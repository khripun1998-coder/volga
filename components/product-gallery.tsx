"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: { url: string; alt?: string | null }[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const touchX = useRef<number | null>(null);
  const swiped = useRef(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const n = images.length;
  const main = images[active] ?? images[0];

  const go = useCallback(
    (d: number) => setActive((a) => (n ? (a + d + n) % n : 0)),
    [n]
  );

  // Свайп пальцем (главное фото и lightbox)
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
    swiped.current = false;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
    if (Math.abs(dx) > 40) {
      swiped.current = true; // подавляем последующий синтетический click
      go(dx < 0 ? 1 : -1);
    }
    touchX.current = null;
  };

  // Hover-зум только мышью (на тач не залипает)
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  // Клавиатура + фокус-ловушка + блокировка прокрутки в lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(false);
      } else if (e.key === "ArrowLeft") {
        go(-1);
      } else if (e.key === "ArrowRight") {
        go(1);
      } else if (e.key === "Tab") {
        const btns = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!btns || btns.length === 0) return;
        const first = btns[0];
        const last = btns[btns.length - 1];
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(focusTimer);
      triggerRef.current?.focus(); // вернуть фокус на триггер
    };
  }, [lightbox, go]);

  if (!main) return null;

  return (
    <div>
      {/* Главное фото — hover-зум (мышь) + клик/Enter в полноэкранный просмотр */}
      <div
        ref={triggerRef}
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-cream"
        onClick={() => {
          if (swiped.current) {
            swiped.current = false;
            return;
          }
          setLightbox(true);
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setZoom(true);
        }}
        onPointerLeave={() => setZoom(false)}
        onPointerMove={onPointerMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="button"
        tabIndex={0}
        aria-label="Открыть фото в полном размере"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setLightbox(true);
          }
        }}
      >
        <Image
          src={main.url}
          alt={main.alt ?? title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-200 ease-out"
          style={zoom ? { transform: "scale(1.8)", transformOrigin: `${origin.x}% ${origin.y}%` } : undefined}
        />

        <span className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper/85 text-graphite/70 opacity-0 backdrop-blur transition group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" strokeWidth={1.8} />
        </span>

        {n > 1 && (
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-graphite/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            {active + 1} / {n}
          </span>
        )}

        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Предыдущее фото"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-graphite opacity-0 backdrop-blur transition hover:bg-paper group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-paper/85 text-graphite opacity-0 backdrop-blur transition hover:bg-paper group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </>
        )}
      </div>

      {/* Миниатюры */}
      {n > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2.5">
          {images.map((im, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Фото ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-cream transition",
                i === active
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-line hover:border-accent/50"
              )}
            >
              <Image src={im.url} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Полноэкранный просмотр — через портал в body, чтобы накрыть сайдбар/шапку */}
      {lightbox &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dialogRef}
            className="fixed inset-0 z-[100] flex animate-[fadeIn_0.18s_ease-out] items-center justify-center bg-graphite/90 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр фото"
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Закрыть"
              onClick={() => setLightbox(false)}
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <X className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <div
              className="relative h-full max-h-[86vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={main.url}
                alt={main.alt ?? title}
                fill
                sizes="100vw"
                className="object-contain"
              />

              {n > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Предыдущее фото"
                    onClick={() => go(-1)}
                    className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <ChevronLeft className="h-6 w-6" strokeWidth={1.7} />
                  </button>
                  <button
                    type="button"
                    aria-label="Следующее фото"
                    onClick={() => go(1)}
                    className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    <ChevronRight className="h-6 w-6" strokeWidth={1.7} />
                  </button>
                  <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                    {active + 1} / {n}
                  </span>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
