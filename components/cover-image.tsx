"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Обложка с «мягкой деградацией»: если фото по `src` загрузилось — показываем его,
 * иначе остаётся градиент + декоративный кружок (плейсхолдер).
 * Так можно просто класть фото в /public, и они появляются без правок кода.
 */
export function CoverImage({
  src,
  gradient,
  className,
  alt = "",
}: {
  src?: string | null;
  gradient: string;
  className?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: gradient }}>
      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src as string}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {!showImg && (
        <div
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,.8), 0 10px 24px -8px rgba(40,40,90,.12)" }}
          aria-hidden
        />
      )}
    </div>
  );
}
