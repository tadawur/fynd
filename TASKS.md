# TASKS — Fynd

Priebežný stav implementácie appky (`webapp/`), naviazaný na fázy z [`docs/roadmap.md`](docs/roadmap.md).
`docs/roadmap.md` zostáva zdrojom pravdy pre **produktový** rozsah a poradie fáz; tento súbor sleduje
**technický** stav — čo je hotovo, rozrobené a čo je ďalší krok. Aktualizuje sa priebežne pri každej
väčšej zmene v `webapp/`.

Legenda: ✅ hotovo · 🔶 rozrobené / čiastočné · ⬜ nezačaté

---

## Phase 1 — Core MVP

### Infraštruktúra appky
- ✅ Next.js 16 (TypeScript, Tailwind CSS 4, App Router) scaffold — `webapp/`
- ✅ Supabase klient (browser + server + proxy/middleware session refresh)
- ✅ Databázová schéma F1 — `supabase/schema.sql` (profiles, clubs, categories,
  club_memberships, trainings, training_attendance, xp_events, chat_channels,
  chat_messages, announcements) + RLS politiky (MVP baseline)
- ✅ PWA základ — manifest, placeholder ikony, ručný service worker (`public/sw.js`)
- ✅ Build a lint overené (`npm run build`, `npm run lint` prechádzajú čisto)
- ⬜ Nasadenie (Vercel/Netlify) — zatiaľ len lokálny beh

### Registrácia a prihlásenie
- ✅ Registrácia e-mailom + heslom (Supabase Auth, potvrdzovací e-mail)
- ✅ Prihlásenie e-mailom + heslom
- ✅ Ochrana `/dashboard` cez proxy (presmerovanie neprihláseného na `/login`)
- ⬜ Prihlásenie cez Google (Supabase Google OAuth provider)
- ⬜ Onboarding flow po registrácii (výber role, pripojenie ku klubu/kategórii)

### Profil hráča
- 🔶 Základná stránka profilu (`/dashboard`) — meno, XP/level bar
- ⬜ Avatar (SVG, customizovateľný — vlasy, farba dresu, pleť)
- ⬜ Viacero animovaných pozadí profilu
- ⬜ Napojenie XP/level na reálne dáta (`profiles.xp`/`profiles.level`, `xp_events` ledger)

### Kluby a kategórie
- ⬜ UI pre založenie klubu a kategórií (zatiaľ len DB schéma)
- ⬜ Priradenie hráča/trénera/rodiča ku klubu a kategórii (`club_memberships`)
- ⬜ Klubový adresár (club discovery, Section 10 v `docs/features.md`)

### Skupinové chaty
- ⬜ Chat UI naviazaný na `chat_channels`/`chat_messages` (kategóriové zamknutie)

### Kalendár tréningov
- ⬜ Mesačný kalendár (`trainings`), tvorba tréningu trénerom
- ⬜ Konfigurovateľné notifikácie (deň tréningu, X dní vopred)

### Dochádzka a streak
- 🔶 Streak grid komponent (`StreakGrid.tsx`) — zatiaľ len s placeholder dátami
- ⬜ Označovanie dochádzky trénerom (`training_attendance`)
- ⬜ Výpočet reálneho streaku z dochádzky (nahradiť placeholder v `dashboard/page.tsx`)

### Oznamy
- ⬜ Broadcast oznamov (kategória / celý klub) — `announcements`

### Push notifikácie
- ⬜ Firebase Cloud Messaging integrácia (zmeny tréningov)

---

## Phase 2–6

Zatiaľ nezačaté — pozri [`docs/roadmap.md`](docs/roadmap.md) pre plný rozsah (XP systém a Odmeňovňa,
live ticker, Sportnet integrácia, národná škála, Fynd Network).

---

## Rozhodnutia (technický decision log)

- **Next.js namiesto Vite** (odklon od pôvodného `docs/tech-stack.md`) — rozhodnuté pri zakladaní appky.
- **Supabase** ako backend (Postgres + Auth) — odporúčanie z `docs/tech-stack.md` pre rýchlejší MVP.
- **Ručný service worker namiesto next-pwa** — Next.js 16 defaultne buildí cez Turbopack, next-pwa
  (webpack-based) s ním koliduje. `@ducanh2912/next-pwa` ostáva v `package.json` nepoužitý; odstrániť
  cez `npm uninstall` priamo v Termináli (v tomto vývojovom prostredí to zlyhávalo na súborovom systéme).
- **Systémový font stack namiesto Google Fonts (`next/font/google`)** — build prostredie nemalo prístup
  na `fonts.googleapis.com`; systémové fonty navyše nepotrebujú sieť pri prvom načítaní (dobré pre PWA).
- **Placeholder ikony/maskota** (`public/icons/`) — jednoduché tvary v Fynd farbách (tmavomodrá +
  zelený vizor), nahradiť skutočným Futbot maskotom (`docs/branding.md`) keď bude k dispozícii.

---

*Posledná aktualizácia: 2026-09-04*
