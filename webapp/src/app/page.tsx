import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fynd-navy ring-1 ring-white/10">
          <div className="h-3 w-8 rounded-full bg-fynd-green" />
        </div>
        <span className="text-2xl font-semibold tracking-tight">Fynd</span>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Beyond the Score
        </h1>
        <p className="max-w-md text-zinc-400">
          Tréningové streaky, XP, live výsledky a klubový chat — jedno miesto
          pre hráčov, trénerov, rodičov aj kluby.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/register"
          className="rounded-full bg-fynd-green px-6 py-3 font-medium text-zinc-950 transition-colors hover:brightness-110"
        >
          Zaregistrovať sa
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-white/15 px-6 py-3 font-medium text-zinc-100 transition-colors hover:bg-white/5"
        >
          Prihlásiť sa
        </Link>
      </div>
    </div>
  );
}
