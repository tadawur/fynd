"use client";

import { useState, useTransition } from "react";
import { markAttendance } from "../actions";

const OPTIONS: { value: string; label: string }[] = [
  { value: "present", label: "✅" },
  { value: "absent", label: "❌" },
  { value: "excused", label: "🟡" },
];

export function AttendanceRow({
  trainingId,
  profileId,
  name,
  initialStatus,
}: {
  trainingId: string;
  profileId: string;
  name: string;
  initialStatus: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between text-sm">
      <span>{name}</span>
      <div className="flex gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setStatus(o.value);
                await markAttendance(trainingId, profileId, o.value);
              })
            }
            className={
              "flex h-8 w-8 items-center justify-center rounded-full border transition-colors disabled:opacity-50 " +
              (status === o.value ? "border-green bg-green/15" : "border-line hover:bg-card")
            }
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
