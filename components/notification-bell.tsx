"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

const demoNotifications = [
  { title: "Заказ В-100100 отправлен", sub: "Трек CDEK1234567890" },
  { title: "Новый отзыв на «Кружку»", sub: "Оценка 5 из 5" },
  { title: "Товар прошёл модерацию", sub: "«Зайка Соня» опубликован" },
  { title: "Спор по заказу В-100100", sub: "На рассмотрении арбитра" },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Уведомления"
        className="relative grid h-10 w-10 place-items-center rounded-full text-graphite transition hover:bg-cream"
      >
        <Bell className="h-5 w-5" strokeWidth={1.6} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-line bg-paper p-2 shadow-[var(--shadow-lift)]">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Уведомления
            </div>
            {demoNotifications.map((n, i) => (
              <div key={i} className="rounded-xl px-3 py-2.5 transition hover:bg-cream">
                <div className="text-sm text-graphite">{n.title}</div>
                <div className="text-xs text-muted">{n.sub}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
