"use client";

import { Heart } from "lucide-react";
import { useFavorites, type FavItem } from "@/lib/favorites-store";
import { notify } from "@/lib/toast-store";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  item,
  variant = "icon",
}: {
  item: FavItem;
  variant?: "icon" | "inline";
}) {
  const items = useFavorites((s) => s.items);
  const toggle = useFavorites((s) => s.toggle);
  const active = items.some((x) => x.productId === item.productId);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(item);
    notify(active ? "Удалено из избранного" : `«${item.title}» — в избранном`);
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-2 text-sm transition",
          active ? "text-accent" : "text-graphite hover:text-accent"
        )}
      >
        <Heart className={cn("h-4 w-4", active && "fill-accent")} strokeWidth={1.6} />
        {active ? "В избранном" : "В избранное"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="В избранное"
      className="grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-graphite shadow-[var(--shadow-soft)] backdrop-blur transition hover:text-accent"
    >
      <Heart className={cn("h-4 w-4", active && "fill-accent text-accent")} strokeWidth={1.8} />
    </button>
  );
}
