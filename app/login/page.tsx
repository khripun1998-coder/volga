import Link from "next/link";
import {
  Eye,
  Scale,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { login } from "./actions";

export const metadata = { title: "Роли и вход — Волга" };

const roles: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  cta: string;
}[] = [
  { icon: Eye, title: "Гость", text: "Просмотр витрин, поиск и фильтры. Без покупки и контакта с продавцом.", href: "/", cta: "Открыть витрину" },
  { icon: ShoppingBag, title: "Покупатель", text: "Заказы и статусы, избранное, отзывы, чат с продавцом, споры.", href: "/account", cta: "Кабинет покупателя" },
  { icon: Store, title: "Продавец", text: "Магазин, товары, заказы и статусы, доставка/оплата, статистика.", href: "/seller", cta: "Кабинет продавца" },
  { icon: Users, title: "Сотрудник магазина", text: "Ограниченные права по назначению владельца: заказы, контент, бухгалтерия.", href: "/seller#employees", cta: "Сотрудники" },
  { icon: ShieldCheck, title: "Модератор", text: "Проверка товаров и магазинов, очередь модерации, жалобы.", href: "/admin#moderation", cta: "Модерация" },
  { icon: Scale, title: "Арбитр", text: "Рассмотрение споров по заказам и вынесение решений.", href: "/admin#disputes", cta: "Споры" },
  { icon: Settings, title: "Администратор", text: "Полный доступ: пользователи, финансы, модерация, настройки.", href: "/admin", cta: "Админ-панель" },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const field =
    "h-11 w-full rounded-lg border border-line bg-paper px-3.5 text-sm text-graphite focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

  return (
    <div className="container-page py-14">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold text-graphite md:text-5xl">
          Вход и регистрация
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          «Волга» — многопользовательская площадка. Войдите под своей ролью —
          или попробуйте демо-аккаунт.
        </p>
      </div>

      <form action={login} className="mt-8 max-w-md space-y-3 rounded-2xl border border-line bg-paper p-6">
        <div className="text-sm font-medium text-graphite">Войти в аккаунт</div>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Пользователь не найден. Используйте демо-почту ниже.
          </p>
        )}
        <input name="email" type="email" placeholder="Email" required className={field} />
        <input name="password" type="password" placeholder="Пароль" className={field} />
        <button className="h-11 w-full rounded-lg bg-accent text-sm font-medium text-white transition hover:bg-accent-hover">
          Войти
        </button>
        <p className="text-xs leading-relaxed text-muted">
          Демо-аккаунты (пароль любой): buyer@volga.market · marina@teplye-lapki.ru ·
          admin@volga.market
        </p>
      </form>

      <h2 className="font-display mt-12 text-2xl font-semibold text-graphite">
        Или выберите роль (демо)
      </h2>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => (
          <Link
            key={r.title}
            href={r.href}
            className="group rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-lift)]"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
              <r.icon className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-graphite">{r.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.text}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
              {r.cta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
