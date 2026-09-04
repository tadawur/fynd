// Zrkadlí public.level_for_xp / public.level_name zo supabase/schema_v2.sql —
// udržiavať v súlade pri zmene prahov v DB.
export const LEVEL_THRESHOLDS: { level: number; xp: number; name: string }[] = [
  { level: 1, xp: 0, name: "Začiatočník" },
  { level: 2, xp: 200, name: "Sľubný mladík" },
  { level: 3, xp: 500, name: "Nádejný hráč" },
  { level: 4, xp: 1000, name: "Nádejný talent" },
  { level: 5, xp: 2000, name: "Stálica tímu" },
  { level: 6, xp: 3500, name: "Kľúčový hráč" },
  { level: 7, xp: 5500, name: "Šampión" },
  { level: 8, xp: 8000, name: "Kapitán" },
  { level: 9, xp: 12000, name: "Hviezda" },
  { level: 10, xp: 20000, name: "Legenda" },
];

export function levelForXp(xp: number): number {
  let level = 1;
  for (const t of LEVEL_THRESHOLDS) if (xp >= t.xp) level = t.level;
  return level;
}

export function levelName(level: number): string {
  return LEVEL_THRESHOLDS.find((t) => t.level === level)?.name ?? "Legenda";
}

/** Vráti { current, next, progressPct } pre XP progres bar smerom k ďalšiemu levelu. */
export function levelProgress(xp: number) {
  const idx = LEVEL_THRESHOLDS.findIndex((t) => t.level === levelForXp(xp));
  const current = LEVEL_THRESHOLDS[idx];
  const next = LEVEL_THRESHOLDS[idx + 1];
  if (!next) return { current, next: null, progressPct: 100 };
  const span = next.xp - current.xp;
  const progressPct = Math.min(100, Math.round(((xp - current.xp) / span) * 100));
  return { current, next, progressPct };
}
