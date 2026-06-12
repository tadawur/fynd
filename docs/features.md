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

**XP transfer pri prestupe:** Keď hráč prestúpi do iného klubu vo Fynd sieti, jeho celkové XP, level a história sa prenášajú s ním. Profil a postup hráča nezávisí od konkrétneho klubu — motivácia sa tak nestráca pri zmene dresu.

**Bonus XP za postup v lige:** Keď sa tím posunie v lige smerom nahor (napr. z okresnej do oblastnej súťaže), všetci hráči daného tímu dostanú jednorazový bonus XP. Bonus je malý, nie extrémny, a jeho výška závisí od úrovne ligy, do ktorej tím postúpil — vyššia liga = o niečo vyšší bonus.

**Negatívne XP za žlté/červené karty:** Žltá aj červená karta strhávajú malé množstvo XP. Platí to rovnako pre hráčov aj pre trénerov — fair play sa tak prejavuje priamo v XP bilancii, bez toho aby šlo o drastický postih.

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

**Zostavy zápasu (Lineups):** Pri každom zápase je k dispozícii kompletný zoznam nastupujúcich hráčov oboch tímov, vrátane trénerov a rozhodcov daného zápasu. Každé meno je klikateľné a otvára verejný profil danej osoby (hráč, trénér, rozhodca — ak má vo Fynd profil).

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
| Profile design / skin (background, frame, theme) | 250–500 XP |

The shop is fully configurable by the club — they set the items, prices, and availability. Tabuľka vyššie je len odporúčaný príklad; každý klub si nezávisle určuje vlastný zoznam odmien podľa svojho rozpočtu a možností. Fynd handles the request flow and notifications.

**Profile skins:** Beyond physical rewards, players can spend XP on cosmetic profile designs — alternative background themes, avatar frames and colour skins. These are digital-only, available to every club regardless of physical reward budget, and act as a status symbol on the profile and leaderboards.

---

## 8. Leaderboards

See full detail in [leaderboards.md](leaderboards.md).

**Summary:** Three tiers of leaderboard — club, regional, national. Six ranking dimensions: XP total, attendance %, goals and assists, streak record, best-rated player, fair play.

**Samostatné tabuľky pre góly a odohraté minúty:** Okrem celkového XP rebríčka existujú samostatné tabuľky pre najviac gólov a najviac odohraných minút, každá v dvoch verziách — **sezónna** (aktuálna sezóna) a **celoročná/kariérna** (od registrácie hráča).

**Pozícia na profile:** Ak sa hráč nachádza v top 50 niektorej z týchto tabuliek, jeho profil zobrazuje konkrétne poradie a kategóriu (napr. "12. miesto — najviac gólov, sezóna 2025/26").

**Sezónne a celoslovenské umiestnenia (top 1–3):** Hráč, ktorý skončí na 1.–3. mieste v sezónnom alebo celoslovenskom rebríčku, získa na profil viditeľné označenie tohto umiestnenia. Sezónne umiestnenie sa zobrazuje po celú sezónu a zmizne pri vyhlásení novej sezónnej tabuľky. Celoslovenské umiestnenie sa zobrazuje až do začiatku nového roka, kedy sa spustí nová ročná tabuľka. Po skončení zobrazovania sa umiestnenie spolu s príslušným rokom uloží natrvalo medzi odznaky hráča (pozri Section 9).

---

## 9. Player Profile

**Components:**
- **Avatar** — customisable SVG character (hair, kit colour, skin tone, background, animated background)
- **Level badge** — current level name and XP progress bar
- **Season stats** — matches, goals, assists, minutes played, attendance %, XP total, žlté/červené karty, rohové kopy (sezónne)
- **Badge collection** — rozšírená zbierka odznakov (výrazne viac ako pôvodných 18) zobrazená Steam-style
- **Social links** — Instagram, TikTok, YouTube, Facebook, X, Snapchat (age 15+ only)
- **Leaderboard position** — current rank in club, region, nation; ak je hráč v top 50, zobrazuje sa konkrétne poradie a kategória (pozri Section 8)

Social links display as icon row only — no embedded feed, no algorithmic content. Clean, like a Steam profile.

**Animated profile backgrounds:** Players choose from a growing library of animated background styles (e.g. subtle particles, gradient motion, seasonal effects, club-colour pulses) to personalise their profile. Additional designs can be unlocked via the XP reward shop (see Section 7).

**Minutes played (seasonal):** In addition to matches, goals and assists, the profile tracks total minutes played on the pitch for the current season — sourced from match-day input (coach) and, once available, Sportnet match data (see Section 12).

**Karty a rohové kopy (sezónne):** Profil zobrazuje sezónny súčet žltých a červených kariet a rohových kopov, podobne ako minúty odohraté. Tieto čísla sa zároveň premietajú do negatívneho XP (žlté/červené karty, pozri Section 2).

**Rebríčkové odznaky (top 1–3 a roky):** Ak hráč skončí na 1.–3. mieste v sezónnom alebo celoslovenskom rebríčku, na profile sa mu po dobu platnosti zobrazuje príslušné umiestnenie (pozri Section 8). Po jeho skončení sa do zbierky odznakov pridá trvalý odznak s rokom a dosiahnutou priečkou (napr. "🥈 2025 — 2. miesto, najviac gólov").

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

**Mesačný kalendár tréningov:** Každý tím má prehľadný kalendár plánovaných tréningov na celý mesiac. Hráči dostávajú notifikácie v deň tréningu, prípadne aj v predchádzajúcich dňoch — počet dní vopred si každý hráč nastavuje individuálne vo svojich notifikačných preferenciách (podobne ako pri klubových notifikáciách, Section 3).

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

---

## 15. Match Photos (Photographer & Graphic Designer roles)

**Roles:** Photographer (Fotograf), Graphic Designer (Grafik) — optional, club-assigned extended roles. See [target-audience.md](../marketing/target-audience.md) for persona detail.

**Concept:** Clubs that have a volunteer taking match-day photos can give that person a dedicated **Photographer** role instead of sharing images through a WhatsApp group.

**Photographer capabilities:**
- Upload photos directly to a specific match (linked to the calendar/live ticker)
- Tag photos to individual players or to the whole team
- Set visibility per photo set — visible to the whole club, or restricted to selected members only
- Share a private photo set with the club's **Graphic Designer** role only

**Graphic Designer capabilities:**
- See all photo sets the Photographer has shared with them (including ones hidden from other members)
- Browse by match or by player
- Download originals in full resolution for use in graphics, social posts and end-of-season materials

**Visibility model:**

| Photo set visibility | Who sees it |
|---|---|
| Public (default) | All club members |
| Restricted to selected players | Photographer-chosen players/team only |
| Designer-only | Only the assigned Graphic Designer |

No photo is visible by default to anyone outside the club. The Photographer always controls the visibility of their own uploads.

---

## 16. Straty a nálezy (Lost & Found)

**Koncept:** Po zápase sa môže stať, že hráčovi niečo zostane na štadióne alebo sa stratí (vybavenie, oblečenie, osobné veci). Fynd umožňuje priamu komunikáciu medzi hráčom/rodičom a vedením klubu ohľadom takýchto strát a nálezov.

**Funkcie:**
- Hráč alebo rodič nahlási stratenú vec priamo z appky, s priradením k danému zápasu/dátumu
- Vedenie klubu vidí zoznam nahlásených strát a môže reagovať, či sa vec našla
- Obojstranná komunikácia (chat-like vlákno) k jednotlivému hláseniu
- Nálezy nahlásené klubom (napr. trénerom) sa zobrazia ako verejný zoznam pre celý klub, aby si hráči mohli skontrolovať, či sa nestratená vec nenašla

**Cieľ:** Nahradiť neefektívnu komunikáciu cez WhatsApp skupiny jednoduchým, dohľadateľným záznamom v appke.
