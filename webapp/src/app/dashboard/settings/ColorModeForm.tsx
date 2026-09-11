"use client";

import { useActionState } from "react";
import { COLOR_MODES, type ColorMode } from "@/lib/fynd/mode";
import { updateColorMode, type ModeFormState } from "./actions";

const initialState: ModeFormState = { error: null };

export function ColorModeForm({ current }: { current: ColorMode }) {
  const [state, formAction, pending] = useActionState(updateColorMode, initialState);
  const active = state.mode ?? current;

  return (
    <form action={formAction} className="grid grid-cols-2 gap-3">
      {COLOR_MODES.map((m) => {
        const isActive = active === m.key;
        return (
          <button
            key={m.key}
            type="submit"
            name="mode"
            value={m.key}
            disabled={pending}
            className={
              "flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors disabled:opacity-60 " +
              (isActive
                ? "border-green bg-green/10 text-fg"
                : "border-line bg-card text-muted hover:bg-card/70")
            }
          >
            <span className="text-lg">{m.emoji}</span>
            {m.label}
          </button>
        );
      })}
      {state.error && <p className="col-span-full text-sm text-coral">{state.error}</p>}
    </form>
  );
}
