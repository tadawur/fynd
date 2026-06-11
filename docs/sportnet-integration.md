# Sportnet Integration — Fynd

## Overview

[Sportnet.online](https://sportnet.online) is the official results and registration platform of the Slovak Football Association (SFZ). It stores all official match results, player registrations, club data and transfer records.

Fynd integrates with the Sportnet REST API to eliminate manual data entry and ensure Fynd data is always in sync with the official record.

---

## What We Sync

| Data type | Direction | Frequency | Notes |
|---|---|---|---|
| Match results | Sportnet → Fynd | After each match | Triggers live ticker end-state |
| Live match events | Sportnet → Fynd | During match | Goals, cards, substitutions |
| Player registrations | Sportnet → Fynd | On registration | Verifies player identity |
| Club transfers | Sportnet → Fynd | On transfer event | Updates player's club automatically |
| Season fixtures | Sportnet → Fynd | Weekly | Populates match calendar |
| Club metadata | Sportnet → Fynd | On change | Name, league, division |

---

## How Transfers Work

**Before Fynd:**
1. Player or agent fills in transfer form on Sportnet
2. Coach manually updates WhatsApp group
3. Player profile on other platforms is never updated
4. Next season, confusion about which club the player is actually in

**With Fynd:**
1. Player or agent fills in transfer form on Sportnet (unchanged)
2. Sportnet webhook fires → Fynd receives event
3. Fynd automatically moves player to new club
4. Player's profile, chat access and leaderboard position update instantly
5. Previous club sees the player's history as read-only

---

## Player Verification

When a new player registers on Fynd, they enter their SFZ registration number. Fynd calls the Sportnet API to verify:
- The registration number exists
- The player name matches
- The club they are registering under matches their active registration

If verification fails, the player can still use the app but appears with an "Unverified" badge. Verified players get a green checkmark on their profile.

---

## Technical Approach

### Authentication
Sportnet uses OAuth 2.0. Fynd's backend holds a club-level API key, authorised by each club admin during onboarding.

### Webhooks
Fynd registers a webhook endpoint with Sportnet for:
- `match.result.updated`
- `match.event.created` (goal, card, substitution)
- `player.transfer.completed`
- `player.registration.created`

### Caching
All Sportnet data is cached on the Fynd server. Cache TTL:
- Live match events: 30 seconds
- Match results: 5 minutes
- Fixtures: 24 hours
- Player/club metadata: 7 days

This prevents hammering the Sportnet API and ensures Fynd stays responsive even if Sportnet is slow.

### Fallback
If Sportnet is unavailable or the webhook is delayed:
- Coach can manually enter match events in the Fynd app
- Manual events are clearly marked as "Coach input" vs "Sportnet verified"
- When Sportnet data arrives, it overwrites manual entries and marks them reconciled

---

## Future: Other Federation APIs

The integration layer is designed to be modular. Phase F5 includes adding:

| Federation | Sport | API |
|---|---|---|
| SZĽH | Ice hockey | TBD |
| SBA | Basketball | TBD |
| SZH | Handball | TBD |
| SAZ | Athletics | TBD |

Each new integration follows the same pattern: authenticate, register webhooks, map data to Fynd's internal schema.

---

## Data Privacy

- Fynd only stores data received from Sportnet, not derived data
- Player data is owned by the player; they can request deletion
- Club data is owned by the club; admin can export or delete
- All Sportnet-sourced data is labelled with its source and timestamp
- GDPR Article 6(1)(b) — processing necessary for performance of contract
