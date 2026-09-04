"use client";

import { useState, useTransition } from "react";
import { setLineup } from "../actions";

export function LineupPicker({
  matchId,
  roster,
  currentLineup,
}: {
  matchId: string;
  roster: { profileId: string; name: string }[];
  currentLineup: string[];
}) {
  const [selected, setSelected] = useState<string[]>(currentLineup);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="mb-3 font-medium">Zostava</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {roster.map((r) => (
          <label key={r.profileId} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(r.profileId)}
              onChange={(e) =>
                setSelected((prev) =>
                  e.target.checked ? [...prev, r.profileId] : prev.filter((id) => id !== r.profileId)
                )
              }
              className="h-4 w-4 accent-green"
            />
            {r.name}
          </label>
        ))}
      </div>
      <button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await setLineup(matchId, selected);
            setSaved(true);
          })
        }
        className="mt-4 rounded-full bg-green px-5 py-2 text-sm font-medium text-ink disabled:opacity-60"
      >
        {pending ? "Ukladám..." : "Uložiť zostavu"}
      </button>
      {saved && <span className="ml-3 text-sm text-green">Uložené ✅</span>}
    </div>
  );
}
