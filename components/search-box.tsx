"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Search, SlidersHorizontal, Star, Store, Tag } from "lucide-react";
import Link from "next/link";
import { searchSuggest, type SuggestResult } from "@/app/search-actions";
import { cn, formatPrice } from "@/lib/utils";

const EMPTY: SuggestResult = { products: [], shops: [], categories: [] };

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [res, setRes] = useState<SuggestResult>(EMPTY);
  const [active, setActive] = useState(-1);
  const [, startTransition] = useTransition();
  const boxRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Плоский список ссылок для навигации стрелками
  const items: { href: string }[] = [
    ...res.products.map((p) => ({ href: `/product/${p.slug}` })),
    ...res.shops.map((s) => ({ href: `/shop/${s.slug}` })),
    ...res.categories.map((c) => ({ href: `/catalog?category=${c.slug}` })),
  ];

  // Дебаунс-запрос подсказок
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (q.trim().length < 2) {
      setRes(EMPTY);
      return;
    }
    timer.current = setTimeout(() => {
      startTransition(async () => {
        const r = await searchSuggest(q);
        setRes(r);
        setActive(-1);
      });
    }, 160);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q]);

  // Клик вне — закрыть
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };
  const submit = () => {
    setOpen(false);
    router.push(q.trim() ? `/catalog?q=${encodeURIComponent(q.trim())}` : "/catalog");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(items.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(-1, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && items[active]) go(items[active].href);
      else submit();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const has = items.length > 0;
  const showPanel = open && q.trim().length >= 2;
  let idx = -1; // сквозной индекс для подсветки

  const rowCls = (i: number) =>
    cn(
      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition",
      i === active ? "bg-cream" : "hover:bg-cream"
    );

  return (
    <div ref={boxRef} className={cn("relative w-full max-w-xl", className)}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          strokeWidth={1.7}
        />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Найти магазин или работу мастера"
          role="combobox"
          aria-expanded={showPanel && has}
          aria-autocomplete="list"
          aria-label="Поиск по магазинам и изделиям"
          className="h-12 w-full rounded-full bg-cream pl-11 pr-12 text-[14px] text-graphite transition placeholder:text-muted/80 focus:bg-paper focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <Link
          href="/catalog"
          aria-label="Фильтры поиска"
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-paper hover:text-accent"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.7} />
        </Link>
      </form>

      {showPanel && (
        <div className="absolute z-40 mt-2 max-h-[70vh] w-full overflow-auto rounded-2xl bg-paper p-2 shadow-[var(--shadow-lift)] hairline">
          {!has && (
            <div className="px-3 py-4 text-sm text-muted">
              Ничего не нашлось по «{q.trim()}»
            </div>
          )}

          {res.products.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Изделия
              </div>
              {res.products.map((p) => {
                idx++;
                const i = idx;
                return (
                  <button key={p.slug} type="button" onMouseEnter={() => setActive(i)} onClick={() => go(`/product/${p.slug}`)} className={rowCls(i)}>
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream">
                      {p.image && <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-graphite">{p.title}</span>
                      <span className="block truncate text-xs text-muted">{p.shop}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-graphite">{formatPrice(p.price)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {res.shops.length > 0 && (
            <div className="mt-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Магазины
              </div>
              {res.shops.map((s) => {
                idx++;
                const i = idx;
                return (
                  <button key={s.slug} type="button" onMouseEnter={() => setActive(i)} onClick={() => go(`/shop/${s.slug}`)} className={rowCls(i)}>
                    <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft text-accent">
                      {s.avatar ? <Image src={s.avatar} alt="" fill sizes="40px" className="object-cover" /> : <Store className="h-4 w-4" strokeWidth={1.7} />}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-graphite">{s.name}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted">
                      <Star className="h-3.5 w-3.5 text-gold" fill="currentColor" strokeWidth={0} />
                      {s.rating.toFixed(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {res.categories.length > 0 && (
            <div className="mt-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Категории
              </div>
              {res.categories.map((c) => {
                idx++;
                const i = idx;
                return (
                  <button key={c.slug} type="button" onMouseEnter={() => setActive(i)} onClick={() => go(`/catalog?category=${c.slug}`)} className={rowCls(i)}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cream text-muted">
                      <Tag className="h-4 w-4" strokeWidth={1.7} />
                    </span>
                    <span className="flex-1 truncate text-sm font-medium text-graphite">{c.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {has && (
            <button
              type="button"
              onClick={submit}
              className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-accent transition hover:bg-cream"
            >
              Показать все результаты по «{q.trim()}» →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
