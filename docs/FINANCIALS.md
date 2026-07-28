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

### 3b. Škála — národný rollout (100 000 – 200 000 používateľov ročne)

Ilustračný odhad pri rozsahu blízko celého slovenského futbalového trhu (TAM ~500-tis., viď [pitch-notes.md](../marketing/pitch-notes.md)). Architektonicky ide o rovnaký stack ako pri 10-tisícovej škále, len s väčšou kapacitou — detail zmien v [tech-stack.md](tech-stack.md#národná-škála--100-000--200-000-používateľov-ročne).

| Položka | 100 000 použ. | 200 000 použ. |
|---|---|---|
| Hosting (frontend + API) | 80 – 150 € | 150 – 250 € |
| Databáza (dedikovaná + read replika) | 150 – 250 € | 250 – 400 € |
| Redis (cache, session, real-time) | 30 – 50 € | 50 – 80 € |
| Push notifikácie (FCM) | 0 € | 0 – 30 € |
| Storage + CDN (fotky, médiá) | 80 – 150 € | 150 – 250 € |
| Monitoring / error tracking | 40 – 60 € | 60 – 100 € |
| **Infraštruktúra spolu** | **~400 – 650 € / mes.** | **~650 – 1 100 € / mes.** |
| Ľudia (DevOps/podpora, čiastočný úväzok navyše k zakladateľovi) | 800 – 1 500 € / mes. | 800 – 1 500 € / mes. |
| **Spolu (illustračne)** | **~1 200 – 2 150 € / mes.** | **~1 450 – 2 600 € / mes.** |

Ročne: **~14 – 26 tis. €** (100-tis. použ.) až **~17 – 31 tis. €** (200-tis. použ.) — rádovo desaťnásobok pilotného rozpočtu, no stále mimoriadne nízke voči klasickému enterprise vývoju vďaka PWA + serverless prístupu. Náklady rastú výrazne pomalšie než počet používateľov (~2× infra pri 20× viac používateľov oproti 10-tisícovej škále).

Pre porovnanie, príjmový potenciál pri tejto škále (rovnaké konzervatívne konverzie ako v sekcii 5): rádovo **10 000 – 25 000 € / mes.**, teda pri hornej hranici nákladov už komfortne pokrýva prevádzku aj tím. Čísla sú illustračné, nie záväzný forecast — reálne overenie až po dosiahnutí medzikroku ~10-tisícovej škály.

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
| Darovanie Fynd+ Hráč | rovnaká cena ako Fynd+ Hráč (1,99 €/mes. alebo 14,99 €/rok), platí darca | starí rodičia, fanúšikovia, firmy — nezávislé od rozpočtu rodiny |
| Firemný CSR kanál | hromadný nákup Fynd+ Hráč seats pre deti zamestnancov, množstevná zľava dohodou | B2B kanál, väčšie jednorazové obchody namiesto rodiča po rodičovi |
| Odmeňovňa — marketplace provízia | 10 – 15 % z ceny sprostredkovaného produktu | pozri detail nižšie — z nákladovej položky klubu sa stáva príjem pre Fynd |

### Darovanie a firemný CSR kanál — detail

Obe cesty riešia rovnaký problém inak než priama subscription rodiča: niekto iný než rodina platí za prémiový profil dieťaťa.

- **Darovanie:** hociktorý používateľ appky (aj bez vlastného dieťaťa v appke) môže darovať Fynd+ Hráč konkrétnemu profilu — mesačne alebo ročne, rovnaká cena ako bežné predplatné. Generuje PR hodnotu (prístup nezávislý od rodinného rozpočtu, sedí s inkluzívnym posolstvom SFZ) aj nový mikro-kanál príjmu bez zmeny ceny pre existujúcich používateľov.
- **Firemný CSR kanál:** zamestnávateľ kúpi balík Fynd+ Hráč licencií pre deti zamestnancov ako benefit (analogicky k príspevku na šport/fitness). Predáva sa ako jeden B2B obchod (napr. 50 licencií naraz s množstevnou zľavou), nie stovky jednotlivých rodičovských konverzií — nižšie predajné náklady na euro príjmu.

### Odmeňovňa ako marketplace — detail

Dnes: klub si sám kupuje a fyzicky odovzdáva odmeny (fľaša, dres, tréning s A-tímom) — čistá nákladová položka, Fynd na tom nezarába nič.

Marketplace verzia: Fynd dojedná veľkoobchodné/affiliate partnerstvá so značkami športových potrieb. V katalógu Odmeňovne popri klubových odmenách (nulový náklad — tréning s A-tímom, meno na nástenke) pribudnú aj reálne produkty od partnerov. Hráč minie nazbierané XP ako zľavu a doplatí len rozdiel do plnej ceny (napr. fľaša za 8 €, XP zníži doplatok na 3 €) — objedná sa priamo v appke, klub nič neskladuje ani nekupuje vopred. Fynd si necháva 10 – 15 % marže ako sprostredkovateľ, zvyšok ide výrobcovi/distribútorovi.

Efekt: z nákladovej položky klubu sa stáva príjmový kanál pre Fynd, klub navyše profituje z veľkoobchodných cien vyjednaných naprieč všetkými Fynd klubmi (ktoré by sám nedosiahol), a pravidlo "žiadne pay-to-win" zostáva nedotknuté — XP určuje len veľkosť zľavy, nikdy priamy nákup hernej výhody.

---

## 4b. Dynamická monetizácia

Cena, ktorá reaguje na správanie hráča a sezónnosť klubu namiesto plochej sadzby po celý rok.

| Nápad | Mechanika | Efekt |
|---|---|---|
| Zľava za streak/XP | Dlhší streak alebo vyššie XP → lacnejší Fynd+ Hráč (napr. -20 % pri 30-dňovom streaku) | Prepája monetizáciu s gamifikačnou slučkou — len na kozmetiku, nikdy na hernú výhodu |
| Rodinná zľava | 2. dieťa pod tým istým rodičovským účtom -25 %, 3. a ďalšie zadarmo | Drží pri appke celú rodinu, nie len jedno dieťa |
| Odporúčací bonus | Pozvi rodiča/hráča, ktorý sa stane platiacim → mesiac Fynd+ zadarmo | Priamy monetizačný dopad organického rastu cez zdieľateľnosť |
| Sezónna cena Klub tieru | -30 až 40 % počas letnej prestávky namiesto plnej ceny | Udrží kontinuitu platieb cez mŕtve obdobie namiesto úplného zrušenia |
| Dynamická cena sponzoringu | Cena sa mení podľa reálnej mesačnej aktivity klubu — viac v sezóne, menej cez prázdniny | Nižšie vstupné riziko pre sponzora → viac firiem to skúsi |

### Rodinná zľava — prečo sa nedá jednoducho fakovať

Zľava nie je zdieľateľný kód, ale automatický benefit na 2., 3. a ďalšie dieťa **pod tým istým rodičovským účtom**, ktorý už dnes musí potvrdiť každý nákup prémia pre hráča do 18 rokov (pozri [premium-profiles.md](premium-profiles.md), zásada 3). Aby to niekto obišiel, musel by reálne zaregistrovať ďalšie dieťa — a hráčsky profil vo Fynde sa overuje cez registráciu SFZ na Sportnete (["Player registrations... Verifies player identity"](sportnet-integration.md#what-we-sync)). Fiktívne dieťa bez reálnej registrácie v klube teda nejde len tak vytvoriť. Doplnkovo možno pridať strop (napr. max. 4 – 5 detí na rodinu) pre prípad, že by niekto mal skutočne veľa detí v jednom klube.

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
