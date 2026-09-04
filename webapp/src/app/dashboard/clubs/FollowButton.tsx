"use client";

import { useTransition } from "react";
import { toggleFollow } from "./actions";

export function FollowButton({
  clubId,
  slug,
  following,
}: {
  clubId: string;
  slug: string;
  following: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleFollow(clubId, slug))}
      disabled={pending}
      className={
        "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors disabled:opacity-60 " +
        (following
          ? "border-green bg-green/10 text-green"
          : "border-line text-muted hover:bg-card")
      }
    >
      {following ? "Sledujem" : "Sledovať"}
    </button>
  );
}
