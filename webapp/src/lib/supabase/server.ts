import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase klient pre použitie v Server Components, Server Actions a Route Handlers.
 * Musí sa volať vždy nanovo v rámci requestu (nikdy nezdieľať/cachovať globálne).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll volané zo Server Component bez middleware refreshu — bezpečné ignorovať,
            // pokiaľ middleware.ts obnovuje session.
          }
        },
      },
    }
  );
}
