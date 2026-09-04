"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthFormState } from "./actions";

const initialState: AuthFormState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-semibold">Prihlásenie</h1>
        <p className="mb-8 text-sm text-zinc-400">
          Vitaj späť vo Fynd komunite.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
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
              autoComplete="current-password"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-fynd-green"
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-fynd-green px-6 py-2.5 font-medium text-zinc-950 transition-colors hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Prihlasujem..." : "Prihlásiť sa"}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-400">
          Nemáš účet?{" "}
          <Link href="/register" className="text-fynd-green hover:underline">
            Zaregistruj sa
          </Link>
        </p>
      </div>
    </div>
  );
}
