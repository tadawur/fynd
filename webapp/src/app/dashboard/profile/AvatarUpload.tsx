"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/Avatar";
import { savePhotoUrl } from "./actions";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export function AvatarUpload({
  userId,
  level,
  kitColor,
  name,
  initialPhotoUrl,
}: {
  userId: string;
  level: number;
  kitColor: string;
  name: string;
  initialPhotoUrl: string | null;
}) {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!ALLOWED.includes(file.type)) {
      setError("Podporované sú len JPG, PNG alebo WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Fotka môže mať maximálne 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, cacheControl: "3600" });

      if (uploadError) {
        setError("Nahranie sa nepodarilo, skús to prosím znova.");
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const bustedUrl = `${data.publicUrl}?v=${Date.now()}`;
      setPhotoUrl(bustedUrl);

      startTransition(async () => {
        await savePhotoUrl(bustedUrl);
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar
        level={level}
        kitColor={kitColor}
        photoUrl={photoUrl}
        name={name}
        size={64}
        showFrame
      />
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || pending}
          className="rounded-full border border-line px-4 py-2 text-sm text-fg hover:bg-card disabled:opacity-60"
        >
          {uploading ? "Nahrávam..." : "Nahrať fotku"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <p className="text-xs text-muted">JPG, PNG alebo WebP, max 5 MB.</p>
        {error && <p className="text-xs text-coral">{error}</p>}
      </div>
    </div>
  );
}
