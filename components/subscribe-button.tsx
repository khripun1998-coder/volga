"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { toggleFollow } from "@/app/shop/[slug]/actions";
import { notify } from "@/lib/toast-store";
import { cn } from "@/lib/utils";

export function SubscribeButton({
  slug,
  baseCount,
  accent,
  compact = false,
}: {
  slug: string;
  baseCount: number;
  accent: string;
  compact?: boolean;
}) {
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("volga.subs") ?? "[]";
      const arr = JSON.parse(raw) as string[];
      setSubscribed(arr.includes(slug));
    } catch {}
  }, [slug]);

  const toggle = async () => {
    // Оптимистично обновляем UI + localStorage (мгновенно, и для гостя).
    const next = !subscribed;
    setSubscribed(next);
    try {
      const raw = localStorage.getItem("volga.subs") ?? "[]";
      const set = new Set(JSON.parse(raw) as string[]);
      if (next) set.add(slug);
      else set.delete(slug);
      localStorage.setItem("volga.subs", JSON.stringify(Array.from(set)));
    } catch {}

    // Сохраняем в БД, если есть сессия.
    try {
      const res = await toggleFollow(slug);
      if (res.needAuth) {
        notify("Войдите, чтобы подписка сохранилась в профиле");
      } else if (res.ok && typeof res.following === "boolean") {
        setSubscribed(res.following);
      }
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={subscribed}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition active:scale-[0.98]",
        subscribed
          ? "border border-line bg-paper text-graphite hover:bg-cream"
          : "text-white shadow-[0_12px_24px_-12px_rgba(0,0,0,0.25)] hover:brightness-105"
      )}
      style={subscribed ? undefined : { background: accent }}
    >
      {subscribed ? (
        <>
          <BellRing className="h-4 w-4" strokeWidth={1.8} />
          {compact ? "Вы подписаны" : `Вы подписаны · ${baseCount + 1}`}
        </>
      ) : (
        <>
          <Bell className="h-4 w-4" strokeWidth={1.8} />
          {compact ? "Подписаться" : `Подписаться · ${baseCount}`}
        </>
      )}
    </button>
  );
}
