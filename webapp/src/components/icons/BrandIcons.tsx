import type { SVGProps } from "react";

/**
 * Fynd brand ikony — vybrané a upravené zo site/icon-set.html (34-icon sada
 * navrhnutá spolu s prezentáciou/marketingom), napojené na CSS premenné
 * paletky z globals.css tak, aby vždy sedeli so značkou appky.
 */

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 64 64",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    ...props,
  } as const;
}

// Domov — Štadión
export function IconHome(props: IconProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="32" cy="34" rx="28" ry="18" fill="var(--color-green)" opacity=".25" />
      <ellipse cx="32" cy="34" rx="28" ry="18" fill="none" stroke="var(--color-green)" strokeWidth="3" />
      <ellipse cx="32" cy="34" rx="16" ry="9" fill="var(--color-fg)" />
      <rect x="20" y="32" width="24" height="2" fill="var(--color-green)" />
      <line x1="32" y1="16" x2="32" y2="52" stroke="var(--color-green)" strokeWidth="2" opacity=".4" />
    </svg>
  );
}

// Kalendár
export function IconCalendar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="8" y="12" width="48" height="44" rx="6" fill="var(--color-fg)" />
      <path d="M8 18 a6 6 0 0 1 6 -6 H50 a6 6 0 0 1 6 6 V26 H8 Z" fill="var(--color-green)" />
      <rect x="18" y="4" width="6" height="14" rx="2" fill="var(--color-muted)" />
      <rect x="40" y="4" width="6" height="14" rx="2" fill="var(--color-muted)" />
      <circle cx="32" cy="40" r="6" fill="var(--color-coral)" />
    </svg>
  );
}

// Chat — Komunita (bublina)
export function IconChat(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 12 H56 V40 H30 L18 52 V40 H8 Z" fill="var(--color-green)" />
      <circle cx="20" cy="26" r="3" fill="var(--color-ink)" />
      <circle cx="32" cy="26" r="3" fill="var(--color-ink)" />
      <circle cx="44" cy="26" r="3" fill="var(--color-ink)" />
    </svg>
  );
}

// Zápasy — Bránka
export function IconMatches(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 12 H56 V18 H50 V52 H44 V18 H20 V52 H14 V18 H8 Z" fill="var(--color-fg)" />
      <g stroke="var(--color-muted)" strokeWidth="1" opacity=".6">
        <line x1="20" y1="22" x2="44" y2="22" />
        <line x1="20" y1="30" x2="44" y2="30" />
        <line x1="20" y1="38" x2="44" y2="38" />
        <line x1="26" y1="18" x2="26" y2="50" />
        <line x1="32" y1="18" x2="32" y2="50" />
        <line x1="38" y1="18" x2="38" y2="50" />
      </g>
      <circle cx="30" cy="40" r="6" fill="var(--color-green)" />
    </svg>
  );
}

// Rebríčky — Trofej
export function IconTrophy(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M16 10 H48 V18 C48 30 40 38 32 38 C24 38 16 30 16 18 Z" fill="var(--color-gold)" />
      <path d="M16 14 C6 14 6 28 18 30" fill="none" stroke="var(--color-gold)" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 14 C58 14 58 28 46 30" fill="none" stroke="var(--color-gold)" strokeWidth="4" strokeLinecap="round" />
      <rect x="29" y="38" width="6" height="10" fill="var(--color-gold)" />
      <rect x="20" y="48" width="24" height="6" rx="2" fill="var(--color-gold)" />
      <rect x="16" y="54" width="32" height="6" rx="2" fill="var(--color-gold)" />
    </svg>
  );
}

// Odmeňovňa — Bonus (darček)
export function IconGift(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="10" y="26" width="44" height="32" rx="4" fill="var(--color-coral)" />
      <rect x="10" y="16" width="44" height="12" rx="3" fill="var(--color-green)" />
      <rect x="29" y="16" width="6" height="42" fill="var(--color-gold)" />
      <path d="M32 16 C24 16 20 8 26 6 C32 4 32 16 32 16 Z" fill="var(--color-green)" />
      <path d="M32 16 C40 16 44 8 38 6 C32 4 32 16 32 16 Z" fill="var(--color-green)" />
    </svg>
  );
}

// Kluby — Štít
export function IconShield(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M32 4 L54 12 V28 C54 44 44 56 32 60 C20 56 10 44 10 28 V12 Z" fill="var(--color-green)" />
      <path d="M32 4 L54 12 V28 C54 44 44 56 32 60 Z" fill="var(--color-ink)" opacity=".15" />
      <path d="M22 30 L29 38 L44 22" fill="none" stroke="var(--color-ink)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Oznamy — Megafón
export function IconMegaphone(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 26 L36 14 V50 L10 38 Z" fill="var(--color-gold)" />
      <rect x="6" y="24" width="6" height="16" rx="2" fill="var(--color-gold)" />
      <path d="M40 22 Q50 32 40 42" fill="none" stroke="var(--color-green)" strokeWidth="4" strokeLinecap="round" />
      <path d="M46 16 Q60 32 46 48" fill="none" stroke="var(--color-green)" strokeWidth="4" strokeLinecap="round" opacity=".6" />
    </svg>
  );
}

// Straty a nálezy — Skauting (lupa)
export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="28" cy="28" r="18" fill="none" stroke="var(--color-fg)" strokeWidth="6" />
      <circle cx="28" cy="28" r="10" fill="var(--color-green)" opacity=".35" />
      <line x1="41" y1="41" x2="56" y2="56" stroke="var(--color-fg)" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

// Profil — Dres
export function IconJersey(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M22 8 L10 16 L16 26 L22 22 V56 H42 V22 L48 26 L54 16 L42 8 Q32 17 22 8 Z"
        fill="var(--color-green)"
      />
      <path d="M22 8 Q32 17 42 8" fill="none" stroke="var(--color-ink)" strokeWidth="3" />
    </svg>
  );
}

// Notifikácie — Zvonček
export function IconBell(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M32 6 C20 6 16 16 16 26 V36 L10 46 H54 L48 36 V26 C48 16 44 6 32 6 Z"
        fill="var(--color-green)"
      />
      <path d="M26 50 Q32 58 38 50 Z" fill="var(--color-green)" />
      <circle cx="48" cy="14" r="7" fill="var(--color-coral)" />
    </svg>
  );
}

// Tréneri (chat) — Píšťalka
export function IconWhistle(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="10" y="24" width="34" height="18" rx="9" fill="var(--color-fg)" />
      <circle cx="44" cy="33" r="14" fill="var(--color-fg)" />
      <circle cx="44" cy="33" r="6" fill="var(--color-ink)" />
      <rect x="6" y="29" width="8" height="8" rx="2" fill="var(--color-gold)" />
      <line x1="44" y1="19" x2="44" y2="12" stroke="var(--color-fg)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Fynd+ — Hviezda
export function IconStar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M32 6 L39 24 L58 24 L43 36 L49 54 L32 43 L15 54 L21 36 L6 24 L25 24 Z"
        fill="var(--color-gold)"
      />
    </svg>
  );
}

// Nastavenia — posuvníky
export function IconSettings(props: IconProps) {
  return (
    <svg {...base(props)}>
      <line x1="10" y1="18" x2="54" y2="18" stroke="var(--color-muted)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="38" cy="18" r="6" fill="var(--color-green)" />
      <line x1="10" y1="32" x2="54" y2="32" stroke="var(--color-muted)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="22" cy="32" r="6" fill="var(--color-gold)" />
      <line x1="10" y1="46" x2="54" y2="46" stroke="var(--color-muted)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="42" cy="46" r="6" fill="var(--color-coral)" />
    </svg>
  );
}
