import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, ChevronRight, MapPin, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { ProductArtwork } from "@/components/product-artwork";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductCard } from "@/components/product-card";
import { AskAboutProduct } from "@/components/ask-about-product";
import { Badge } from "@/components/ui/badge";
import { Rating, Stars } from "@/components/rating";
import { getShopTheme, themeVars } from "@/lib/shop-theme";
import { addReview } from "@/app/product/[slug]/actions";
import { formatPrice, pluralize } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type FullProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    variants: true;
    reviews: true;
    materialSources: true;
    category: true;
    shop: true;
  };
}>;

type RelatedProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    shop: true;
    category: { select: { slug: true; name: true } };
  };
}>;

export function ProductDetail({
  product,
  related,
  variant = "page",
}: {
  product: FullProduct;
  related: RelatedProduct[];
  variant?: "page" | "modal";
}) {
  const theme = getShopTheme(product.shop.slug);

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

  const reviewDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((r) => r.rating === star).length,
  }));

  /**
   * 7 пунктов, заданных клиентом дословно (см. ТЗ §4.4):
   *  1. Состав / материал
   *  2. Метка «Ручная работа»
   *  3. Количество ИЛИ «на заказ»
   *  4. Адрес магазина / самовывоз
   *  5. Способы доставки (свободный текст)
   *  6. Условия возврата
   *  7. Рекомендации по уходу
   * Здесь рендерим как явный, читаемый список — чтобы покупатель видел всё
   * «что нужно знать о товаре и его получении» в одном месте.
   */
  const stockLabel = product.madeToOrder
    ? `Под заказ${product.productionDays ? ` · изготовление ${product.productionDays} дн.` : ""}`
    : product.stock > 0
      ? `В наличии · ${product.stock} шт.`
      : "Нет в наличии";

  const clientFields = [
    { label: "Состав / материал", value: product.materials },
    { label: "Метка", value: product.handmade ? "Ручная работа" : null },
    { label: "Наличие", value: stockLabel },
    {
      label: "Самовывоз / адрес магазина",
      value: product.shop.address ?? product.shop.city ?? null,
    },
    { label: "Способы доставки", value: product.deliveryInfo },
    { label: "Условия возврата", value: product.returnPolicy },
    { label: "Рекомендации по уходу", value: product.care },
  ].filter((s) => s.value);

  const techSpecs = [
    { label: "Размеры", value: product.dimensions },
    { label: "Вес", value: product.weightGrams ? `${product.weightGrams} г` : null },
  ].filter((s) => s.value);

  const inner = variant === "modal" ? "px-6 pb-10 pt-2 md:px-10" : "container-page py-8";

  return (
    <div className={inner} style={themeVars(theme)}>
      {variant === "page" && (
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <Link href="/" className="transition hover:text-graphite">
            Лента
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href={`/shop/${product.shop.slug}`}
            className="transition hover:text-graphite"
          >
            {product.shop.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1 max-w-xs text-graphite">{product.title}</span>
        </nav>
      )}

      <div className={`grid gap-10 ${variant === "page" ? "mt-6" : "mt-3"} lg:grid-cols-[1.1fr_1fr]`}>
        <div className={variant === "page" ? "lg:sticky lg:top-28 lg:self-start" : ""}>
          {product.images.length > 0 ? (
            <ProductGallery images={product.images} title={product.title} />
          ) : (
            <ProductArtwork
              category={product.category.slug}
              className="aspect-square rounded-[28px] hairline"
            />
          )}
        </div>

        <div>
          <Link
            href={`/shop/${product.shop.slug}`}
            className="group inline-flex items-center gap-3 rounded-full hairline bg-paper py-1.5 pl-1.5 pr-4 transition hover:bg-cream"
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-full font-medium text-white"
              style={{ background: theme.accent }}
            >
              {product.shop.name.charAt(0)}
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <span className="font-medium text-graphite">{product.shop.name}</span>
              {product.shop.verified && (
                <BadgeCheck className="h-4 w-4" style={{ color: theme.accent }} />
              )}
            </span>
          </Link>

          <h1 className="font-serif mt-5 text-[28px] leading-tight text-graphite md:text-[36px]">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.handmade && <Badge variant="handmade">Ручная работа</Badge>}
            {product.madeInRussia && <Badge variant="russia">Сделано в России</Badge>}
            {product.eco && <Badge variant="eco">Эко</Badge>}
            {product.madeToOrder && <Badge variant="default">Под заказ</Badge>}
            {reviewAvg != null && (
              <span className="ml-1 inline-flex items-center">
                <Rating value={reviewAvg} count={product.reviews.length} />
              </span>
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
              madeToOrder={product.madeToOrder}
              shopSlug={product.shop.slug}
              variantGroups={variantGroups}
            />
          </div>

          <div className="mt-4">
            <AskAboutProduct
              shopName={product.shop.name}
              shopSlug={product.shop.slug}
              productTitle={product.title}
              accent={theme.accent}
            />
          </div>

          {/* Сигналы доверия — данные эскроу/возврата/верификации уже есть */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-accent" strokeWidth={1.6} />
              Деньги мастеру после получения
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw className="h-4 w-4 text-accent" strokeWidth={1.6} />
              Возврат 7 дней
            </span>
            {product.shop.verified && (
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-accent" strokeWidth={1.6} />
                Проверенный мастер
              </span>
            )}
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl p-5 text-sm sm:grid-cols-2" style={{ background: "var(--surface-muted, #faf8f4)" }}>
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} style={{ color: theme.accent }} />
              <span className="text-graphite">{product.deliveryInfo}</span>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} style={{ color: theme.accent }} />
              <span className="text-graphite">{product.returnPolicy}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-12 grid gap-12 ${variant === "page" ? "lg:grid-cols-[1fr_340px]" : ""}`}>
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl font-semibold text-graphite">Описание</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-graphite/90">
              {product.description}
            </p>
          </section>

          {/* Главный блок: всё, что нужно знать о товаре и его получении */}
          <section>
            <p className="eyebrow">Что нужно знать</p>
            <h2 className="font-display mt-2 text-2xl font-semibold text-graphite">
              О товаре и получении
            </h2>
            <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl hairline bg-line">
              {clientFields.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-1 bg-paper px-5 py-4 text-sm sm:flex-row sm:gap-4"
                >
                  <dt className="w-52 shrink-0 text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
                    {s.label}
                  </dt>
                  <dd className="text-graphite">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {techSpecs.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold text-graphite">
                Размеры и вес
              </h2>
              <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl hairline">
                {techSpecs.map((s) => (
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
                <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl hairline">
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
                          className="font-medium transition"
                          style={{ color: theme.accent }}
                        >
                          Поставщик: {m.supplierName} →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
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
              <>
                {reviewAvg != null && (
                  <div className="mt-5 flex flex-col gap-6 rounded-2xl hairline p-5 sm:flex-row sm:items-center">
                    <div className="text-center sm:w-44 sm:shrink-0">
                      <div className="font-display text-5xl font-semibold text-graphite">
                        {reviewAvg.toFixed(1)}
                      </div>
                      <Stars value={reviewAvg} className="mt-2 justify-center" />
                      <div className="mt-1.5 text-xs text-muted">
                        {product.reviews.length}{" "}
                        {pluralize(product.reviews.length, ["отзыв", "отзыва", "отзывов"])}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {reviewDist.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-2 text-xs text-muted">
                          <span className="w-2.5 text-right text-graphite">{star}</span>
                          <Star className="h-3 w-3 text-gold" fill="currentColor" strokeWidth={0} />
                          <span className="h-2 flex-1 overflow-hidden rounded-full bg-cream">
                            <span
                              className="block h-full rounded-full bg-gold"
                              style={{ width: `${(count / product.reviews.length) * 100}%` }}
                            />
                          </span>
                          <span className="w-6 text-right tabular-nums">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <ul className="mt-5 space-y-5">
                  {product.reviews.map((r) => (
                    <li key={r.id} className="rounded-2xl hairline p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-2">
                          <span className="font-medium text-graphite">{r.authorName}</span>
                          {r.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-sage/10 px-2 py-0.5 text-[11px] font-medium text-sage">
                              <BadgeCheck className="h-3 w-3" strokeWidth={2} /> Проверенная покупка
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-muted">{dateFmt.format(r.createdAt)}</span>
                      </div>
                      <Stars value={r.rating} className="mt-2" />
                      <p className="mt-2.5 leading-relaxed text-graphite/90">{r.text}</p>
                      {r.sellerReply && (
                        <div className="mt-3 rounded-xl bg-cream/70 p-3.5">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-graphite">
                            <span
                              className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold text-white"
                              style={{ background: theme.accent }}
                            >
                              {product.shop.name.charAt(0)}
                            </span>
                            Ответ магазина «{product.shop.name}»
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-graphite/90">
                            {r.sellerReply}
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {variant === "page" && (
              <form
                action={addReview}
                className="mt-6 rounded-2xl hairline bg-cream/60 p-5"
              >
                <input type="hidden" name="productId" value={product.id} />
                <div className="text-sm font-semibold text-graphite">
                  Оставить отзыв
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <label className="text-sm text-muted">Оценка</label>
                  <select
                    name="rating"
                    defaultValue="5"
                    className="h-10 rounded-lg border border-line bg-paper px-3 text-sm text-graphite focus:border-accent focus:outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} ★
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  name="text"
                  required
                  rows={3}
                  placeholder="Поделитесь впечатлением о товаре…"
                  className="mt-3 w-full resize-none rounded-xl border border-line bg-paper p-3 text-sm text-graphite placeholder:text-muted/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
                <button className="btn-accent mt-3 inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition">
                  Опубликовать отзыв
                </button>
              </form>
            )}
          </section>
        </div>

        {variant === "page" && (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div
              className="overflow-hidden rounded-3xl bg-paper hairline"
              style={themeVars(theme)}
            >
              <div className="h-20" style={{ background: theme.cover }} />
              <div className="-mt-8 px-5 pb-5">
                <div
                  className="relative h-14 w-14 overflow-hidden rounded-2xl border-4 border-paper shadow-[var(--shadow-soft)]"
                  style={{ background: product.shop.avatarUrl ? undefined : theme.accentSoft }}
                >
                  {product.shop.avatarUrl ? (
                    <Image
                      src={product.shop.avatarUrl}
                      alt={product.shop.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <span
                      className="grid h-full w-full place-items-center font-display text-xl font-semibold"
                      style={{ color: theme.accent }}
                    >
                      {product.shop.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="font-medium text-graphite">{product.shop.name}</span>
                  {product.shop.verified && (
                    <BadgeCheck className="h-4 w-4" style={{ color: theme.accent }} />
                  )}
                </div>
                <Rating value={product.shop.rating} count={product.shop.ratingCount} />
                {product.shop.city && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                    <MapPin className="h-4 w-4" strokeWidth={1.6} /> {product.shop.city},{" "}
                    {product.shop.region}
                  </div>
                )}
                <Link
                  href={`/shop/${product.shop.slug}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-white transition active:scale-[0.98]"
                  style={{ background: theme.accent }}
                >
                  Открыть магазин
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>

      {related.length > 0 && variant === "page" && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-graphite">
            Похожие изделия
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} layout="feed" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
