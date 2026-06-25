"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function ProductModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const close = () => router.back();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр товара"
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={close}
        className="absolute inset-0 bg-graphite/45 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-paper shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)] focus:outline-none"
      >
        <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-end gap-2 border-b border-line bg-paper/85 px-4 backdrop-blur">
          <button
            type="button"
            onClick={close}
            aria-label="Закрыть"
            className="grid h-10 w-10 place-items-center rounded-full text-graphite transition hover:bg-cream"
          >
            <X className="h-5 w-5" strokeWidth={1.7} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
