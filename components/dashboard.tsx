"use client";

import { Children, isValidElement, useEffect, useState } from "react";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";

export function DashShell({
  title,
  role,
  nav,
  children,
}: {
  title: string;
  role: string;
  nav: { label: string; href: string }[];
  children: React.ReactNode;
}) {
  // Разделы приходят как DashSection-дети. Показываем ТОЛЬКО выбранный раздел
  // (правка клиента: табы вместо «ленты» — клик по кнопке открывает свой раздел).
  const sections = Children.toArray(children).filter(isValidElement) as ReactElement<{
    id: string;
  }>[];
  const tabId = (href: string) => href.replace(/^#/, "");
  const [active, setActive] = useState(
    nav[0] ? tabId(nav[0].href) : sections[0]?.props.id ?? ""
  );

  // Прямые ссылки на раздел (например /seller#orders, /account#messages) открывают нужный таб.
  useEffect(() => {
    const h = window.location.hash.replace(/^#/, "");
    if (h && sections.some((s) => s.props.id === h)) setActive(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-page py-8">
      <div className="mb-7">
        <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
          {role}
        </span>
        <h1 className="font-display mt-3 text-3xl font-semibold text-graphite md:text-4xl">
          {title}
        </h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav className="flex flex-wrap gap-1 lg:flex-col" role="tablist" aria-label="Разделы кабинета">
            {nav.map((n) => {
              const id = tabId(n.href);
              const on = id === active;
              return (
                <button
                  key={n.href}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(id)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition",
                    on
                      ? "bg-accent text-white shadow-[var(--shadow-accent)]"
                      : "text-graphite/80 hover:bg-cream hover:text-accent"
                  )}
                >
                  {n.label}
                </button>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0">
          {sections.map((child) => (
            <div key={child.props.id} hidden={child.props.id !== active}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashSection({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-graphite">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const w = 64;
  const h = 20;
  const max = Math.max(1, ...data);
  const pts = data
    .map((v, i) => `${(i / Math.max(1, data.length - 1)) * w},${h - (v / max) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Stat({
  label,
  value,
  hint,
  delta,
  spark,
}: {
  label: string;
  value: string | number;
  hint?: string;
  /** Динамика в процентах (знаковая) — рисует ▲/▼ и цвет. */
  delta?: number;
  /** Точки мини-графика тренда. */
  spark?: number[];
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm text-muted">{label}</div>
        {spark && spark.length > 1 && <Sparkline data={spark} />}
      </div>
      <div className="mt-1.5 flex items-end gap-2">
        <div className="font-display text-[26px] font-semibold leading-none text-graphite">
          {value}
        </div>
        {delta != null && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold",
              delta >= 0 ? "text-sage" : "text-red-500"
            )}
          >
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
          </span>
        )}
      </div>
      {hint && <div className="mt-2 text-xs text-muted">{hint}</div>}
    </div>
  );
}

const tones: Record<string, string> = {
  default: "bg-cream text-muted border-line",
  green: "bg-sage/10 text-sage border-sage/30",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-accent-soft text-accent border-accent/20",
  red: "bg-red-50 text-red-700 border-red-200",
};

export function StatusPill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-line bg-paper", className)} {...props} />
  );
}
