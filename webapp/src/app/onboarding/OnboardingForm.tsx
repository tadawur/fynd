"use client";

import { useActionState, useState } from "react";
import { completeOnboarding, type OnboardingState } from "./actions";

type Club = { id: string; name: string; region: string | null };
type Category = { id: string; name: string; club_id: string };

const ROLE_OPTIONS: { value: string; label: string; needsCategory: boolean }[] = [
  { value: "player", label: "Hráč", needsCategory: true },
  { value: "parent", label: "Rodič", needsCategory: true },
  { value: "coach", label: "Tréner", needsCategory: true },
  { value: "club_admin", label: "Klubový admin", needsCategory: false },
  { value: "photographer", label: "Fotograf", needsCategory: false },
  { value: "designer", label: "Grafik", needsCategory: false },
];

const initialState: OnboardingState = { error: null };

export function OnboardingForm({ clubs, categories }: { clubs: Club[]; categories: Category[] }) {
  const [state, formAction, pending] = useActionState(completeOnboarding, initialState);
  const [role, setRole] = useState("player");
  const [clubId, setClubId] = useState(clubs[0]?.id ?? "");

  const roleMeta = ROLE_OPTIONS.find((r) => r.value === role)!;
  const clubCategories = categories.filter((c) => c.club_id === clubId);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted">Tvoja rola</span>
        <div className="grid grid-cols-2 gap-2">
          {ROLE_OPTIONS.map((r) => (
            <label
              key={r.value}
              className={
                "cursor-pointer rounded-xl border px-3 py-2.5 text-sm transition-colors " +
                (role === r.value
                  ? "border-green bg-green/10 text-fg"
                  : "border-line text-muted hover:bg-card")
              }
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="club_id" className="text-sm text-muted">
          Klub
        </label>
        <select
          id="club_id"
          name="club_id"
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
          className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
        >
          {clubs.length === 0 && <option value="">Zatiaľ žiadne kluby</option>}
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.region ? ` — ${c.region}` : ""}
            </option>
          ))}
        </select>
      </div>

      {roleMeta.needsCategory && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category_id" className="text-sm text-muted">
            Kategória
          </label>
          <select
            id="category_id"
            name="category_id"
            required
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
          >
            <option value="">Vyber kategóriu</option>
            {clubCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {(role === "player" || role === "parent") && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="birth_date" className="text-sm text-muted">
            {role === "player" ? "Dátum narodenia hráča" : "Dátum narodenia dieťaťa"}{" "}
            <span className="text-muted/70">(voliteľné, pre vekové kategórie)</span>
          </label>
          <input
            id="birth_date"
            name="birth_date"
            type="date"
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
          />
        </div>
      )}

      {state.error && <p className="text-sm text-coral">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || !clubId}
        className="mt-2 rounded-full bg-green px-6 py-2.5 font-medium text-ink transition-colors hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Ukladám..." : "Vstúpiť do Fynd"}
      </button>
    </form>
  );
}
