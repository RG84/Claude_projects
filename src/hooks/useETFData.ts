import { useState, useEffect, useCallback } from 'react';
import { EnrichedETF } from '../types/etf';
import { VANGUARD_ETFS } from '../data/vanguardETFs';
import { fetchAllPerformance } from '../api/yahooFinance';

export interface ETFDataState {
  etfs: EnrichedETF[];
  loading: boolean;
  progress: number;
  lastUpdated: Date | null;
  error: string | null;
  refresh: () => void;
}

export function useETFData(): ETFDataState {
  const [etfs, setEtfs] = useState<EnrichedETF[]>(
    VANGUARD_ETFS.map((e) => ({ ...e, dataSource: 'mock' as const })),
  );
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProgress(0);
    setError(null);

    const tickers = VANGUARD_ETFS.map((e) => e.ticker);

    fetchAllPerformance(tickers, (done, total) => {
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
          setError('Could not reach Yahoo Finance — showing estimated data');
        } else if (results.size < tickers.length) {
          const missed = tickers.length - results.size;
          setError(`${missed} fund${missed > 1 ? 's' : ''} could not be fetched — showing estimated data for those`);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError('Connection failed — showing estimated data');
        setEtfs(VANGUARD_ETFS.map((e) => ({ ...e, dataSource: 'error' as const })));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return { etfs, loading, progress, lastUpdated, error, refresh };
}
