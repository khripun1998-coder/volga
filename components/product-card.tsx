import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { QuickAddButton } from "@/components/quick-add-button";
import { FavoriteButton } from "@/components/favorite-button";
import { ProductArtwork } from "@/components/product-artwork";
import type { CardProduct } from "@/lib/queries";

export function ProductCard({
  product,
  index = 0,
}: {
  product: CardProduct;
  index?: number;
}) {
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : null;

  const fav = {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    oldPrice: product.oldPrice,
    category: product.category.slug,
    shopName: product.shop.name,
  };

  return (
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-line/70 bg-cream shadow-[0_1px_2px_rgba(26,26,26,0.04)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-lift)]">
          <ProductArtwork
            category={product.category.slug}
            seed={index}
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {discount && <Badge variant="accent">−{discount}%</Badge>}
            {product.handmade && <Badge variant="handmade">Ручная работа</Badge>}
            {product.eco && <Badge variant="eco">Эко</Badge>}
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 grid place-items-center bg-paper/55 text-sm font-medium text-graphite backdrop-blur-[1px]">
              Нет в наличии
            </div>
          )}
        </div>

        <div className="mt-3.5 px-0.5">
          <h3 className="line-clamp-1 text-[15px] font-medium text-graphite">
            {product.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted">{product.shop.name}</p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base font-semibold text-graphite">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute left-3 top-3">
        <FavoriteButton item={fav} />
      </div>

      {product.stock > 0 && (
        <div className="absolute right-3 top-3">
          <QuickAddButton
            product={{
              productId: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              category: product.category.slug,
              shopName: product.shop.name,
            }}
          />
        </div>
      )}
    </div>
  );
}
