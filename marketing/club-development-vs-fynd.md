# Club Development (SFZ) × Fynd — porovnanie a stratégia prepojenia

Analýza strategického projektu SFZ **Club Development** vo vzťahu k Fyndu: čo majú spoločné, v čom je Fynd iný, ako projekty prepojiť a čo to znamená pre bezplatný základ Fyndu. Časť 5 je pripravená ako podklad, ktorý sa dá prezentovať ľuďom z Club Developmentu / SFZ.

Zdroje: [futbalsfz.sk/club-development](https://futbalsfz.sk/club-development/) a podstránka [Mobilná aplikácia](https://futbalsfz.sk/club-development/mobilna-aplikacia/), prístup 9. júla 2026.

---

## 1. Čo je Club Development

Strategický projekt SFZ schválený Výkonným výborom 10. 11. 2024. Cieľ: *„udržať v ekosystéme futbalových/športových hodnôt ľudí po celý život"* cez trvalo udržateľné procesy klubov.

**Rozsah projektu** (appka je podľa SFZ len ~20 % riešenia, 80 % je obsah a vzdelávanie):

| Zložka | Obsah |
|---|---|
| 8 pilierov rozvoja klubov | infraštruktúra, financovanie, športový manažment a vzdelávanie, ľudské zdroje, komunikácia a marketing, digitalizácia, športové právo, všeobecné informácie |
| **CD.app** (mobilná aplikácia) | Flutter nad službami sportnet.online (dáta ISSF): osobný profil (+ deti zákonného zástupcu), mapa „kam na futbal", Moje aktivity (zápasy, tréningy), Obľúbené (kluby, družstvá, súťaže, osoby + notifikácie), Novinky (články podľa cieľovej skupiny), Správy (notifikácie + textové správy bez príloh, automatické tímové skupiny) |
| CD.sk | obsahový portál (vzdelávanie, činnosť klubov, zväzov a škôl) |
| Vzdelávanie | akreditovaná licencia „Športový manažment vo futbale/športe" v spolupráci s univerzitou |
| Licenčné systémy | akadémie/ÚTM, amatérske kluby, hodnotenie „kvality klubov" |

**Roadmapa CD.app:** 2025 — Activity.app, osobné štatistiky, živá mapa zápasov, plánovanie aktivít, rodičia + deti, výsledky bez reklamy pre platiacich členov SFZ/klubu, formuláre na hodnotenie kvality klubov · 2026 — dobrovoľníci, portál klubových aktivít, hodnotenia hráčov trénermi a fanúšikmi (skauting) · 2027 — publikovanie klubov, platby mesačných poplatkov rodičmi, fankluby · 2028 — integrácia Dajme spolu gól, Disney Playmakers, Školský pohár, finančný modul.

**Zdroje a tempo:** UEFA kofinancuje 50 000 € ročne (výhradne appka), SFZ investuje do digitálnych projektov 200 – 300 000 € ročne. Časová os riešenia **3 – 7 rokov**.

**Cieľové skupiny CD:** primárne rodičia, fanúšikovia, tréneri a kluboví funkcionári; ďalej učitelia (400 škôl v DSG), samosprávy, manažéri, dobrovoľníci, rozhodcovia, delegáti.

---

## 2. Čo majú projekty spoločné

Oba projekty vyrastajú z rovnakej diagnózy: informácie o klubovom futbale sú roztrieštené a ľudia zo športu odchádzajú.

| Spoločný prvok | Club Development | Fynd |
|---|---|---|
| Misia | udržať ľudí vo futbale po celý život | udržať deti pri športe cez motiváciu a návyk |
| Všetko na jednom mieste | zápasy, tréningy, novinky, notifikácie | zápasy, tréningy, oznamy, notifikácie |
| Tímová komunikácia | automatické skupiny družstiev, kanály klubu | kategóriové chaty s vekovými právami |
| Sledovanie klubov | Obľúbené + notifikácie | Club following + per-klub notifikácie |
| Osobný profil | profil + väzba rodič – dieťa | profil hráča + rodičovský pohľad |
| Tréner plánuje | tréningy a iné aktivity (2025) | tréningový kalendár od F1 |
| Dáta zo Sportnetu/ISSF | natívne (appka beží nad sportnet.online) | plánovaná integrácia vo fáze F4 |
| Hodnotenia hráčov | trénermi a fanúšikmi, skauting (2026) | pozápasové hodnotenia od F2, scouting v F6 |
| Ambícia sociálnej siete | „sociálna sieť futbalu" v Novinkách | F6 — Fynd Network (športový LinkedIn) |

Tento prienik nie je hrozba — je to **potvrdenie problému aj riešenia**. Národný zväz došiel k rovnakému záveru ako Fynd. Otázka nie je „kto má pravdu", ale kto ktorú vrstvu spraví najlepšie.

---

## 3. V čom je Fynd iný (a lepší vo svojej vrstve)

Club Development je top-down projekt riadenia a informovania ekosystému. Fynd je bottom-up produkt pre každodenný život klubu. Z toho vyplýva šesť zásadných rozdielov:

**1. Hráč-dieťa je hlavný používateľ.** Primárne cieľové skupiny CD sú rodičia, fanúšikovia, tréneri a funkcionári — samotný mladý hráč v nich chýba. Fynd je postavený od začiatku okolo hráča 8 – 18 rokov: jeho streak, jeho level, jeho profil. CD doručuje informácie o futbale; Fynd buduje návyk chodiť na tréning.

**2. Gamifikácia je jadro, nie feature.** XP, levely, odznaky, streaky a Odmeňovňa s klubovým katalógom odmien — mechaniky overené Duolingom, aplikované na mládežnícky šport. CD nič také nemá v pláne ani do roku 2028. Toto je vrstva, ktorú Fynd robí najlepšie a ktorá v ekosystéme chýba.

**3. Dochádzka ako živé dáta.** Tréner označí dochádzku za 30 sekúnd — a z nej rastú streaky hráčov, KPI tímu aj index rizika odchodu ([xp-system.md](../docs/xp-system.md#xp-ako-kpi--vyhodnocovanie-v-čase)). CD plánuje „formuláre na zber údajov o kvalite klubov" — Fynd tie isté údaje generuje automaticky z každodennej prevádzky, bez vypĺňania čohokoľvek.

**4. Rýchlosť a cena.** CD počíta s horizontom 3 – 7 rokov a rozpočtom státisícov eur. Fynd má plán F1 – F5 na ~5 mesiacov s hotovosťou do 2 500 € ([FINANCIALS.md](../docs/FINANCIALS.md)). Fynd si môže dovoliť experimentovať, zlyhať lacno a iterovať rýchlo — presne to, čo si federačný projekt dovoliť nemôže.

**5. Bohatšia klubová každodennosť.** Live ticker so zostavami, fotografie zo zápasov (role Fotograf/Grafik), Odmeňovňa, straty a nálezy, sezónne témy. Správy v CD.app sú zámerne „len textové bez príloh" — Fynd je miesto, kde klub žije, nie len číta.

**6. Nezávislý a transparentný biznis model.** Fynd nezávisí od rozpočtu zväzu ani UEFA grantu: 3 piliere (prémiové profily, lokálny sponzoring, SFZ partnerstvo ako bonus), break-even pri ~3 000 používateľoch. CD viaže bezreklamný obsah na platené členstvo SFZ; Fynd je bez reklamných sietí pre všetkých od začiatku.

### Interne úprimne: v čom je CD silnejšie a aké sú riziká

- **Oficiálne dáta a autorita.** CD.app sedí priamo na sportnet.online/ISSF. Fynd túto integráciu len plánuje (F4) a potrebuje k nej prístup — kľúčová závislosť a zároveň hlavný dôvod, prečo s SFZ spolupracovať, nie súperiť.
- **Zdroje a distribúcia.** 200 – 300 tis. € ročne, tím, 2 800+ klubov pod zväzom, 400 škôl v DSG, vzdelávací obsah a licenčné systémy. Fynd nič z toho nezreplikuje — a nemusí.
- **Prekrytie základu.** CD.app postupne komoditizuje informačné funkcie (výsledky, kalendár, notifikácie, základný chat). Fynd na nich nesmie stavať hodnotu ani monetizáciu — hodnota Fyndu je v motivačnej vrstve (pozri časť 6).
- **Politické riziko.** Ak by SFZ vnímal Fynd ako konkurenciu CD.app, môže sťažiť prístup k API. Preto je pozícia Fyndu jednoznačná: **gamifikačná vrstva, ktorá CD dopĺňa** — nie druhá informačná appka.
- **Časové okno.** Prienik sa bude zväčšovať (2026 skauting, 2027 platby). Fynd má ~2 sezóny na to, aby bol v kluboch nenahraditeľný skôr, než CD.app dozreje.

---

## 4. Ako projekty prepojiť

Princíp: **CD vlastní oficiálnu informačnú a vzdelávaciu vrstvu, Fynd vlastní motivačnú a komunitnú vrstvu klubu.** Obe stoja na tých istých dátach (sportnet.online).

```
┌─────────────────────────────────────────────────────┐
│  MOTIVAČNÁ VRSTVA — FYND                            │
│  XP · streaky · levely · Odmeňovňa · live ticker    │
│  dochádzka · kategóriové chaty · fotky · KPI        │
├─────────────────────────────────────────────────────┤
│  OFICIÁLNA VRSTVA — CLUB DEVELOPMENT                │
│  CD.app (info, mapa, novinky) · CD.sk (vzdelávanie) │
│  licenčné systémy · manažérske vzdelávanie          │
├─────────────────────────────────────────────────────┤
│  DÁTOVÁ VRSTVA — SPORTNET.ONLINE / ISSF             │
│  registrácie · súpisky · výsledky · prestupy        │
└─────────────────────────────────────────────────────┘
```

### Konkrétne integračné body (mapované na roadmapu CD)

| Rok CD | Plán CD | Prepojenie s Fyndom |
|---|---|---|
| 2025 | formuláre „kvalita klubov" | Fynd KPI dashboard exportuje overené dochádzkové a engagement dáta priamo do hodnotenia — klub nevypĺňa formuláre |
| 2025 | osobné štatistiky a profily | jednotná identita cez sportnet ID (SSO); Fynd profil odkazuje na oficiálny CD profil a naopak |
| 2026 | hodnotenia hráčov, skauting | Fynd pozápasové hodnotenia a XP KPI ako doplnkový signál pre skauting (opt-in hráča a rodiča) |
| 2026 | portál klubových aktivít | Fynd automaticky publikuje sumáre aktivít klubu (tréningy, streaky, odmeny) do portálu |
| 2027 | platby klubových poplatkov | necháme CD — Fynd platby zámerne nerobí; prepojíme stav „zaplatené" ako podmienku Odmeňovne, ak to klub chce |
| 2028 | integrácia DSG a školských projektov | Fynd streak/XP mechanika ako motivačný modul pre školské projekty (najprirodzenejšie miesto pre gamifikáciu) |

### Modely spolupráce (od najľahšieho po najhlbší)

1. **Dátové partnerstvo** — Fynd dostane prístup k sportnet.online API (to, čo už plánuje F4); SFZ dostane anonymizované agregáty tréningovej aktivity — dáta, ktoré dnes nemá odkiaľ získať.
2. **Obsahové partnerstvo** — články a vzdelávací obsah CD.sk sa zobrazujú vo Fynde trénerom a rodičom (CD tvrdí, že obsah je 80 % riešenia — Fynd mu dá denné publikum).
3. **Fynd ako odporúčaná gamifikačná vrstva CD** — CD.app zostáva oficiálny informačný kanál, Fynd je odporúčaná appka pre vnútorný život klubu; vzájomné deep-linky (výsledok v CD → live ticker a fotky vo Fynde; profil vo Fynde → oficiálne štatistiky v CD).
4. **Spoločný pilot** — jedna sezóna, jeden ObFZ (5 – 10 klubov okolo Novej Bane): Fynd meria dochádzku a engagement, SFZ dostáva mesačný report. Výstup: dôkaz pre celoslovenské nasadenie oboch projektov.

Fynd pri tom zostáva samostatný produkt s vlastnou značkou a multi-športovou ambíciou (F5/F6) — spolupráca so SFZ pokrýva futbal, neblokuje expanziu do iných športov.

---

## 5. Podklad pre SFZ — Fynd × Club Development (partner-facing)

> Táto časť je formulovaná tak, aby sa dala poslať alebo odprezentovať tímu Club Developmentu.

**Fynd je motivačná vrstva pre každodenný život mládežníckeho klubu.** Streaky dochádzky, XP, levely a klubová Odmeňovňa — mechaniky, ktoré udržia dieťa pri tréningu — postavené nad oficiálnymi dátami sportnet.online. Presne tá časť ekosystému, ktorú Club Development (zatiaľ) nerieši: CD doručuje správne informácie správnym skupinám, Fynd mení informácie na návyk dieťaťa.

**Čo Fynd prináša Club Developmentu:**

- **Dáta, ktoré dnes neexistujú.** Tréningová aktivita klubov medzi zápasmi je pre zväz čierna diera. Fynd ju meria automaticky (dochádzka za 30 sekúnd, overená trénerom) — pripravené pre hodnotenie kvality klubov aj licenčné systémy, bez jediného formulára.
- **Zapojenie dieťaťa.** CD cieli na rodičov, fanúšikov, trénerov a funkcionárov. Fynd dopĺňa chýbajúcu skupinu — samotného mladého hráča — a drží ho v ekosystéme presne v duchu misie CD („udržať ľudí vo futbale po celý život").
- **Rýchle overenie v teréne.** Kým CD buduje robustné celoštátne riešenie (3 – 7 rokov), Fynd vie za jednu sezónu otestovať motivačné mechaniky na pilotných kluboch a odovzdať dáta aj poznatky.
- **Denné publikum pre obsah CD.** Vzdelávací obsah CD.sk sa vo Fynde zobrazí trénerom a rodičom v appke, ktorú otvárajú niekoľkokrát do týždňa.

**Čo Fynd potrebuje od SFZ:** prístup k sportnet.online API (overenie hráčov, súpisky, výsledky, prestupy) a súhlas so spoločným pilotom v jednom ObFZ.

**Návrh prvého kroku:** pilotná sezóna 2026/27, 5 – 10 klubov v regióne Nová Baňa / Žiar nad Hronom. Fynd nasadí platformu na vlastné náklady, SFZ dostane mesačné reporty dochádzky a engagementu. Po sezóne spoločné vyhodnotenie: či a ako zapojiť Fynd do ekosystému Club Development natrvalo.

*Kontakt: Tadeáš Letko, info@fynd.fans, fynd.fans*

---

## 6. Čo nechať v základe Fyndu (free tier voči CD)

Kľúčová zásada: **nič, čo CD.app ponúka zadarmo, nesmie byť vo Fynde spoplatnené.** Inak Fynd vyzerá ako paywall na verejné informácie — a proti bezplatnej oficiálnej appke to prehrá.

| Funkcia | CD.app | Fynd základ (zadarmo) | Fynd+ (platené) |
|---|---|---|---|
| Výsledky, zápasy, tabuľky | ✅ zadarmo (bez reklamy pre platiacich členov SFZ) | ✅ vždy, bez reklamných sietí pre všetkých | — |
| Kalendár aktivít a tréningov | ✅ | ✅ | šablóny a hromadné plánovanie (Tréner) |
| Notifikácie o zmenách | ✅ | ✅ vrátane per-klub nastavení | vlastné zvuky (Hráč) |
| Tímové chaty | ✅ (len text, bez príloh) | ✅ s vekovými právami, prílohami a fotkami | — |
| Sledovanie klubov | ✅ Obľúbené | ✅ | — |
| Osobný profil + štatistiky | ✅ (2025) | ✅ základ | grafy trendov, porovnania (Hráč) |
| **Dochádzka + streak** | ❌ | ✅ **jadro Fyndu, vždy zadarmo** | — |
| **XP, levely, odznaky** | ❌ | ✅ vždy zadarmo, nedajú sa kúpiť | — |
| **Odmeňovňa** | ❌ | ✅ (klub konfiguruje, hráč nakupuje za XP) | štatistiky a návrhy ocenení (Klub) |
| **Live ticker so zostavami** | ❌ (živá mapa je iná funkcia) | ✅ | — |
| KPI analytika, riziko odchodu | ❌ (formuláre kvality) | základný týždenný prehľad | plná analytika a exporty (Tréner/Klub) |
| Klubový branding v appke | ❌ | — | ✅ (Klub) |

Závery pre [premium-profiles.md](../docs/premium-profiles.md) (hranica free/premium zostáva v platnosti):

1. Informačné funkcie, ktoré CD komoditizuje, sú vo Fynde zadarmo — s lepším UX a navyše s prílohami, fotkami a vekovými právami.
2. Diferenciátory (streak, XP, Odmeňovňa, live ticker, dochádzka) sú **tiež zadarmo** — sú to motory adopcie a dát; spoplatniť ich by zabilo sieťový efekt.
3. Platí sa výhradne za kozmetiku, hlbokú analytiku, branding a prioritnú podporu — vrstvy, ktoré CD.app neponúka a ponúkať neplánuje.
4. Fynd nikdy neviaže odstránenie reklám na platbu (nemá reklamné siete) — kontrast voči CD modelu „bez reklamy pre platiacich členov SFZ" je komunikačná výhoda.

---

## Súvisiace dokumenty

- [Konkurenčné prostredie](competitive-landscape.md) — CD dopĺňa mapu ako strategická platforma, nie konkurent
- [Prémiové profily](../docs/premium-profiles.md) — hranica free/premium
- [Adopcia klubmi](club-adoption.md) — pilot, ktorý môže byť zároveň spoločným pilotom so SFZ
- [Roadmap](../docs/roadmap.md) — F4 Sportnet integrácia, F6 Fynd Network
- [XP ako KPI](../docs/xp-system.md#xp-ako-kpi--vyhodnocovanie-v-čase) — dáta, ktoré Fynd vie dodať SFZ
