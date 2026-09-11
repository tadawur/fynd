"use client";

import { useActionState } from "react";
import { SEASONS, type SeasonKey } from "@/lib/fynd/season";
import { updateSeasonTheme, type SeasonFormState } from "./actions";

const initialState: SeasonFormState = { error: null };

export function SeasonThemeForm({ current }: { current: SeasonKey }) {
  const [state, formAction, pending] = useActionState(updateSeasonTheme, initialState);
  const active = state.season ?? current;

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {SEASONS.map((s) => {
        const isActive = active === s.key;
        return (
          <button
            key={s.key}
            type="submit"
            name="season"
            value={s.key}
            disabled={pending}
            className={
              "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors disabled:opacity-60 " +
              (isActive
                ? "border-green bg-green/10"
                : "border-line bg-card hover:bg-card/70")
            }
          >
            <span className="text-2xl">{s.emoji}</span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-fg">{s.label}</span>
              <span className="mt-1 flex gap-1">
                {s.swatch.map((c, i) => (
                  <span
                    key={i}
                    className="h-2.5 w-6 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </span>
            </span>
            {isActive && <span className="text-xs font-medium text-green">Aktívna</span>}
          </button>
        );
      })}
      {state.error && <p className="col-span-full text-sm text-coral">{state.error}</p>}
    </form>
  );
}
