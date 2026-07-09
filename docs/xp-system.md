# XP System & Levels — Fynd

## Philosophy

Fynd's XP system is borrowed directly from the most successful habit-forming apps in the world — Duolingo, Habitica, fitness trackers. The core insight: **small, consistent rewards for small, consistent actions create lasting habits**.

The goal is not to gamify sport. The goal is to make the habit of showing up feel acknowledged and progressive — because a player who shows up consistently is a better player, a more loyal club member, and less likely to drop out.

---

## Earning XP

| Action | XP | Notes |
|---|---|---|
| Training attendance | +10 XP | Marked by coach after session |
| Post-match rating | +15 XP | Only if all fields completed |
| Playing in a match | +25 XP | Confirmed via Sportnet |
| 7-day streak bonus | +50 XP | Awarded automatically at milestone |
| Badge earned | +100 XP | Per badge, one-time |
| Completed profile | +30 XP | Photo, bio, at least one social link |
| Inviting a teammate | +25 XP | When the invited user registers |
| First login | +50 XP | Welcome bonus |

---

## Level Thresholds

| Level | Name | XP required | Cumulative |
|---|---|---|---|
| 1 | Začiatočník | 0 | 0 |
| 2 | Sľubný mladík | 200 | 200 |
| 3 | Nádejný hráč | 300 | 500 |
| 4 | Nádejný talent | 500 | 1 000 |
| 5 | Stálica tímu | 1 000 | 2 000 |
| 6 | Kľúčový hráč | 1 500 | 3 500 |
| 7 | Šampión | 2 000 | 5 500 |
| 8 | Kapitán | 2 500 | 8 000 |
| 9 | Hviezda | 4 000 | 12 000 |
| 10 | Legenda | 8 000 | 20 000 |

Level names are localised to Slovak. International versions will use equivalent translations.

---

## Level Benefits

Higher levels unlock:
- Exclusive badge designs
- Priority display in leaderboards (tie-breaking)
- Access to higher-tier items in the club's reward shop
- Special profile frame and badge

Clubs can configure level requirements for specific rewards — e.g. "Kapitánska páska" only available at Level 8+.

---

## The Reward Shop (Odmeňovňa)

### How it works

1. **Club configures** the reward catalogue (name, XP cost, quantity, level requirement)
2. **Player browses** the shop and taps "Buy"
3. **Confirmation screen** shows cost and delivery note ("Club will process within 3 days")
4. **Club receives** a notification with player name and reward
5. **Club marks** the order as fulfilled or rejected
6. **Player's XP** is deducted only on confirmation

### Default reward templates (clubs can modify)

| Reward | Suggested XP | Min. level |
|---|---|---|
| Club water bottle | 200 XP | 1 |
| Training t-shirt | 450 XP | 2 |
| Shin guards | 350 XP | 2 |
| Match ticket (home game) | 150 XP | 1 |
| Individual coaching session | 800 XP | 5 |
| Gold profile badge | 300 XP | 3 |
| Captain's armband (profile title) | 600 XP | 8 |
| Kit with name print | 1 200 XP | 7 |

### XP is not transferable

XP is earned by the individual player and tied to their account. It cannot be gifted, traded, or combined. This prevents gaming the system.

---

## Badge System

Badges are earned by meeting specific milestones. Each badge award comes with +100 XP. Badges display on the player profile in a grid (locked badges shown greyed out, like Steam achievements).

### Earned badges (examples)

| Badge | Emoji | Condition |
|---|---|---|
| First Step | 🎯 | Attend first training |
| Week Streak | 🔥 | 7 consecutive training days |
| Scorer | ⚽ | Score first goal |
| Team Player | 🤝 | Record 3 assists |
| Regular | 📅 | Attend 10 trainings |

### Locked badges (examples)

| Badge | Emoji | Condition |
|---|---|---|
| Monthly Streak | 🏆 | 30 consecutive days |
| Captain | 👑 | 5★ average from teammates |
| Hat-Trick Hero | 🎩 | 3 goals in one match |
| Season Hero | 🛡️ | Complete full season |
| Iron Man | 💪 | Zero absences in a month |
| Sniper | 🎯 | 10 goals in a season |
| Explorer | 🌍 | Browse 5 different clubs |
| Social Player | 🤜 | Connect 3 social accounts |

---

## Anti-abuse

- Attendance can only be marked by verified coaches (role-gated)
- Match XP is only awarded after Sportnet confirms the fixture
- Rating XP requires all fields to be completed
- Duplicate badge awards are blocked at the system level
- XP cannot go below zero (spending is blocked if insufficient balance)

---

## XP ako KPI — vyhodnocovanie v čase

XP nie je len herná mena — každý XP záznam nesie **typ akcie, čas a kontext** (hráč, kategória, klub). Vďaka tomu je XP zároveň merateľný KPI systém: to, čo hráča motivuje, dáva trénerovi a klubu dáta.

### Parametre, za ktoré sa XP zbiera, a čo merajú

| XP parameter | Zdroj záznamu | KPI, ktorý z neho odvodíme |
|---|---|---|
| Dochádzka na tréning (+10) | tréner | **Miera dochádzky** — % absolvovaných tréningov hráča/tímu/kategórie |
| Streak bonusy (+50) | automaticky | **Konzistentnosť** — podiel hráčov s aktívnym streakom, priemerná dĺžka streaku |
| Odohraný zápas (+25) | Sportnet | **Zápasová vyťaženosť** — počet zápasov, minúty na ihrisku |
| Pozápasové hodnotenie (+15) | hráč | **Miera zapojenia do spätnej väzby** — % vyplnených hodnotení po zápasoch |
| Odznaky (+100) | automaticky | **Míľniky rozvoja** — tempo dosahovania cieľov (góly, asistencie, účasť) |
| Kompletný profil (+30) | hráč | **Kvalita onboardingu** — % dokončených profilov v klube |
| Pozvanie spoluhráča (+25) | hráč | **Organický rast** — virálny koeficient, noví hráči na pozvánku |
| Záporné XP za žlté/červené karty | Sportnet | **Disciplína** — trend kariet hráča/tímu v čase (platí aj pre trénerov) |
| Bonus za postup v lige | Sportnet | **Tímový výkon** — prepojenie individuálnej aktivity s výsledkom tímu |

### Odvodené metriky

- **XP velocity** — XP získané za týždeň/mesiac. Základná metrika zapojenia; jej pokles je najskorší signál, že hráč stráca záujem.
- **Skladba XP** — pomer dochádzkového, zápasového a komunitného XP. Hráč s vysokým zápasovým, ale nízkym tréningovým XP = talent, ktorý vynecháva tréningy.
- **Aktívny hráč** — hráč s nenulovým XP za posledných 14 dní. Presnejšie než počet registrácií.
- **Index rizika odchodu** — kombinácia klesajúcej XP velocity, prerušeného streaku a neaktivity v appke. Tréner ho vidí ako zoznam rizikových hráčov (súčasť [Fynd+ Tréner](premium-profiles.md#fynd-tréner--399--mes-alebo-2999--rok)).
- **Disciplinárny trend** — záporné XP za karty agregované po mesiacoch, porovnateľné medzi kategóriami.

### Vyhodnocovanie v čase

| Rytmus | Kto | Čo obsahuje |
|---|---|---|
| Týždenne | tréner | XP velocity tímu, dochádzka za týždeň, rizikoví hráči, prerušené streaky |
| Mesačne | tréner + klub | trend dochádzky po kategóriách, skladba XP, disciplinárny trend, top 3 zlepšenia/poklesy |
| Sezónne | klub | medziročné porovnanie kategórií, podklady na koncoročné ocenenia, retencia hráčov (koľko aktívnych na začiatku sezóny dohralo do konca) |
| Priebežne | hráč | vlastný graf XP v čase, osobné rekordy, porovnanie s priemerom kategórie |

Všetky série sa počítajú ako kĺzavý priemer (4 týždne), aby jeden vynechaný týždeň nespúšťal falošné alarmy. Porovnania vždy v rámci rovnakej vekovej kategórie — U9 sa nikdy neporovnáva s U19.

### Štatistiky podľa role

- **Hráč:** vývoj XP, streak história, percentil v kategórii (zadarmo základ, detailné grafy vo Fynd+ Hráč)
- **Tréner:** tímové trendy, rizikoví hráči, export reportov (Fynd+ Tréner)
- **Klub:** dashboard všetkých kategórií, aktívni vs. registrovaní, výročné podklady (Fynd+ Klub)
- **SFZ (potenciálne partnerstvo):** anonymizované agregáty dochádzky podľa regiónov — dáta o aktivite medzi zápasmi, ktoré dnes zväz nemá

### Zásady

- KPI sa počítajú z existujúcich XP záznamov — hráč nevypĺňa nič navyše
- Individuálne dáta vidí len hráč, jeho tréner a klub; navonok len anonymizované agregáty
- XP kúpené ani ovplyvnené peniazmi neexistuje ([premium-profiles.md](premium-profiles.md)) — KPI preto ostávajú neskreslené
