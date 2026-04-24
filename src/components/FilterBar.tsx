import { Search, X } from 'lucide-react';
import { CATEGORIES } from '../data/vanguardETFs';
import { ETFCategory } from '../types/etf';

type CategoryFilter = 'All' | ETFCategory;

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  resultCount: number;
}

export function FilterBar({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-screen-xl mx-auto space-y-3">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by ticker or name..."
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat as CategoryFilter)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">{resultCount} fund{resultCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}
