import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase klient pre použitie v Client Components ("use client").
 * Číta verejné env premenné — bezpečné pre browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
