"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNavItems, isActivePath, type Session } from "@/lib/nav";

/** Нижний таб-бар для телефонов (≤ md). Дублирует пункты сайдбара. */
export function MobileTabBar({ session }: { session: Session }) {
  const pathname = usePathname();
  const items = getNavItems(session);
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {items.map((it) => {
        const Icon = it.icon;
        const active = isActivePath(pathname, it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition",
              active ? "text-accent" : "text-muted hover:text-graphite"
            )}
          >
            <Icon className="h-[22px] w-[22px] shrink-0" strokeWidth={active ? 2 : 1.7} />
            <span className="leading-none">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
