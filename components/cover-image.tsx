"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Обложка с «мягкой деградацией»: если фото по `src` загрузилось — показываем его,
 * иначе остаётся градиент + крупная монограмма (первая буква названия) — «авторская
 * заглушка» вместо технического кружка.
 * `zoom` — лёгкое увеличение фото при наведении на родителя с классом `group`.
 * `grain` — тонкая зернистая фактура поверх (приятно на градиентных заглушках).
 */
export function CoverImage({
  src,
  gradient,
  className,
  alt = "",
  zoom = false,
  grain = false,
}: {
  src?: string | null;
  gradient: string;
  className?: string;
  alt?: string;
  zoom?: boolean;
  grain?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: gradient }}>
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src as string}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            zoom && "transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          )}
        />
      ) : (
        <span
          aria-hidden
          className="font-serif absolute inset-0 grid place-items-center text-6xl font-semibold text-accent/25"
        >
          {alt.trim().charAt(0) || "В"}
        </span>
      )}
      {grain && <span aria-hidden className="grain-overlay" />}
    </div>
  );
}
