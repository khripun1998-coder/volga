import Link from "next/link";
import { BadgeCheck, ChevronRight, Heart, Star, Users } from "lucide-react";
import { CoverImage } from "@/components/cover-image";
import { cn, pluralize } from "@/lib/utils";
import type { CardProduct } from "@/lib/queries";

const kindLabel: Record<string, string> = {
  workshop: "Мастерская ручной работы",
  production: "Производство",
  supplier: "Поставщик материалов",
};

// Мягкие лавандово-пастельные обложки — варьируются между карточками (Aurora)
const COVERS = [
  "linear-gradient(135deg,#ECEAFE 0%,#D9D3FB 100%)",
  "linear-gradient(135deg,#E6EEFF 0%,#CFE0FB 100%)",
  "linear-gradient(135deg,#FBEAF6 0%,#F0CDE8 100%)",
  "linear-gradient(135deg,#EAECFF 0%,#D2D6F8 100%)",
  "linear-gradient(135deg,#E9F1FE 0%,#CCE0F7 100%)",
  "linear-gradient(135deg,#F1EAFE 0%,#DCC9F6 100%)",
];

export interface FeedShop {
  slug: string;
  name: string;
  description: string;
  kind: string;
  city?: string | null;
  region?: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  rating: number;
  ratingCount: number;
  verified: boolean;
  promoted: boolean;
  /** Реальные клиенты магазина = уникальные покупатели по заказам (не накрутка). */
  clients: number;
  _count: { products: number };
  products?: CardProduct[];
}

export function ShopFeedCard({
  shop,
  className,
  index = 0,
  layout = "card",
}: {
  shop: FeedShop;
  className?: string;
  index?: number;
  /** "card" — вертикальная карточка (сетка/лента); "row" — компактная строка (вид «по 1»). */
  layout?: "card" | "row";
}) {
  const cover = COVERS[index % COVERS.length];
  const clients = shop.clients;
  const clientsLabel = pluralize(clients, ["клиент", "клиента", "клиентов"]);

  // ─────────── Компактная строка (вид «по 1») ───────────
  if (layout === "row") {
    return (
      <Link
        href={`/shop/${shop.slug}`}
        className={cn(
          "tilt group flex items-center gap-4 overflow-hidden rounded-3xl bg-paper p-3 hairline shadow-[var(--shadow-soft)]",
          className
        )}
      >
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-44">
          <CoverImage
            src={`/shops/${shop.slug}.png`}
            gradient={cover}
            alt={shop.name}
            className="absolute inset-0 h-full w-full"
          />
          {index < 3 && (
            <span className="absolute left-2 top-2 rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent shadow-[var(--shadow-soft)]">
              ТОП {index + 1}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display line-clamp-1 text-[16px] font-bold leading-tight text-graphite">
              {shop.name}
            </h3>
            {shop.verified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0"
                style={{ color: "var(--color-verified)" }}
              />
            )}
          </div>
          <p className="mt-1 line-clamp-1 text-[12.5px] text-muted">
            {shop.description || kindLabel[shop.kind] || "Магазин мастера"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
            <Star className="h-3.5 w-3.5 text-gold" fill="currentColor" strokeWidth={0} />
            <span className="font-semibold text-graphite">{shop.rating.toFixed(1)}</span>
            <span className="text-muted">({shop.ratingCount})</span>
            <span className="text-muted/50">·</span>
            <span
              className="inline-flex items-center gap-1 text-muted"
              title="Реальные клиенты — те, кто оформил заказ. Не накрутка."
            >
              <Users className="h-3.5 w-3.5" strokeWidth={1.7} />
              {clients.toLocaleString("ru-RU")} {clientsLabel}
            </span>
          </div>
        </div>

        <ChevronRight
          className="hidden h-5 w-5 shrink-0 text-muted/50 transition group-hover:text-accent sm:block"
          strokeWidth={1.8}
        />
      </Link>
    );
  }

  // ─────────── Вертикальная карточка (лента / сетка) ───────────
  return (
    <Link
      href={`/shop/${shop.slug}`}
      className={cn(
        "tilt group block overflow-hidden rounded-3xl bg-paper hairline shadow-[var(--shadow-soft)]",
        className
      )}
    >
      {/* Обложка: фото магазина (если есть) либо мягкий лавандовый градиент */}
      <div className="relative aspect-[16/10]">
        <CoverImage
          src={`/shops/${shop.slug}.png`}
          gradient={cover}
          alt={shop.name}
          className="absolute inset-0 h-full w-full"
        />

        {index < 3 && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-paper px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent shadow-[var(--shadow-soft)]">
            ТОП {index + 1}
          </span>
        )}
        <span
          className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-graphite/70 backdrop-blur transition group-hover:text-accent"
          aria-hidden
        >
          <Heart className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </span>
      </div>

      {/* Тело */}
      <div className="p-5">
        <div className="flex items-start gap-1.5">
          <h3 className="font-display line-clamp-1 text-[18px] font-bold leading-tight text-graphite">
            {shop.name}
          </h3>
          {shop.verified && (
            <BadgeCheck
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "var(--color-verified)" }}
            />
          )}
        </div>
        <p className="mt-1 line-clamp-1 text-[12.5px] text-muted">
          {shop.description || kindLabel[shop.kind] || "Магазин мастера"}
        </p>

        <div className="mt-3.5 flex items-center gap-2 border-t border-line pt-3.5 text-[13px]">
          <Star className="h-4 w-4 text-gold" fill="currentColor" strokeWidth={0} />
          <span className="font-semibold text-graphite">{shop.rating.toFixed(1)}</span>
          <span className="text-muted">({shop.ratingCount})</span>
          <span className="text-muted/50">·</span>
          <span
            className="inline-flex items-center gap-1 text-muted"
            title="Реальные клиенты — те, кто оформил заказ. Не накрутка."
          >
            <Users className="h-3.5 w-3.5" strokeWidth={1.7} />
            {clients.toLocaleString("ru-RU")} {clientsLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
