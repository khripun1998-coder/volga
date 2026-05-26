"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FavItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  oldPrice?: number | null;
  category: string;
  shopName: string;
}

interface FavState {
  items: FavItem[];
  toggle: (item: FavItem) => void;
  remove: (productId: string) => void;
}

export const useFavorites = create<FavState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (item) =>
        set((s) =>
          s.items.some((x) => x.productId === item.productId)
            ? { items: s.items.filter((x) => x.productId !== item.productId) }
            : { items: [...s.items, item] }
        ),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((x) => x.productId !== productId) })),
    }),
    { name: "volga-favorites" }
  )
);

export const selectFavCount = (s: FavState) => s.items.length;
