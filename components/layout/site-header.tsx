"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal, User } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";
import { logout } from "@/app/login/actions";
import { cn } from "@/lib/utils";

type Session = { id: string; name: string; role: string } | null;

function SearchForm({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/catalog?q=${encodeURIComponent(q.trim())}` : "/catalog");
      }}
      className={cn("relative w-full max-w-xl", className)}
      role="search"
    >
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        strokeWidth={1.7}
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Найти магазин или работу мастера"
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
  );
}

export function SiteHeader({ session }: { session: Session }) {
  return (
    <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur">
      <div className="flex h-[72px] items-center gap-4 px-5 md:px-8">
        <SearchForm className="hidden md:block" />
        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />
          {session ? (
            <form action={logout}>
              <button className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-4 text-[13.5px] font-semibold text-graphite hairline transition hover:bg-cream">
                <User className="h-4 w-4" strokeWidth={1.8} />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 text-[13.5px] font-semibold text-graphite hairline transition hover:bg-cream"
            >
              <User className="h-4 w-4" strokeWidth={1.8} />
              Войти
            </Link>
          )}
        </div>
      </div>
      <div className="px-5 pb-3 md:hidden">
        <SearchForm />
      </div>
    </header>
  );
}
