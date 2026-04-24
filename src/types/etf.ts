export type ETFCategory =
  | 'Broad Market'
  | 'US Equity Style'
  | 'US Sector'
  | 'International'
  | 'Dividend'
  | 'Fixed Income';

export type TimePeriod = '1M' | '3M' | '6M' | '1Y';

export interface ETFPerformance {
  '1M': number;
  '3M': number;
  '6M': number;
  '1Y': number;
}

export interface ETF {
  ticker: string;
  name: string;
  category: ETFCategory;
  expenseRatio: number;
  aumBillions: number;
  performance: ETFPerformance;
  description: string;
}

export type SortField = 'ticker' | 'name' | 'category' | TimePeriod | 'expenseRatio' | 'aumBillions';
export type SortDirection = 'asc' | 'desc';
