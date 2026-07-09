# Finančný model — Fynd

Detailný rozpis nákladov, príjmov a bodu zlomu, na ktorý sa odkazuje sekcia Financovanie na [fynd.fans](https://fynd.fans). Konzervatívne odhady, stav: júl 2026.

---

## 1. Vývojové náklady (jednorazové)

| Scenár | Hotovosť | Trvanie | Poznámka |
|---|---|---|---|
| **Hybrid: solo + AI (náš plán)** | do ~2 500 € | 6 – 9 mesiacov | AI nástroje, nezávislé code review, vlastný čas popri štúdiu |
| Externý vývoj (porovnanie) | MVP od ~10 000 €, komplet do ~45 000 € | 4 – 6 mesiacov | trhová cena u slovenského vývojára/agentúry; zvážime až po overení pilotom |

---

## 2. Prevádzkové náklady — pilot (do 2 000 používateľov)

| Položka | € / mes. | Poznámka |
|---|---|---|
| Hosting + serverless funkcie | 0 – 20 | Vercel/Cloudflare, PWA je statická + API |
| Databáza + autentifikácia | ~25 | managed Postgres/BaaS, platený tier kvôli zálohám |
| Push notifikácie | 0 | FCM / web push v rámci free tieru |
| Storage (fotky zo zápasov) | 5 – 15 | objektové úložisko, rastie s počtom klubov |
| Doména + e-mail | ~5 | fynd.fans + info@fynd.fans |
| Monitoring a error tracking | ~10 | uptime + chybové reporty |
| **Údržba, updaty a upgrady** | **30 – 40** | bezpečnostné záplaty, upgrady frameworkov a závislostí, kompatibilita s novými verziami OS/prehliadačov, vývojárske a AI nástroje |
| **SLA / podpora** | **5 – 10** | status page a nástroje podpory; samotnú podporu v pilote robí zakladateľ (náklad je čas, nie hotovosť) |
| **Spolu** | **< 150 € / mes.** | **< 1 800 € / rok** |

## 3. Prevádzkové náklady — škála (~10 000 aktívnych používateľov)

| Položka | € / mes. | Poznámka |
|---|---|---|
| Infraštruktúra (hosting, DB, storage, push) | ~250 – 300 | rast najmä DB, storage a push objemu |
| **Údržba, updaty a upgrady** | **~150** | mesačný release cyklus, štvrťročné upgrady závislostí, ročný bezpečnostný audit |
| **SLA / podpora** | **~100 – 150** | prioritná podpora pre Fynd+ Klub, nástroje, čas na incidenty |
| **Spolu** | **< 600 € / mes.** | |

### SLA — k čomu sa zaväzujeme

| Parameter | Pilot | Škála (F5+) |
|---|---|---|
| Cieľová dostupnosť | 99,5 % | 99,9 % |
| Kritický výpadok (appka nedostupná) | reakcia do 4 h, obnova do 24 h | reakcia do 2 h, obnova do 12 h |
| Vážna chyba (funkcia nefunguje) | reakcia do 24 h | reakcia do 12 h, fix v najbližšom release |
| Bežná otázka / drobná chyba | do 48 h | do 48 h (Fynd+ Klub: do 24 h v pracovné dni) |
| Plánovaná údržba | mimo tréningových špičiek (nie 16:00 – 21:00), oznámená 48 h vopred | rovnako + status page |

### Cyklus updateov a upgradov

- **Priebežne:** bezpečnostné záplaty (do 72 h od zverejnenia kritickej zraniteľnosti)
- **Mesačne:** feature release + opravy chýb
- **Štvrťročne:** upgrade frameworkov a závislostí, test na nových verziách iOS/Android/prehliadačov
- **Ročne:** technologický audit (výkon, bezpečnosť, náklady) pred začiatkom sezóny

---

## 4. Príjmový model (3 piliere)

Detail tierov: [premium-profiles.md](premium-profiles.md). Žiadny pilier neobmedzuje základné funkcie.

| Pilier | Cena | Konzervatívny predpoklad |
|---|---|---|
| Fynd+ Hráč | 1,99 € / mes. (14,99 € / rok) | konverzia 3 – 5 % aktívnych hráčov |
| Fynd+ Tréner | 3,99 € / mes. (29,99 € / rok) | 5 – 10 % trénerov mimo klubovej licencie |
| Fynd+ Klub | 14,99 € / mes. (119 € / rok) | 10 – 20 % klubov po prvej sezóne |
| Lokálny sponzoring | 50 – 75 € / mes. / sponzor | 2 – 6 regionálnych sponzorov podľa fázy |
| SFZ partnerstvo | symbolický príspevok za zaznamenaný tréning | nezarátané do break-evenu — iba potenciál |

---

## 5. Bod zlomu (~3 000 aktívnych používateľov)

Odhad nákladov pri 3 000 používateľoch (medzi pilotom a škálou, vrátane SLA a údržby): **~250 – 300 € / mes.**

Konzervatívny odhad príjmov pri 3 000 aktívnych používateľoch (~30 klubov):

| Zdroj | Výpočet | € / mes. |
|---|---|---|
| Fynd+ Hráč | 3 000 × 3,5 % × 1,99 € | ~210 |
| Fynd+ Klub | 30 klubov × 15 % × 14,99 € | ~65 |
| Fynd+ Tréner | mimo klubových licencií | ~10 |
| Lokálny sponzoring | 2 × 50 € | ~100 |
| **Spolu** | | **~385 € / mes.** |

**~385 € príjmov vs. ~300 € nákladov → prevádzka vrátane SLA a údržby je pokrytá.** Pri 10 000 používateľoch generuje rovnaký model ~1 – 1,5 tis. € mesačne pri nákladoch < 600 €.

---

## 6. Predpoklady a zdroje

- Ceny infraštruktúry: verejné cenníky managed služieb (júl 2026), overované pri každom štvrťročnom audite
- Konverzie: dolné pásma benchmarkov freemium/kozmetických predplatných v gamifikovaných spotrebiteľských appkách
- Slovenský futbalový trh: 180 000+ registrovaných hráčov SFZ, ~500 000 potenciálnych používateľov vrátane rodičov a trénerov (zdroj: [pitch-notes.md](../marketing/pitch-notes.md)) → 3 000 aktívnych používateľov je < 1 % trhu
- Kurzové riziko: žiadne (náklady aj príjmy v €)
- Neráta sa s: SFZ príspevkom, grantami, investíciou — model musí stáť aj bez nich

> Čísla aktualizujeme po každej fáze roadmapy s reálnymi dátami z pilotu. História zmien: git log tohto súboru.
