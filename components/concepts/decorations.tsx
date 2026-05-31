/**
 * Декоративные «3D»-фигуры, имитирующие render-сцены с референсов.
 * Чистый CSS/SVG — никаких внешних картинок.
 */

import { cn } from "@/lib/utils";

/* ────────────────── Phone mockup (для V1 / V2) ────────────────── */
export function PhoneMockup({
  className,
  tone = "sky",
}: {
  className?: string;
  tone?: "sky" | "sunshine";
}) {
  const accent = tone === "sky" ? "#3D7FE0" : "#F59E0B";
  const screen = tone === "sky" ? "#EAF2FE" : "#FFF4E0";

  return (
    <div className={cn("relative", className)}>
      {/* большой телефон в центре */}
      <div
        className="relative mx-auto h-[440px] w-[220px] rotate-[-6deg] rounded-[36px] border-[10px] border-graphite/90 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)]"
        style={{ background: screen }}
      >
        <div className="absolute left-1/2 top-1 h-1.5 w-16 -translate-x-1/2 rounded-full bg-graphite/80" />
        {/* «контент» внутри экрана */}
        <div className="absolute inset-3 overflow-hidden rounded-[22px]">
          <div className="h-12 w-full" style={{ background: accent, opacity: 0.18 }} />
          <div className="space-y-2 p-3">
            <div className="h-2 w-1/2 rounded bg-graphite/30" />
            <div className="h-2 w-1/3 rounded bg-graphite/20" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg"
                  style={{ background: i % 2 ? accent + "22" : "#00000010" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Плавающие мини-карточки UI вокруг — как на рендере */}
      <FloatingCard
        className="absolute -left-6 top-10 w-32 rotate-[-10deg]"
        delay={0.1}
        tone={accent}
      >
        <div className="h-1.5 w-12 rounded bg-graphite/30" />
        <div className="mt-1 h-1.5 w-8 rounded bg-graphite/20" />
        <div className="mt-2 h-12 rounded" style={{ background: accent + "33" }} />
      </FloatingCard>

      <FloatingCard
        className="absolute -right-2 top-4 w-28 rotate-[8deg]"
        delay={0.5}
        tone={accent}
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full" style={{ background: accent }} />
          <div className="flex-1 space-y-1">
            <div className="h-1.5 w-full rounded bg-graphite/20" />
            <div className="h-1.5 w-2/3 rounded bg-graphite/10" />
          </div>
        </div>
      </FloatingCard>

      <FloatingCard
        className="absolute -right-8 bottom-16 w-36 rotate-[-4deg]"
        delay={0.9}
        tone={accent}
      >
        <div className="h-16 rounded" style={{ background: accent + "55" }} />
        <div className="mt-1.5 h-1.5 w-3/4 rounded bg-graphite/20" />
      </FloatingCard>

      <FloatingCard
        className="absolute -left-4 bottom-6 w-28 rotate-[14deg]"
        delay={1.3}
        tone={accent}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-graphite">★ 4.9</span>
          <span
            className="rounded px-1.5 py-0.5 text-[9px] font-semibold text-white"
            style={{ background: accent }}
          >
            NEW
          </span>
        </div>
      </FloatingCard>

      {/* Декоративные «жидкие» элементы фона */}
      <div
        className="absolute -left-12 -top-12 h-32 w-32 rounded-full opacity-60 blur-3xl"
        style={{ background: accent + "44" }}
      />
      <div
        className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-50 blur-3xl"
        style={{ background: accent + "33" }}
      />
    </div>
  );
}

function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  tone?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/70 bg-white p-2.5 shadow-[0_18px_30px_-10px_rgba(0,0,0,0.18)]",
        "animate-[float_6s_ease-in-out_infinite]",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/* ────────────────── Glass cubes (V3) ────────────────── */
export function GlassScene({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* «Поднос» — широкое стекло снизу */}
      <div
        className="absolute bottom-12 left-1/2 h-12 w-72 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.0) 70%)",
          filter: "blur(3px)",
        }}
      />

      <GlassCube
        className="absolute left-12 top-4 h-24 w-24"
        delay={0}
        rotate={-8}
        tint="#A78BFA"
      />
      <GlassCube
        className="absolute right-8 top-16 h-28 w-28"
        delay={0.6}
        rotate={12}
        tint="#7CC4FF"
      />
      <GlassCube
        className="absolute left-32 bottom-32 h-20 w-20"
        delay={1.2}
        rotate={-3}
        tint="#F0ABFC"
      />

      {/* Стеклянная сфера */}
      <div
        className="absolute right-24 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border border-white/60 animate-[float_8s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(167,139,250,0.35) 50%, rgba(99,102,241,0.55) 100%)",
          backdropFilter: "blur(8px)",
          boxShadow:
            "inset 0 0 30px rgba(255,255,255,0.5), 0 30px 60px -20px rgba(99,102,241,0.4)",
        }}
      />

      {/* Стеклянные «цилиндры» — переменной высоты, как на референсе */}
      <div className="absolute bottom-16 left-20 flex items-end gap-3">
        <GlassCylinder height={70} tint="#A78BFA" delay={0.2} />
        <GlassCylinder height={110} tint="#7CC4FF" delay={0.6} />
        <GlassCylinder height={88} tint="#F0ABFC" delay={1.0} />
      </div>
    </div>
  );
}

function GlassCube({
  className,
  delay = 0,
  rotate = 0,
  tint,
}: {
  className?: string;
  delay?: number;
  rotate?: number;
  tint: string;
}) {
  return (
    <div
      className={cn("rounded-3xl border border-white/60 animate-[float_7s_ease-in-out_infinite]", className)}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.85) 0%, ${tint}55 100%)`,
        backdropFilter: "blur(10px)",
        boxShadow: `inset 0 1px 1px rgba(255,255,255,0.9), 0 20px 40px -10px ${tint}80`,
        transform: `rotate(${rotate}deg)`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function GlassCylinder({
  height,
  tint,
  delay = 0,
}: {
  height: number;
  tint: string;
  delay?: number;
}) {
  return (
    <div
      className="w-12 rounded-t-full rounded-b-2xl border border-white/60 animate-[float_6s_ease-in-out_infinite]"
      style={{
        height,
        background: `linear-gradient(180deg, ${tint}cc 0%, rgba(255,255,255,0.6) 100%)`,
        backdropFilter: "blur(6px)",
        boxShadow: `inset 0 -10px 16px ${tint}66, 0 10px 30px -10px ${tint}80`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}
