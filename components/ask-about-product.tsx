"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { notify } from "@/lib/toast-store";
import { askAboutProduct } from "@/app/product/[slug]/actions";

const suggestions = [
  "Здравствуйте! Расскажите подробнее про материалы.",
  "Возможно ли изготовление под заказ?",
  "Когда планируете отправить?",
];

export function AskAboutProduct({
  shopName,
  shopSlug,
  productTitle,
  accent,
}: {
  shopName: string;
  shopSlug: string;
  productTitle: string;
  accent?: string;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Esc закрывает; фокус уходит в поле ввода; Tab циклится внутри диалога;
  // при закрытии фокус возвращается на кнопку-открыватель.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  const send = async () => {
    if (!text.trim()) return;
    setSent(true);
    try {
      await askAboutProduct(shopSlug, productTitle, text);
    } catch {}
    notify(`Сообщение для «${shopName}» отправлено`);
    setText("");
    setTimeout(() => {
      setOpen(false);
      setSent(false);
    }, 1100);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:brightness-105 active:scale-[0.98]"
        style={{ background: accent ?? "var(--color-accent)" }}
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
        Спросить о товаре
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center">
          <div
            className="absolute inset-0 bg-graphite/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Вопрос магазину ${shopName}`}
            className="relative w-full max-w-md overflow-hidden rounded-t-3xl border border-line bg-paper shadow-[var(--shadow-lift)] sm:rounded-3xl"
          >
            <div className="flex items-start gap-3 border-b border-line p-5">
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-medium text-white"
                style={{ background: accent ?? "var(--color-accent)" }}
              >
                {shopName.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-graphite">
                  {shopName}
                </div>
                <div className="truncate text-xs text-muted">
                  Вопрос о «{productTitle}»
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              <div className="rounded-2xl bg-cream p-4 text-sm leading-relaxed text-graphite/90">
                Привет! Здесь вы можете задать любой вопрос мастеру —
                от наличия и сроков до индивидуального заказа. Магазин
                @{shopSlug} обычно отвечает в течение дня.
              </div>

              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setText(s)}
                    className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-graphite/80 transition hover:border-accent/40 hover:bg-cream"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ваш вопрос…"
                rows={3}
                className="w-full resize-none rounded-2xl border border-line bg-paper p-4 text-sm text-graphite placeholder:text-muted/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />

              <button
                type="button"
                onClick={send}
                disabled={!text.trim() || sent}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-white transition disabled:opacity-50"
                style={{ background: accent ?? "var(--color-accent)" }}
              >
                <Send className="h-4 w-4" strokeWidth={1.8} />
                {sent ? "Отправлено" : "Отправить вопрос"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
