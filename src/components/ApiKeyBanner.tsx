import { useState } from 'react';
import { Key, ExternalLink, X, Check } from 'lucide-react';

interface ApiKeyBannerProps {
  onSave: (key: string) => void;
}

export function ApiKeyBanner({ onSave }: ApiKeyBannerProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  function handleSave() {
    if (input.trim()) {
      onSave(input.trim());
      setOpen(false);
      setInput('');
    }
  }

  return (
    <div className="bg-sky-50 border-b border-sky-200">
      <div className="max-w-screen-xl mx-auto px-6 py-2.5 flex items-center gap-3">
        <Key className="w-4 h-4 text-sky-600 shrink-0" />
        <p className="text-sm text-sky-800 flex-1">
          Showing <strong>estimated data</strong> — connect to live prices with a free API key.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="text-xs font-semibold text-sky-700 border border-sky-300 bg-white px-3 py-1 rounded-lg hover:bg-sky-50 transition-colors shrink-0"
        >
          Connect live data
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Connect to Live Data</h2>
                <p className="text-xs text-gray-500 mt-0.5">Via Financial Modeling Prep (free tier)</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-2 text-sm text-gray-600 mb-5">
              <li className="flex gap-2">
                <span className="font-bold text-sky-600 shrink-0">1.</span>
                <span>
                  Sign up at{' '}
                  <a
                    href="https://financialmodelingprep.com/developer/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 underline inline-flex items-center gap-0.5"
                  >
                    financialmodelingprep.com
                    <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  (free, no credit card)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-sky-600 shrink-0">2.</span>
                <span>Copy your API key from the dashboard</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-sky-600 shrink-0">3.</span>
                <span>Paste it below — saved locally in your browser</span>
              </li>
            </ol>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="Paste your API key..."
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-mono"
                autoFocus
              />
              <button
                onClick={handleSave}
                disabled={!input.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Free tier: 250 requests/day — enough for ~7 full refreshes</p>
          </div>
        </div>
      )}
    </div>
  );
}
