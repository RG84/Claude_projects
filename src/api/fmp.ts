import { ETFPerformance } from '../types/etf';

const BASE = 'https://financialmodelingprep.com/api/v3';

interface FMPEntry {
  date: string;
  adjClose: number;
  close: number;
}

interface FMPSingleResponse {
  symbol: string;
  historical: FMPEntry[];
}

interface FMPBatchResponse {
  historicalStockList: FMPSingleResponse[];
}

function monthsAgoDate(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
}

function priceAt(historical: FMPEntry[], targetDate: string): number | null {
  // historical is sorted newest-first; find first entry on or before targetDate
  for (const e of historical) {
    if (e.date <= targetDate) return e.adjClose ?? e.close;
  }
  return null;
}

function calcPerformance(historical: FMPEntry[]): ETFPerformance | null {
  if (!historical.length) return null;
  const current = historical[0].adjClose ?? historical[0].close;
  const pct = (months: number): number => {
    const past = priceAt(historical, monthsAgoDate(months));
    if (!past) return 0;
    return ((current - past) / past) * 100;
  };
  return { '1M': pct(1), '3M': pct(3), '6M': pct(6), '1Y': pct(12) };
}

export async function fetchAllPerformance(
  tickers: string[],
  apiKey: string,
  onProgress: (done: number, total: number) => void,
): Promise<Map<string, ETFPerformance>> {
  const results = new Map<string, ETFPerformance>();
  const from = monthsAgoDate(13);
  const to = new Date().toISOString().slice(0, 10);
  const BATCH = 5;

  for (let i = 0; i < tickers.length; i += BATCH) {
    const batch = tickers.slice(i, i + BATCH);
    const symbols = batch.join(',');
    const url = `${BASE}/historical-price-full/${symbols}?from=${from}&to=${to}&apikey=${apiKey}`;

    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FMPSingleResponse | FMPBatchResponse = await res.json();

      // Single ticker returns FMPSingleResponse; multiple returns FMPBatchResponse
      if ('historicalStockList' in data) {
        for (const item of data.historicalStockList) {
          const perf = calcPerformance(item.historical);
          if (perf) results.set(item.symbol, perf);
        }
      } else if ('historical' in data && data.historical?.length) {
        const perf = calcPerformance(data.historical);
        if (perf) results.set(data.symbol, perf);
      }
    } catch {
      // Fall back to mock data for this batch
    }

    onProgress(Math.min(i + BATCH, tickers.length), tickers.length);
    if (i + BATCH < tickers.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return results;
}
