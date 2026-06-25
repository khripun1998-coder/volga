"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";
import { CartButton } from "@/components/cart-button";
import { SearchBox } from "@/components/search-box";
import { logout } from "@/app/login/actions";

type Session = { id: string; name: string; role: string } | null;

export function SiteHeader({ session }: { session: Session }) {
  return (
    <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur">
      <div className="flex h-[72px] items-center gap-4 px-5 md:px-8">
        <SearchBox className="hidden md:block" />
        <div className="ml-auto flex items-center gap-2">
          <CartButton />
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
        <SearchBox />
      </div>
    </header>
  );
}
