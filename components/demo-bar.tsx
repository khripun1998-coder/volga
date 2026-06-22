import Link from "next/link";
import { loginAsDemo, exitDemo } from "@/lib/demo-actions";

const roles = [
  { role: "buyer", label: "Покупатель" },
  { role: "seller", label: "Продавец" },
  { role: "admin", label: "Админ / Модерация" },
];

const linkCls =
  "font-medium text-accent/90 underline-offset-2 transition hover:text-accent hover:underline";

export function DemoBar() {
  return (
    <div className="border-b border-accent/10 bg-accent-soft">
      <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-1 py-1.5 text-xs">
        <span className="font-semibold uppercase tracking-[0.15em] text-accent">Демо</span>
        <span className="text-muted">войти как:</span>
        {roles.map((r) => (
          <form key={r.role} action={loginAsDemo} className="contents">
            <input type="hidden" name="role" value={r.role} />
            <button type="submit" className={linkCls}>
              {r.label}
            </button>
          </form>
        ))}
        <Link href="/catalog" className={linkCls}>
          Каталог
        </Link>
        <form action={exitDemo} className="contents">
          <button type="submit" className={linkCls}>
            Выйти
          </button>
        </form>
      </div>
    </div>
  );
}
