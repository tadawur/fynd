"use client";

import { useActionState } from "react";
import { updateProfile, type FormState } from "./actions";

const initialState: FormState = { error: null };

export function ProfileEditForm({
  fullName,
  bio,
  kitColor,
  instagram,
  visibility,
}: {
  fullName: string;
  bio: string;
  kitColor: string;
  instagram: string;
  visibility: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="mb-3 font-medium">Upraviť profil</h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted">Meno a priezvisko</label>
          <input
            name="full_name"
            defaultValue={fullName}
            required
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted">Bio</label>
          <textarea
            name="bio"
            defaultValue={bio}
            rows={2}
            maxLength={280}
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm text-muted">Farba dresu</label>
            <input
              type="color"
              name="kit_color"
              defaultValue={kitColor}
              className="h-10 w-full rounded-lg border border-line bg-card"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-sm text-muted">Instagram</label>
            <input
              name="instagram"
              defaultValue={instagram}
              placeholder="bez @"
              className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted">Viditeľnosť na rebríčkoch</label>
          <select
            name="leaderboard_visibility"
            defaultValue={visibility}
            className="rounded-lg border border-line bg-card px-3 py-2 outline-none focus:border-green"
          >
            <option value="public">Verejné (klub + región + Slovensko)</option>
            <option value="club_only">Len klub</option>
          </select>
        </div>

        {state.error && <p className="text-sm text-coral">{state.error}</p>}
        {state.success && <p className="text-sm text-green">Uložené ✅</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full bg-green px-5 py-2 text-sm font-medium text-ink hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Ukladám..." : "Uložiť zmeny"}
        </button>
      </div>
    </form>
  );
}
