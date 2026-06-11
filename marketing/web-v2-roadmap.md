# Marketing Web — Roadmap v2

## Overview

Verzia 0 marketingového webu (`site/index.html`) je hotová a nasadená. Ďalší krok sú tri paralelné workstreamy:

- **A — Doladenie obsahu** existujúceho webu (presnosť, presvedčivosť, chýbajúce CTA)
- **B — Business / Investorská sekcia** (zhrnutie biznis modelu pre investorov a kluby, postavené na `marketing/pitch-notes.md`)
- **C — Partnerská sekcia** pre firmy zo športového sektora (predajcovia tovaru a služieb, sponzori)

Každý workstream je samostatne nasaditeľný — A sa dá robiť priebežne, B a C sú nové sekcie/stránky webu.

> **Tento dokument je jediný zdroj pravdy pre tracking tohto plánu.** Status (🟡 Planning / 🟠 In Progress / 🟢 Done) a checkboxy sa priebežne aktualizujú tu, podľa rovnakého formátu ako `docs/roadmap.md`.

---

## Aktuálny stav

| Workstream | Status | Ďalší krok |
|---|---|---|
| A — Doladenie obsahu | 🟡 Planning | Schváliť poradie prác, začať s hero/CTA a SEO |
| B — Business/Investorská sekcia | 🟡 Planning | Rozhodnúť formu (sekcia vs. podstránka vs. PDF) a publikum |
| C — Partnerská sekcia | 🟡 Planning | Pripraviť `marketing/partner-program.md` (persony partnerov, value props, tiery) |

---

## Workstream A — Doladenie existujúceho obsahu webu
**Status:** 🟡 Planning

### Úlohy

- [ ] **Hero sekcia** — overiť tagline a hlavné CTA (registrácia záujmu / waitlist pre kluby vs. "coming soon")
- [ ] **Stats sekcia** — prepojiť čísla so zdrojom (`marketing/pitch-notes.md` — SFZ 2025), pridať zdroj/poznámku pod čiarou
- [ ] **Problémová sekcia** ("Šport prehráva digitálny boj o pozornosť") — skontrolovať, či copy zodpovedá `README.md` → The Problem
- [ ] **App sekcia** (4 obrazovky, návykový cyklus) — zosúladiť s aktuálnym stavom F1/F2 z `docs/roadmap.md`
- [ ] **Features sekcia** (14 funkcií) — cross-check s `docs/features.md`, doplniť chýbajúce/odstrániť neaktuálne
- [ ] **Audience sekcia** (4 postavy) — zosúladiť s personami v `marketing/target-audience.md`
- [ ] **Roadmap sekcia** — zosúladiť s `docs/roadmap.md` (F1–F5), pridať aktuálny status
- [ ] **Brand sekcia** — bez zmeny, len vizuálna kontrola
- [ ] **Seasons sekcia** — funkčná, skontrolovať na mobile
- [ ] **Nové:** kontaktný/lead formulár alebo mailto CTA ("Som klub, chcem pilot" / "Chcem vedieť viac")
- [ ] **SEO/meta:** title, description, OG image, favicon
- [ ] **Accessibility pass** (kontrast, klávesová navigácia) — pozri `design:accessibility-review`

### Success criteria
- Všetky čísla a texty na webe súhlasia s aktuálnymi `.md` podkladmi v repo
- Existuje aspoň jedno funkčné CTA na zber kontaktov (kluby/partneri)

---

## Workstream B — Business / Investorská sekcia
**Status:** 🟡 Planning

### Rozhodnutie pred štartom
- [ ] **Forma:** nová sekcia na hlavnej stránke vs. samostatná podstránka (napr. `/pre-investorov`) vs. odkaz na samostatný dokument/PDF
- [ ] **Publikum:** investori, potenciálni partneri (kluby, SFZ), alebo obe skupiny → ovplyvňuje tón a mieru detailu

### Obsah (zdroj: `marketing/pitch-notes.md`)
- [ ] Market size / TAM tabuľka (2 800+ klubov, 180 000+ hráčov, ~500 000 TAM)
- [ ] Business model — freemium tiers (Free / Club / Pro / Federation)
- [ ] "Why now" — 4 dôvody (Sportnet adopcia, post-COVID, Gen Z, žiadna priama konkurencia)
- [ ] "Why Fynd wins" — porovnávacia tabuľka s konkurenciou (zo `marketing/competitive-landscape.md`)
- [ ] Traction goals (Year 1) — pilot, beta, kluby, MAU, platiace kluby
- [ ] Investment ask (orientačný rozpočet ~9 000 €)
- [ ] CTA — kontakt / dohodnúť stretnutie / stiahnuť pitch dokument

### Success criteria
- Sekcia/stránka jasne komunikuje veľkosť trhu, biznis model a "ask" bez nutnosti posielať samostatný dokument

---

## Workstream C — Partnerská sekcia (firmy v športe)
**Status:** 🟡 Planning

Cieľová skupina podľa rozhodnutia: **predajcovia športového vybavenia/oblečenia**, **lokálne služby pre kluby a hráčov** (fyzioterapeuti, výživoví poradcovia, kempy a pod.) a **sponzori sezónnych tém**.

### Úlohy
- [ ] Definovať hodnotovú ponuku pre každý typ partnera:
  - [ ] Predajcovia tovaru/oblečenia → produkty/zľavy v "Odmeňovni" (reward shop), % provízia
  - [ ] Lokálne služby → sponzorované umiestnenia/odporúčania smerom ku klubom a rodičom
  - [ ] Sezónne témy → co-branded sezónna téma v appke (Halloween, Vianoce, Leto...) — pozri `marketing/pitch-notes.md` → Additional revenue streams
- [ ] Navrhnúť partnerské "tiery" / orientačný cenník (zatiaľ TBD, môže byť "kontaktujte nás")
- [ ] Sekcia na webe: 3 karty (typy partnerstiev) + spoločné CTA "Staň sa partnerom"
- [ ] Partnerský kontaktný formulár / mailto
- [ ] Pripraviť podkladový dokument `marketing/partner-program.md` (persony partnerov, value props, tiery) — vstup pre copy webu

### Success criteria
- Existuje samostatná, jasne odlíšená sekcia/stránka pre partnerov s CTA na kontakt
- `marketing/partner-program.md` existuje a je zdrojom pravdy pre copy

---

## Navrhované poradie (na schválenie)

1. **A — Doladenie obsahu** (rýchle víťazstvá, zosúladenie s aktuálnymi `.md` podkladmi, najnižšie riziko)
2. **C — Partnerská sekcia** (nový revenue stream, relatívne rýchlo pridateľná ako nová sekcia/stránka)
3. **B — Business/Investorská sekcia** (vyžaduje rozhodnutie o forme a publiku pred tvorbou obsahu)

Toto poradie je len návrh — finálna priorita a termíny podľa rozhodnutia Tadeáša.

---

## Otvorené otázky

- Workstream B: samostatná stránka, sekcia na hlavnej stránke, alebo PDF na stiahnutie?
- Workstream C: aké partnerské tiery/ceny (alebo zatiaľ len "kontaktujte nás")?
- Existuje formulárový backend (napr. Formspree, Google Form) na zber kontaktov, alebo zatiaľ len `mailto:info@fynd.sk`?

---

## Súvisiace dokumenty

- [`marketing/pitch-notes.md`](pitch-notes.md) — biznis model, market size, investment ask
- [`marketing/target-audience.md`](target-audience.md) — persony
- [`marketing/competitive-landscape.md`](competitive-landscape.md) — konkurencia
- [`docs/roadmap.md`](../docs/roadmap.md) — produktový roadmap F1–F5
- [`docs/features.md`](../docs/features.md) — detail funkcií
