"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: { url: string; alt?: string | null }[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-cream">
        {main && (
          <Image
            src={main.url}
            alt={main.alt ?? title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((im, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Фото ${i + 1}`}
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
    </div>
  );
}
