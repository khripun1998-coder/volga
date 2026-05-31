import Link from "next/link";
import {
  Search,
  Star,
  ArrowUpRight,
  Box,
  MessageCircle,
  Briefcase,
  Laptop,
  Bell,
} from "lucide-react";
import { Reveal, SlideIn, Stagger, StaggerItem } from "@/components/motion";
import { FeedTabs } from "@/components/feed-tabs";
import { PhoneMockup } from "@/components/concepts/decorations";
import { TilePlaceholder } from "@/components/tile-placeholder";
import { getShops, getCatalog } from "@/lib/queries";

export const metadata = { title: "Волга — V2 Sunshine" };

type SP = { [k: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const ACCENT = "#F59E0B";
const ACCENT_DARK = "#D97706";

export default async function V2Page({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const view = one(sp.view) === "products" ? "products" : "shops";

  const [shops, products] = await Promise.all([getShops(), getCatalog({ sort: "new" })]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* мягкие 3D blob фоны как на референсе */}
      <div className="pointer-events-none absolute -left-32 top-40 h-96 w-96 rounded-full opacity-25 blur-[120px]" style={{ background: ACCENT }} />
      <div className="pointer-events-none absolute right-12 top-72 h-72 w-72 rounded-full opacity-15 blur-[100px]" style={{ background: "#FBBF24" }} />

      <div className="relative mx-3 mt-3 mb-12 rounded-[36px] bg-white px-6 pb-16 shadow-[0_30px_80px_-30px_rgba(245,158,11,0.18)] md:mx-6 md:mt-6 md:px-10">
        {/* Шапка */}
        <div className="flex h-16 items-center justify-between border-b border-[#F1ECE3]">
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
            <Link href="/v2">Главная</Link>
            <Link href="/v2?view=products">Товары</Link>
            <Link href="/v2">Магазины</Link>
            <Link href="/login">Войти</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              aria-label="Уведомления"
              className="grid h-9 w-9 place-items-center rounded-full bg-[#FFF7E6] text-graphite"
            >
              <Bell className="h-4 w-4" strokeWidth={1.8} />
            </button>
            <Link
              href="/login"
              className="hidden h-9 items-center rounded-full px-4 text-[13px] font-medium text-white transition hover:brightness-110 sm:inline-flex"
              style={{ background: ACCENT }}
            >
              Войти
            </Link>
          </div>
        </div>

        {/* HERO с большой поисковой строкой как на референсе */}
        <section className="grid items-center gap-10 pt-12 md:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <h1 className="font-display text-[44px] font-semibold leading-[1] tracking-[-0.02em] text-graphite md:text-[58px]">
              Найдите своего <br />
              <span style={{ color: ACCENT_DARK }}>мастера</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-graphite/70">
              Поиск по всем мастерам и каналам России. Сначала — лучшие
              по рейтингу, с самыми тёплыми отзывами.
            </p>

            {/* Поисковая строка */}
            <form
              action="/catalog"
              className="mt-7 flex w-full max-w-xl items-center gap-2 rounded-full border bg-white p-1.5 shadow-[0_24px_50px_-20px_rgba(245,158,11,0.25)]"
              style={{ borderColor: "#FCE3B4" }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center text-graphite/50">
                <Search className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <input
                name="q"
                placeholder="Что ищете? Например, керамика"
                className="h-10 flex-1 bg-transparent text-[14px] text-graphite outline-none placeholder:text-graphite/40"
              />
              <button
                className="inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-[13px] font-semibold text-white transition hover:brightness-110"
                style={{ background: ACCENT }}
              >
                Найти
              </button>
            </form>

            <p className="mt-4 text-[12px] text-graphite/50">
              <span
                className="mr-2 inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: ACCENT }}
              />
              Более 1 200 мастеров уже на площадке
            </p>
          </Reveal>

          <SlideIn from="right" delay={0.2}>
            <PhoneMockup className="h-[460px]" tone="sunshine" />
          </SlideIn>
        </section>

        {/* 3 USP-блока с иконками — как на референсе */}
        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: Briefcase, title: "Личный канал", sub: "Витрина мастера, как YouTube‑канал" },
            { icon: MessageCircle, title: "Спросить о товаре", sub: "Прямой чат с автором изделия" },
            { icon: Laptop, title: "Простой кабинет", sub: "Загрузить товар — за пару минут" },
          ].map((u, i) => {
            const Icon = u.icon;
            return (
              <SlideIn key={u.title} from="bottom" delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl border border-[#F4EBD7] bg-white p-5">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
                    style={{ background: "#FFF4E0", color: ACCENT_DARK }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-graphite">{u.title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-graphite/60">
                      {u.sub}
                    </p>
                  </div>
                </div>
              </SlideIn>
            );
          })}
        </section>

        {/* Топ магазинов */}
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: ACCENT_DARK }}
              >
                Классифицировано
              </p>
              <h2 className="font-display mt-1 text-[28px] font-semibold leading-tight text-graphite md:text-[34px]">
                Лучшие каналы недели
              </h2>
            </div>
            <FeedTabs active={view} basePath="/v2" />
          </div>

          {view === "shops" ? (
            <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shops.map((s, i) => (
                <StaggerItem key={s.slug}>
                  <SunCard
                    href={`/shop/${s.slug}`}
                    title={s.name}
                    sub={s.city ?? "Россия"}
                    rating={s.rating}
                    count={s._count.products}
                    index={i}
                    isShop
                  />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p, i) => (
                <StaggerItem key={p.id}>
                  <SunCard
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
      </div>
    </div>
  );
}

function SunCard({
  href,
  title,
  sub,
  rating,
  count,
  index,
  isShop = false,
}: {
  href: string;
  title: string;
  sub: string;
  rating: number;
  count: number;
  index: number;
  isShop?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-[#F4EBD7] bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_50px_-20px_rgba(245,158,11,0.3)]"
    >
      <div className="relative">
        <TilePlaceholder
          size="md"
          seed={index}
          className="aspect-[4/3] rounded-none border-0"
        />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
          style={{ background: ACCENT }}
        >
          {isShop ? "Канал" : "Хит"}
        </span>
        <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
          <ArrowUpRight className="h-3.5 w-3.5 text-graphite" strokeWidth={2} />
        </span>
      </div>
      <div className="p-3.5">
        <p className="line-clamp-1 text-[13.5px] font-semibold text-graphite">
          {title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-graphite/70">
            <Star className="h-3 w-3" fill={ACCENT} strokeWidth={0} />
            {rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-graphite/40">·</span>
          <span className="line-clamp-1 text-[11px] text-graphite/60">{sub}</span>
        </div>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span
            className="text-[14px] font-semibold"
            style={{ color: ACCENT_DARK }}
          >
            {isShop ? `${count} работ` : `${count.toLocaleString("ru-RU")} ₽`}
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{ background: "#FFF4E0", color: ACCENT_DARK }}
          >
            Открыть
          </span>
        </div>
      </div>
    </Link>
  );
}
