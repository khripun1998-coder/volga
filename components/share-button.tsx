"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

/** Рабочая кнопка «Поделиться»: системный share, иначе копирование ссылки. */
export function ShareButton({ title, className }: { title?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: title ?? document.title, url });
        return;
      } catch {
        /* пользователь отменил — продолжаем к копированию */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* нет доступа к буферу — тихо игнорируем */
    }
  };

  return (
    <button
      type="button"
      aria-label="Поделиться"
      onClick={onShare}
      title={copied ? "Ссылка скопирована" : "Поделиться"}
      className={
        className ??
        "grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-graphite transition hover:bg-cream"
      }
    >
      {copied ? (
        <Check className="h-4 w-4 text-accent" strokeWidth={2} />
      ) : (
        <Share2 className="h-4 w-4" strokeWidth={1.7} />
      )}
    </button>
  );
}
