import Link from "next/link";
import { Search, Star, ArrowRight, Box, Home, Sparkles, Zap, Heart } from "lucide-react";
import { Reveal, SlideIn, Stagger, StaggerItem } from "@/components/motion";
import { FeedTabs } from "@/components/feed-tabs";
import { PhoneMockup } from "@/components/concepts/decorations";
import { TilePlaceholder } from "@/components/tile-placeholder";
import { getShops, getCatalog } from "@/lib/queries";
import { pluralize } from "@/lib/utils";

export const metadata = { title: "Волга — V1 Sky" };

type SP = { [k: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function V1Page({
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
          "linear-gradient(180deg, #DDEBFB 0%, #EAF2FE 50%, #F4F9FF 100%)",
      }}
    >
      {/* мягкие 3D blobs фона */}
      <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-[#7CB2F0] opacity-30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-96 h-96 w-96 rounded-full bg-[#A4C7F8] opacity-30 blur-[120px]" />

      {/* Контейнер-«бумага» */}
      <div className="relative mx-3 mt-3 mb-12 rounded-[36px] bg-white/90 px-6 pb-16 shadow-[0_30px_80px_-30px_rgba(40,80,140,0.2)] backdrop-blur md:mx-6 md:mt-6 md:px-10">
        {/* Шапка-бренд */}
        <div className="flex h-16 items-center justify-between border-b border-[#E6EEFA]">
          <Link href="/" className="flex items-center gap-2 text-graphite">
            <span
              className="grid h-7 w-7 place-items-center rounded-lg text-white"
              style={{ background: "#3D7FE0" }}
            >
              <Box className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-display text-[18px] font-semibold tracking-tight">
              Волга
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] text-graphite/80 md:flex">
            <Link href="/v1">Главная</Link>
            <Link href="/v1?view=products">Товары</Link>
            <Link href="/v1">Магазины</Link>
            <Link href="/login">Войти</Link>
          </nav>
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium text-white shadow-[0_8px_18px_-6px_rgba(61,127,224,0.6)] transition hover:brightness-110"
            style={{ background: "#3D7FE0" }}
          >
            <Search className="h-3.5 w-3.5" strokeWidth={2.2} /> Войти
          </Link>
        </div>

        {/* HERO */}
        <section className="grid items-center gap-8 pt-10 md:grid-cols-[1.05fr_1fr] md:pt-14">
          <Reveal>
            <h1 className="font-display text-[44px] font-semibold leading-[1] tracking-[-0.02em] text-graphite md:text-[60px]">
              Маркетплейс <br />
              <span style={{ color: "#3D7FE0" }}>мастеров</span> рядом
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-graphite/70">
              Откройте для себя магазины российских мастеров. Подписывайтесь
              на любимые каналы и поддерживайте крафт прямо из вашего города.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="#feed"
                className="inline-flex h-12 items-center gap-2 rounded-full px-7 text-[14px] font-medium text-white shadow-[0_14px_30px_-10px_rgba(61,127,224,0.7)] transition hover:brightness-110"
                style={{ background: "#3D7FE0" }}
              >
                Открыть ленту
              </Link>
              <Link
                href="/seller"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-[#C8DAF5] bg-white px-7 text-[14px] font-medium text-graphite transition hover:bg-[#F2F7FE]"
              >
                Стать продавцом
              </Link>
            </div>
          </Reveal>

          <SlideIn from="right" delay={0.2}>
            <PhoneMockup className="h-[460px]" tone="sky" />
          </SlideIn>
        </section>

        {/* Категории — чипы как на референсе */}
        <section className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {[
            { icon: Home, label: "Главная", active: true },
            { icon: Sparkles, label: "Новые" },
            { icon: Star, label: "Топ" },
            { icon: Zap, label: "Эко" },
            { icon: Heart, label: "Любимые" },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <SlideIn key={c.label} from="bottom" delay={i * 0.06}>
                <button
                  className="flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-[13px] font-medium text-graphite transition hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-15px_rgba(61,127,224,0.35)]"
                  style={{
                    borderColor: c.active ? "#3D7FE0" : "#E6EEFA",
                    color: c.active ? "#3D7FE0" : undefined,
                  }}
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl"
                    style={{
                      background: c.active ? "#EAF2FE" : "#F2F7FE",
                      color: "#3D7FE0",
                    }}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span>{c.label}</span>
                </button>
              </SlideIn>
            );
          })}
        </section>

        {/* Топ магазинов — как просил клиент на эскизе */}
        <section id="feed" className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3D7FE0]">
                Featured
              </p>
              <h2 className="font-display mt-1 text-[28px] font-semibold leading-tight text-graphite md:text-[34px]">
                Топ магазинов
              </h2>
            </div>
            <FeedTabs active={view} basePath="/v1" />
          </div>

          {view === "shops" ? (
            <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shops.map((s, i) => (
                <StaggerItem key={s.slug}>
                  <SkyCard
                    href={`/shop/${s.slug}`}
                    title={s.name}
                    sub={s.city ?? "Россия"}
                    rating={s.rating}
                    count={s._count.products}
                    index={i}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p, i) => (
                <StaggerItem key={p.id}>
                  <SkyCard
                    href={`/product/${p.slug}`}
                    title={p.title}
                    sub={p.shop.name}
                    rating={5}
                    count={p.price}
                    index={i}
                    price
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </section>
      </div>
    </div>
  );
}

function SkyCard({
  href,
  title,
  sub,
  rating,
  count,
  index,
  price = false,
}: {
  href: string;
  title: string;
  sub: string;
  rating: number;
  count: number;
  index: number;
  price?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-[#E6EEFA] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_50px_-20px_rgba(61,127,224,0.35)]"
    >
      <div className="relative">
        <TilePlaceholder
          size="md"
          seed={index}
          className="aspect-square rounded-none border-0"
        />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
          style={{ background: "#3D7FE0" }}
        >
          {price ? "Хит" : "Канал"}
        </span>
        <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
          <Heart className="h-3.5 w-3.5 text-[#3D7FE0]" strokeWidth={2} />
        </span>
      </div>
      <div className="p-3.5">
        <p className="line-clamp-1 text-[13.5px] font-semibold text-graphite">
          {title}
        </p>
        <p className="mt-0.5 text-[11.5px] text-graphite/60">{sub}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-graphite">
            <Star
              className="h-3 w-3"
              fill="#F5B400"
              strokeWidth={0}
            />
            {rating.toFixed(1)}
          </span>
          <span
            className="inline-flex h-7 items-center gap-1 rounded-full px-3 text-[11px] font-semibold text-white"
            style={{ background: "#3D7FE0" }}
          >
            {price ? `${count} ₽` : `${count} работ`}
            <ArrowRight className="h-3 w-3" strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
