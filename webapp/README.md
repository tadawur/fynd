# Fynd — webapp (F1–F3 postavené, F4 Sportnet fallback)

PWA appka postavená na **Next.js 16** (App Router, TypeScript, Tailwind CSS 4) a **Supabase**
(Postgres + Auth + Realtime), podľa [`docs/tech-stack.md`](../docs/tech-stack.md) a
[`docs/roadmap.md`](../docs/roadmap.md).

## Stav

Podrobný, priebežne aktualizovaný rozpis (čo je hotovo/zjednodušené/nezačaté, feature po feature) je v
[`../TASKS.md`](../TASKS.md) — toto je len rýchly prehľad:

- Registrácia, prihlásenie, onboarding (rola, klub, kategória)
- Responzívny app shell (desktop sidebar + mobilná spodná lišta)
- Profil, XP/level/odznaky, kluby (adresár + sledovanie), kalendár + dochádzka (reálny streak),
  realtime chat (vrátane U9 child-safety pravidla presadeného v RLS), oznamy, Odmeňovňa + skiny,
  rebríčky (3 úrovne × 6 dimenzií), zápasy + live ticker (manuálny "Coach input" vstup — Sportnet
  fallback), pozápasové hodnotenia, notifikačné centrum, straty a nálezy, informačná `/pricing`
- Databázová schéma: [`../supabase/schema.sql`](../supabase/schema.sql) →
  [`../supabase/schema_v2.sql`](../supabase/schema_v2.sql) →
  [`../supabase/schema_v3.sql`](../supabase/schema_v3.sql) (spusti v tomto poradí)
- PWA základ: manifest, ikony (placeholder), jednoduchý service worker (offline app shell)

Zámerne nezapojené (chýbajú credentials, nie je to mock): skutočný Sportnet API, skutočné push
notifikácie (FCM/APNs), platobný spracovateľ pre Fynd+. Pozri `TASKS.md` pre presný rozsah.

Zámerne inak než pôvodný `docs/tech-stack.md`: Next.js namiesto Vite (rozhodnutie z otázok pri
zakladaní appky), a ručný `public/sw.js` namiesto next-pwa balíka — Next.js 16 defaultne buildí cez
Turbopack a next-pwa (webpack-based) s ním koliduje. Balík `@ducanh2912/next-pwa` ostáva zatiaľ
v `package.json` nepoužitý (odstránenie cez `npm uninstall` zlyhávalo v tomto vývojovom prostredí —
skús to priamo vo svojom Termináli, malo by to prejsť bez problémov).

## Lokálny beh

1. Vytvor si projekt na [supabase.com](https://supabase.com/dashboard) (free tier stačí na MVP).
2. V Supabase SQL Editore spusti **v tomto poradí**: [`../supabase/schema.sql`](../supabase/schema.sql) →
   [`../supabase/schema_v2.sql`](../supabase/schema_v2.sql) →
   [`../supabase/schema_v3.sql`](../supabase/schema_v3.sql).
3. `cp .env.local.example .env.local` a doplň `NEXT_PUBLIC_SUPABASE_URL` a
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API).
4. `npm install` (ak si `node_modules` nemal/a už predtým).
5. `npm run dev` a otvor `http://localhost:3000`.

## Skripty

- `npm run dev` — vývojový server
- `npm run build` — produkčný build (`npx tsc --noEmit` a `npm run lint` overené čisto; samotný
  `npm run build` over si vo vlastnom Termináli — vývojové prostredie, v ktorom appka vznikla, beží na
  Linuxe bez prístupu na npm registry na stiahnutie natívnej `@next/swc-linux-*` binárky)
- `npm run lint` — ESLint

## Ďalšie kroky

Pozri [`../TASKS.md`](../TASKS.md) — rozpis zvyšku F1 (kluby/kategórie, kalendár, chat, oznamy)
a F2+ podľa `docs/roadmap.md`.
