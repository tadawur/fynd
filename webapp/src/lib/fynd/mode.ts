// Svetlý/tmavý režim appky — nezávislý od sezónnej témy (viď season.ts).

export type ColorMode = "dark" | "light";

export const COLOR_MODES: { key: ColorMode; label: string; emoji: string }[] = [
  { key: "dark", label: "Tmavý", emoji: "🌙" },
  { key: "light", label: "Svetlý", emoji: "☀️" },
];
