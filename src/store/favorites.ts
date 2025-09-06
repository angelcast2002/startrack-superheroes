import { useState, useEffect } from 'react';
import type { Superhero } from '../interfaces/hero';

const KEY = 'startrack:favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Superhero[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    setFavorites(stored ? JSON.parse(stored) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites));
  }, [favorites]);

  return [favorites, setFavorites] as const;
};
