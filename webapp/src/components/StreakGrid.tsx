const DAYS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

export type StreakDay = {
  label: string;
  status: "present" | "today" | "upcoming" | "missed";
};

/**
 * Týždenný streak grid (Section 1, docs/features.md) — zelený plamienok za odtrénovaný deň,
 * zlatá bodka pre dnešný tréning, sivá pre budúce/žiadne tréningy.
 */
export function StreakGrid({
  days,
  currentStreak,
}: {
  days: StreakDay[];
  currentStreak: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium text-zinc-200">Tréningový streak</h2>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-fynd-green">
          🔥 {currentStreak} {currentStreak === 1 ? "deň" : "dní"}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-xs text-zinc-500">{DAYS[i]}</span>
            <div
              className={
                "flex h-9 w-9 items-center justify-center rounded-full text-sm " +
                (day.status === "present"
                  ? "bg-fynd-green/20 text-fynd-green"
                  : day.status === "today"
                    ? "border-2 border-amber-400 text-amber-400"
                    : day.status === "missed"
                      ? "bg-white/5 text-zinc-600"
                      : "border border-dashed border-white/10 text-zinc-700")
              }
            >
              {day.status === "present" ? "🔥" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
