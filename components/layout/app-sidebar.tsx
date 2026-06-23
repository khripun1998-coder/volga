"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Heart,
  Home,
  type LucideIcon,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Store,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Session = { id: string; name: string; role: string } | null;

const STORAGE_KEY = "volga.sidebar.collapsed";

interface Item {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

function useCollapsed(): [boolean, (v: boolean) => void] {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true);
    } catch {}
  }, []);
  const save = (v: boolean) => {
    setCollapsed(v);
    try {
      localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch {}
    document.documentElement.classList.toggle("sidebar-collapsed", v);
  };
  useEffect(() => {
    document.documentElement.classList.toggle("sidebar-collapsed", collapsed);
  }, [collapsed]);
  return [collapsed, save];
}

/** Эмблема Волги — кораблик/штурвал в круге (оригинальный SVG) */
function Emblem({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full text-white",
        className
      )}
      style={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)" }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7.5" />
        <path d="M12 4.5v15M4.5 12h15M6.7 6.7l10.6 10.6M17.3 6.7L6.7 17.3" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

function SidebarLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: Item;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex h-11 items-center gap-3 rounded-2xl px-3.5 text-[14px] transition",
        active
          ? "bg-accent-soft text-accent"
          : "text-graphite/80 hover:bg-cream hover:text-graphite",
        collapsed && "justify-center px-0"
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent"
        />
      )}
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.7} />
      <span
        className={cn(
          "truncate transition-opacity",
          collapsed && "pointer-events-none w-0 opacity-0"
        )}
      >
        {item.label}
      </span>
      {item.badge != null && item.badge > 0 && (
        <span
          className={cn(
            "ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-white",
            collapsed && "absolute right-1 top-1 ml-0 h-4 min-w-4 px-1 text-[9px]"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function AppSidebar({ session }: { session: Session }) {
  const [collapsed, setCollapsed] = useCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("#")[0]);
  };

  const roleHome = session
    ? session.role === "SELLER"
      ? "/seller"
      : session.role === "ADMIN"
        ? "/admin"
        : "/account"
    : "/login";
  // Навигация площадки (по направлению клиента: сайдбар + лента/магазины), затем личное.
  const items: Item[] = [
    { href: "/", label: "Лента", icon: Home },
    { href: "/shops", label: "Магазины", icon: Store },
    { href: "/catalog", label: "Каталог", icon: Search },
    { href: roleHome, label: "Профиль", icon: User },
    { href: "/account#messages", label: "Сообщения", icon: MessageCircle },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Открыть меню"
        className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-lift)] transition active:scale-95 md:hidden"
      >
        Меню
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-graphite/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <SidebarBody
            items={items}
            isActive={isActive}
            collapsed={false}
            setCollapsed={() => setMobileOpen(false)}
            isMobile
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      )}

      <SidebarBody
        items={items}
        isActive={isActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
    </>
  );
}

function SidebarBody({
  items,
  isActive,
  collapsed,
  setCollapsed,
  isMobile = false,
  onNavigate,
}: {
  items: Item[];
  isActive: (href: string) => boolean;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  isMobile?: boolean;
  onNavigate?: () => void;
}) {
  const width = collapsed ? 64 : 248;
  return (
    <aside
      className={cn(
        "z-40 flex shrink-0 flex-col bg-paper hairline border-y-0 border-l-0 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isMobile
          ? "absolute left-0 top-0 h-full w-64 shadow-[var(--shadow-lift)]"
          : "sticky top-0 hidden h-screen md:flex"
      )}
      style={isMobile ? undefined : { width, minWidth: width, maxWidth: width }}
      aria-label="Главное меню"
    >
      {/* Логотип: эмблема + чёткая надпись «Волга» (раньше вязаный курсив читался как «ВолХа») */}
      <div className={cn("flex h-16 items-center px-5", collapsed && "justify-center px-0")}>
        <Link
          href="/"
          onClick={onNavigate}
          aria-label="Волга — на главную"
          className={cn("flex items-center gap-2.5", collapsed && "gap-0")}
        >
          <Emblem className="h-9 w-9" />
          {!collapsed && (
            <span className="font-display text-[22px] font-extrabold leading-none tracking-tight text-graphite">
              Волга
            </span>
          )}
        </Link>
      </div>

      <nav className="px-3 py-2">
        <ul className="flex flex-col gap-1">
          {items.map((it) => (
            <li key={it.href}>
              <SidebarLink
                item={it}
                active={isActive(it.href)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Промо-карточка «Поддерживайте мастеров» */}
      {!collapsed && (
        <div className="mx-3 mt-auto mb-2 rounded-2xl bg-accent-soft p-4">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-accent">
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <p className="mt-3 text-[13.5px] font-semibold leading-tight text-graphite">
            Поддерживайте мастеров
          </p>
          <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
            Покупая у локальных авторов, вы помогаете развивать творчество
          </p>
          <Link
            href="/seller"
            onClick={onNavigate}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-paper px-3.5 py-2 text-[12px] font-semibold text-accent transition hover:bg-white"
          >
            Подробнее
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </div>
      )}

      {/* Кнопка сворачивания */}
      {!isMobile && (
        <div className={cn("p-3", !collapsed && "mt-0")}>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
            className={cn(
              "flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[13px] text-muted transition hover:bg-cream hover:text-graphite",
              collapsed && "mt-auto justify-center px-0"
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px]" strokeWidth={1.6} />
            ) : (
              <>
                <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={1.6} />
                <span>Скрыть</span>
              </>
            )}
          </button>
        </div>
      )}

      {isMobile && (
        <div className="p-3">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="h-10 w-full rounded-xl text-sm text-muted hover:bg-cream hover:text-graphite"
          >
            Закрыть
          </button>
        </div>
      )}
    </aside>
  );
}
