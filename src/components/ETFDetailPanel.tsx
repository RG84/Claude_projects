import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { X } from 'lucide-react';
import { ETF, TimePeriod } from '../types/etf';

const PERIODS: TimePeriod[] = ['1M', '3M', '6M', '1Y'];

interface ETFDetailPanelProps {
  etf: ETF;
  onClose: () => void;
}

function formatTooltip(value: number) {
  return [(value >= 0 ? '+' : '') + value.toFixed(2) + '%', 'Return'];
}

export function ETFDetailPanel({ etf, onClose }: ETFDetailPanelProps) {
  const chartData = PERIODS.map((period) => ({
    period,
    value: etf.performance[period],
  }));

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg mx-4 mb-2 p-5 animate-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gray-900">{etf.ticker}</span>
            <span className="text-sm px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
              {etf.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{etf.name}</p>
          <p className="text-xs text-gray-500 mt-2 max-w-xl">{etf.description}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Chart */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Performance by Period
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => v + '%'}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={45}
              />
              <Tooltip
                formatter={formatTooltip}
                contentStyle={{ fontSize: 12, borderRadius: 6 }}
              />
              <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.period}
                    fill={entry.value >= 0 ? '#10b981' : '#ef4444'}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Fund Details
          </p>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Expense Ratio</dt>
              <dd className="font-semibold text-gray-900">{etf.expenseRatio.toFixed(2)}%</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">AUM</dt>
              <dd className="font-semibold text-gray-900">${etf.aumBillions}B</dd>
            </div>
            {PERIODS.map((period) => (
              <div key={period} className="flex justify-between text-sm">
                <dt className="text-gray-500">{period} Return</dt>
                <dd
                  className={`font-semibold ${
                    etf.performance[period] >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {etf.performance[period] >= 0 ? '+' : ''}
                  {etf.performance[period].toFixed(2)}%
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
