"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type AuthFormState } from "./actions";

const initialState: AuthFormState = { error: null };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-semibold">Registrácia</h1>
        <p className="mb-8 text-sm text-zinc-400">
          Vytvor si Fynd profil hráča, trénera alebo rodiča.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-sm text-zinc-300">
              Meno a priezvisko
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-fynd-green"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-zinc-300">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-fynd-green"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-zinc-300">
              Heslo
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-fynd-green"
            />
            <span className="text-xs text-zinc-500">Aspoň 8 znakov.</span>
          </div>

          {state.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-fynd-green px-6 py-2.5 font-medium text-zinc-950 transition-colors hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Registrujem..." : "Zaregistrovať sa"}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-400">
          Už máš účet?{" "}
          <Link href="/login" className="text-fynd-green hover:underline">
            Prihlás sa
          </Link>
        </p>
      </div>
    </div>
  );
}
