import { useState } from 'react';

const STORAGE_KEY = 'fmp_api_key';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(STORAGE_KEY) ?? '');

  function saveApiKey(key: string) {
    const trimmed = key.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    setApiKey(trimmed);
  }

  function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
  }

  return { apiKey, saveApiKey, clearApiKey };
}
