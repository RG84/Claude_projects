import { RefreshCw, KeyRound } from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date | null;
  loading: boolean;
  onRefresh: () => void;
  apiKey: string;
  onClearApiKey: () => void;
}

export function Header({ lastUpdated, loading, onRefresh, apiKey, onClearApiKey }: HeaderProps) {
  return (
    <header className="bg-[#8B0000] text-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Vanguard ETF Performance Tracker
            </h1>
            <p className="mt-1 text-red-200 text-sm">
              Compare fund performance across 1-month, 3-month, 6-month, and 1-year periods
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-xs text-red-200 mt-1">
            {lastUpdated ? (
              <div className="text-right">
                <p>Live data as of</p>
                <p className="font-semibold text-white">
                  {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  {' · '}
                  {lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ) : (
              <p className="font-semibold text-white">
                {apiKey ? 'Fetching live data...' : 'Showing estimated data'}
              </p>
            )}

            <div className="flex gap-2">
              {apiKey && (
                <button
                  onClick={onClearApiKey}
                  title="Disconnect API key"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Disconnect
                </button>
              )}
              <button
                onClick={onRefresh}
                disabled={loading || !apiKey}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
