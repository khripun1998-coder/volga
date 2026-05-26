"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart, selectCount } from "@/lib/cart-store";
import { useFavorites, selectFavCount } from "@/lib/favorites-store";
import { NotificationBell } from "@/components/notification-bell";
import { logout } from "@/app/login/actions";
import { cn } from "@/lib/utils";

type Session = { id: string; name: string; role: string } | null;

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/shops", label: "Магазины" },
  { href: "/catalog?tag=handmade", label: "Ручная работа" },
  { href: "/catalog?tag=russia", label: "Сделано в России" },
];

function CartIndicator() {
  const count = useCart(selectCount);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      aria-label="Корзина"
      className="relative grid h-10 w-10 place-items-center rounded-full text-graphite transition hover:bg-cream"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
      {mounted && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

function FavIndicator() {
  const count = useFavorites(selectFavCount);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/account#favorites"
      aria-label="Избранное"
      className="relative hidden h-10 w-10 place-items-center rounded-full text-graphite transition hover:bg-cream sm:grid"
    >
      <Heart className="h-5 w-5" strokeWidth={1.6} />
      {mounted && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

function SearchForm({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/catalog?q=${encodeURIComponent(q.trim())}` : "/catalog");
      }}
      className={cn("relative", className)}
      role="search"
    >
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        strokeWidth={1.6}
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск изделий, мастеров, категорий…"
        className="h-11 w-full rounded-full border border-line bg-cream pl-10 pr-4 text-sm text-graphite transition placeholder:text-muted/80 focus:border-accent focus:bg-paper focus:outline-none focus:ring-2 focus:ring-accent/15"
      />
    </form>
  );
}

export function SiteHeader({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="container-page">
        <div className="flex h-16 items-center gap-3 md:gap-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Меню"
            className="grid h-10 w-10 place-items-center rounded-full text-graphite transition hover:bg-cream md:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.6} />
          </button>

          <Link href="/" className="flex shrink-0 items-baseline gap-1.5">
            <span className="font-display text-2xl font-semibold text-graphite">Волга</span>
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted sm:inline">
              маркетплейс
            </span>
          </Link>

          <SearchForm className="hidden flex-1 md:block" />

          <div className="ml-auto flex items-center gap-0.5 md:ml-0">
            <FavIndicator />
            <NotificationBell />
            {session ? (
              <>
                <Link
                  href={session.role === "SELLER" ? "/seller" : session.role === "ADMIN" ? "/admin" : "/account"}
                  className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm text-graphite transition hover:bg-cream lg:flex"
                >
                  <User className="h-5 w-5" strokeWidth={1.6} />
                  <span className="max-w-[110px] truncate">{session.name}</span>
                </Link>
                <form action={logout} className="hidden sm:block">
                  <button className="h-10 rounded-full px-3 text-sm text-muted transition hover:text-graphite">
                    Выйти
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm text-graphite transition hover:bg-cream sm:flex"
                >
                  <User className="h-5 w-5" strokeWidth={1.6} />
                  <span className="hidden lg:inline">Вход</span>
                </Link>
                <Link
                  href="/seller"
                  className="hidden h-10 items-center rounded-full bg-accent px-4 text-sm font-medium text-white transition hover:bg-accent-hover sm:inline-flex"
                >
                  Открыть магазин
                </Link>
              </>
            )}
            <CartIndicator />
          </div>
        </div>

        <SearchForm className="block pb-3 md:hidden" />
      </div>

      <nav className="hidden border-t border-line md:block">
        <div className="container-page flex h-11 items-center justify-between">
          <ul className="flex items-center gap-7 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-graphite/80 transition hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/catalog"
            className="text-sm font-medium text-accent transition hover:text-accent-hover"
          >
            Весь каталог →
          </Link>
        </div>
      </nav>

      {/* Мобильное меню */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-graphite/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-paper p-6 shadow-[var(--shadow-lift)]">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl font-semibold">Волга</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream"
              >
                <X className="h-5 w-5" strokeWidth={1.6} />
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-graphite transition hover:bg-cream"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-graphite transition hover:bg-cream"
              >
                Войти
              </Link>
              <Link
                href="/seller"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 font-medium text-accent transition hover:bg-accent-soft"
              >
                Открыть магазин →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
