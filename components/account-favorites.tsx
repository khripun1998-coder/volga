"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFavorites } from "@/lib/favorites-store";
import { ProductArtwork } from "@/components/product-artwork";
import { FavoriteButton } from "@/components/favorite-button";
import { formatPrice } from "@/lib/utils";

export function AccountFavorites() {
  const items = useFavorites((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-24" />;

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-cream px-5 py-8 text-center text-sm text-muted">
        В избранном пока пусто. Нажмите ♡ на карточке товара, чтобы сохранить.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((p, i) => (
        <div key={p.productId} className="group relative">
          <Link href={`/product/${p.slug}`} className="block">
            <ProductArtwork
              category={p.category}
              seed={i}
              className="aspect-[4/5] rounded-[20px] border border-line/70 transition-transform duration-500 group-hover:-translate-y-1"
            />
            <h3 className="mt-3 line-clamp-1 text-[15px] font-medium text-graphite">{p.title}</h3>
            <p className="mt-0.5 text-xs text-muted">{p.shopName}</p>
            <div className="mt-1 font-semibold text-graphite">{formatPrice(p.price)}</div>
          </Link>
          <div className="absolute left-3 top-3">
            <FavoriteButton item={p} />
          </div>
        </div>
      ))}
    </div>
  );
}
