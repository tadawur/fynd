/**
 * Jarná/veľkonočná dekorácia do rohov pozadia appky — kvitnúca vetvička
 * (variant "B" z náhľadu, ktorý si vybral používateľ). Zobrazuje sa iba
 * pri sezónnej téme "velkanoc", inak nevykresľuje nič.
 *
 * Rovnaká logika ako PitchBackground: absolútne umiestnená, mimo
 * dokumentového toku (záporný z-index), takže nikdy neprekrýva obsah
 * a vyžaduje position:relative + vlastný stacking context na najbližšom
 * pozicovanom predkovi (dashboard/layout.tsx wrapper má "relative z-0").
 * Farby (green/gold/coral) sledujú aktuálny sezónny akcent cez CSS premenné.
 */
export function SeasonCorners({ seasonTheme }: { seasonTheme?: string }) {
  if (seasonTheme !== "velkanoc") return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* vetvička vľavo hore */}
      <svg
        viewBox="0 0 100 100"
        className="absolute left-0 top-0 h-28 w-28 sm:h-40 sm:w-40"
        style={{ opacity: 0.5 }}
      >
        <path
          d="M2 2 Q26 8 32 32"
          fill="none"
          stroke="var(--color-green)"
          strokeWidth="2"
        />
        <ellipse
          cx="16"
          cy="10"
          rx="7"
          ry="3.5"
          fill="var(--color-green)"
          transform="rotate(-25 16 10)"
        />
        <g transform="translate(32,32)">
          <circle r="4.5" fill="var(--color-gold)" />
          <ellipse cx="0" cy="-10" rx="5.5" ry="8" fill="var(--color-coral)" />
          <ellipse cx="9.5" cy="0" rx="8" ry="5.5" fill="var(--color-coral)" />
          <ellipse cx="0" cy="10" rx="5.5" ry="8" fill="var(--color-coral)" />
          <ellipse cx="-9.5" cy="0" rx="8" ry="5.5" fill="var(--color-coral)" />
        </g>
        <g fill="var(--color-coral)" opacity="0.7">
          <circle cx="52" cy="18" r="2" />
          <circle cx="60" cy="30" r="1.6" />
        </g>
      </svg>

      {/* menšia vetvička vpravo dole (zrkadlovo otočená) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute bottom-0 right-0 h-24 w-24 sm:h-32 sm:w-32"
        style={{ opacity: 0.35, transform: "scale(-1, -1)" }}
      >
        <path
          d="M2 2 Q22 6 28 28"
          fill="none"
          stroke="var(--color-green)"
          strokeWidth="1.8"
        />
        <ellipse
          cx="14"
          cy="9"
          rx="6"
          ry="3"
          fill="var(--color-green)"
          transform="rotate(-25 14 9)"
        />
        <g transform="translate(28,28)">
          <circle r="3.6" fill="var(--color-gold)" />
          <ellipse cx="0" cy="-8" rx="4.5" ry="6.5" fill="var(--color-coral)" />
          <ellipse cx="7.5" cy="0" rx="6.5" ry="4.5" fill="var(--color-coral)" />
          <ellipse cx="0" cy="8" rx="4.5" ry="6.5" fill="var(--color-coral)" />
          <ellipse cx="-7.5" cy="0" rx="6.5" ry="4.5" fill="var(--color-coral)" />
        </g>
      </svg>
    </div>
  );
}
