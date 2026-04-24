import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PerformanceBadgeProps {
  value: number;
}

export function PerformanceBadge({ value }: PerformanceBadgeProps) {
  const formatted = (value >= 0 ? '+' : '') + value.toFixed(2) + '%';

  if (value > 5) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">
        <TrendingUp className="w-3 h-3" />
        {formatted}
      </span>
    );
  }
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-600">
        <TrendingUp className="w-3 h-3" />
        {formatted}
      </span>
    );
  }
  if (value === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-500">
        <Minus className="w-3 h-3" />
        {formatted}
      </span>
    );
  }
  if (value >= -3) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-500">
        <TrendingDown className="w-3 h-3" />
        {formatted}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
      <TrendingDown className="w-3 h-3" />
      {formatted}
    </span>
  );
}
