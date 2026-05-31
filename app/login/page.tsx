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
import { login, register } from "./actions";

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
    <div className="container-page py-10 md:py-14">
      {/* Hero: текст + форма слева, фото справа */}
      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
        <div className="relative z-10">
          <h1 className="font-serif text-[40px] leading-[1.05] text-[#211c4d] md:text-[54px]">
            Вход и регистрация
          </h1>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">
            «Волга» — многопользовательская площадка. Войдите под своей ролью —
            или попробуйте демо-аккаунт.
          </p>

          <form
            action={login}
            className="mt-8 max-w-md space-y-3 rounded-[24px] border border-white/70 bg-white/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          >
            <div className="text-sm font-semibold text-graphite">Войти в аккаунт</div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                Пользователь не найден. Используйте демо-почту ниже.
              </p>
            )}
            <input name="email" type="email" placeholder="Email" required className={field} />
            <input name="password" type="password" placeholder="Пароль" className={field} />
            <button className="btn-accent h-12 w-full rounded-2xl bg-accent text-sm font-semibold text-white transition">
              Войти
            </button>
            <p className="text-xs leading-relaxed text-muted">
              Демо-аккаунты (пароль любой): buyer@volga.market · marina@teplye-lapki.ru ·
              admin@volga.market
            </p>
          </form>

          {/* Регистрация */}
          <details className="mt-4 max-w-md overflow-hidden rounded-[24px] border border-white/70 bg-white/70 backdrop-blur-xl">
            <summary className="cursor-pointer list-none px-6 py-4 text-sm font-semibold text-graphite">
              Нет аккаунта? <span className="text-accent">Зарегистрироваться →</span>
            </summary>
            <form action={register} className="space-y-3 px-6 pb-6">
              <input name="name" placeholder="Имя" required className={field} />
              <input name="email" type="email" placeholder="Email" required className={field} />
              <input name="password" type="password" placeholder="Пароль" className={field} />
              <button className="btn-accent h-12 w-full rounded-2xl bg-accent text-sm font-semibold text-white transition">
                Создать аккаунт
              </button>
            </form>
          </details>
        </div>

        {/* Фото-композиция справа + анимированные сферы */}
        <div className="relative hidden min-h-[540px] lg:block">
          {[
            { pos: "right-[16%] top-[3%]", size: 66, c: "#C9BEF5", dur: 7, delay: 0 },
            { pos: "right-[1%] top-[30%]", size: 40, c: "#D7CCF8", dur: 8.2, delay: 0.6 },
            { pos: "left-[5%] top-[22%]", size: 22, c: "#E4D9FB", dur: 6.6, delay: 1.0 },
            { pos: "left-[12%] top-[7%]", size: 15, c: "#ffffff", dur: 7.4, delay: 0.4 },
            { pos: "right-[22%] bottom-[10%]", size: 26, c: "#CBBEF6", dur: 8.6, delay: 0.3 },
            { pos: "left-[2%] bottom-[20%]", size: 13, c: "#F3B6C2", dur: 7.2, delay: 0.9 },
            { pos: "right-[7%] top-[14%]", size: 11, c: "#ffffff", dur: 6.9, delay: 1.3 },
            { pos: "left-[18%] bottom-[8%]", size: 18, c: "#DCD0FA", dur: 8, delay: 0.7 },
          ].map((s, i) => (
            <span
              key={i}
              className={`absolute ${s.pos} rounded-full`}
              style={{
                width: s.size,
                height: s.size,
                background: `radial-gradient(circle at 32% 28%, #fff 0%, ${s.c} 58%, color-mix(in srgb, ${s.c}, #000 16%) 100%)`,
                boxShadow:
                  "inset 0 -3px 5px rgba(120,90,150,0.25), inset 2px 2px 3px rgba(255,255,255,0.8), 0 12px 20px -8px rgba(100,70,140,0.38)",
                animation: `float ${s.dur}s ease-in-out ${s.delay}s infinite`,
              }}
              aria-hidden
            />
          ))}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/login-hero.png"
            alt="Изделия мастеров"
            className="absolute inset-0 h-full w-full scale-[1.16] object-contain object-center drop-shadow-[0_36px_56px_rgba(80,60,120,0.22)]"
          />
        </div>
      </div>

      <h2 className="font-display mt-14 text-2xl font-semibold text-graphite md:text-[28px]">
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
