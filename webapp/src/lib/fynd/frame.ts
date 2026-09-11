// Rámček avatara podľa levelu hráča — "Steam-like" vizuálna vrstva.
// Čisto vizuálne (žiadna DB logika); prahy mierne kopírujú LEVEL_THRESHOLDS z xp.ts,
// len zoskupené do 5 "tierov" rámčeka.

export type FrameTier = {
  key: "starter" | "silver" | "gold" | "emerald" | "legendary";
  label: string;
  /** Statický gradient rámčeka (vždy viditeľný). */
  ringGradient: string;
  /** Farba jemnej žiary (box-shadow) okolo avatara. */
  glowColor: string;
  /** Či sa má rámček jemne točiť (len vyššie tiery). */
  animated: boolean;
  /** Či má avatar okolo seba aj mikro-častice. */
  particles: boolean;
};

const TIERS: FrameTier[] = [
  {
    key: "starter",
    label: "Štartér",
    ringGradient: "linear-gradient(135deg, #4b5a6b, #7a9abb)",
    glowColor: "rgba(122, 154, 187, 0.35)",
    animated: false,
    particles: false,
  },
  {
    key: "silver",
    label: "Strieborný rámček",
    ringGradient: "linear-gradient(135deg, #c7d3e0, #8fa3b8, #eef3f8)",
    glowColor: "rgba(199, 211, 224, 0.45)",
    animated: false,
    particles: false,
  },
  {
    key: "gold",
    label: "Zlatý rámček",
    ringGradient: "linear-gradient(135deg, #ffb830, #ffe1a3, #ffb830)",
    glowColor: "rgba(255, 184, 48, 0.55)",
    animated: false,
    particles: false,
  },
  {
    key: "emerald",
    label: "Smaragdový rámček",
    ringGradient:
      "conic-gradient(from 0deg, #00d97e, #7dffc4, #00d97e, #049a5c, #00d97e)",
    glowColor: "rgba(0, 217, 126, 0.6)",
    animated: true,
    particles: false,
  },
  {
    key: "legendary",
    label: "Legendárny rámček",
    ringGradient:
      "conic-gradient(from 0deg, #ffb830, #ff6b6b, #00d97e, #ffb830, #ff6b6b, #00d97e, #ffb830)",
    glowColor: "rgba(255, 184, 48, 0.65)",
    animated: true,
    particles: true,
  },
];

/** level 1-10 (viď LEVEL_THRESHOLDS v xp.ts) → rámček avatara. */
export function frameForLevel(level: number): FrameTier {
  if (level >= 9) return TIERS[4];
  if (level >= 7) return TIERS[3];
  if (level >= 5) return TIERS[2];
  if (level >= 3) return TIERS[1];
  return TIERS[0];
}
