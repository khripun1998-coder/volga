/**
 * Темы магазинов v3 — только белые/серые тона.
 * Цвета убраны: индивидуальность канала держится на типографике,
 * плотности контента и микро‑узорах, а не на цветной обложке.
 */

export type ThemePreset =
  | "white"
  | "paper"
  | "stone"
  | "ash"
  | "snow"
  | "linen";

export type CardStyle = "minimal" | "postcard" | "magazine";

export interface ShopTheme {
  preset: ThemePreset;
  displayName: string;
  surface: string;
  surfaceMuted: string;
  line: string;
  ink: string;
  mutedInk: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  cover: string;
  headingFont: "serif" | "sans" | "display";
}

export const themePresets: Record<ThemePreset, ShopTheme> = {
  white: {
    preset: "white",
    displayName: "Белая бумага",
    surface: "#ffffff",
    surfaceMuted: "#fafafa",
    line: "#ececec",
    ink: "#111111",
    mutedInk: "#8a8a8a",
    accent: "#111111",
    accentHover: "#000000",
    accentSoft: "#f3f3f3",
    cover: "linear-gradient(135deg, #ffffff 0%, #f6f6f6 60%, #ededed 100%)",
    headingFont: "serif",
  },
  paper: {
    preset: "paper",
    displayName: "Бумага",
    surface: "#fdfdfd",
    surfaceMuted: "#f6f6f6",
    line: "#e8e8e8",
    ink: "#161616",
    mutedInk: "#888888",
    accent: "#161616",
    accentHover: "#000000",
    accentSoft: "#efefef",
    cover: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 60%, #e7e7e7 100%)",
    headingFont: "sans",
  },
  stone: {
    preset: "stone",
    displayName: "Камень",
    surface: "#fbfbfa",
    surfaceMuted: "#f1f1f0",
    line: "#e2e2e0",
    ink: "#1a1a1a",
    mutedInk: "#7e7c78",
    accent: "#1a1a1a",
    accentHover: "#000000",
    accentSoft: "#ededec",
    cover: "linear-gradient(135deg, #f4f4f3 0%, #e6e6e4 60%, #d4d4d2 100%)",
    headingFont: "serif",
  },
  ash: {
    preset: "ash",
    displayName: "Пепел",
    surface: "#fafafa",
    surfaceMuted: "#f0f0f0",
    line: "#e0e0e0",
    ink: "#101010",
    mutedInk: "#7a7a7a",
    accent: "#101010",
    accentHover: "#000000",
    accentSoft: "#ebebeb",
    cover: "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 60%, #cdcdcd 100%)",
    headingFont: "sans",
  },
  snow: {
    preset: "snow",
    displayName: "Снег",
    surface: "#ffffff",
    surfaceMuted: "#f9f9f9",
    line: "#ededed",
    ink: "#121212",
    mutedInk: "#8c8c8c",
    accent: "#121212",
    accentHover: "#000000",
    accentSoft: "#f4f4f4",
    cover: "linear-gradient(135deg, #ffffff 0%, #f3f3f3 60%, #e6e6e6 100%)",
    headingFont: "serif",
  },
  linen: {
    preset: "linen",
    displayName: "Лён",
    surface: "#fcfcfb",
    surfaceMuted: "#f4f4f2",
    line: "#e6e6e3",
    ink: "#181818",
    mutedInk: "#83817c",
    accent: "#181818",
    accentHover: "#000000",
    accentSoft: "#efefed",
    cover: "linear-gradient(135deg, #f7f7f5 0%, #ebebe7 60%, #dddcd7 100%)",
    headingFont: "display",
  },
};

const presetList: ThemePreset[] = ["white", "paper", "stone", "ash", "snow", "linen"];

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getShopTheme(
  slug: string,
  presetOverride?: string | null
): ShopTheme {
  if (presetOverride && presetOverride in themePresets) {
    return themePresets[presetOverride as ThemePreset];
  }
  const idx = hashString(slug) % presetList.length;
  return themePresets[presetList[idx]];
}

const cardStyleList: CardStyle[] = ["minimal", "postcard", "magazine"];
export function getShopCardStyle(
  slug: string,
  override?: string | null
): CardStyle {
  if (override && (cardStyleList as string[]).includes(override)) {
    return override as CardStyle;
  }
  const idx = (hashString(slug + "::card") >>> 0) % cardStyleList.length;
  return cardStyleList[idx];
}

export function themeVars(t: ShopTheme): React.CSSProperties {
  return {
    ["--surface" as string]: t.surface,
    ["--surface-muted" as string]: t.surfaceMuted,
    ["--line" as string]: t.line,
    ["--ink" as string]: t.ink,
    ["--muted-ink" as string]: t.mutedInk,
    ["--accent" as string]: t.accent,
    ["--accent-hover" as string]: t.accentHover,
    ["--accent-soft" as string]: t.accentSoft,
    ["--cover" as string]: t.cover,
  };
}
