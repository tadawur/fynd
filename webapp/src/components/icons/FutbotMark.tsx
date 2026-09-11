type FutbotMarkProps = {
  size?: number;
  className?: string;
};

/**
 * Fynd logomark — "Futbot" maskot (docs/branding.md).
 * Zdrojová grafika: site/favicon.svg — jednotná so značkou naprieč
 * marketingovými materiálmi (prezentácia, landing mockupy).
 */
export function FutbotMark({ size = 40, className }: FutbotMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="14" fill="var(--color-ink)" />
      <rect
        x="10"
        y="14"
        width="44"
        height="34"
        rx="9"
        fill="var(--color-surface)"
        stroke="var(--color-green)"
        strokeWidth="2.5"
      />
      <rect x="17" y="24" width="14" height="9" rx="3" fill="var(--color-green)" />
      <rect x="33" y="24" width="14" height="9" rx="3" fill="var(--color-green)" />
      <line
        x1="32"
        y1="14"
        x2="32"
        y2="6"
        stroke="var(--color-green)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="32" cy="5" r="3.5" fill="var(--color-gold)" />
    </svg>
  );
}
