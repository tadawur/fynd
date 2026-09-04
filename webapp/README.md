# Fynd — webapp (F1 Core MVP)

PWA appka postavená na **Next.js 16** (App Router, TypeScript, Tailwind CSS 4) a **Supabase**
(Postgres + Auth), podľa [`docs/tech-stack.md`](../docs/tech-stack.md) a [`docs/roadmap.md`](../docs/roadmap.md).

## Stav (F1 — Core MVP)

Hotovo v tejto iterácii:
- Next.js scaffold (TypeScript, Tailwind, App Router)
- Supabase Auth: registrácia + prihlásenie (email/heslo), potvrdzovací e-mail, ochrana `/dashboard`
- Databázová schéma pre F1 ([`../supabase/schema.sql`](../supabase/schema.sql)): profily, kluby,
  kategórie, členstvá, tréningy, dochádzka, XP ledger, chat, oznamy + RLS politiky
- Základný profil hráča a týždenný streak grid (zatiaľ s ukážkovými/placeholder dátami —
  napojenie na reálnu dochádzku je ďalší krok, pozri [`../TASKS.md`](../TASKS.md))
- PWA základ: manifest, ikony (placeholder), jednoduchý service worker (offline app shell)

Zámerne inak než pôvodný `docs/tech-stack.md`: Next.js namiesto Vite (rozhodnutie z otázok pri
zakladaní appky), a ručný `public/sw.js` namiesto next-pwa balíka — Next.js 16 defaultne buildí cez
Turbopack a next-pwa (webpack-based) s ním koliduje. Balík `@ducanh2912/next-pwa` ostáva zatiaľ
v `package.json` nepoužitý (odstránenie cez `npm uninstall` zlyhávalo v tomto vývojovom prostredí —
skús to priamo vo svojom Termináli, malo by to prejsť bez problémov).

## Lokálny beh

1. Vytvor si projekt na [supabase.com](https://supabase.com/dashboard) (free tier stačí na MVP).
2. V Supabase SQL Editore spusti [`../supabase/schema.sql`](../supabase/schema.sql).
3. `cp .env.local.example .env.local` a doplň `NEXT_PUBLIC_SUPABASE_URL` a
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API).
4. `npm install` (ak si `node_modules` nemal/a už predtým).
5. `npm run dev` a otvor `http://localhost:3000`.

## Skripty

- `npm run dev` — vývojový server
- `npm run build` — produkčný build (overené, prechádza čisto)
- `npm run lint` — ESLint

## Ďalšie kroky

Pozri [`../TASKS.md`](../TASKS.md) — rozpis zvyšku F1 (kluby/kategórie, kalendár, chat, oznamy)
a F2+ podľa `docs/roadmap.md`.
