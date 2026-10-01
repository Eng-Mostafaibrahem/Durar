import { useCallback, useEffect, useMemo, useState } from 'react';
import { FavoritesContext } from './favoritesContext.js';

const STORAGE_KEY = 'durar:favorites';

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function snapshotFrom(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price ?? null,
    final_price: product.final_price ?? null,
    discount_percentage: product.discount_percentage ?? null,
    stock: product.stock ?? product.quantity ?? null,
    image: product.image ?? product.main_image?.[0] ?? null,
    category_id: product.category?.id ?? product.category_id ?? null,
    category_name: product.category?.name ?? product.category_name ?? null,
    background_variant: product.background_variant ?? product.silk_variant ?? null,
  };
}

/**
 * Favorites live in localStorage only — the backend has no favorites API.
 * Snapshots of products are stored so the favorites page renders without
 * any network round-trips.
 */
export function FavoritesProvider({ children }) {
  const [items, setItems] = useState(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // privacy mode / storage full — keep in memory only
    }
  }, [items]);

  useEffect(() => {
    function syncAcrossTabs(event) {
      if (event.key !== STORAGE_KEY || event.newValue == null) return;
      try {
        const parsed = JSON.parse(event.newValue);
        if (Array.isArray(parsed)) setItems(parsed);
      } catch {
        // ignore malformed payloads
      }
    }

    window.addEventListener('storage', syncAcrossTabs);
    return () => window.removeEventListener('storage', syncAcrossTabs);
  }, []);

  const isFavorite = useCallback(
    (id) => items.some((item) => String(item.id) === String(id)),
    [items],
  );

  const toggleFavorite = useCallback((product) => {
    const id = product.id;
    setItems((current) => {
      const exists = current.some((item) => String(item.id) === String(id));
      return exists
        ? current.filter((item) => String(item.id) !== String(id))
        : [snapshotFrom(product), ...current];
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setItems((current) => current.filter((item) => String(item.id) !== String(id)));
  }, []);

  const value = useMemo(
    () => ({ items, count: items.length, isFavorite, toggleFavorite, removeFavorite }),
    [items, isFavorite, toggleFavorite, removeFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
