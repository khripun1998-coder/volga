"use client";

import { useState } from "react";

/**
 * Hero-визуал Aurora. Если в /public лежит hero.png (композиция с клубками/крафтом
 * на прозрачном фоне) — показываем его. Иначе — стеклянная 3D-сцена на CSS.
 */
export function HeroVisual() {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <div className="relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.png"
          alt="Изделия мастеров"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-contain object-right drop-shadow-[0_30px_45px_rgba(60,60,120,0.16)]"
        />
      </div>
    );
  }

  return <GlassScene />;
}

function GlassScene() {
  return (
    <div className="relative h-full w-full" aria-hidden>
      <div className="absolute bottom-8 left-1/2 h-10 w-64 -translate-x-1/2 rounded-full bg-[#a99bf0]/30 blur-2xl" />
      <div
        className="absolute left-6 top-2 h-24 w-24 animate-[float_7s_ease-in-out_infinite] rounded-[26px] border border-white/70"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,.92), rgba(167,139,250,.5))",
          boxShadow: "inset 0 2px 3px rgba(255,255,255,.95), inset 0 -10px 18px rgba(120,100,240,.28), 0 26px 44px -14px rgba(99,102,241,.55)",
          transform: "rotate(-7deg)",
        }}
      />
      <div
        className="absolute right-10 top-10 h-28 w-28 animate-[float_8s_ease-in-out_infinite] rounded-[28px] border border-white/70"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,.92), rgba(124,196,255,.55))",
          boxShadow: "inset 0 2px 3px rgba(255,255,255,.95), inset 0 -10px 18px rgba(99,102,241,.25), 0 26px 44px -14px rgba(99,102,241,.5)",
          transform: "rotate(9deg)",
          animationDelay: "0.6s",
        }}
      />
      <div className="absolute bottom-10 left-16 flex items-end gap-3">
        {[
          { h: 78, g: "rgba(167,139,250,.9)" },
          { h: 120, g: "rgba(124,196,255,.9)" },
          { h: 96, g: "rgba(240,171,252,.9)" },
        ].map((c, i) => (
          <div
            key={i}
            className="w-11 animate-[float_6s_ease-in-out_infinite] rounded-[999px_999px_20px_20px] border border-white/70"
            style={{
              height: c.h,
              background: `linear-gradient(180deg, ${c.g}, rgba(255,255,255,.7))`,
              boxShadow: "inset 0 3px 6px rgba(255,255,255,.85), 0 18px 32px -10px rgba(99,102,241,.5)",
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
      <div
        className="absolute right-8 top-1/2 h-28 w-28 -translate-y-1/2 animate-[float_8s_ease-in-out_infinite] rounded-full border border-white/70"
        style={{
          background: "radial-gradient(circle at 32% 28%, #fff 0%, rgba(167,139,250,.45) 52%, rgba(99,102,241,.7) 100%)",
          boxShadow: "inset 0 0 32px rgba(255,255,255,.5), 0 30px 56px -18px rgba(99,102,241,.55)",
        }}
      />
    </div>
  );
}
