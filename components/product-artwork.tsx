import { cn } from "@/lib/utils";

/* Тематические иллюстрации по категориям — чистый минималистичный стиль,
   мягкие тёплые градиенты. Надёжная замена фото: консистентно и премиально. */

function Bunny() {
  return (
    <g>
      <ellipse cx="170" cy="118" rx="25" ry="72" transform="rotate(-12 170 118)" fill="#F7EADD" />
      <ellipse cx="170" cy="120" rx="11" ry="50" transform="rotate(-12 170 120)" fill="#EFC2C9" />
      <ellipse cx="232" cy="118" rx="25" ry="72" transform="rotate(12 232 118)" fill="#F7EADD" />
      <ellipse cx="232" cy="120" rx="11" ry="50" transform="rotate(12 232 120)" fill="#EFC2C9" />
      <circle cx="200" cy="212" r="86" fill="#FCF3EB" />
      <circle cx="158" cy="228" r="13" fill="#F4C2C9" opacity="0.75" />
      <circle cx="242" cy="228" r="13" fill="#F4C2C9" opacity="0.75" />
      <path d="M166 204 q11 13 22 0" stroke="#6b574a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M212 204 q11 13 22 0" stroke="#6b574a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M194 224 h12 l-6 8 z" fill="#E79AA6" />
      <path d="M200 232 v7 M200 239 q-8 6 -15 1 M200 239 q8 6 15 1" stroke="#a08a7d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Mug() {
  return (
    <g>
      <path d="M178 92 q-12 16 0 32 q12 16 0 32" stroke="#C9B7A8" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M222 86 q-12 16 0 32 q12 16 0 32" stroke="#C9B7A8" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M262 208 q48 6 42 52 q-6 42 -48 38" stroke="#C2774F" strokeWidth="17" fill="none" strokeLinecap="round" />
      <path d="M130 194 h142 v54 q0 66 -71 66 q-71 0 -71 -66 z" fill="#CE805A" />
      <path d="M130 194 h142 v18 q-71 18 -142 0 z" fill="#B96B46" />
      <rect x="150" y="250" width="102" height="8" rx="4" fill="#EBD9CB" opacity="0.55" />
    </g>
  );
}

function Ring() {
  return (
    <g>
      <ellipse cx="200" cy="256" rx="78" ry="44" fill="none" stroke="#D7B36A" strokeWidth="18" />
      <ellipse cx="200" cy="256" rx="78" ry="44" fill="none" stroke="#EFD9A2" strokeWidth="6" />
      <path d="M200 104 l40 34 -40 60 -40 -60 z" fill="#BFE0E6" />
      <path d="M160 138 h80 l-40 60 z" fill="#A9D2DB" />
      <path d="M200 104 l40 34 -40 0 z" fill="#DCEFF2" />
      <path d="M200 104 l-40 34 40 0 z" fill="#CFE9ED" />
      <path d="M150 116 v16 M142 124 h16" stroke="#EAD59C" strokeWidth="4" strokeLinecap="round" />
      <circle cx="258" cy="152" r="4" fill="#EAD59C" />
    </g>
  );
}

function Textile() {
  return (
    <g>
      <rect x="108" y="236" width="184" height="60" rx="16" fill="#E6D4BC" />
      <rect x="120" y="198" width="160" height="56" rx="16" fill="#EFE0CB" />
      <rect x="132" y="162" width="136" height="52" rx="16" fill="#F7EDDC" />
      <path d="M132 188 h136 M120 226 h160 M108 266 h184" stroke="#D8C3A6" strokeWidth="3" opacity="0.5" />
      <path d="M156 162 v52" stroke="#CBB48F" strokeWidth="3" strokeDasharray="2 7" />
    </g>
  );
}

function Vase() {
  return (
    <g>
      <path d="M200 152 q-4 -42 -38 -66" stroke="#9FB39B" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M200 152 q6 -52 42 -80" stroke="#9FB39B" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="158" cy="90" rx="16" ry="9" transform="rotate(-40 158 90)" fill="#AFC4A6" />
      <ellipse cx="246" cy="78" rx="16" ry="9" transform="rotate(35 246 78)" fill="#AFC4A6" />
      <ellipse cx="200" cy="120" rx="14" ry="8" fill="#C2D4B6" />
      <path d="M166 158 h68 q14 0 12 18 l-10 86 q-3 28 -36 28 q-33 0 -36 -28 l-10 -86 q-2 -18 12 -18 z" fill="#DCC9B0" />
      <ellipse cx="200" cy="160" rx="34" ry="9" fill="#CBB69A" />
    </g>
  );
}

function Candle() {
  return (
    <g>
      <circle cx="200" cy="120" r="46" fill="#F6D7A8" opacity="0.5" />
      <path d="M200 90 q23 27 0 56 q-23 -11 0 -56 z" fill="#F2A65A" />
      <path d="M200 108 q11 14 0 30 q-11 -6 0 -30 z" fill="#F8D193" />
      <rect x="197" y="146" width="6" height="14" rx="3" fill="#7a6a5c" />
      <rect x="148" y="158" width="104" height="152" rx="22" fill="#F5EDDE" />
      <rect x="148" y="158" width="104" height="16" rx="8" fill="#EADDC7" />
      <rect x="136" y="302" width="128" height="22" rx="10" fill="#D9C7AB" />
    </g>
  );
}

function Table() {
  return (
    <g>
      <rect x="78" y="150" width="244" height="38" rx="10" fill="#CBA06E" />
      <rect x="152" y="150" width="96" height="38" rx="6" fill="#6FA8BD" opacity="0.6" />
      <rect x="98" y="188" width="18" height="96" rx="7" fill="#B07F4C" />
      <rect x="284" y="188" width="18" height="96" rx="7" fill="#B07F4C" />
      <rect x="110" y="276" width="180" height="12" rx="6" fill="#B07F4C" />
    </g>
  );
}

function Plank() {
  return (
    <g>
      <circle cx="262" cy="132" r="32" fill="#D8AE78" stroke="#B0824E" strokeWidth="3" />
      <circle cx="262" cy="132" r="20" fill="none" stroke="#B0824E" strokeWidth="2.5" />
      <circle cx="262" cy="132" r="9" fill="none" stroke="#B0824E" strokeWidth="2.5" />
      <rect x="90" y="178" width="220" height="34" rx="8" fill="#C99A63" />
      <rect x="100" y="216" width="200" height="32" rx="8" fill="#D8AE78" />
      <rect x="112" y="252" width="176" height="30" rx="8" fill="#C0905A" />
      <path d="M110 195 h180 M122 232 h156 M134 267 h132" stroke="#A87B47" strokeWidth="2" opacity="0.5" />
    </g>
  );
}

type Theme = {
  from: string;
  to: string;
  blob: string;
  Art: () => React.ReactElement;
};

const themes: Record<string, Theme> = {
  toys: { from: "#FDEFE4", to: "#F7DECE", blob: "#F6C9AE", Art: Bunny },
  ceramics: { from: "#F0E7DB", to: "#E3D4C0", blob: "#D9B89B", Art: Mug },
  jewelry: { from: "#F5EDF2", to: "#ECE0EA", blob: "#D8C3DA", Art: Ring },
  textile: { from: "#F5EDDE", to: "#EBDCC5", blob: "#DDC7A6", Art: Textile },
  decor: { from: "#ECF1E7", to: "#DCE7D5", blob: "#BBD0B2", Art: Vase },
  candles: { from: "#FBEFDD", to: "#F6E2C7", blob: "#F4CE94", Art: Candle },
  furniture: { from: "#F3E7D6", to: "#E6D2B8", blob: "#D7B98C", Art: Table },
  materials: { from: "#EFE6D6", to: "#DECDB0", blob: "#CBAE82", Art: Plank },
};

export function ProductArtwork({
  category,
  className,
  seed = 0,
}: {
  category: string;
  className?: string;
  seed?: number;
}) {
  const t = themes[category] ?? themes.toys;
  const Art = t.Art;
  const angle = 135 + (seed % 4) * 15;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(${angle}deg, ${t.from}, ${t.to})` }}
      />
      <div
        className="absolute h-44 w-44 rounded-full opacity-50 blur-2xl"
        style={{
          background: t.blob,
          top: seed % 2 === 0 ? "-2.5rem" : "auto",
          bottom: seed % 2 === 0 ? "auto" : "-2.5rem",
          right: "-2.5rem",
        }}
      />
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`Иллюстрация: ${category}`}
      >
        <Art />
      </svg>
    </div>
  );
}
