/**
 * Декор hero: разбросанные пуговицы (розовые/фиолетовые), жемчужины, бусины и «искры».
 * Оригинальный SVG/CSS. Слой — ПОД клубками (z ниже фото), чтобы детали не лежали поверх клубков.
 */

function Button({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className="drop-shadow-[0_6px_8px_rgba(110,80,120,0.28)]"
      aria-hidden
    >
      <circle cx="20" cy="20" r="19" fill={color} />
      <circle cx="20" cy="20" r="19" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" />
      <circle cx="20" cy="20" r="13" fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="1.2" />
      <ellipse cx="14" cy="13" rx="5" ry="3.4" fill="rgba(255,255,255,0.4)" />
      {[
        [15, 15],
        [25, 15],
        [15, 25],
        [25, 25],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill="rgba(0,0,0,0.28)" />
      ))}
    </svg>
  );
}

function Bead({ size, color }: { size: number; color: string }) {
  return (
    <span
      className="block rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 32% 28%, #fff 0%, ${color} 55%, color-mix(in srgb, ${color}, #000 18%) 100%)`,
        boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.12), 0 6px 10px -3px rgba(80,60,110,0.3)",
      }}
      aria-hidden
    />
  );
}

function Pearl({ size }: { size: number }) {
  return (
    <span
      className="block rounded-full"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 34% 30%, #ffffff 0%, #f4ece0 45%, #e3d6c4 100%)",
        boxShadow:
          "inset 0 -2px 4px rgba(150,130,110,0.3), inset 2px 2px 3px rgba(255,255,255,0.9), 0 6px 10px -3px rgba(90,70,110,0.28)",
      }}
      aria-hidden
    />
  );
}

function Sparkle({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z"
        fill={color}
      />
    </svg>
  );
}

type Item = {
  kind: "button" | "bead" | "pearl" | "sparkle";
  size: number;
  color?: string;
  pos: string;
  delay: number;
  dur: number;
};

// Раскидано по свободным краям (верх/низ/левый/правый край), подальше от клубков.
const ITEMS: Item[] = [
  // фиолетовые и розовые пуговицы
  { kind: "button", size: 26, color: "#7C6FF0", pos: "left-[40%] top-[9%]", delay: 0, dur: 7 },
  { kind: "button", size: 22, color: "#F2A8B8", pos: "left-[53%] bottom-[4%]", delay: 1.1, dur: 8 },
  { kind: "button", size: 28, color: "#EA90A8", pos: "left-[44%] bottom-[2%]", delay: 0.6, dur: 6.5 },
  { kind: "button", size: 20, color: "#9B8DF5", pos: "left-[11%] bottom-[7%]", delay: 0.9, dur: 8.2 },
  // жемчужины
  { kind: "pearl", size: 14, color: "", pos: "left-[6%] top-[11%]", delay: 0.4, dur: 7.5 },
  { kind: "pearl", size: 12, color: "", pos: "right-[7%] top-[7%]", delay: 1.3, dur: 8 },
  { kind: "pearl", size: 16, color: "", pos: "right-[4%] bottom-[18%]", delay: 0.7, dur: 8.4 },
  { kind: "pearl", size: 11, color: "", pos: "left-[9%] bottom-[20%]", delay: 0.2, dur: 7.1 },
  // бусины
  { kind: "bead", size: 10, color: "#F3B6C2", pos: "left-[34%] top-[4%]", delay: 0.5, dur: 7.2 },
  { kind: "bead", size: 9, color: "#CBBEF6", pos: "right-[28%] top-[5%]", delay: 1.4, dur: 7.8 },
  { kind: "bead", size: 8, color: "#F4D29A", pos: "right-[22%] bottom-[6%]", delay: 0.3, dur: 6.8 },
  // искры
  { kind: "sparkle", size: 16, color: "#8B7BF2", pos: "left-[30%] top-[3%]", delay: 0.8, dur: 6.4 },
  { kind: "sparkle", size: 13, color: "#A99BF5", pos: "right-[14%] bottom-[10%]", delay: 1.0, dur: 7 },
  { kind: "sparkle", size: 11, color: "#C4B8F8", pos: "left-[18%] top-[16%]", delay: 0.6, dur: 6.6 },
];

export function HeroDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] hidden md:block" aria-hidden>
      {ITEMS.map((it, i) => (
        <span
          key={i}
          className={`absolute ${it.pos}`}
          style={{ animation: `float ${it.dur}s ease-in-out ${it.delay}s infinite` }}
        >
          {it.kind === "button" ? (
            <Button size={it.size} color={it.color!} />
          ) : it.kind === "pearl" ? (
            <Pearl size={it.size} />
          ) : it.kind === "sparkle" ? (
            <Sparkle size={it.size} color={it.color!} />
          ) : (
            <Bead size={it.size} color={it.color!} />
          )}
        </span>
      ))}
    </div>
  );
}
