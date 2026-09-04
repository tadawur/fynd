"use client";

import { useRef, useState, useTransition } from "react";
import { postMessage } from "../actions";

export function MessageForm({ itemId }: { itemId: string }) {
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const v = value;
        setValue("");
        startTransition(() => postMessage(itemId, v));
      }}
      className="mt-3 flex gap-2"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Napíš správu..."
        className="flex-1 rounded-full border border-line bg-card px-4 py-2 text-sm outline-none focus:border-green"
      />
      <button
        type="submit"
        disabled={pending || !value.trim()}
        className="rounded-full bg-green px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
      >
        Poslať
      </button>
    </form>
  );
}
