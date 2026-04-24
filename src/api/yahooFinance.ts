import { ETFPerformance } from '../types/etf';

const BASE = '/api/yahoo';

interface ChartResult {
  meta: { symbol: string };
  timestamp: number[];
  indicators: {
    adjclose?: Array<{ adjclose: (number | null)[] }>;
    quote: Array<{ close: (number | null)[] }>;
  };
}

interface ChartResponse {
  chart: {
    result: ChartResult[] | null;
    error: { code: string; description: string } | null;
  };
}

function targetTimestamp(monthsAgo: number): number {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return d.getTime() / 1000;
}

function priceAt(prices: number[], timestamps: number[], targetTs: number): number | null {
  let result: number | null = null;
  for (let i = 0; i < timestamps.length; i++) {
    if (timestamps[i] <= targetTs && prices[i] != null) {
      result = prices[i];
    }
  }
  return result;
}

async function fetchChart(ticker: string): Promise<ChartResult | null> {
  const url = `${BASE}/v8/finance/chart/${ticker}?interval=1d&range=1y&includeAdjustedClose=true`;
  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: ChartResponse = await res.json();
  if (data.chart.error || !data.chart.result?.[0]) return null;
  return data.chart.result[0];
}

export async function fetchPerformance(ticker: string): Promise<ETFPerformance | null> {
  const chart = await fetchChart(ticker);
  if (!chart) return null;

  const timestamps = chart.timestamp;
  const rawPrices =
    chart.indicators.adjclose?.[0]?.adjclose ??
    chart.indicators.quote[0].close;

  // Strip nulls
  const ts: number[] = [];
  const prices: number[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const p = rawPrices[i];
    if (p != null) {
      ts.push(timestamps[i]);
      prices.push(p);
    }
  }

  if (prices.length === 0) return null;

  const current = prices[prices.length - 1];

  const returnPct = (monthsAgo: number): number => {
    const past = priceAt(prices, ts, targetTimestamp(monthsAgo));
    if (!past) return 0;
    return ((current - past) / past) * 100;
  };

  return {
    '1M': returnPct(1),
    '3M': returnPct(3),
    '6M': returnPct(6),
    '1Y': returnPct(12),
  };
}

export async function fetchAllPerformance(
  tickers: string[],
  onProgress: (done: number, total: number) => void,
): Promise<Map<string, ETFPerformance>> {
  const results = new Map<string, ETFPerformance>();
  const BATCH = 8;

  for (let i = 0; i < tickers.length; i += BATCH) {
    const batch = tickers.slice(i, i + BATCH);
    await Promise.allSettled(
      batch.map(async (ticker) => {
        try {
          const perf = await fetchPerformance(ticker);
          if (perf) results.set(ticker, perf);
        } catch {
          // Silently fall back to mock data for this ticker
        }
      }),
    );
    onProgress(Math.min(i + BATCH, tickers.length), tickers.length);
    if (i + BATCH < tickers.length) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  return results;
}
