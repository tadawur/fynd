"use client";

import { useState, useTransition } from "react";
import { rate } from "./actions";

export function StarPicker({
  matchId,
  targetId,
  targetType,
  name,
  initialStars,
}: {
  matchId: string;
  targetId: string;
  targetType: string;
  name: string;
  initialStars: number;
}) {
  const [stars, setStars] = useState(initialStars);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between text-sm">
      <span>{name}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setStars(n);
                await rate(matchId, targetId, targetType, n);
              })
            }
            className={"text-lg " + (n <= stars ? "text-gold" : "text-line")}
            aria-label={`${n} hviezdičiek`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
