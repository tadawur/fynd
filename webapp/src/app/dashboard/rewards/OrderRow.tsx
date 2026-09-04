"use client";

import { useTransition } from "react";
import { resolveOrder } from "./actions";

export function OrderRow({
  orderId,
  playerName,
  itemName,
  xpCost,
}: {
  orderId: string;
  playerName: string;
  itemName: string;
  xpCost: number;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between text-sm">
      <span>
        {playerName} — {itemName} ({xpCost} XP)
      </span>
      <div className="flex gap-2">
        <button
          disabled={pending}
          onClick={() => startTransition(async () => { await resolveOrder(orderId, true); })}
          className="rounded-full border border-green px-3 py-1 text-xs text-green disabled:opacity-40"
        >
          Schváliť
        </button>
        <button
          disabled={pending}
          onClick={() => startTransition(async () => { await resolveOrder(orderId, false); })}
          className="rounded-full border border-coral px-3 py-1 text-xs text-coral disabled:opacity-40"
        >
          Zamietnuť
        </button>
      </div>
    </div>
  );
}
