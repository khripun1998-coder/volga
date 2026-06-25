"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  shopName: string;
  variant?: string;
  qty: number;
  /** Потолок количества (склад; для «под заказ» — большой). Ограничивает add/setQty. */
  maxQty?: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string, variant?: string) => void;
  setQty: (productId: string, variant: string | undefined, qty: number) => void;
  clear: () => void;
}

const sameLine = (a: CartItem, productId: string, variant?: string) =>
  a.productId === productId && (a.variant ?? "") === (variant ?? "");

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((state) => {
          const cap = (n: number) => (item.maxQty != null ? Math.min(n, item.maxQty) : n);
          const existing = state.items.find((i) =>
            sameLine(i, item.productId, item.variant)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.variant)
                  ? { ...i, qty: cap(i.qty + qty) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: cap(qty) }] };
        }),
      remove: (productId, variant) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, variant)),
        })),
      setQty: (productId, variant, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              sameLine(i, productId, variant)
                ? { ...i, qty: Math.max(1, i.maxQty != null ? Math.min(qty, i.maxQty) : qty) }
                : i
            )
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "volga-cart" }
  )
);

export const selectCount = (s: CartState) =>
  s.items.reduce((n, i) => n + i.qty, 0);
export const selectTotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.qty, 0);
