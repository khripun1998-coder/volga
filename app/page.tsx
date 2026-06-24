import Link from "next/link";
import Image from "next/image";
import { ShopCarousel } from "@/components/shop-carousel";
import { ProductsView } from "@/components/products-view";
import { FeedTabs } from "@/components/feed-tabs";
import { Heart, Package, Search, Star, Users } from "lucide-react";
import { Reveal } from "@/components/motion";
import { HeroVisual } from "@/components/hero-visual";
import { getCatalog, getShops, getPlatformStats, getFeaturedMaster } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

type SP = { [key: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const view = one(sp.view) === "products" ? "products" : "shops";

  const [shops, products, stats, master] = await Promise.all([
    getShops(),
    getCatalog({ sort: "new" }),
    getPlatformStats(),
    getFeaturedMaster(),
  ]);

  const statCards = [
    { n: stats.shops.toLocaleString("ru-RU"), l: "магазинов", Icon: Users },
    { n: stats.products.toLocaleString("ru-RU"), l: "изделий", Icon: Package },
    { n: stats.avgRating.toFixed(1), l: "средний рейтинг", Icon: Star },
    { n: stats.clients.toLocaleString("ru-RU"), l: "клиентов", Icon: Heart },
  ];

  const productsSorted = [...products].sort((a, b) => {
    const ra = a.shop.rating * Math.log(1 + a.shop.ratingCount);
    const rb = b.shop.rating * Math.log(1 + b.shop.ratingCount);
    if (rb !== ra) return rb - ra;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="container-page pb-20 pt-8 md:pt-10">
      <h1 className="sr-only">Волга — соцсеть мастеров и магазинов</h1>

      {/* ─────────── HERO ─────────── */}
      <section className="relative z-30 rounded-[32px] bg-gradient-to-br from-[#F3F1FE] via-[#EFEDFC] to-[#E7ECFE] hairline md:overflow-visible">
        {/* Hero-визуал поверх правой части — крупный, выходит за край блока (как в макете) */}
        <div className="pointer-events-none absolute right-[-6%] top-[55%] z-10 hidden h-[158%] w-[70%] -translate-y-1/2 md:block lg:right-[-8%] lg:h-[164%] lg:w-[72%]">
          <HeroVisual />
        </div>

        <div className="relative grid items-center gap-6 p-7 md:grid-cols-[1.15fr_0.85fr] md:p-12">
          <Reveal className="relative z-20">
            <p className="eyebrow" style={{ color: "var(--color-accent)" }}>
              Союз мастеров
            </p>
            <h2 className="font-serif mt-4 text-[24px] leading-[1.2] text-[#211c4d] md:text-[29px] lg:text-[33px]">
              Если вы производитель или мастер — откройте магазин на «Волге»,
              чтобы продавать свои изделия по всей РФ и за рубежом, поддерживая
              российское производство
            </h2>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-muted">
              Открывайте магазины мастеров, общайтесь с авторами и
              поддерживайте локальный крафт. Сначала — лучшие по рейтингу.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/?view=products"
                className="btn-accent inline-flex h-12 items-center rounded-full bg-accent px-7 text-[14.5px] font-semibold text-white transition"
              >
                Открыть ленту
              </Link>
              <Link
                href="/seller"
                className="inline-flex h-12 items-center rounded-full bg-paper px-7 text-[14.5px] font-semibold text-graphite hairline transition hover:bg-cream"
              >
                Стать продавцом
              </Link>
            </div>
          </Reveal>

          {/* распорка под абсолютный hero-визуал */}
          <div className="hidden h-[330px] md:block lg:h-[380px]" aria-hidden />
        </div>
      </section>

      {/* ─────────── Центральный поиск (над плашкой) ─────────── */}
      <Reveal>
        <div className="relative mx-auto mt-8 max-w-2xl">
          <form
            action="/catalog"
            method="get"
            role="search"
            className="flex items-center gap-2 rounded-full border border-white/70 bg-white/70 p-2 pl-5 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          >
            <Search className="h-5 w-5 shrink-0 text-muted" strokeWidth={1.7} />
          <input
            name="q"
            placeholder="Поиск по магазинам и изделиям"
            aria-label="Поиск по магазинам и изделиям"
            className="h-11 flex-1 bg-transparent text-[14.5px] text-graphite outline-none placeholder:text-muted/70"
          />
          <button
            type="submit"
            className="btn-accent inline-flex h-11 items-center rounded-full bg-accent px-7 text-[14px] font-semibold text-white transition"
          >
            Найти
          </button>
          </form>
        </div>
      </Reveal>

      {/* ─────────── Светлая стеклянная плашка статистики ─────────── */}
      <Reveal>
        <section className="relative z-10 mt-6 grid grid-cols-2 overflow-hidden rounded-[24px] border border-white/70 bg-gradient-to-br from-white/75 to-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),var(--shadow-lift)] backdrop-blur-xl md:grid-cols-4">
          {statCards.map(({ n, l, Icon }, i) => (
            <div
              key={l}
              className={`flex items-center gap-4 px-6 py-7 ${
                i % 2 === 1 ? "border-l border-white/60" : ""
              } ${i >= 2 ? "border-t border-white/60 md:border-t-0" : ""} ${
                i > 0 ? "md:border-l md:border-white/60" : ""
              }`}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent-soft text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <div className="font-display text-[26px] font-extrabold leading-none text-graphite">
                  {n}
                </div>
                <div className="mt-1 text-[12px] text-muted">{l}</div>
              </div>
            </div>
          ))}
        </section>
      </Reveal>

      {/* ─────────── ТОП НЕДЕЛИ ─────────── */}
      <section className="mt-12">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow" style={{ color: "var(--color-accent)" }}>
              Топ недели
            </p>
            <h3 className="font-display mt-1.5 text-[26px] leading-tight text-graphite md:text-[32px]">
              {view === "shops" ? "Топ магазинов" : "Изделия мастеров"}
            </h3>
            <p className="mt-1.5 text-[14px] text-muted">
              {view === "shops"
                ? "Лучшие магазины недели по оценкам покупателей"
                : "Изделия от мастеров с самым высоким рейтингом"}
            </p>
          </div>
          <FeedTabs active={view} />
        </div>

        {view === "shops" ? (
          <ShopCarousel shops={shops} />
        ) : (
          <div className="mt-6">
            <ProductsView products={productsSorted} />
          </div>
        )}
      </section>

      {/* ─────────── МАСТЕР НЕДЕЛИ (редакторский блок) ─────────── */}
      {master && (
        <section className="mt-16">
          <div className="grid overflow-hidden rounded-[28px] bg-paper hairline shadow-[var(--shadow-soft)] md:grid-cols-[1fr_1.05fr]">
            <div className="flex flex-col justify-center gap-5 bg-cream p-8 md:p-10">
              <p className="eyebrow" style={{ color: "var(--color-accent)" }}>
                Мастер недели
              </p>
              <div className="flex items-center gap-3.5">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-accent-soft font-serif text-2xl font-semibold text-accent">
                  {(master.owner?.name ?? master.name).charAt(0)}
                </span>
                <div>
                  <div className="font-serif text-2xl leading-tight text-graphite">
                    {master.owner?.name ?? master.name}
                  </div>
                  <div className="mt-0.5 text-sm text-muted">
                    {master.name}
                    {master.craftSince ? ` · в ремесле с ${master.craftSince}` : ""}
                  </div>
                </div>
              </div>
              {master.story && (
                <p className="line-clamp-4 text-[15px] leading-relaxed text-graphite/90">
                  {master.story}
                </p>
              )}
              <Link
                href={`/shop/${master.slug}`}
                className="btn-accent inline-flex h-11 w-fit items-center rounded-full bg-accent px-6 text-[14px] font-semibold text-white transition"
              >
                Открыть магазин
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2.5 p-4 md:gap-3 md:p-5">
              {master.products.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-cream">
                    {p.images[0] && (
                      <Image
                        src={p.images[0].url}
                        alt={p.title}
                        fill
                        sizes="160px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="mt-2 truncate text-[12.5px] font-medium text-graphite">
                    {p.title}
                  </div>
                  <div className="text-[12.5px] text-muted">{formatPrice(p.price)}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
