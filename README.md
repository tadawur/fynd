# Fynd

**Beyond the Score.**

Fynd is the first community-driven sports platform built for Slovak youth clubs — and designed to scale across every sport. One place for live results, training streaks, club communication, XP rewards, and leaderboards. No more scattered WhatsApp groups, no more googling for scores.

---

## What is Fynd?

Fynd *(from "find" + "fandom")* is a mobile-first Progressive Web App (PWA) that serves as the digital home for sports clubs and their communities — players, coaches, parents, and fans.

**Tagline:** Beyond the Score

The name captures two things at once: *finding* your club, your team, your results — and the *fandom* that surrounds every sport.

---

## The Problem

- Parents spend 30 minutes searching for match results across Sportnet, Facebook, and three WhatsApp groups
- Coaches cancel training and the message gets lost in 200 other notifications
- Young players have zero digital motivation to show up consistently
- Talented players from small towns are invisible to scouts
- Clubs lose thousands of young members every year to other activities
- Transfers between clubs are filled out manually, duplicated across systems

## The Solution

One platform. Everything there.

| Feature | What it does |
|---|---|
| 🔥 Training streak | Duolingo-style attendance motivation |
| ⭐ XP & levels | Points for every activity, redeemable for club rewards |
| 📡 Live match ticker | Every goal, card, half-time — instant push notification |
| ❤️ Club following | Per-club notification settings, like Instagram story alerts |
| 🏆 Leaderboards | Club, regional, and national rankings |
| 💬 Category chats | Locked by age group — U9 never sees A-team messages |
| 📋 Post-match ratings | Anonymous ratings of referee, coach, teammates → +XP |
| 🔗 Sportnet integration | Automatic transfer sync, results, and player stats |
| 🎨 Seasonal themes | App changes colours 6× per year — Halloween, Christmas, Summer |
| 🤖 Futbot mascot | The Fynd robot mascot, friendly and recognisable |

---

## Target Audience

- **Youth players** (8–18): streaks, XP, profiles, rewards
- **Coaches**: attendance, announcements, training calendar
- **Parents**: live results, schedule changes, U9–U13 chats
- **Club management**: stats, XP reward catalogue, Sportnet sync

---

## Current Status

| Phase | Status | Description |
|---|---|---|
| F1 — MVP Core | 🟡 Planning | Login, profile, chats, calendar, streak |
| F2 — XP & Rewards | 🟡 Planning | XP system, levels, reward shop, badges |
| F3 — Community | 🟡 Planning | Club following, live ticker, push notifications |
| F4 — Sportnet | 🟡 Planning | API integration, transfers, stats |
| F5 — Scale | 🟡 Planning | National rollout, 50+ clubs, SFZ partnership |
| F6 — Fynd Network | ⚪ Vision | Own social network — "sports LinkedIn", career profiles, scouting |

---

## Repository Structure

```
fynd/
├── README.md                   ← You are here
├── TASKS.md                    ← Implementation status (webapp/), tracked against docs/roadmap.md
├── webapp/                     ← Next.js + Supabase PWA (F1 Core MVP) — see webapp/README.md
├── supabase/
│   └── schema.sql              ← F1 database schema (Postgres) + RLS policies
├── docs/
│   ├── overview.md             ← Vision, mission, audience
│   ├── features.md             ← All features in detail
│   ├── xp-system.md            ← XP economy, levels, reward shop, XP as KPI
│   ├── premium-profiles.md     ← Premium tiers (player, coach, club) & what stays free
│   ├── FINANCIALS.md           ← Cost model, SLA, revenue, break-even
│   ├── notifications.md        ← Push notification system
│   ├── leaderboards.md         ← Club / regional / national rankings
│   ├── chat-permissions.md     ← Who sees what in group chats
│   ├── sportnet-integration.md ← Sportnet API connection plan
│   ├── tech-stack.md           ← PWA vs native, recommended stack
│   ├── roadmap.md              ← F1–F6 implementation phases
│   └── branding.md             ← Name, mascot, colours, themes
└── marketing/
    ├── pitch-notes.md          ← Key investor/partner messages
    ├── target-audience.md      ← Detailed user personas
    ├── competitive-landscape.md← What exists, why Fynd is different
    ├── club-development-vs-fynd.md ← SFZ Club Development: comparison & partnership strategy
    ├── sfz-marketing-pitch.md  ← SFZ marketing/PR angle: Spond gap analysis + partnership deck notes
    ├── club-adoption.md        ← Coach adoption plan & club sales playbook
    └── web-v2-roadmap.md       ← Roadmap: site content polish, business & partner sections
```

---

## Quick Links

- 📄 [Full Feature Overview](docs/features.md)
- ⭐ [XP System, Levels & KPI](docs/xp-system.md)
- 💎 [Premium Profiles](docs/premium-profiles.md)
- 🏆 [Leaderboard System](docs/leaderboards.md)
- 🗺️ [Roadmap](docs/roadmap.md)
- 🛠️ [Implementation Tasks](TASKS.md)
- 💻 [Webapp Setup](webapp/README.md)
- 🎨 [Brand & Design](docs/branding.md)
- 💰 [Investment Overview](marketing/pitch-notes.md)
- 📊 [Financial Model & SLA](docs/FINANCIALS.md)
- 🤝 [Club Adoption Playbook](marketing/club-adoption.md)
- 🏛️ [SFZ Club Development × Fynd](marketing/club-development-vs-fynd.md)
- 📣 [SFZ Marketing Pitch](marketing/sfz-marketing-pitch.md)
- 🗂️ [Marketing Web Roadmap v2](marketing/web-v2-roadmap.md)

---

## Contact

**Tadeáš Letko** — Founder  
📧 info@fynd.fans  
🌐 [fynd.fans](https://fynd.fans)

---

*Fynd — Beyond the Score.*





















