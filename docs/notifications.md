# Notifications — Fynd

## Design Principle

Fynd notifications are inspired by Instagram's per-account notification settings. Every user controls exactly what they receive, for each followed club individually.

**No spam. No noise. Just what you care about.**

---

## Notification Types

| Type | Trigger | Default | Configurable |
|---|---|---|---|
| ⚽ Goals | Every goal scored | On | Yes |
| 🟨 Yellow card | Yellow card event | Off | Yes |
| 🟥 Red card | Red card event | On | Yes |
| ⏱️ Half-time score | End of 45 min | Off | Yes |
| 🏁 Final result | Full-time whistle | On | Yes |
| 📅 Match date reminder | 3 days before kick-off | On | Yes |
| ☀️ Match day reminder | Morning of match (9:00) | On | Yes |
| ⚠️ Training change | Immediately on change | **Always on** | No |
| 📣 Club announcement | Posted by coach/admin | On | Yes |
| 🔥 Streak at risk | 22:00 if no training that day | On | Yes |
| ⭐ XP milestone | Level up or badge earned | On | Yes |

`Training change` notifications cannot be turned off — this is a safety feature to ensure no player misses a cancellation.

---

## Per-Club Settings

Each followed club has its own notification profile. Example:

```
MFK Nová Baňa (my club)
  ⚽ Goals          ● ON
  🟨 Yellow cards   ○ OFF
  ⏱️ Half-time      ● ON
  🏁 Result         ● ON
  📅 Match reminder ● ON
  ☀️ Match day      ● ON
  🟥 Red cards      ● ON

FK Žiar nad Hronom (followed rival)
  ⚽ Goals          ● ON
  🟨 Yellow cards   ○ OFF
  ⏱️ Half-time      ○ OFF
  🏁 Result         ● ON
  📅 Match reminder ○ OFF
  ☀️ Match day      ○ OFF
  🟥 Red cards      ○ OFF
```

---

## Push Notification Format

All push notifications follow a consistent format:

```
[App icon] FutNova              teraz

⚽ Gól! MFK Nová Baňa 1–0
Marek Horváth, 12. minúta
```

- App name always shown (iOS/Android standard)
- Icon reflects event type (goal = ⚽, card = 🟨/🟥, etc.)
- Title: event summary with score
- Body: player name and minute, or match/event detail
- Timestamp: always "teraz" during live events

---

## Live Match Push Sequence (example)

```
0'   ⚽  Kick-off — MFK NB vs FK Žiar n/H
12'  ⚽  Gól! MFK NB 1–0  (Marek Horváth)
23'  🟨  Žltá karta — FK Žiar #5
38'  ⚽  Gól! MFK NB 2–0  (Peter Kováč)
45'  ⏱️  Polčas: MFK NB 2–0
58'  🟥  Červená karta — FK Žiar #3
67'  ⚽  Gól! MFK NB 2–1  (Ján Novák / Žiar)
82'  ⚽  Gól! MFK NB 3–1  (Horváth 2.)
90'  🏁  Záverečný výsledok: 3–1  ✓ MFK NB víťazí
```

Users who have Goals ON but Half-time OFF receive notifications at 0', 12', 38', 67', 82', 90' — and skip the half-time push.

---

## Technical Implementation

- **Delivery:** Firebase Cloud Messaging (FCM) for Android, Apple Push Notification Service (APNs) for iOS
- **Trigger:** Sportnet webhook → Fynd backend → FCM/APNs
- **Fallback:** Manual coach input if Sportnet webhook is delayed
- **Rate limiting:** Maximum 1 push per event type per match per user to prevent duplicate delivery
- **Quiet hours:** No notifications between 23:00 and 07:00 (configurable in Settings)

---

## In-App Notification Centre

All notifications are also stored in-app (bell icon, top-right). Users can review the past 30 days of notifications per club. Unread count shown as red badge on the nav icon.
