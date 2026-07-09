# Roadmap — Fynd

## Overview

Six phases from MVP to national scale — and beyond it, towards a standalone sports network. Each phase is independently deployable — clubs can start using F1 features while F2 is in development.

---

## Phase 1 — Core MVP
**Duration:** 4 – 6 weeks  
**Status:** 🟡 Planning

### Deliverables
- [ ] User registration and login (email + Google)
- [ ] Player profile with customisable avatar
- [ ] Multiple animated profile background options
- [ ] Club structure and category assignment
- [ ] Group chats (with category-based access control)
- [ ] Training calendar (coach creates, players view) — mesačný prehľad + konfigurovateľné notifikácie (deň tréningu, X dní vopred)
- [ ] Training attendance marking (coach action)
- [ ] Streak counter (weekly grid, flame animation)
- [ ] Basic announcements (broadcast to category or club-wide)
- [ ] Push notifications for training changes (always-on)

### Success criteria
- One pilot club (MFK Nová Baňa) onboarded
- 80% of active players complete profile
- 70% of training sessions marked in app within 24h

---

## Phase 2 — XP & Motivation
**Duration:** 3 – 4 weeks  
**Status:** 🟡 Planning

### Deliverables
- [ ] XP awarding engine (attendance, ratings, match, streak, badges)
- [ ] Level system (10 levels, Slovak names)
- [ ] XP progress bar and level badge on profile
- [ ] Badge system (rozšírená zbierka odznakov, earn/locked state)
- [ ] Reward shop (Odmeňovňa) — club configures own catalogue (rewards, ceny, dostupnosť), player requests
- [ ] Profile design/skin shop — players buy cosmetic profile designs with XP
- [ ] Post-match rating screen (referee, coach, teammates)
- [ ] Rating XP reward
- [ ] Negatívne XP za žlté/červené karty (platí pre hráčov aj trénerov)
- [ ] Bonus XP za postup tímu v lige (malý bonus, výška podľa úrovne ligy)
- [ ] Club leaderboard (XP dimension) + samostatné tabuľky najviac gólov a najviac odohraných minút (sezónne)

### Success criteria
- Average session frequency ≥ 1.5× per week per active user
- 60%+ of players complete at least one post-match rating
- At least one reward redeemed per club in first month

---

## Phase 3 — Community & Live
**Duration:** 4 – 5 weeks  
**Status:** 🟡 Planning

### Deliverables
- [ ] Club directory (browse all Fynd clubs)
- [ ] Club following with per-club notification settings
- [ ] Live match ticker (events, score, timeline)
- [ ] Zostavy zápasu — zoznam hráčov, trénerov a rozhodcov s klikateľnými profilmi
- [ ] Push notifications for live events (goal, card, result)
- [ ] Match schedule view (followed clubs)
- [ ] Match reminder system (3 days before, match morning)
- [ ] Regional leaderboard
- [ ] Zobrazenie pozície v rebríčku na profile (top 50, s kategóriou)
- [ ] Social media links on profile (age 15+ gate)
- [ ] Photographer role — upload match photos, tag players, set per-set visibility
- [ ] Graphic Designer role — access to photo sets shared by Photographer
- [ ] Straty a nálezy — komunikácia s vedením klubu o stratených/nájdených veciach po zápase

### Success criteria
- 30%+ of users follow at least one club beyond their own
- Push notification opt-in rate ≥ 70%
- Live ticker open rate ≥ 40% of followed-club matches

---

## Phase 4 — Sportnet Integration
**Duration:** 3 – 4 weeks  
**Status:** 🟡 Planning

### Deliverables
- [ ] Sportnet OAuth and webhook setup
- [ ] Player registration verification via SFZ number
- [ ] Automatic transfer sync (club changes) + prenos XP a levelu hráča pri prestupe do iného klubu
- [ ] Match results from Sportnet (replaces manual input)
- [ ] Full season stats on player profile (goals, assists, minutes played on pitch, žlté/červené karty, rohové kopy)
- [ ] National leaderboard + celoročné/kariérne tabuľky najviac gólov a najviac odohraných minút
- [ ] Sezónne a celoslovenské umiestnenia (top 1-3) na profile + trvalé odznaky s rokom po skončení platnosti
- [ ] Seasonal themes engine (6 themes, auto-switch by date)
- [ ] End-of-season awards (auto-generated, permanent badges)

### Success criteria
- 90%+ of registered players verified via Sportnet
- Zero manual transfer updates required from coaches
- Season stats accuracy ≥ 95% vs Sportnet records

---

## Phase 5 — National Scale
**Duration:** 2 – 3 weeks initial + ongoing  
**Status:** 🟡 Planning

### Deliverables
- [ ] Multi-club onboarding flow (self-service for club admins)
- [ ] SFZ partnership and data sharing agreement
- [ ] Marketing campaign (target: 50 clubs in first season)
- [ ] Multi-sport support framework (hockey, basketball, handball)
- [ ] PWA → native app evaluation and decision point
- [ ] B2B pricing model for clubs (freemium vs subscription)

### Success criteria
- 50+ clubs active on platform by end of first full season
- 5 000+ registered players
- NPS ≥ 40 from club admins

---

## Phase 6 — Fynd Network (vlastná sociálna sieť)
**Duration:** ongoing, starts after F5 proves scale (year 2+)  
**Status:** ⚪ Vision

Dlhodobá vízia: z klubovej platformy sa stane **samostatná športová sociálna sieť — „športový LinkedIn"**. Zameraná výhradne na športové témy: žiadny všeobecný feed, žiadne memy, žiadna politika. Profil hráča a trénera sa mení na overený športový životopis.

### Deliverables
- [ ] Kariérny profil — overená história klubov, štatistiky, odznaky a úspechy naprieč sezónami (dáta zo Sportnetu, nie samodeklarované)
- [ ] Športový feed — príspevky viazané na kluby, zápasy a kariérne míľniky; moderácia obmedzená na športový obsah
- [ ] Networking — prepojenia hráč ↔ tréner ↔ klub ↔ skaut, odporúčania a referencie (ako LinkedIn endorsements, ale za overené športové úspechy)
- [ ] Scouting portál — vyhľadávanie talentov podľa veku, pozície, regiónu a KPI dát (explicitný opt-in hráča a rodiča)
- [ ] Kariérna nástenka — kluby inzerujú nábory, trénerov, brigády okolo klubu; hráči a tréneri sa hlásia profilom
- [ ] Medzinárodné rozšírenie — podpora federácií mimo SK ako predpoklad rastu siete

### Success criteria
- 30 %+ hráčov 15+ má vyplnený kariérny profil
- Prvých 10 overených skautov/agentov aktívne používa scouting portál
- Prvý prestup, ktorý preukázateľne vznikol cez Fynd Network

### Prečo až po F5

Sociálna sieť má hodnotu len s kritickou masou overených profilov. F1–F5 túto masu vybudujú cez každodennú klubovú prevádzku — F6 ju premení na sieť, ktorú nevie skopírovať nikto bez rovnakých dát.

---

## Timeline (estimated)

```
Month 1–2   F1 — Core MVP         ████████░░░░░░░░░░
Month 2–3   F2 — XP & Motivation  ░░░░████████░░░░░░
Month 3–4   F3 — Community        ░░░░░░░░████████░░
Month 4–5   F4 — Sportnet         ░░░░░░░░░░░█████░░
Month 5+    F5 — Scale            ░░░░░░░░░░░░░░████
Year 2+     F6 — Fynd Network     ░░░░░░░░░░░░░░░░██
```

Phases overlap slightly — backend work for F3 begins while F2 frontend is in testing.

---

## Out of Scope (v1)

These features are explicitly deferred to post-F5:

- Video highlights upload
- Live video streaming
- Merchandise e-commerce
- Ticket sales integration
- Agent/scout portal → planned as part of **F6 — Fynd Network**
- International club support (non-SK federations) → planned as part of **F6 — Fynd Network**
