import { useState, useEffect, useCallback } from 'react';
import { EnrichedETF } from '../types/etf';
import { VANGUARD_ETFS } from '../data/vanguardETFs';
import { fetchAllPerformance } from '../api/fmp';

export interface ETFDataState {
  etfs: EnrichedETF[];
  loading: boolean;
  progress: number;
  lastUpdated: Date | null;
  error: string | null;
  refresh: () => void;
}

export function useETFData(apiKey: string): ETFDataState {
  const [etfs, setEtfs] = useState<EnrichedETF[]>(
    VANGUARD_ETFS.map((e) => ({ ...e, dataSource: 'mock' as const })),
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!apiKey) {
      setEtfs(VANGUARD_ETFS.map((e) => ({ ...e, dataSource: 'mock' as const })));
      setLastUpdated(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setProgress(0);
    setError(null);

    const tickers = VANGUARD_ETFS.map((e) => e.ticker);

    fetchAllPerformance(tickers, apiKey, (done, total) => {
      if (!cancelled) setProgress(Math.round((done / total) * 100));
    })
      .then((results) => {
        if (cancelled) return;

        setEtfs(
          VANGUARD_ETFS.map((etf) => {
            const live = results.get(etf.ticker);
            return {
              ...etf,
              performance: live ?? etf.performance,
              dataSource: live ? ('live' as const) : ('mock' as const),
            };
          }),
        );

        setLastUpdated(new Date());
        setLoading(false);

        if (results.size === 0) {
          setError('No data returned — check your API key is valid');
        } else if (results.size < tickers.length) {
          const missed = tickers.length - results.size;
          setError(`${missed} fund${missed > 1 ? 's' : ''} unavailable — showing estimated data for those`);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError('Fetch failed — check your connection and API key');
        setEtfs(VANGUARD_ETFS.map((e) => ({ ...e, dataSource: 'error' as const })));
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [apiKey, tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return { etfs, loading, progress, lastUpdated, error, refresh };
}
