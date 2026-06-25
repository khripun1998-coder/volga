import { Home, Store, Search, User, MessageCircle, type LucideIcon } from "lucide-react";

/** Сессия в клиентских компонентах навигации. */
export type Session = { id: string; name: string; role: string } | null;

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

/** Личный раздел по роли (или вход для гостя). */
export function roleHome(session: Session): string {
  if (!session) return "/login";
  if (session.role === "SELLER") return "/seller";
  if (session.role === "ADMIN") return "/admin";
  return "/account";
}

/** Единый источник пунктов навигации для сайдбара и мобильного таб-бара. */
export function getNavItems(session: Session): NavItem[] {
  const messages = session?.role === "SELLER" ? "/seller#messages" : "/account#messages";
  return [
    { href: "/", label: "Лента", icon: Home },
    { href: "/shops", label: "Магазины", icon: Store },
    { href: "/catalog", label: "Каталог", icon: Search },
    { href: roleHome(session), label: "Профиль", icon: User },
    { href: messages, label: "Сообщения", icon: MessageCircle },
  ];
}

/** Активна ли ссылка для текущего пути (общая логика для сайдбара и таб-бара).
 *  Пункты-якоря (с «#», напр. «/account#messages») не подсвечиваются по пути —
 *  иначе на /account зажглись бы сразу «Профиль» и «Сообщения». */
export function isActivePath(pathname: string, href: string): boolean {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
