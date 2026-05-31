import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Rating } from "@/components/rating";
import { cn } from "@/lib/utils";

const kindLabel: Record<string, string> = {
  workshop: "Мастерская",
  production: "Производство",
  supplier: "Поставщик сырья",
};

export interface RankShop {
  slug: string;
  name: string;
  kind: string;
  rating: number;
  ratingCount: number;
  verified: boolean;
  promoted: boolean;
  _count: { products: number };
}

export function ShopRankCard({
  shop,
  rank,
  className,
}: {
  shop: RankShop;
  rank: number;
  className?: string;
}) {
  return (
    <Link
      href={`/shop/${shop.slug}`}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-line bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[var(--shadow-soft)]",
        className
      )}
    >
      <span className="absolute -left-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-accent text-xs font-semibold text-white shadow-[var(--shadow-soft)]">
        {rank}
      </span>
      {shop.promoted && (
        <span className="absolute right-3 top-3 rounded-full bg-[#f3f3f3] px-2 py-0.5 text-[10px] font-semibold text-graphite">
          Промо
        </span>
      )}

      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft font-display text-lg font-semibold text-accent">
          {shop.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="truncate font-medium text-graphite">{shop.name}</span>
            {shop.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />}
          </div>
          <span className="text-xs text-muted">{kindLabel[shop.kind] ?? "Магазин"}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Rating value={shop.rating} count={shop.ratingCount} />
        <span className="text-xs text-muted">{shop._count.products} тов.</span>
      </div>
    </Link>
  );
}
