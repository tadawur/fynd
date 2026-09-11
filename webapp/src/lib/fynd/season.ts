// Sezónne + sviatočné vizuálne témy appky — ručný výber v Nastaveniach
// (docs/branding.md zostáva základ, témy menia len akcentové farby cez
// CSS premenné v globals.css, prípadne drobný dekoratívny emoji).

export type SeasonKey =
  | "default"
  | "jar"
  | "leto"
  | "jesen"
  | "zima"
  | "halloween"
  | "vianoce"
  | "velkanoc";

export const SEASONS: {
  key: SeasonKey;
  label: string;
  emoji: string;
  swatch: [string, string, string]; // green/gold/coral náhľad
  /** Drobný dekoratívny doplnok (len pri sviatočných témach) — napr. tekvica pri Halloweene. */
  decor?: string;
}[] = [
  { key: "default", label: "Predvolená (Fynd)", emoji: "⚽", swatch: ["#00d97e", "#ffb830", "#ff6b6b"] },
  { key: "jar", label: "Jar", emoji: "🌱", swatch: ["#5fd97e", "#c8e06a", "#ff8fb1"] },
  { key: "leto", label: "Leto", emoji: "☀️", swatch: ["#1fd6c8", "#ffd23f", "#ff7a45"] },
  { key: "jesen", label: "Jeseň", emoji: "🍂", swatch: ["#e0a83e", "#d9622b", "#b33f2e"] },
  { key: "zima", label: "Zima", emoji: "❄️", swatch: ["#5fc9e8", "#d9e6f2", "#7a9abb"] },
  {
    key: "halloween",
    label: "Halloween",
    emoji: "🎃",
    swatch: ["#8bd346", "#ff8c1a", "#8b5cf6"],
    decor: "🎃",
  },
  {
    key: "vianoce",
    label: "Vianoce",
    emoji: "🎄",
    swatch: ["#1f8a4c", "#d4af37", "#c0392b"],
    decor: "🎄",
  },
  {
    key: "velkanoc",
    label: "Veľká noc",
    emoji: "🐣",
    swatch: ["#8fd14f", "#ffd66b", "#ff9eb5"],
    decor: "🐣",
  },
];

export function seasonLabel(key: string | null | undefined): string {
  return SEASONS.find((s) => s.key === key)?.label ?? SEASONS[0].label;
}

export function seasonDecor(key: string | null | undefined): string | undefined {
  return SEASONS.find((s) => s.key === key)?.decor;
}

/** Emoji danej témy (má ho úplne každá téma) — používa sa napr. na ikonku "Domov" v navigácii. */
export function seasonEmoji(key: string | null | undefined): string {
  return SEASONS.find((s) => s.key === key)?.emoji ?? SEASONS[0].emoji;
}
