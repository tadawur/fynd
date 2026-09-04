import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StreakGrid, type StreakDay } from "@/components/StreakGrid";
import { logout } from "./actions";

// Placeholder týždenný streak, kým nie je napojená reálna dochádzka z public.training_attendance.
const PLACEHOLDER_WEEK: StreakDay[] = [
  { label: "Po", status: "present" },
  { label: "Ut", status: "present" },
  { label: "St", status: "missed" },
  { label: "Št", status: "present" },
  { label: "Pi", status: "today" },
  { label: "So", status: "upcoming" },
  { label: "Ne", status: "upcoming" },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, xp, level, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">Vitaj späť,</p>
          <h1 className="text-2xl font-semibold">
            {profile?.full_name || user.email}
          </h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Odhlásiť sa
          </button>
        </form>
      </header>

      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fynd-navy ring-1 ring-white/10">
          <div className="h-2.5 w-6 rounded-full bg-fynd-green" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-zinc-400">
            Level {profile?.level ?? 1} · {profile?.xp ?? 0} XP
          </p>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-fynd-green"
              style={{ width: `${Math.min(((profile?.xp ?? 0) % 500) / 5, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <StreakGrid days={PLACEHOLDER_WEEK} currentStreak={3} />

      <div className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-zinc-500">
        Ďalšie F1 časti (kluby, kategórie, kalendár tréningov, chat, oznamy)
        pribudnú v ďalších iteráciách — pozri TASKS.md.
      </div>
    </div>
  );
}
