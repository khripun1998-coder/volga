import Link from "next/link";

const links = [
  { href: "/", label: "Выбор роли" },
  { href: "/catalog", label: "Каталог" },
  { href: "/account", label: "Покупатель" },
  { href: "/seller", label: "Продавец" },
  { href: "/admin", label: "Админ / Модерация" },
];

export function DemoBar() {
  return (
    <div className="border-b border-accent/10 bg-accent-soft">
      <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-1 py-1.5 text-xs">
        <span className="font-semibold uppercase tracking-[0.15em] text-accent">
          Демо
        </span>
        <span className="text-muted">войти как:</span>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="font-medium text-accent/90 underline-offset-2 transition hover:text-accent hover:underline"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
