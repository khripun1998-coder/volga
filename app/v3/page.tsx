import Link from "next/link";
import { ArrowUpRight, Box, Plus, Search, Sparkles, Star } from "lucide-react";
import { Parallax, Reveal, SlideIn, Stagger, StaggerItem } from "@/components/motion";
import { FeedTabs } from "@/components/feed-tabs";
import { GlassScene } from "@/components/concepts/decorations";
import { TilePlaceholder } from "@/components/tile-placeholder";
import { getShops, getCatalog } from "@/lib/queries";

export const metadata = { title: "Волга — V3 Aurora" };

type SP = { [k: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const ACCENT = "#6366F1";
const ACCENT_DARK = "#4F46E5";
const GLASS = "rgba(255, 255, 255, 0.65)";

export default async function V3Page({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const view = one(sp.view) === "products" ? "products" : "shops";

  const [shops, products] = await Promise.all([getShops(), getCatalog({ sort: "new" })]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #E8E6FB 0%, #F3F0FE 40%, #FFFFFF 100%)",
      }}
    >
      {/* мягкие фоновые сияния */}
      <div className="pointer-events-none absolute -left-32 top-32 h-[480px] w-[480px] rounded-full bg-[#A78BFA] opacity-30 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-96 h-[520px] w-[520px] rounded-full bg-[#F0ABFC] opacity-25 blur-[160px]" />
      <div className="pointer-events-none absolute left-1/2 top-[60vh] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[#7CC4FF] opacity-20 blur-[160px]" />

      <div
        className="relative mx-3 mt-3 mb-12 rounded-[36px] border px-6 pb-16 shadow-[0_30px_80px_-30px_rgba(99,102,241,0.3)] md:mx-6 md:mt-6 md:px-10"
        style={{
          background: GLASS,
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderColor: "rgba(255,255,255,0.6)",
        }}
      >
        {/* Шапка */}
        <div className="flex h-16 items-center justify-between border-b border-white/40">
          <Link href="/" className="flex items-center gap-2 text-graphite">
            <span
              className="grid h-7 w-7 place-items-center rounded-lg text-white"
              style={{ background: ACCENT }}
            >
              <Box className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-display text-[18px] font-semibold tracking-tight">
              Волга
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] text-graphite/80 md:flex">
            <Link href="/v3">Главная</Link>
            <Link href="/v3?view=products">Товары</Link>
            <Link href="/v3">Магазины</Link>
            <Link href="/login">Войти</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              aria-label="Создать"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/60 text-graphite shadow-[0_4px_12px_rgba(99,102,241,0.15)] backdrop-blur"
            >
              <Plus className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <Link
              href="/login"
              className="hidden h-9 items-center rounded-full px-5 text-[13px] font-medium text-white transition hover:brightness-110 sm:inline-flex"
              style={{ background: "#15172B" }}
            >
              Войти
            </Link>
          </div>
        </div>

        {/* HERO с glass-сценой */}
        <section className="relative grid items-center gap-10 pt-12 md:grid-cols-[1.1fr_1fr] md:pt-16">
          <Reveal>
            <h1 className="font-display text-[44px] font-semibold leading-[1] tracking-[-0.02em] text-graphite md:text-[60px]">
              Маркетплейс <br />
              <span style={{ color: ACCENT_DARK }}>
                с душой
              </span>{" "}
              мастера
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-graphite/70">
              Открывайте каналы российских мастеров. Подписывайтесь,
              общайтесь, поддерживайте — как в любимой соцсети.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="#feed"
                className="inline-flex h-12 items-center gap-2 rounded-full px-7 text-[14px] font-medium text-white shadow-[0_16px_40px_-12px_rgba(99,102,241,0.7)] transition hover:brightness-110"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
                }}
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.8} />
                Открыть ленту
              </Link>
              <Link
                href="/catalog"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/70 bg-white/60 px-7 text-[14px] font-medium text-graphite backdrop-blur transition hover:bg-white/85"
              >
                <Search className="h-4 w-4" strokeWidth={1.8} /> Поиск
              </Link>
            </div>
          </Reveal>

          <SlideIn from="right" delay={0.2}>
            <GlassScene className="h-[460px]" />
          </SlideIn>
        </section>

        {/* Бентограм статистики */}
        <Reveal>
          <section
            className="mt-14 grid gap-4 rounded-3xl border p-2 md:grid-cols-4"
            style={{
              borderColor: "rgba(255,255,255,0.6)",
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(12px)",
            }}
          >
            {[
              { value: "1 200+", label: "мастеров" },
              { value: "8 500+", label: "изделий" },
              { value: "98%", label: "качество" },
              { value: "24/7", label: "поддержка" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/70 p-5 text-graphite shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]"
              >
                <p className="font-display text-[28px] font-semibold tracking-tight">
                  {s.value}
                </p>
                <p className="mt-1 text-[12px] text-graphite/60">{s.label}</p>
              </div>
            ))}
          </section>
        </Reveal>

        {/* Топ магазинов — бентограм */}
        <section id="feed" className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: ACCENT_DARK }}
              >
                Featured
              </p>
              <h2 className="font-display mt-1 text-[28px] font-semibold leading-tight text-graphite md:text-[34px]">
                Каналы недели
              </h2>
            </div>
            <FeedTabs active={view} basePath="/v3" />
          </div>

          {view === "shops" ? (
            <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shops.map((s, i) => (
                <StaggerItem
                  key={s.slug}
                  className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
                >
                  <GlassCard
                    href={`/shop/${s.slug}`}
                    title={s.name}
                    sub={s.city ?? "Россия"}
                    rating={s.rating}
                    count={s._count.products}
                    index={i}
                    big={i === 0}
                    isShop
                  />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p, i) => (
                <StaggerItem key={p.id}>
                  <GlassCard
                    href={`/product/${p.slug}`}
                    title={p.title}
                    sub={p.shop.name}
                    rating={5}
                    count={p.price}
                    index={i}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </section>

        {/* Параллакс-бренд внизу */}
        <Parallax speed={50} className="mt-20">
          <p
            className="text-center font-display text-[14vw] font-semibold leading-none tracking-[-0.04em] md:text-[12rem]"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}66 0%, ${ACCENT_DARK}33 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Волга
          </p>
        </Parallax>
      </div>
    </div>
  );
}

function GlassCard({
  href,
  title,
  sub,
  rating,
  count,
  index,
  big = false,
  isShop = false,
}: {
  href: string;
  title: string;
  sub: string;
  rating: number;
  count: number;
  index: number;
  big?: boolean;
  isShop?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block h-full overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(99,102,241,0.45)]"
      style={{
        background: "rgba(255,255,255,0.7)",
        borderColor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="relative">
        <TilePlaceholder
          size={big ? "lg" : "md"}
          seed={index}
          className={`${big ? "aspect-[5/4]" : "aspect-square"} rounded-none border-0`}
        />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
          style={{
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
          }}
        >
          {isShop ? "Канал" : "Изделие"}
        </span>
        <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white/85 backdrop-blur">
          <ArrowUpRight className="h-3.5 w-3.5 text-graphite" strokeWidth={2} />
        </span>
      </div>
      <div className={big ? "p-5" : "p-3.5"}>
        <p
          className={`line-clamp-1 ${big ? "font-display text-[20px] font-semibold" : "text-[13.5px] font-semibold"} text-graphite`}
        >
          {title}
        </p>
        <p className="mt-0.5 text-[12px] text-graphite/60">{sub}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-graphite">
            <Star className="h-3 w-3" fill={ACCENT} strokeWidth={0} />
            {rating.toFixed(1)}
          </span>
          <span
            className="text-[12px] font-semibold"
            style={{ color: ACCENT_DARK }}
          >
            {isShop ? `${count} работ` : `${count.toLocaleString("ru-RU")} ₽`}
          </span>
        </div>
      </div>
    </Link>
  );
}
