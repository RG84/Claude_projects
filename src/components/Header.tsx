export function Header() {
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
          <div className="text-right text-xs text-red-200 mt-1">
            <p>Data as of</p>
            <p className="font-semibold text-white">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
