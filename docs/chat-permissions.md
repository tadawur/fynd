# Chat Permissions — Fynd

## Principle

Every message should reach exactly the right people, and no one else. Fynd uses a role-and-category permission model: your access to each chat group is determined by your registered role and age category.

---

## Permission Matrix

| Group | Can Read | Can Write | Notes |
|---|---|---|---|
| A-mužstvo | A-team players only | A-team + head coach | — |
| U19 — Dorast | U19 players only | U19 + coach | — |
| U15 — Dorast | U15 players only | U15 + coach | — |
| U13 — Prípravka | U13 players + parents | Coach + parents | Parents always included |
| U11 — Prípravka | U11 players + parents | Coach + parents | Parents always included |
| U9 — Najmladší | Parents + coach only | Coach manages | Players have no direct access |
| Coaches (internal) | Coaches only | Coaches only | Cross-category coordination |
| Management / Board | Management only | Management only | Minutes, documents, finances |
| Marketing | Marketing team | Marketing team | Content, photos, announcements |

---

## Role Definitions

| Role | Description |
|---|---|
| Player | Registered player in a specific age category |
| Coach | Assigned to one or more categories, write access to those groups |
| Head Coach | Write access to all player groups |
| Parent | Linked to a player U13 and under, read/write in that player's group |
| Management | Club officer, access to management group and read-only on all |
| Marketing | Club marketing contact, access to marketing group |
| Admin | Full access to all groups (typically club secretary) |

---

## U9 Special Case

Players in the U9 category (typically 7–9 years old) do not have direct chat access. Their parents are the chat participants. The coach communicates with parents, who relay information to players.

This is a deliberate child safety decision — not a technical limitation.

---

## Parent Automatic Inclusion

When a player is registered in category U9, U11, or U13, their linked parent account is automatically added to that category's chat group. Parents cannot be removed by the player. A parent can mute the group but cannot leave it entirely (they will still receive critical notifications like training cancellations).

---

## Cross-Category Communication

A head coach can broadcast to multiple category groups simultaneously from a single compose screen. This is useful for club-wide announcements (pre-season meetings, club events, emergency communications).

Players still only see the message in their own group — they cannot see the recipients of a broadcast.

---

## Chat History & Search

- Chat history is stored indefinitely per club
- Searchable by keyword within each group
- Media (photos, files) stored for 12 months
- Coaches and admins can pin important messages
- Pinned messages appear at the top of the chat

---

## Moderation

- Coaches and admins can delete any message in their accessible groups
- Repeated rule violations can be flagged to club management
- Fynd does not moderate content by default — this is the club's responsibility
- All messages are logged server-side for safeguarding purposes (GDPR-compliant)
