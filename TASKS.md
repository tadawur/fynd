# TASKS — Fynd

Priebežný stav implementácie appky (`webapp/`), naviazaný na fázy z [`docs/roadmap.md`](docs/roadmap.md).
`docs/roadmap.md` zostáva zdrojom pravdy pre **produktový** rozsah a poradie fáz; tento súbor sleduje
**technický** stav — čo je hotovo, rozrobené a čo je ďalší krok. Aktualizuje sa priebežne pri každej
väčšej zmene v `webapp/`.

Legenda: ✅ hotovo · 🔶 rozrobené / čiastočné / zjednodušené · ⬜ nezačaté

---

## Ako appku spustiť po tejto aktualizácii

1. V Supabase SQL Editore, **v tomto poradí**, spusti (ak si ešte nespúšťal): `supabase/schema.sql` →
   `supabase/schema_v2.sql` → **`supabase/schema_v3.sql`** (nový — doplnkové RLS politiky, kategóriové
   chat oprávnenia vrátane U9 pravidla, realtime pre chat/zápasy, seed dát pre MFK Nová Baňa).
2. `cd webapp && rm -rf node_modules && npm install && npm run build` vo vlastnom Termináli (macOS) —
   toto vývojové prostredie beží v Linux sandboxe bez prístupu na npm registry, takže **produkčný
   `npm run build` sa tu nedal overiť** (pozri "Overenie" nižšie). `npx tsc --noEmit` a `npm run lint`
   prešli čisto.
3. `npm run dev` a over si appku ako viacero rolí (hráč, tréner, rodič) — MFK Nová Baňa je preddefinovaný
   klub s 6 kategóriami a pár odmenami v Odmeňovni.

---

## Phase 1 — Core MVP

### Infraštruktúra appky
- ✅ Next.js 16 (TypeScript, Tailwind CSS 4, App Router) scaffold — `webapp/`
- ✅ Supabase klient (browser + server + proxy/middleware session refresh)
- ✅ Databázová schéma — `supabase/schema.sql` + `schema_v2.sql` + `schema_v3.sql`
- ✅ Fynd brand farebná paleta aplikovaná (`docs/branding.md`) — `globals.css` (ink/surface/card/
  green/gold/coral/text/muted), systémový font stack (Space Grotesk/Nunito nie sú lokálne dostupné,
  fallback na systémové fonty ostáva zámerný, pozri "Rozhodnutia")
- ✅ Responzívny app shell — desktop bočný panel (`Sidebar.tsx`) + mobilná spodná lišta
  (`BottomNav.tsx`), zdieľaná navigácia (`nav-items.ts`)
- ✅ PWA základ — manifest, placeholder ikony, ručný service worker (`public/sw.js`)
- 🔶 Build overenie: `npx tsc --noEmit` a `npm run lint` prechádzajú čisto v tomto prostredí; plný
  `npm run build` NEBOL overený tu (sandbox je Linux, `node_modules` má natívne binárky pre macOS z
  predošlého `npm install` na tvojom Macu → over `npm run build` priamo u seba)
- ⬜ Nasadenie (Vercel/Netlify) — zatiaľ len lokálny beh

### Registrácia, prihlásenie, onboarding
- ✅ Registrácia e-mailom + heslom (Supabase Auth, potvrdzovací e-mail)
- ✅ Prihlásenie e-mailom + heslom
- ✅ Ochrana `/dashboard` a `/onboarding` cez proxy (presmerovanie neprihláseného na `/login`)
- ✅ Onboarding flow (`/onboarding`) — výber role, výber klubu, výber kategórie, voliteľný dátum
  narodenia; zapisuje `club_memberships` + automaticky nastaví sledovanie vlastného klubu
  (`club_follows`) s predvolenými notifikáciami
- ⬜ Prihlásenie cez Google (Supabase Google OAuth provider)

### Profil hráča
- ✅ `/dashboard/profile` — meno, level/XP, bio, farba dresu, Instagram handle, viditeľnosť na
  rebríčkoch, odznaky (grid), sezónne štatistiky (tréningy, góly, priemerné hodnotenie)
- ✅ Reálne XP/level napojenie (`profiles.xp`/`level`, `lib/fynd/xp.ts` zrkadlí SQL prahy)
- 🔶 Avatar je zatiaľ len farba dresu (`avatar_config.kit_color`) + skin pozadie z Odmeňovne —
  plnohodnotný SVG avatar (vlasy, pleť, doplnky) nie je implementovaný
- ⬜ Fotka profilu (upload cez Supabase Storage)

### Kluby a kategórie
- ✅ Klubový adresár (`/dashboard/clubs`) — zoznam, sledovanie (follow/unfollow)
- ✅ Detail klubu (`/dashboard/clubs/[slug]`) — kategórie, posledné/nadchádzajúce zápasy, per-klub
  notifikačné nastavenia (docs/notifications.md)
- ✅ Seed dát: MFK Nová Baňa + 6 kategórií (A-mužstvo, U19, U15, U13, U11, U9) — `schema_v2.sql`
- ⬜ UI pre klubového admina na založenie nového klubu (zatiaľ len cez SQL seed)

### Skupinové chaty
- ✅ Realtime chat (`/dashboard/chat`) naviazaný na `chat_channels`/`chat_messages`
- ✅ Kategóriové zamknutie + **U9 — Najmladší: hráči nemajú priamy prístup** (child-safety pravidlo z
  `docs/chat-permissions.md`), presadené v RLS (`can_access_chat_channel()` v `schema_v3.sql`), nie len
  v UI
- ✅ Interný trénerský kanál (`kind='coaches'`)
- 🔶 Zjednodušenia oproti docs: nie je "Management"/"Marketing" rola v DB enume (len `club_admin`
  substituuje), cross-category broadcast rieši Oznamy (nie chat), pripínanie správ a 12-mesačné
  úložisko médií nie je implementované (chat zatiaľ len textový)

### Kalendár tréningov a dochádzka
- ✅ `/dashboard/calendar` — zoznam nadchádzajúcich/nedávnych tréningov, tréner/admin vytvára nový
  tréning
- ✅ Označovanie dochádzky trénerom (`/dashboard/calendar/[id]`, `mark_attendance` RPC) → automaticky
  XP (+10), streak bonus (+50 každých 7 tréningov), odznaky (Prvý krok, Týždenný/Mesačný streak,
  Pravidelník)
- ✅ Reálny `StreakGrid` na `/dashboard` (nahradený placeholder) + `current_streak` RPC
- ✅ "Zmena tréningu" notifikácia vždy zapnutá pri vytvorení/zmene tréningu (posiela sa všetkým v
  kategórii, `docs/notifications.md`)
- ⬜ Editácia/zrušenie existujúceho tréningu (zatiaľ len vytvorenie)
- ⬜ Opakujúce sa tréningové šablóny (Fynd+ Tréner feature, zámerne mimo MVP)

### Oznamy
- ✅ `/dashboard/announcements` — broadcast do jednej/viacerých kategórií alebo celého klubu,
  automatická notifikácia príjemcom

### XP, levely, odznaky, Odmeňovňa
- ✅ Plný XP ledger (`xp_events`) + automatický prepočet `profiles.xp`/`level` cez trigger
- ✅ Levely a prahy presne podľa `docs/xp-system.md` (`level_for_xp`, `level_name`)
- ✅ Odznaky: automaticky sa udeľujú za streak (Prvý krok, Týždenný/Mesačný streak, Pravidelník) a za
  góly (Strelec, Hetrik hrdina, Snajper) — zvyšné odznaky z `docs/xp-system.md` (Kapitán, Hrdina sezóny,
  Železný muž, Objaviteľ, Sociálny hráč) nemajú zatiaľ automatický trigger, len existujú v katalógu
- ✅ Odmeňovňa (`/dashboard/rewards`) — nákup za XP (`redeem_reward`), klubový admin schvaľuje/zamieta
  (`resolve_reward_order`), správa katalógu (pridávanie odmien)
- ✅ Profilové skiny (`buy_skin`) — 5 skinov vrátane free navy predvoleného
- 🔶 XP za "Odohraný zápas" (+25) a karty (žltá −20, červená −50, presné hodnoty nešpecifikované v
  docs, zvolené ako rozumný predvolený default) implementované cez zápasy, nie cez Sportnet
  potvrdenie (žiadne reálne Sportnet napojenie, pozri nižšie)
- ⬜ "Kompletný profil" (+30 XP) a "Pozvanie spoluhráča" (+25 XP) — nie sú implementované
- ⬜ "Prvé prihlásenie" (+50 XP) — nie je implementované (chýba trigger na `handle_new_user`)

### Rebríčky
- ✅ `/dashboard/leaderboards` — 3 úrovne (klub / región / Slovensko) × 6 dimenzií (XP Total,
  Dochádzka %, Góly, Streak King, Najlepšie hodnotení, Fair Play), age-gating (< 13 rokov = iniciály
  na regionálnom/národnom rebríčku), rešpektuje `leaderboard_visibility`
- 🔶 "Goals & Assists" dimenzia rieši len góly — asistencie nie sú v DB schéme trackované
  (`match_events` nemá typ pre asistenciu), zjednodušené na "Góly"
- ⬜ Sezónny reset a automatické koncoročné ocenenia (XP Champion, Iron Attendance, ...) — nie sú
  implementované

### Zápasy a live ticker (Sportnet fallback)
- ✅ `/dashboard/matches` — zoznam zápasov, tréner/admin vytvára nový zápas
- ✅ `/dashboard/matches/[id]` — realtime live ticker (skóre, udalosti), zostava, manuálny vstup
  udalostí trénerom (výkop/gól/karty/polčas/koniec), **každá udalosť viditeľne označená "Coach input"**
  presne podľa `docs/sportnet-integration.md#fallback` — toto je genuinely funkčná náhrada, nie mock,
  keďže reálne Sportnet API credentials nie sú k dispozícii
- ✅ Fanout notifikácií pri góle/karte/polčase/výsledku podľa per-klub nastavení sledovateľa
  (`docs/notifications.md`), presný formát textu ("⚽ Gól! ... X–Y" / "meno, N. minúta")
- ✅ Pozápasové hodnotenia (`/dashboard/matches/[id]/rate`) — hráči hodnotia spoluhráčov a trénera
  (`submit_rating` RPC, +15 XP)
- ⬜ **Rozhodca ako cieľ hodnotenia nie je podporený** — rozhodcovia nie sú registrovaní Fynd
  používatelia, `post_match_ratings.target_id` vyžaduje profil; dokumentované ako známa medzera
- ⬜ Skutočné Sportnet napojenie (OAuth, webhooky, caching) — nemám prístup k Sportnet API
  credentials; keby prišli, "Coach input" eventy majú byť podľa docs prepísané a označené "reconciled"

### Straty a nálezy
- ✅ `/dashboard/lost-found` — nahlásenie straty/nálezu, vláknové správy, označenie ako vyriešené

### Push notifikácie a notifikačné centrum
- ✅ In-app notifikačné centrum (`/dashboard/notifications`) — posledných 30 dní, označenie
  prečítaného, zvonček s počtom neprečítaných v hlavičke
- ⬜ **Skutočné push notifikácie (FCM/APNs) nie sú implementované** — nemám Firebase/APNs credentials;
  notifikácie sa ukladajú do `notifications` tabuľky a zobrazujú in-app, ale netrigrujú mobilný push
- ⬜ Quiet hours (23:00–07:00) a rate limiting na typ udalosti — nie sú implementované

### Fotky (fotograf/grafik)
- ⬜ Nie je implementované — DB schéma (`photo_sets`, `photos`) existuje v `schema_v2.sql`, ale bez UI

### Prémiové profily (Fynd+)
- ✅ `/pricing` — informačná stránka so 4 zásadami a 3 tiermi presne podľa `docs/premium-profiles.md`
- ⬜ **Žiadny reálny platobný tok** — nemám prístup k platobnému spracovateľovi (Stripe a pod.); appka
  zámerne nepredstiera platbu, aby nešlo o falošný checkout

---

## Phase 2–6 (za rámec tejto iterácie)

Národná škála, viacero federácií (SZĽH, SBA, SZH, SAZ), Fynd Network — zatiaľ nezačaté, pozri
[`docs/roadmap.md`](docs/roadmap.md).

---

## Rozhodnutia (technický decision log)

- **Next.js namiesto Vite** (odklon od pôvodného `docs/tech-stack.md`) — rozhodnuté pri zakladaní appky.
- **Supabase** ako backend (Postgres + Auth + Realtime) — odporúčanie z `docs/tech-stack.md`.
- **Ručný service worker namiesto next-pwa** — Next.js 16 defaultne buildí cez Turbopack, next-pwa
  (webpack-based) s ním koliduje. `@ducanh2912/next-pwa` ostáva v `package.json` nepoužitý.
- **Systémový font stack namiesto Google Fonts** — build prostredie nemalo prístup na
  `fonts.googleapis.com`. Zatiaľ neplatí pre "Space Grotesk"/"Nunito" z `docs/branding.md` — CSS na ne
  odkazuje s fallbackom, no fonty samotné nie sú lokálne pribalené.
- **Placeholder ikony/maskot** — nahradiť skutočným Futbot maskotom keď bude k dispozícii.
- **U9 chat pravidlo presadené v RLS, nie len v UI** (`can_access_chat_channel()`) — child-safety
  pravidlo z `docs/chat-permissions.md` nesmie závisieť len od toho, čo appka zobrazí.
- **Karty vo Fynd (žltá/červená) majú predvolené XP penalizácie −20/−50** — `docs/xp-system.md`
  spomína len "záporné XP za karty" bez presných čísel; klub si ich vie v budúcnosti nakonfigurovať.
- **XP za "odohraný zápas" (+25) sa pripisuje pri manuálnom "koniec zápasu" evente, nie po Sportnet
  potvrdení** — vzhľadom na chýbajúce Sportnet napojenie je to najbližšia poctivá náhrada.
- **Produkčný `npm run build` nebol overený v tomto vývojovom prostredí** — sandbox beží na Linuxe a
  nemá sieťový prístup na `registry.npmjs.org` na stiahnutie `@next/swc-linux-*` binárky (`node_modules`
  má len `darwin-arm64` z tvojho Macu). `npx tsc --noEmit` a `npm run lint` prešli čisto — over
  `npm run build` priamo u seba pred nasadením.

---

*Posledná aktualizácia: 2026-09-04*
