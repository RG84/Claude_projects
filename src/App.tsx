import { useState, useMemo } from 'react';
import { AlertTriangle, Wifi } from 'lucide-react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ETFTable } from './components/ETFTable';
import { ApiKeyBanner } from './components/ApiKeyBanner';
import { useETFData } from './hooks/useETFData';
import { useApiKey } from './hooks/useApiKey';
import { ETFCategory } from './types/etf';

type CategoryFilter = 'All' | ETFCategory;

export default function App() {
  const { apiKey, saveApiKey, clearApiKey } = useApiKey();
  const { etfs, loading, progress, lastUpdated, error, refresh } = useETFData(apiKey);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return etfs.filter((etf) => {
      const matchesSearch =
        !query ||
        etf.ticker.toLowerCase().includes(query) ||
        etf.name.toLowerCase().includes(query);
      const matchesCategory =
        activeCategory === 'All' || etf.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [etfs, search, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={refresh}
        apiKey={apiKey}
        onClearApiKey={clearApiKey}
      />

      {/* Progress bar */}
      {loading && (
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-[#8B0000] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Banners */}
      {!apiKey && <ApiKeyBanner onSave={saveApiKey} />}
      {apiKey && !loading && !error && lastUpdated && (
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-1.5">
          <div className="max-w-screen-xl mx-auto flex items-center gap-2 text-emerald-700 text-xs">
            <Wifi className="w-3.5 h-3.5" />
            Live data from Financial Modeling Prep
          </div>
        </div>
      )}
      {error && !loading && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2">
          <div className="max-w-screen-xl mx-auto flex items-center gap-2 text-amber-700 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        </div>
      )}

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        resultCount={filtered.length}
      />

      <main className="max-w-screen-xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ETFTable etfs={filtered} loading={loading} />
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          {apiKey
            ? 'Live data from Financial Modeling Prep · Adjusted close prices · Not financial advice'
            : 'Showing estimated performance data · Connect an API key for live prices · Not financial advice'}
        </p>
      </main>
    </div>
  );
}
