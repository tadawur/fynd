/**
 * Jemné pozadie ihriska — presne tie isté SVG čiary ako v prezentácii
 * (site/index.html, hero sekcia, trieda .pitch-bg), len prenesené do appky.
 * Statický (bez animácie), farba čiar sleduje aktuálny sezónny akcent
 * (var(--color-green)), takže sedí s Halloweenom/Vianocami/atď.
 *
 * Umiestnenie: absolútne, mimo dokumentového toku (záporný z-index), takže
 * nikdy neprekrýva obsah — vyžaduje position:relative na najbližšom
 * pozicovanom predkovi (dashboard/layout.tsx wrapper).
 */
export function PitchBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ opacity: 0.2 }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <g fill="none" stroke="var(--color-green)" strokeWidth="1.5">
          <rect x="80" y="40" width="1240" height="820" rx="8" />
          <line x1="700" y1="40" x2="700" y2="860" />
          <circle cx="700" cy="450" r="88" />
          <path d="M80 280 L270 280 L270 620 L80 620" />
          <path d="M1320 280 L1130 280 L1130 620 L1320 620" />
          <path d="M80 355 L155 355 L155 545 L80 545" />
          <path d="M1320 355 L1245 355 L1245 545 L1320 545" />
          <path d="M80 40 Q110 40 110 70" />
          <path d="M1320 40 Q1290 40 1290 70" />
          <path d="M80 860 Q110 860 110 830" />
          <path d="M1320 860 Q1290 860 1290 830" />
          <rect x="36" y="375" width="44" height="150" />
          <rect x="1320" y="375" width="44" height="150" />
          <circle cx="270" cy="450" r="5" />
          <circle cx="1130" cy="450" r="5" />
        </g>
        <circle cx="700" cy="450" r="4" fill="var(--color-green)" opacity=".7" />
      </svg>
    </div>
  );
}
