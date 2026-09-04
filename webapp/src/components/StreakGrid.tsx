const DAYS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

export type StreakDay = {
  label: string;
  status: "present" | "today" | "upcoming" | "missed" | "none";
};

/**
 * Týždenný streak grid — zelený plamienok za odtrénovaný deň, zlatý rámik pre dnešný
 * tréning, koralová/sivá pre vynechaný, bodkovaná pre budúci/žiadny tréning daný deň.
 */
export function StreakGrid({
  days,
  currentStreak,
}: {
  days: StreakDay[];
  currentStreak: number;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium text-fg">Tréningový streak</h2>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-gold">
          🔥 {currentStreak} {currentStreak === 1 ? "deň" : "dní"}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-xs text-muted">{DAYS[i]}</span>
            <div
              className={
                "flex h-9 w-9 items-center justify-center rounded-full text-sm " +
                (day.status === "present"
                  ? "bg-green/20 text-green"
                  : day.status === "today"
                    ? "border-2 border-gold text-gold"
                    : day.status === "missed"
                      ? "bg-coral/10 text-coral"
                      : "border border-dashed border-line text-muted")
              }
            >
              {day.status === "present" ? "🔥" : day.status === "missed" ? "·" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
