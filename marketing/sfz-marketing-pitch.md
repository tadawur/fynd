# Marketingový podklad pre SFZ — príprava partnerskej prezentácie

> Zápis zo session z 22. júla 2026. Nadväzuje na [Club Development × Fynd](club-development-vs-fynd.md), ktorý je napísaný pre produktový/CD tím — táto analýza dopĺňa uhol pohľadu, ktorý CD podklad nerieši: marketing, PR a dosah.

## Kontext a cieľ

Tadeáš chce prezentovať SFZ marketing tímu podklad s cieľom **schválenia partnerstva a spoločnej pilotnej sezóny 2026/27** (rovnaký pilot ako v [club-development-vs-fynd.md, časť 5](club-development-vs-fynd.md#5-podklad-pre-sfz--fynd--club-development-partner-facing), len s marketingovým rámcovaním navyše). Postup v tejto session:

1. Konkurenčná analýza Sponde (Spond) — čo robí lepšie ako Fynd.
2. Na základe toho odporúčania, čo vylepšiť, aby podklad zaujal aj marketing tím SFZ (nie len Club Development).
3. Príprava samotnej prezentácie (`.pptx`) kombinujúcej produktový aj marketingový pitch.

---

## 1. Sponde (Spond) — čo robí lepšie ako Fynd

Sponde = **Spond**, celosvetovo najpoužívanejšia appka na správu športových tímov/klubov (12M+ používateľov, zadarmo, plus platená nadstavba Spond Club). Krátky profil je aj v [competitive-landscape.md](competitive-landscape.md).

Reálne medzery, ktoré má Spond a Fynd nie (ani v roadmape F1–F6):

- **Výber platieb od rodičov/hráčov** — členské, poplatky za akcie, výstroj, tábory. Jadro biznisu Spond Club (transakčný poplatok). Fynd túto vrstvu nerieši vôbec — `docs/roadmap.md` má v "Out of Scope" len merchandise e-commerce a ticket sales, členské poplatky sa nespomínajú nikde.
- **RSVP pred udalosťou** — rodič/hráč vopred potvrdí účasť na tréningu/zápase (vrátane waiting listu pri obmedzenej kapacite). Fynd rieši dochádzku opačne — tréner ju označuje *počas/po* tréningu, žiadne predbežné potvrdzovanie.
- **Vlastná verejná webstránka klubu** (Spond Club Website). Fynd má len interný "Club Discovery" adresár vo vlastnej appke, nie samostatnú verejnú stránku klubu navonok.
- **Registrácia + platba na kempy/akadémie/tábory** — súvisí s bodom o platbách, tiež chýba.
- **Multišportovosť naživo dnes** — Spond funguje pre desiatky športov hneď teraz. Fynd je sport-agnostic v návrhu, ale reálne beží len na futbale; hokej/basketbal/hádzaná sú až vo Fáze 5.
- **Škála a dôvera** — 12M+ používateľov globálne, roky prevádzky naprieč krajinami. Fynd je zatiaľ na úrovni jedného pilotného klubu.

**Záver pre produktovú stratégiu:** najvýznamnejšia medzera je výber platieb — kluby ju dnes riešia hotovosťou/bankovým prevodom mimo akejkoľvek appky, presne to, čo sa Fynd inde snaží nahradiť. Stojí za úvahu pridať ju aspoň do roadmapy (F5/F6), aj keď to zvyšuje komplexnosť (platobná brána, KYC, zodpovednosť za peniaze detí).

---

## 2. Čo vylepšiť, aby podklad zaujal aj marketing SFZ

Existujúci partner-facing podklad (`club-development-vs-fynd.md`, časť 5) je napísaný pre **produktový/CD tím** — dochádzkové dáta, API prístup, gamifikačné mechaniky. Marketing tím SFZ počúva na iné veci: dosah, obsah, brand, čísla na PR a granty. Odporúčania:

- **Vizuálne/video demo namiesto markdownu.** `docs/branding.md` má sekciu "App Store Assets (future)" — 30s preview video streak → notifikácia → rebríček — zatiaľ neexistuje. Malo by byť hotové pred stretnutím, nie po ňom.
- **Zdieľateľnosť ako feature, nie len detail persony.** `target-audience.md` spomína, že Lukáš (14) chce linknúť profil z Instagram bio — appka zatiaľ nemá explicitné "zdieľaj streak/odznak/umiestnenie do Instagram Story" tlačidlo. Rebríčkové odznaky (top 1–3 celoslovensky) sú prirodzene virálne; toto marketing vie premeniť na organický dosah bez rozpočtu.
- **Prepojenie na Dajme spolu gól (DSG) posunúť z 2028 na "teraz".** DSG integrácia je v CD roadmape produktovo až vo fáze 2028, ale DSG je aktívna marketingová kampaň SFZ dnes — dochádzkové/engagement dáta z pilotu môžu slúžiť ako materiál pre DSG reporting/PR už v sezóne 2026/27.
- **Case study prerámcovať ako co-marketing asset**, nie len predajný materiál pre ďalšie kluby (`club-adoption.md`, 2.6) — rovnaký obsah môže SFZ marketing publikovať ako dôkaz podpory grassroots inovácie.
- **Konkrétny mockup co-brandingu.** Sezónne témy appky (6× ročne) sú ideálne miesto na vizuálny návrh spolupráce (napr. počas kvalifikácie) — jeden obrázok presvedčí viac než odsek textu.
- **Chýba dievčenský/inkluzívny hlas medzi personami.** Všetkých 5 hlavných person v `target-audience.md` je bez explicitnej dievčenskej hráčky — SFZ aj UEFA marketingovo silno komunikujú rast dievčenského futbalu.
- **Agregátne, anonymizované celoslovenské dáta o angažovanosti mládeže** ako samostatný benefit pre marketing/PR use-case (odlíšené od dát pre CD kvalitu klubov) — materiál pre tlačové správy a žiadosti o granty, ktorý SFZ dnes nemá odkiaľ získať.

Najväčší pákový efekt na malú investíciu času: demo video/GIF a jeden co-branding mockup.

---

## 3. Prezentácia — `Fynd × SFZ — podklad na partnerstvo.pptx`

Na základe bodov 1–2 bola pripravená kombinovaná prezentácia (produkt + dáta + marketing/PR hodnota) pre reálne stretnutie so SFZ. 16 slidov:

1. Titulka — Fynd, "Beyond the Score", podklad pre SFZ
2. Problém — fragmentácia komunikácie, žiadna digitálna motivácia
3. Trh v číslach — 2 800+ klubov, 180 000+ hráčov, ~500 000 TAM
4. Produkt — 3 piliere (streak, XP/Odmeňovňa, live ticker/rebríčky)
5. Ako appka vyzerá — ilustratívne mockupy obrazoviek
6. Fynd × Club Development — spoločná diagnóza, "CD vs Fynd" porovnanie
7. Vrstvový model spolupráce (motivačná / oficiálna / dátová vrstva)
8. Čo Fynd prináša SFZ — produktová a dátová hodnota pre CD
9. Deliaci slide — prechod na marketingovú časť
10. Organický dosah cez hráčov a rodičov (zdieľateľnosť)
11. Dajme spolu gól — spolupráca hneď, nie v 2028
12. Co-branding — koncept sezónnych tém
13. Ďalšie PR a dátové príležitosti (case study, granty, inkluzivita)
14. Biznis model — nezávislá udržateľnosť bez rozpočtu SFZ
15. Návrh pilotu 2026/27 — konkrétny ask (čo Fynd potrebuje / čo SFZ získa)
16. Ďalšie kroky a kontakt

**Dizajn:** tmavá navy + zelená/zlatá brand paleta z `docs/branding.md`, vlastné ilustratívne mockupy appky (jasne označené ako koncept, žiadne oficiálne logo SFZ). Na žiadosť o väčšiu dynamiku boli layouty prerobené — rotované/rozhádzané karty, stupňovité stĺpce, "VS" súboj namiesto plochej tabuľky, dva plnofarebné (gold/green) slidy pre rytmus, opakujúci sa "speed slats" motív v rohoch.

**Stav:** súbor je hotový, prešiel validáciou aj vizuálnou kontrolou všetkých 16 slidov. Zatiaľ je len na stiahnutie mimo repozitára (voľba z tejto session) — ak sa má natrvalo uložiť do `marketing/`, treba to explicitne potvrdiť.

---

## Súvisiace dokumenty

- [Club Development × Fynd](club-development-vs-fynd.md) — produktovo orientovaný partner-facing podklad, časť 5
- [Konkurenčné prostredie](competitive-landscape.md) — profil Spondu a ostatných konkurentov
- [Adopcia klubmi](club-adoption.md) — case study plán, ktorý sa dá prerámcovať na co-marketing asset
- [Branding](../docs/branding.md) — sezónne témy, app store assets (video demo — zatiaľ chýba)
- [Cieľové skupiny](target-audience.md) — 5 hlavných person, chýba dievčenská hráčka
