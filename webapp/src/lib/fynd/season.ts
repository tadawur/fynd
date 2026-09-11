// Sezónne vizuálne témy appky — ručný výber v Nastaveniach (docs/branding.md
// zostáva základ, sezóny menia len akcentové farby cez CSS premenné v globals.css).

export type SeasonKey = "default" | "jar" | "leto" | "jesen" | "zima";

export const SEASONS: {
  key: SeasonKey;
  label: string;
  emoji: string;
  swatch: [string, string, string]; // green/gold/coral náhľad
}[] = [
  { key: "default", label: "Predvolená (Fynd)", emoji: "⚽", swatch: ["#00d97e", "#ffb830", "#ff6b6b"] },
  { key: "jar", label: "Jar", emoji: "🌱", swatch: ["#5fd97e", "#c8e06a", "#ff8fb1"] },
  { key: "leto", label: "Leto", emoji: "☀️", swatch: ["#1fd6c8", "#ffd23f", "#ff7a45"] },
  { key: "jesen", label: "Jeseň", emoji: "🍂", swatch: ["#e0a83e", "#d9622b", "#b33f2e"] },
  { key: "zima", label: "Zima", emoji: "❄️", swatch: ["#5fc9e8", "#d9e6f2", "#7a9abb"] },
];

export function seasonLabel(key: string | null | undefined): string {
  return SEASONS.find((s) => s.key === key)?.label ?? SEASONS[0].label;
}
