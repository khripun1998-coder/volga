"use client";

import { useEffect, useState } from "react";
import { Grid2x2, Grid3x3, Rows3, StretchHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { CardProduct } from "@/lib/queries";
import { cn, pluralize } from "@/lib/utils";

/**
 * Переключатель вида ленты товаров (правка клиента: «везде, где листание, нужна
 * кнопка настройки отображения»). Те же режимы, что и у магазинов: Лента / по 1 /
 * по 4 / по 6. Выбор запоминается в localStorage.
 */
type Mode = "feed" | "one" | "four" | "six";

const STORAGE_KEY = "volga.productsView";

const MODES: { id: Mode; label: string; Icon: typeof Rows3 }[] = [
  { id: "feed", label: "Лента", Icon: StretchHorizontal },
  { id: "one", label: "по 1", Icon: Rows3 },
  { id: "four", label: "по 4", Icon: Grid2x2 },
  { id: "six", label: "по 6", Icon: Grid3x3 },
];

const GRID: Record<Mode, string> = {
  feed: "grid-cols-1 gap-4 sm:grid-cols-2",
  one: "grid-cols-1 gap-3",
  four: "grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4",
  six: "grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
};

export function ProductsView({
  products,
  showRating = true,
  cardLayout = "feed",
}: {
  products: CardProduct[];
  showRating?: boolean;
  cardLayout?: "feed" | "channel";
}) {
  const [mode, setMode] = useState<Mode>("four");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
      if (saved && saved in GRID) setMode(saved);
    } catch {}
  }, []);

  const change = (m: Mode) => {
    setMode(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {}
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-[13px] text-muted">
          {products.length} {pluralize(products.length, ["товар", "товара", "товаров"])}
        </span>

        <div
          role="tablist"
          aria-label="Вид отображения"
          className="inline-flex items-center gap-0.5 rounded-full bg-cream p-1"
        >
          {MODES.map(({ id, label, Icon }) => {
            const active = mode === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={label}
                onClick={() => change(id)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold transition-colors duration-300 sm:px-3.5",
                  active
                    ? "bg-accent text-white shadow-[var(--shadow-accent)]"
                    : "text-graphite/70 hover:text-graphite"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={cn("grid", GRID[mode])}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            row={mode === "one"}
            layout={cardLayout}
            showRating={showRating}
          />
        ))}
      </div>
    </>
  );
}
