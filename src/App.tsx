import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { ETFTable } from './components/ETFTable';
import { VANGUARD_ETFS } from './data/vanguardETFs';
import { ETFCategory } from './types/etf';

type CategoryFilter = 'All' | ETFCategory;

export default function App() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return VANGUARD_ETFS.filter((etf) => {
      const matchesSearch =
        !query ||
        etf.ticker.toLowerCase().includes(query) ||
        etf.name.toLowerCase().includes(query);
      const matchesCategory =
        activeCategory === 'All' || etf.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        resultCount={filtered.length}
      />
      <main className="max-w-screen-xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ETFTable etfs={filtered} />
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          Performance figures are illustrative. Always verify with official fund data before making investment decisions.
        </p>
      </main>
    </div>
  );
}
