import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ProductCard } from "@/components/product-card";
import { ProductArtwork } from "@/components/product-artwork";
import { SectionHeading } from "@/components/section-heading";
import { ShopRankCard } from "@/components/shop-rank-card";
import { getCategories, getCatalog, getTopShops } from "@/lib/queries";

export default async function HomePage() {
  const [categories, products, topShops] = await Promise.all([
    getCategories(),
    getCatalog({}),
    getTopShops(12),
  ]);

  return (
    <>
      <h1 className="sr-only">Волга — маркетплейс изделий ручной работы</h1>

      {/* Категории */}
      <section className="container-page pt-8">
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <StaggerItem key={c.id}>
              <Link
                href={`/catalog?category=${c.slug}`}
                className="group relative flex h-32 flex-col overflow-hidden rounded-2xl border border-line bg-cream p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[var(--shadow-soft)]"
              >
                <span className="relative z-10 max-w-[78%] font-medium leading-tight text-graphite">
                  {c.name}
                </span>
                <ProductArtwork
                  category={c.slug}
                  seed={i}
                  className="absolute -bottom-4 -right-4 h-24 w-24 rotate-6 rounded-2xl opacity-95 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105"
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Топ магазинов */}
      <section className="container-page pt-10">
        <Reveal>
          <SectionHeading
            title="Топ магазинов"
            subtitle="Рейтинг площадки · место в топе — дополнительное продвижение"
            href="/shops"
          />
        </Reveal>
        <Reveal>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 pl-3 pt-3">
            {topShops.map((s, i) => (
              <ShopRankCard key={s.slug} shop={s} rank={i + 1} className="w-60 shrink-0" />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Промо-баннер */}
      <section className="container-page py-8">
        <Reveal>
          <Link
            href="/seller"
            className="relative flex min-h-[170px] items-center overflow-hidden rounded-[24px] border border-line bg-gradient-to-br from-accent-soft to-cream px-8 py-8 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)] md:px-12"
          >
            <div className="animate-blob-slow absolute -right-16 -top-16 h-60 w-60 rounded-full bg-[#cdd9e6] opacity-50 blur-3xl" />
            <div className="relative max-w-lg">
              <h2 className="font-display text-2xl font-semibold text-graphite md:text-3xl">
                Продавайте изделия на Волге
              </h2>
              <p className="mt-2 leading-relaxed text-muted">
                Откройте магазин за пару минут и начните продавать покупателям.
                Бесплатный старт, без скрытых комиссий.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
                Открыть магазин →
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* Рекомендации */}
      <section className="container-page pb-14">
        <Reveal>
          <SectionHeading
            title="Рекомендации для вас"
            subtitle="Изделия ручной работы от мастеров России"
            href="/catalog"
          />
        </Reveal>
        <Stagger className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
