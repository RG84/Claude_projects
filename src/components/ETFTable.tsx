import { Fragment, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { ETF, SortDirection, SortField, TimePeriod } from '../types/etf';
import { PerformanceBadge } from './PerformanceBadge';
import { ETFDetailPanel } from './ETFDetailPanel';

const PERIODS: TimePeriod[] = ['1M', '3M', '6M', '1Y'];

interface ETFTableProps {
  etfs: ETF[];
  loading: boolean;
}

interface Column {
  key: SortField;
  label: string;
  align: 'left' | 'right';
}

const COLUMNS: Column[] = [
  { key: 'ticker', label: 'Ticker', align: 'left' },
  { key: 'name', label: 'Fund Name', align: 'left' },
  { key: 'category', label: 'Category', align: 'left' },
  { key: '1M', label: '1 Month', align: 'right' },
  { key: '3M', label: '3 Months', align: 'right' },
  { key: '6M', label: '6 Months', align: 'right' },
  { key: '1Y', label: '1 Year', align: 'right' },
  { key: 'expenseRatio', label: 'Exp. Ratio', align: 'right' },
  { key: 'aumBillions', label: 'AUM', align: 'right' },
];

function getSortValue(etf: ETF, field: SortField): string | number {
  switch (field) {
    case 'ticker': return etf.ticker;
    case 'name': return etf.name;
    case 'category': return etf.category;
    case 'expenseRatio': return etf.expenseRatio;
    case 'aumBillions': return etf.aumBillions;
    default: return etf.performance[field as TimePeriod];
  }
}

function SortIcon({ field, sortField, sortDirection }: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) {
  if (field !== sortField) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />;
  return sortDirection === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-gray-700" />
    : <ChevronDown className="w-3.5 h-3.5 text-gray-700" />;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Broad Market': 'bg-indigo-50 text-indigo-700',
  'US Equity Style': 'bg-violet-50 text-violet-700',
  'US Sector': 'bg-amber-50 text-amber-700',
  'International': 'bg-sky-50 text-sky-700',
  'Dividend': 'bg-teal-50 text-teal-700',
  'Fixed Income': 'bg-slate-100 text-slate-600',
};

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {[20, 52, 24, 16, 16, 16, 16, 12, 12].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 bg-gray-100 rounded animate-pulse"
            style={{ width: `${w * 4}px`, maxWidth: '100%' }}
          />
        </td>
      ))}
    </tr>
  );
}

export function ETFTable({ etfs, loading }: ETFTableProps) {
  const [sortField, setSortField] = useState<SortField>('1Y');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }

  function handleRowClick(ticker: string) {
    setSelectedTicker((prev) => (prev === ticker ? null : ticker));
  }

  const sorted = [...etfs].sort((a, b) => {
    const aVal = getSortValue(a, sortField);
    const bVal = getSortValue(b, sortField);
    const mult = sortDirection === 'asc' ? 1 : -1;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * mult;
    }
    return ((aVal as number) - (bVal as number)) * mult;
  });

  if (!loading && etfs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">No funds match your search</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-semibold text-gray-600 cursor-pointer select-none hover:bg-gray-100 whitespace-nowrap ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                }`}
                onClick={() => handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.align === 'right' && (
                    <SortIcon field={col.key} sortField={sortField} sortDirection={sortDirection} />
                  )}
                  {col.label}
                  {col.align === 'left' && (
                    <SortIcon field={col.key} sortField={sortField} sortDirection={sortDirection} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonRow key={i} />)
            : sorted.map((etf) => {
                const isSelected = selectedTicker === etf.ticker;
                return (
                  <Fragment key={etf.ticker}>
                    <tr
                      onClick={() => handleRowClick(etf.ticker)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 hover:bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                        {etf.ticker}
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{etf.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[etf.category]}`}>
                          {etf.category}
                        </span>
                      </td>
                      {PERIODS.map((period) => (
                        <td key={period} className="px-4 py-3 text-right whitespace-nowrap">
                          <PerformanceBadge value={etf.performance[period]} />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                        {etf.expenseRatio.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">
                        ${etf.aumBillions}B
                      </td>
                    </tr>
                    {isSelected && (
                      <tr>
                        <td colSpan={9} className="p-0">
                          <ETFDetailPanel etf={etf} onClose={() => setSelectedTicker(null)} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}
