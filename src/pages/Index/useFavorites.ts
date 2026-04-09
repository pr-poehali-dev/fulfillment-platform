import { useState, useEffect, useCallback } from "react";

const KEY = "fulfillhub:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites));
    } catch {
      // ignore quota errors
    }
  }, [favorites]);

  const toggle = useCallback((id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const has = useCallback((id: number) => favorites.includes(id), [favorites]);

  const clear = useCallback(() => setFavorites([]), []);

  return { favorites, toggle, has, clear };
}
