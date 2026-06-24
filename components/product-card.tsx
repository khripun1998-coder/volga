import Link from "next/link";
import { Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { FavoriteButton } from "@/components/favorite-button";
import { CoverImage } from "@/components/cover-image";
import type { CardProduct } from "@/lib/queries";

// Мягкие лавандовые подложки под фото (фолбэк, если фото нет/не загрузилось)
const PRODUCT_COVERS = [
  "linear-gradient(135deg,#ECEAFE 0%,#D9D3FB 100%)",
  "linear-gradient(135deg,#E6EEFF 0%,#CFE0FB 100%)",
  "linear-gradient(135deg,#FBEAF6 0%,#F0CDE8 100%)",
  "linear-gradient(135deg,#EAECFF 0%,#D2D6F8 100%)",
  "linear-gradient(135deg,#E9F1FE 0%,#CCE0F7 100%)",
  "linear-gradient(135deg,#F1EAFE 0%,#DCC9F6 100%)",
];
function coverIndex(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % PRODUCT_COVERS.length;
}

export function ProductCard({
  product,
  index = 0,
  layout = "feed",
  showRating = false,
  row = false,
}: {
  product: CardProduct;
  index?: number;
  layout?: "feed" | "channel";
  showRating?: boolean;
  /** Горизонтальная раскладка для режима «по 1» (список). */
  row?: boolean;
}) {
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : null;

  const cover = PRODUCT_COVERS[coverIndex(product.id)];

  const fav = {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    oldPrice: product.oldPrice,
    category: product.category.slug,
    shopName: product.shop.name,
  };

  // ─────────── Горизонтальная карточка-строка (режим «по 1») ───────────
  if (row) {
    return (
      <article className="group relative">
        <Link
          href={`/product/${product.slug}`}
          prefetch
          className="tilt flex items-center gap-4 overflow-hidden rounded-[20px] bg-paper p-3 pr-12 hairline shadow-[var(--shadow-soft)]"
          aria-label={`${product.title} — ${product.shop.name}`}
        >
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
            <CoverImage
              src={product.images[0]?.url}
              gradient={cover}
              alt={product.title}
              className="absolute inset-0 h-full w-full"
              zoom
            />
            {discount && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-paper px-2 py-0.5 text-[10px] font-semibold text-graphite hairline">
                −{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 grid place-items-center bg-paper/85 text-[11px] font-medium text-graphite backdrop-blur-[2px]">
                Нет в наличии
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-[15px] font-medium text-graphite">
              {product.title}
            </h3>
            <p className="mt-0.5 truncate text-[12.5px] text-muted">{product.shop.name}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-display text-[16px] font-semibold text-graphite">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[12px] text-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[12px] text-muted">
                <Star className="h-3.5 w-3.5 text-gold" fill="currentColor" strokeWidth={0} />
                <span className="font-medium text-graphite">{product.shop.rating.toFixed(1)}</span>
                <span>({product.shop.ratingCount})</span>
              </span>
            </div>
          </div>
        </Link>

        <div className="absolute right-3 top-3">
          <FavoriteButton item={fav} />
        </div>
      </article>
    );
  }

  return (
    <article className="group relative">
      <Link
        href={`/product/${product.slug}`}
        prefetch
        className="block"
        aria-label={`${product.title} — ${product.shop.name}`}
      >
        <div className="tilt overflow-hidden rounded-[24px] bg-paper hairline shadow-[var(--shadow-soft)]">
          <div className="relative aspect-square">
            <CoverImage
              src={product.images[0]?.url}
              gradient={cover}
              alt={product.title}
              className="absolute inset-0 h-full w-full"
              zoom
            />
            {discount && (
              <span className="absolute left-3 top-3 rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold tracking-tight text-graphite hairline">
                −{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 grid place-items-center bg-paper/85 text-sm font-medium text-graphite backdrop-blur-[2px]">
                Нет в наличии
              </div>
            )}
          </div>

          <div className="px-4 py-3.5">
            <h3 className="line-clamp-1 text-[14px] font-medium text-graphite">
              {product.title}
            </h3>
            {(layout === "feed" || showRating) && (
              <p className="mt-0.5 truncate text-[12px] text-muted">
                {product.shop.name}
              </p>
            )}
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[16px] font-semibold text-graphite">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-[12px] text-muted line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              {showRating && (
                <span className="inline-flex shrink-0 items-center gap-1 text-[12px] text-muted">
                  <Star className="h-3.5 w-3.5 text-gold" fill="currentColor" strokeWidth={0} />
                  <span className="font-medium text-graphite">{product.shop.rating.toFixed(1)}</span>
                  <span>({product.shop.ratingCount})</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3">
        <FavoriteButton item={fav} />
      </div>
    </article>
  );
}
