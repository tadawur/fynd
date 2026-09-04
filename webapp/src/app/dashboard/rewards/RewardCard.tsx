"use client";

import { useState, useTransition } from "react";
import { redeemReward } from "./actions";

type Item = { id: string; name: string; xp_cost: number; min_level: number };

export function RewardCard({ item, myXp, myLevel }: { item: Item; myXp: number; myLevel: number }) {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const affordable = myXp >= item.xp_cost && myLevel >= item.min_level;

  return (
    <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-xs text-muted">
          {item.xp_cost} XP{item.min_level > 1 ? ` · min. level ${item.min_level}` : ""}
        </p>
        {msg && <p className="text-xs text-gold">{msg}</p>}
      </div>
      <button
        disabled={!affordable || pending}
        onClick={() =>
          startTransition(async () => {
            const { error } = await redeemReward(item.id);
            setMsg(error ? "Chyba pri objednávke" : "Objednané ✅");
          })
        }
        className="shrink-0 rounded-full bg-green px-4 py-1.5 text-sm font-medium text-ink disabled:opacity-40"
      >
        {affordable ? "Vymeniť" : "Nedostatok XP"}
      </button>
    </div>
  );
}
