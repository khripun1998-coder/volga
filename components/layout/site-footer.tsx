import Link from "next/link";

const columns = [
  {
    title: "Покупателям",
    links: [
      { href: "/catalog", label: "Каталог" },
      { href: "/catalog?tag=handmade", label: "Ручная работа" },
      { href: "/catalog?tag=russia", label: "Сделано в России" },
      { href: "/cart", label: "Корзина" },
    ],
  },
  {
    title: "Продавцам",
    links: [
      { href: "/seller", label: "Открыть магазин" },
      { href: "/login", label: "Кабинет продавца" },
    ],
  },
  {
    title: "Площадка",
    links: [
      { href: "/about", label: "О Волге" },
      { href: "/delivery", label: "Доставка и оплата" },
      { href: "/returns", label: "Возврат и гарантии" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-cream">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <div className="font-display text-2xl font-semibold text-graphite">Волга</div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Маркетплейс изделий ручной работы и товаров российских мастеров.
              Поддержите локальных производителей.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted">
              Краснодар · Калининград
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-graphite">{col.title}</h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l, i) => (
                  <li key={`${l.href}-${i}`}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Волга. Все права защищены.</span>
          <span>Оплата при получении · Перевод · Самовывоз</span>
        </div>
      </div>
    </footer>
  );
}
