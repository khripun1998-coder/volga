import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronRight, MapPin, RotateCcw, Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { ProductArtwork } from "@/components/product-artwork";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Rating, Stars } from "@/components/rating";
import { formatPrice, pluralize } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.title} — Волга` : "Товар — Волга" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "ACTIVE") notFound();

  const related = await getRelatedProducts(product.categoryId, product.id, 4);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : null;

  const variantGroups = Object.values(
    product.variants.reduce<Record<string, { kind: string; values: string[] }>>(
      (acc, v) => {
        (acc[v.kind] ??= { kind: v.kind, values: [] }).values.push(v.value);
        return acc;
      },
      {}
    )
  );

  const reviewAvg = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null;

  const specs = [
    { label: "Материалы", value: product.materials },
    { label: "Размеры", value: product.dimensions },
    { label: "Вес", value: product.weightGrams ? `${product.weightGrams} г` : null },
    {
      label: "Срок изготовления",
      value: product.productionDays ? `${product.productionDays} дн.` : null,
    },
    { label: "Изготовление под заказ", value: product.madeToOrder ? "Да" : null },
    { label: "Уход", value: product.care },
  ].filter((s) => s.value);

  const dateFmt = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const kindLabel =
    ({ workshop: "Мастерская", production: "Производство", supplier: "Поставщик сырья" } as Record<string, string>)[
      product.shop.kind
    ] ?? null;

  return (
    <div className="container-page py-8">
      {/* Хлебные крошки */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="transition hover:text-accent">
          Главная
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/catalog?category=${product.category.slug}`}
          className="transition hover:text-accent"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-graphite">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductArtwork
            category={product.category.slug}
            className="aspect-square rounded-3xl border border-line shadow-[var(--shadow-soft)]"
          />
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5">
            {kindLabel && <Badge variant="default">{kindLabel}</Badge>}
            {product.handmade && <Badge variant="handmade">Ручная работа</Badge>}
            {product.madeInRussia && <Badge variant="russia">Сделано в России</Badge>}
            {product.eco && <Badge variant="eco">Эко</Badge>}
            {product.madeToOrder && <Badge variant="default">Под заказ</Badge>}
          </div>

          <h1 className="font-display mt-3 text-3xl font-semibold leading-tight text-graphite md:text-4xl">
            {product.title}
          </h1>

          <div className="mt-3 flex items-center gap-4">
            <Link
              href={`/shop/${product.shop.slug}`}
              className="text-sm text-muted transition hover:text-accent"
            >
              {product.shop.name}
            </Link>
            {reviewAvg != null && (
              <Rating value={reviewAvg} count={product.reviews.length} />
            )}
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-graphite">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                {discount && <Badge variant="accent">−{discount}%</Badge>}
              </>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-muted">{product.shortDescription}</p>

          <div className="mt-7">
            <ProductPurchase
              product={{
                productId: product.id,
                slug: product.slug,
                title: product.title,
                price: product.price,
                category: product.category.slug,
                shopName: product.shop.name,
              }}
              stock={product.stock}
              shopSlug={product.shop.slug}
              variantGroups={variantGroups}
            />
          </div>

          <div className="mt-8 grid gap-3 rounded-xl border border-line bg-cream p-5 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
              <span className="text-graphite">{product.deliveryInfo}</span>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
              <span className="text-graphite">{product.returnPolicy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Описание / характеристики / отзывы + продавец */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_340px]">
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl font-semibold text-graphite">Описание</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-graphite/90">
              {product.description}
            </p>
          </section>

          {specs.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold text-graphite">
                Характеристики
              </h2>
              <dl className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line">
                {specs.map((s) => (
                  <div key={s.label} className="flex gap-4 px-5 py-3.5 text-sm">
                    <dt className="w-44 shrink-0 text-muted">{s.label}</dt>
                    <dd className="text-graphite">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {(product.materials || product.materialSources.length > 0) && (
            <section>
              <h2 className="font-display text-2xl font-semibold text-graphite">
                Состав и происхождение
              </h2>
              {product.materials && (
                <p className="mt-4 text-graphite/90">
                  <span className="text-muted">Состав:</span> {product.materials}
                </p>
              )}
              {product.materialSources.length > 0 && (
                <div className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line">
                  {product.materialSources.map((m) => (
                    <div
                      key={m.id}
                      className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 text-sm"
                    >
                      <div>
                        <span className="font-medium text-graphite">{m.name}</span>
                        {m.origin && <span className="text-muted"> · {m.origin}</span>}
                      </div>
                      {m.supplierSlug && (
                        <Link
                          href={`/shop/${m.supplierSlug}`}
                          className="font-medium text-accent transition hover:text-accent-hover"
                        >
                          Поставщик: {m.supplierName} →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {product.materialSources.length > 0 && (
                <p className="mt-3 text-xs text-muted">
                  Полная прослеживаемость: видно, из чего и у кого закуплены материалы.
                </p>
              )}
            </section>
          )}

          {product.applications && (
            <section>
              <h2 className="font-display text-2xl font-semibold text-graphite">Применение</h2>
              <p className="mt-4 leading-relaxed text-graphite/90">{product.applications}</p>
            </section>
          )}

          {product.production && (
            <section>
              <h2 className="font-display text-2xl font-semibold text-graphite">Производство</h2>
              <p className="mt-4 leading-relaxed text-graphite/90">{product.production}</p>
            </section>
          )}

          <section>
            <h2 className="font-display text-2xl font-semibold text-graphite">
              Отзывы {product.reviews.length > 0 && `(${product.reviews.length})`}
            </h2>
            {product.reviews.length === 0 ? (
              <p className="mt-4 text-muted">
                Пока нет отзывов. Станьте первым после покупки.
              </p>
            ) : (
              <ul className="mt-5 space-y-5">
                {product.reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border border-line p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-graphite">{r.authorName}</span>
                      <span className="text-xs text-muted">{dateFmt.format(r.createdAt)}</span>
                    </div>
                    <Stars value={r.rating} className="mt-2" />
                    <p className="mt-2.5 leading-relaxed text-graphite/90">{r.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Продавец */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-line p-5">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-line bg-cream">
                {product.shop.avatarUrl && (
                  <Image
                    src={product.shop.avatarUrl}
                    alt={product.shop.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-graphite">{product.shop.name}</span>
                  {product.shop.verified && (
                    <BadgeCheck className="h-4 w-4 text-accent" />
                  )}
                </div>
                <Rating value={product.shop.rating} count={product.shop.ratingCount} />
              </div>
            </div>
            {product.shop.city && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted">
                <MapPin className="h-4 w-4" strokeWidth={1.6} /> {product.shop.city},{" "}
                {product.shop.region}
              </div>
            )}
            {product.shop.exportInfo && (
              <div className="mt-2 text-sm text-muted">Экспорт: {product.shop.exportInfo}</div>
            )}
            {product.shop.address && (
              <div className="mt-2 text-sm text-muted">Адрес / самовывоз: {product.shop.address}</div>
            )}
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
              {product.shop.description}
            </p>
            <Link
              href={`/shop/${product.shop.slug}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-graphite transition hover:border-accent hover:text-accent"
            >
              Перейти в магазин
            </Link>
          </div>
        </aside>
      </div>

      {/* Похожие */}
      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading
            title="Похожие изделия"
            href={`/catalog?category=${product.category.slug}`}
          />
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
