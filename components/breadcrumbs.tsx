import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/**
 * Хлебные крошки. Презентационный серверный компонент — лейблы передаёт страница,
 * которая уже загрузила сущность (доп. запросов к БД не делает).
 * Последний пункт — текущая страница (без ссылки, aria-current="page").
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Хлебные крошки" className={cn("pt-1 text-[13px]", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted/50" strokeWidth={2} aria-hidden />
              )}
              {c.href && !last ? (
                <Link href={c.href} className="transition hover:text-accent">
                  {c.label}
                </Link>
              ) : (
                <span
                  className={cn("max-w-[60vw] truncate sm:max-w-none", last && "font-medium text-graphite")}
                  aria-current={last ? "page" : undefined}
                >
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
