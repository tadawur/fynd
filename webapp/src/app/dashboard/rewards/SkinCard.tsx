"use client";

import { useTransition } from "react";
import { buySkin, activateSkin } from "./actions";

type Skin = { slug: string; name: string; xp_cost: number; css_gradient: string };

export function SkinCard({
  skin,
  owned,
  active,
  myXp,
}: {
  skin: Skin;
  owned: boolean;
  active: boolean;
  myXp: number;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-line p-3">
      <div
        className="h-12 w-full rounded-lg"
        style={{ background: skin.css_gradient }}
      />
      <p className="text-xs font-medium">{skin.name}</p>
      <p className="text-[11px] text-muted">{skin.xp_cost > 0 ? `${skin.xp_cost} XP` : "zadarmo"}</p>
      {active ? (
        <span className="rounded-full bg-green/15 py-1 text-center text-xs text-green">aktívny</span>
      ) : owned ? (
        <button
          disabled={pending}
          onClick={() => startTransition(async () => { await activateSkin(skin.slug); })}
          className="rounded-full border border-line py-1 text-xs hover:bg-card"
        >
          Aktivovať
        </button>
      ) : (
        <button
          disabled={pending || myXp < skin.xp_cost}
          onClick={() => startTransition(async () => { await buySkin(skin.slug); })}
          className="rounded-full bg-green py-1 text-xs font-medium text-ink disabled:opacity-40"
        >
          Kúpiť
        </button>
      )}
    </div>
  );
}
