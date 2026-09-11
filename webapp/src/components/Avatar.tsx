import { frameForLevel } from "@/lib/fynd/frame";

type AvatarProps = {
  level: number;
  kitColor: string;
  photoUrl?: string | null;
  name?: string;
  size?: number;
  /** Zobraziť rámček podľa levelu (banner hero = true, malé miesta v nav = false). */
  showFrame?: boolean;
  className?: string;
};

/**
 * Zdieľaný avatar hráča — fotka (ak je nahraná) alebo farba dresu + level,
 * voliteľne obalený "Steam-like" rámčekom podľa levelu (frame.ts).
 */
export function Avatar({
  level,
  kitColor,
  photoUrl,
  name,
  size = 56,
  showFrame = false,
  className = "",
}: AvatarProps) {
  const tier = frameForLevel(level);
  const frameWidth = Math.max(2, Math.round(size * 0.06));
  const inner = (
    <div
      className="flex h-full w-full items-center justify-center overflow-hidden rounded-full font-display font-bold text-ink"
      style={{
        backgroundColor: kitColor,
        fontSize: Math.max(11, size * 0.32),
      }}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={name ? `Profilová fotka — ${name}` : "Profilová fotka"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{level}</span>
      )}
    </div>
  );

  if (!showFrame) {
    return (
      <div
        className={`shrink-0 rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        {inner}
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={tier.label}
    >
      {/* jemná žiara za avatarom */}
      <div
        className={`absolute inset-0 rounded-full blur-md ${
          tier.animated ? "animate-fynd-glow" : ""
        }`}
        style={{ backgroundColor: tier.glowColor }}
        aria-hidden
      />
      {/* rotujúci gradientový prstenec pre vyššie tiery */}
      {tier.animated && (
        <div
          className="absolute rounded-full animate-fynd-spin"
          style={{
            inset: -frameWidth * 1.5,
            background: tier.ringGradient,
          }}
          aria-hidden
        />
      )}
      {/* statický rámček */}
      <div
        className="absolute inset-0 rounded-full p-[var(--fynd-frame-w)]"
        style={{
          background: tier.animated ? "transparent" : tier.ringGradient,
          ["--fynd-frame-w" as string]: `${frameWidth}px`,
        }}
      >
        <div className="h-full w-full rounded-full bg-ink p-[2px]">{inner}</div>
      </div>
      {tier.particles && (
        <>
          <span
            className="absolute h-1 w-1 rounded-full bg-gold animate-fynd-particle"
            style={{ top: "-6%", left: "50%", animationDelay: "0s" }}
            aria-hidden
          />
          <span
            className="absolute h-1 w-1 rounded-full bg-green animate-fynd-particle"
            style={{ top: "50%", right: "-8%", animationDelay: "0.9s" }}
            aria-hidden
          />
          <span
            className="absolute h-1 w-1 rounded-full bg-coral animate-fynd-particle"
            style={{ bottom: "-6%", left: "35%", animationDelay: "1.7s" }}
            aria-hidden
          />
        </>
      )}
    </div>
  );
}
