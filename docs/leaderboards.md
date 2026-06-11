# Leaderboards — Fynd

## Overview

Fynd features a three-tier leaderboard system that gives every player context for where they stand — within their club, within their region, and across the whole country.

**Goal:** Healthy competition that motivates consistent effort, not just raw talent.

---

## Three Tiers

### 1. Club Leaderboard
Scope: all players registered at the same club  
Reset: annually at season end  
Access: visible to all club members

This is the most personal ranking. A U9 player and an A-team veteran are in the same pool — different XP rates apply to different activities, so it naturally rewards engagement over raw skill.

### 2. Regional Leaderboard
Scope: all Fynd players in the same NUTS-3 region (e.g. Banskobystrický kraj)  
Reset: annually  
Access: visible to all Fynd users

Brings inter-club competition without the scale of national comparison. Particularly motivating for smaller clubs who might not compete nationally but can be regional leaders.

### 3. National Leaderboard
Scope: all Fynd players in Slovakia  
Reset: annually  
Access: visible to all Fynd users

The top of the mountain. National visibility gives talented players from small clubs the same exposure as academy players. A scout browsing Fynd can sort nationally by goals + attendance.

---

## Ranking Dimensions

Six separate leaderboards per tier:

| Leaderboard | Metric | Updated |
|---|---|---|
| XP Total | Cumulative XP earned | Live |
| Attendance % | Attended / invited × 100 | After each training |
| Goals & Assists | Combined goal contributions | After each match |
| Streak King | Longest active streak | Live |
| Best Rated | Average teammate rating score | Weekly aggregate |
| Fair Play | Inverse of disciplinary points | Season aggregate |

Users switch between dimensions with a tab selector. Default view: XP Total.

---

## End-of-Season Awards

At the end of each season, Fynd automatically generates awards for the top 3 in each leaderboard dimension, per club:

| Award | Recipient | Format |
|---|---|---|
| XP Champion | #1 XP in club | Permanent badge + profile frame |
| Iron Attendance | #1 attendance % | Permanent badge + +500 XP bonus |
| Top Scorer | #1 goals in club | Permanent badge |
| Streak Legend | Longest season streak | Permanent badge + +200 XP |
| Fan Favourite | #1 rated by teammates | Permanent badge |
| Fair Play Award | #1 fair play | Permanent badge |

These awards remain on the player profile permanently — they are not removed at the start of the next season.

---

## Display Format

Each leaderboard row shows:

```
# │ Player             │ XP    │ Streak │ Trainings │ Goals
──┼────────────────────┼───────┼────────┼───────────┼──────
🥇│ Martin Horváth     │ 2 840 │ 🔥 18  │     34    │   6
  │ MFK Nová Baňa      │       │        │           │
🥈│ Tomáš Bielik       │ 2 390 │ 🔥 12  │     31    │   0
  │ MFK Nová Baňa      │       │        │           │
```

Gold/silver/bronze rows are visually distinguished. Columns reduce on mobile to # / Player / XP / Streak.

---

## Privacy

- Player profiles on leaderboards are public by default within their club
- Regional and national appearance can be opted out in Settings > Privacy
- Age-gating: players under 13 appear with initials only on regional/national boards (e.g. "M. H." instead of "Martin Horváth")
- Parents can set U9–U12 children to "Club only" visibility
