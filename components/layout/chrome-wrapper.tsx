"use client";

import { usePathname } from "next/navigation";

/**
 * На страницах концептов (/v1, /v2, /v3) и на индексе (/) — каждая страница
 * сама рисует свою «шапку» и фон. Скрываем глобальный сайдбар + хедер.
 */
export function ChromeWrapper({
  sidebar,
  header,
  children,
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/";
  // Концепт-страницы рисуют свою «шапку» сами — прячем глобальный сайдбар/хедер.
  // Главная «/» теперь рабочая (Aurora) и использует общий каркас.
  const isConcept =
    pathname.startsWith("/v1") ||
    pathname.startsWith("/v2") ||
    pathname.startsWith("/v3");

  if (isConcept) {
    return <div className="min-h-[calc(100vh-2.5rem)]">{children}</div>;
  }

  return (
    <div className="flex min-h-[calc(100vh-2.5rem)]">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
      </div>
    </div>
  );
}
