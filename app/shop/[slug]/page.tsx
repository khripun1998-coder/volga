import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, RotateCcw, Truck } from "lucide-react";
import { getShopBySlug } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import { ProductArtwork } from "@/components/product-artwork";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  return { title: shop ? `${shop.name} — Волга` : "Магазин — Волга" };
}

export default async function ShopHome({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  if (!shop) notFound();

  // Закреплённый товар — самый «выгодный» по рейтингу/просмотрам.
  // Сейчас детерминированно: первый featured или с самой высокой ценой.
  const pinned =
    shop.products.find((p) => p.featured) ??
    [...shop.products].sort((a, b) => b.price - a.price)[0];

  const others = shop.products.filter((p) => p.id !== pinned?.id);
  const fresh = [...others]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  if (shop.products.length === 0) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-line py-24 text-center">
        <p className="font-display text-2xl text-graphite">Канал только открылся</p>
        <p className="mt-2 max-w-md text-sm text-muted">
          Мастер скоро добавит первые работы. Подпишитесь, чтобы не пропустить.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Закреплённое — как pinned-видео на YouTube-канале */}
      {pinned && (
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <p className="eyebrow">Закреплено мастером</p>
            <Link
              href={`/shop/${shop.slug}/products`}
              className="text-[13px] font-medium text-graphite hover:text-[var(--accent)]"
            >
              Все товары →
            </Link>
          </div>

          <Link
            href={`/product/${pinned.slug}`}
            className="group grid items-stretch gap-6 overflow-hidden rounded-[28px] bg-paper md:grid-cols-[1.05fr_1fr]"
          >
            <ProductArtwork
              category={pinned.category.slug}
              className="aspect-[5/4] rounded-[24px] transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            />
            <div className="flex flex-col justify-center px-1 md:px-3">
              <p className="eyebrow" style={{ color: "var(--accent)" }}>
                Главный выбор магазина
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-graphite md:text-4xl">
                {pinned.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted">
                {pinned.shortDescription}
              </p>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-2xl font-semibold text-graphite">
                  {formatPrice(pinned.price)}
                </span>
                {pinned.oldPrice && (
                  <span className="text-base text-muted line-through">
                    {formatPrice(pinned.oldPrice)}
                  </span>
                )}
              </div>
              <span
                className="mt-7 inline-flex h-12 w-fit items-center gap-2 rounded-full px-6 text-sm font-medium text-white transition group-hover:brightness-105"
                style={{ background: "var(--accent)" }}
              >
                Смотреть карточку
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Новинки канала */}
      {fresh.length > 0 && (
        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h3 className="font-display text-2xl font-semibold text-graphite">
              Новые работы
            </h3>
            <Link
              href={`/shop/${shop.slug}/products`}
              className="text-[13px] font-medium text-graphite hover:text-[var(--accent)]"
            >
              Все товары →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {fresh.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} layout="channel" />
            ))}
          </div>
        </section>
      )}

      {/* О мастере — короткий блок прямо на главной */}
      <section className="grid gap-8 rounded-[28px] p-8 md:grid-cols-[1.2fr_1fr] md:p-12"
        style={{ background: "var(--surface-muted)" }}
      >
        <div>
          <p className="eyebrow">О мастере</p>
          <p className="mt-4 text-[16px] leading-relaxed text-graphite">
            {shop.description}
          </p>
          <Link
            href={`/shop/${shop.slug}/about`}
            className="mt-5 inline-flex items-center gap-1 text-[14px] font-medium"
            style={{ color: "var(--accent)" }}
          >
            Подробнее →
          </Link>
        </div>
        <div className="space-y-3">
          {shop.deliveryInfo && (
            <div className="flex items-start gap-3 rounded-2xl bg-paper p-4 text-[14px]">
              <Truck
                className="mt-0.5 h-5 w-5 shrink-0"
                strokeWidth={1.5}
                style={{ color: "var(--accent)" }}
              />
              <span className="text-graphite">{shop.deliveryInfo}</span>
            </div>
          )}
          {shop.returnPolicy && (
            <div className="flex items-start gap-3 rounded-2xl bg-paper p-4 text-[14px]">
              <RotateCcw
                className="mt-0.5 h-5 w-5 shrink-0"
                strokeWidth={1.5}
                style={{ color: "var(--accent)" }}
              />
              <span className="text-graphite">{shop.returnPolicy}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
