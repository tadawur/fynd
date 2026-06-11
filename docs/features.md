# Features — Fynd

Complete breakdown of all Fynd features, grouped by area.

---

## 1. Training Streak System

**Inspired by:** Duolingo's daily streak mechanic  
**XP reward:** +10 XP per training session, +50 XP bonus at 7-day streak

The streak is the core engagement loop. Every time a player attends training, the coach marks them present in Fynd. The player's streak counter increments. Breaking the streak resets it to zero — and that loss aversion is the psychological engine that drives attendance.

**Visual design:**
- Weekly grid showing 7 days (Mon–Sun)
- Completed days shown with green flame dot
- Today's training shown in gold
- Animated flame emoji pulses when streak is active

**Streak milestones:**
- 7 days → +50 XP bonus + badge unlock
- 30 days → "Iron Man" badge + +200 XP
- Full season without absence → special seasonal award

---

## 2. XP Points & Level System

See full detail in [xp-system.md](xp-system.md).

**Summary:** Players earn XP for every positive action in the app. XP accumulates to unlock levels (1–10) and can be spent in the club's reward shop.

---

## 3. Club Following & Notifications

See full detail in [notifications.md](notifications.md).

**Summary:** Any user can follow any club. Per-club notification settings allow granular control — exactly like Instagram notifications for a profile. Choose to be notified for goals only, full live coverage, match-day reminders, or everything.

---

## 4. Live Match Ticker

**Inspired by:** Fortuna live match feed  
**Data source:** Sportnet API + manual coach input (fallback)

When a match is live, a ticker card appears at the top of the Home screen. Events are pushed in real time, each with a minute timestamp:

| Event type | Icon | Push notification |
|---|---|---|
| Kick-off | ⚽ | Optional |
| Goal | ⚽ | Yes (if enabled) |
| Yellow card | 🟨 | Optional |
| Red card | 🟥 | Yes (if enabled) |
| Half-time | ⏱️ | Optional |
| Full-time | 🏁 | Yes (if enabled) |

The ticker is expandable — tap to reveal the full event timeline. When the match ends, the badge changes from LIVE to FT.

---

## 5. Group Chats

See full detail in [chat-permissions.md](chat-permissions.md).

**Summary:** Every club has multiple locked chat groups, one per age category. Access is controlled by role — a U9 player cannot see A-team messages. Coaches have write access to all groups. Parents are automatically included in U9–U13 chats.

---

## 6. Post-Match Ratings

**Trigger:** Available after each match for 48 hours  
**XP reward:** +15 XP for completing a full rating  
**Visibility:** Results visible to club management only

After each match, players receive a prompt to rate:
1. **Referee** — 1–5 stars
2. **Head coach** — 1–5 stars
3. **Individual teammates** — 1–5 stars each

Ratings are anonymous. Aggregate scores per match are visible to the club's management panel. No public shame, no drama — just structured feedback that helps clubs improve.

The XP reward ensures participation without making it mandatory.

---

## 7. XP Reward Shop (Odmeňovňa)

**Concept:** Club configures a catalogue of rewards. Players spend XP to request items. Club approves or rejects each order.

**Example rewards clubs can offer:**

| Reward | Suggested XP cost |
|---|---|
| Water bottle with club logo | 200 XP |
| Training t-shirt | 450 XP |
| Shin guards | 350 XP |
| Match ticket | 150 XP |
| Individual coaching session (1h) | 800 XP |
| Gold profile badge | 300 XP |
| Captain's armband (profile title) | 600 XP |

The shop is fully configurable by the club — they set the items, prices, and availability. Fynd handles the request flow and notifications.

---

## 8. Leaderboards

See full detail in [leaderboards.md](leaderboards.md).

**Summary:** Three tiers of leaderboard — club, regional, national. Six ranking dimensions: XP total, attendance %, goals and assists, streak record, best-rated player, fair play.

---

## 9. Player Profile

**Components:**
- **Avatar** — customisable SVG character (hair, kit colour, skin tone, background, animated background)
- **Level badge** — current level name and XP progress bar
- **Season stats** — matches, goals, assists, attendance %, XP total
- **Badge collection** — 18+ earned/locked badges displayed Steam-style
- **Social links** — Instagram, TikTok, YouTube, Facebook, X, Snapchat (age 15+ only)
- **Leaderboard position** — current rank in club, region, nation

Social links display as icon row only — no embedded feed, no algorithmic content. Clean, like a Steam profile.

---

## 10. Club Discovery

Users can browse all registered Fynd clubs. Each club card shows:
- Club name, region, founding year
- Member count, number of categories, league tier
- Favourite (❤️) and notification (🔔) buttons
- Member list (avatars, roles, streaks, social links)
- Category list

Tapping a member opens their public profile.

---

## 11. Training & Match Calendar

- Unified calendar view for all training sessions and matches
- Coach creates events; players see them immediately
- Reminder system: 3 days before match, morning of match
- Calendar integrates with phone's native calendar (export to .ics)
- Colour coding: green = training, gold = match, blue = club event

---

## 12. Sportnet Integration

See full detail in [sportnet-integration.md](sportnet-integration.md).

**Summary:** REST API connection to Sportnet.online. Automatic sync of match results, player transfer records, and registration verification. Eliminates manual data entry for coaches.

---

## 13. Seasonal Themes

The app's colour scheme changes 6 times per year:

| Theme | Period | Colours |
|---|---|---|
| Spring | Apr – Jun | Green, light, grass |
| Summer League | Jul – Aug | Yellow, warm, sunny |
| Autumn | Sep – Oct | Orange, amber, dark |
| Halloween | 31 Oct | Purple, black |
| Christmas | Dec – Jan | Blue, white, gold |
| Winter Training | Feb – Mar | Dark blue, silver |

Theme changes are automatic — no user action required.

---

## 14. Futbot — The Mascot

Futbot is Fynd's robot mascot. A friendly, tech-forward character with a glowing green visor, segmented arms and an FN badge on the chest. Used across onboarding, empty states, achievement screens and marketing.

See full detail in [branding.md](branding.md).
