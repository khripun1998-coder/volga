"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Hand,
  Heart,
  Star,
} from "lucide-react";
import { CoverImage } from "@/components/cover-image";
import { cn, pluralize } from "@/lib/utils";
import type { FeedShop } from "@/components/shop-feed-card";

const CARD_W = 296;
const GAP = 26;
const STEP = CARD_W + GAP;

const kindLabel: Record<string, string> = {
  workshop: "Мастерская",
  production: "Производство",
  supplier: "Поставщик сырья",
};

const COVERS = [
  "linear-gradient(135deg,#ECEAFE 0%,#D9D3FB 100%)",
  "linear-gradient(135deg,#E6EEFF 0%,#CFE0FB 100%)",
  "linear-gradient(135deg,#FBEAF6 0%,#F0CDE8 100%)",
  "linear-gradient(135deg,#EAECFF 0%,#D2D6F8 100%)",
  "linear-gradient(135deg,#E9F1FE 0%,#CCE0F7 100%)",
  "linear-gradient(135deg,#F1EAFE 0%,#DCC9F6 100%)",
];

export function ShopCarousel({ shops }: { shops: FeedShop[] }) {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [cw, setCw] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const lastDrag = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setCw(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const clamp = (i: number) => Math.max(0, Math.min(shops.length - 1, i));
  const offset = cw ? cw / 2 - (active * STEP + CARD_W / 2) : 0;

  useEffect(() => {
    const controls = animate(x, offset, {
      type: "spring",
      stiffness: 260,
      damping: 34,
      mass: 0.9,
    });
    return controls.stop;
  }, [offset, x]);

  const go = (d: number) => setActive((a) => clamp(a + d));

  // клавиши ← →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Не перехватываем стрелки, когда пользователь печатает (поиск/поля ввода)
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shops.length]);

  const onCardClick = (i: number, slug: string) => {
    if (Date.now() - lastDrag.current < 220) return; // не считаем перетаскивание за клик
    if (i === active) router.push(`/shop/${slug}`);
    else setActive(i);
  };

  if (shops.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-cream py-16 text-center">
        <p className="font-display text-lg font-semibold text-graphite">Магазины скоро появятся</p>
        <p className="mt-1 text-sm text-muted">Мастера готовят свои витрины.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={wrapRef} className="overflow-hidden px-1 py-8">
        <motion.div
          className="flex w-max cursor-grab active:cursor-grabbing"
          style={{ x, gap: GAP }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragStart={() => {
            lastDrag.current = Date.now();
          }}
          onDragEnd={(_e, info) => {
            lastDrag.current = Date.now();
            const moved = Math.round(-info.offset.x / STEP);
            const vel = info.velocity.x;
            const extra = vel < -350 ? 1 : vel > 350 ? -1 : 0;
            setActive((a) => clamp(a + moved + extra));
          }}
        >
          {shops.map((s, i) => {
            const isActive = i === active;
            return (
              <motion.div
                key={s.slug}
                style={{ width: CARD_W }}
                className="shrink-0"
                animate={{
                  scale: isActive ? 1.07 : 0.86,
                  opacity: isActive ? 1 : 0.58,
                }}
                transition={{ type: "spring", stiffness: 240, damping: 28 }}
                onClick={() => onCardClick(i, s.slug)}
              >
                <Slide shop={s} rank={i + 1} active={isActive} index={i} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Стрелки */}
      <button
        type="button"
        aria-label="Назад"
        onClick={() => go(-1)}
        disabled={active === 0}
        className="absolute left-1 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-paper text-accent shadow-[var(--shadow-lift)] transition hover:scale-105 disabled:opacity-0"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2} />
      </button>
      <button
        type="button"
        aria-label="Вперёд"
        onClick={() => go(1)}
        disabled={active === shops.length - 1}
        className="absolute right-1 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-paper text-accent shadow-[var(--shadow-lift)] transition hover:scale-105 disabled:opacity-0"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2} />
      </button>

      {/* Точки */}
      <div className="mt-1 flex items-center justify-center gap-2">
        {shops.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Магазин ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === active ? "w-6 bg-accent" : "w-2 bg-line hover:bg-accent/40"
            )}
          />
        ))}
      </div>

      {/* Подсказка — только если есть что листать */}
      {shops.length > 1 && (
        <p className="mt-4 flex items-center justify-center gap-2 text-[13px] text-muted">
          <Hand className="h-4 w-4" strokeWidth={1.7} />
          Листайте влево или вправо, чтобы увидеть больше
        </p>
      )}

      {/* Кнопка */}
      <div className="mt-6 flex justify-center">
        <Link
          href="/shops"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-paper px-7 text-sm font-semibold text-graphite hairline transition hover:bg-cream"
        >
          Смотреть все магазины
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

function Slide({
  shop,
  rank,
  active,
  index,
}: {
  shop: FeedShop;
  rank: number;
  active: boolean;
  index: number;
}) {
  const clients = shop.clients;
  const cover = COVERS[index % COVERS.length];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[26px] bg-paper transition-shadow duration-500",
        active
          ? "shadow-[0_44px_80px_-34px_rgba(90,60,160,0.55)]"
          : "shadow-[var(--shadow-soft)]"
      )}
    >
      <div className="relative aspect-[4/5]">
        <CoverImage
          src={`/shops/${shop.slug}.png`}
          gradient={cover}
          alt={shop.name}
          className="absolute inset-0 h-full w-full"
        />
        <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent shadow-[var(--shadow-soft)]">
          ТОП {rank}
        </span>
        <span aria-hidden className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-paper text-graphite/70 shadow-[var(--shadow-soft)]">
          <Heart className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display line-clamp-1 text-[19px] font-bold leading-tight text-graphite">
            {shop.name}
          </h3>
          {shop.verified && (
            <BadgeCheck
              className="h-4 w-4 shrink-0"
              style={{ color: "var(--color-verified)" }}
            />
          )}
        </div>
        <p className="mt-1 line-clamp-1 text-[13px] text-muted">
          {shop.description || kindLabel[shop.kind] || "Магазин"}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[13px]">
          <span className="inline-flex items-center gap-1.5 font-semibold text-graphite">
            <Star className="h-3.5 w-3.5 text-accent" fill="currentColor" strokeWidth={0} />
            {shop.rating.toFixed(1)}
            <span className="font-normal text-muted">({shop.ratingCount})</span>
          </span>
          <span
            className="text-muted"
            title="Реальные клиенты — те, кто оформил заказ. Не накрутка."
          >
            · {clients.toLocaleString("ru-RU")}{" "}
            {pluralize(clients, ["клиент", "клиента", "клиентов"])}
          </span>
        </div>
      </div>
    </div>
  );
}
