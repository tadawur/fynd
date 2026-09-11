type Badge = {
  slug: string;
  name: string;
  emoji: string;
  description: string;
};

/**
 * "Vitrína" odznakov v Steam štýle — väčšie karty s jemnou žiarou,
 * najnovšie 3 zvýraznené ako "vystavené".
 */
export function BadgeShowcase({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="mb-1 font-medium">Vitrína odznakov</h2>
        <p className="text-sm text-muted">
          Zatiaľ žiadne odznaky — ukáž sa na tréningu alebo v zápase 💪
        </p>
      </div>
    );
  }

  const featured = badges.slice(0, 3);
  const rest = badges.slice(3);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium">Vitrína odznakov</h2>
        <span className="text-xs text-muted">{badges.length} celkovo</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {featured.map((b) => (
          <div
            key={b.slug}
            title={b.description}
            className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-b from-gold/15 to-transparent px-2 py-4 text-center"
          >
            <div
              className="absolute inset-0 -z-10 animate-fynd-glow rounded-xl bg-gold/10 blur-lg"
              aria-hidden
            />
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-2xl ring-1 ring-gold/50">
              {b.emoji}
            </span>
            <span className="text-xs font-medium text-fg">{b.name}</span>
          </div>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-3 border-t border-line pt-4 sm:grid-cols-6">
          {rest.map((b) => (
            <div
              key={b.slug}
              title={b.description}
              className="flex flex-col items-center gap-1 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-xl ring-1 ring-line">
                {b.emoji}
              </span>
              <span className="text-[10px] text-muted">{b.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
