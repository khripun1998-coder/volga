"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";

interface Tab {
  segment: string | null;
  label: string;
  href: string;
}

export function ChannelTabs({ slug }: { slug: string }) {
  const seg = useSelectedLayoutSegment();
  const tabs: Tab[] = [
    { segment: null, label: "Главная", href: `/shop/${slug}` },
    { segment: "products", label: "Все товары", href: `/shop/${slug}/products` },
    { segment: "about", label: "О мастере", href: `/shop/${slug}/about` },
    { segment: "reviews", label: "Отзывы", href: `/shop/${slug}/reviews` },
  ];

  return (
    <div className="sticky top-16 z-20 -mx-5 mt-8 border-b border-line bg-paper/85 px-5 backdrop-blur md:-mx-8 md:px-8">
      <nav
        role="tablist"
        aria-label="Разделы магазина"
        className="container-page -mx-5 flex gap-1 overflow-x-auto px-5 md:-mx-8 md:px-8"
      >
        {tabs.map((t) => {
          const active = seg === t.segment;
          return (
            <Link
              key={t.label}
              href={t.href}
              role="tab"
              aria-selected={active}
              className={cn(
                "relative inline-flex h-12 shrink-0 items-center px-4 text-[14px] font-medium transition",
                active
                  ? "text-graphite"
                  : "text-muted hover:text-graphite"
              )}
            >
              {t.label}
              {active && (
                <span
                  className="absolute inset-x-3 -bottom-px h-[2px] rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
