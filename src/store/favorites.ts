/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

const KEY = 'startrack:favorites';

export const useFavorites = () => {
  const [ids, setIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && (parsed.length === 0 || typeof parsed[0] === 'number')) return parsed;
      if (Array.isArray(parsed) && typeof parsed[0] === 'object') {
        const migrated = parsed.map((h: any) => h?.id).filter((n: any) => Number.isFinite(n));
        localStorage.setItem(KEY, JSON.stringify(migrated));
        return migrated;
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const add = (id: number) => setIds((prev) => (prev.includes(id) ? prev : [...prev, id])); // al final
  const remove = (id: number) => setIds((prev) => prev.filter((x) => x !== id));
  const toggle = (id: number) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return [ids, setIds, { add, remove, toggle }] as const;
};
