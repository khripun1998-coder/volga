"use client";

import { Check } from "lucide-react";
import { useToasts } from "@/lib/toast-store";

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-fade-up pointer-events-auto flex items-center gap-2.5 rounded-xl border border-line bg-paper px-4 py-3 text-sm text-graphite shadow-[var(--shadow-lift)]"
        >
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </span>
          {t.text}
        </div>
      ))}
    </div>
  );
}
