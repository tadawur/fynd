import Link from "next/link";

const TIERS = [
  {
    name: "Fynd+ Hráč",
    price: "1,99 €",
    period: "/ mes. (alebo 14,99 €/rok)",
    audience: "Hráči 8–18 rokov (nákup potvrdzuje rodič) a dospelí hráči vrátane veteránov.",
    features: [
      "Exkluzívne animované pozadia profilu a prémiové rámčeky avatara",
      "Sezónne skiny — 6× ročne nové",
      "Graf vývoja XP v čase a porovnanie s priemerom kategórie",
      "Pripnutie najlepších momentov a odznakov na vrch profilu",
      "Vlastné zvuky notifikácií, rozšírené filtre v rebríčkoch",
    ],
    color: "var(--color-green)",
  },
  {
    name: "Fynd+ Tréner",
    price: "3,99 €",
    period: "/ mes. (alebo 29,99 €/rok)",
    audience: "Tréneri mládežníckych aj dospelých tímov. Klubová licencia ho zahŕňa automaticky.",
    features: [
      "Dashboard rizikových hráčov (dochádzka, streaky, neaktivita)",
      "Mesačné a sezónne KPI reporty, export do PDF/CSV",
      "Šablóny tréningov a hromadné plánovanie na mesiac",
      "Detailný prehľad pozápasových hodnotení v čase",
      "Prémiové trénerské rámčeky a pozadia",
    ],
    color: "var(--color-gold)",
  },
  {
    name: "Fynd+ Klub",
    price: "14,99 €",
    period: "/ mes. (alebo 119 €/rok)",
    audience: "Vedenie klubu — jedna licencia pokrýva celý klub vrátane trénerského tieru.",
    features: [
      "Farby a logo klubu v appke pre všetkých členov",
      "XP KPI dashboard celého klubu, medziročné porovnania",
      "Viac admin účtov (5 namiesto 1), hromadný import členov",
      "Fynd+ Tréner pre všetkých trénerov klubu v cene",
      "Prioritná podpora — odpoveď do 24 h v pracovné dni",
    ],
    color: "var(--color-coral)",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green" />
          <span className="font-display text-lg font-bold">Fynd</span>
        </div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Fynd+ Prémiové profily</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Fynd je a zostane pre kluby, hráčov aj rodičov bezplatný vo všetkých základných
          funkciách. Prémium je voliteľný doplnok, ktorý financuje prevádzku platformy — nikdy
          nie podmienka používania.
        </p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-2">
        <div>
          <p className="font-medium text-green">🚫 Žiadne pay-to-win</p>
          <p className="text-sm text-muted">
            Prémiový účet nikdy nezíska XP, lepšie umiestnenie v rebríčku ani žiadnu súťažnú
            výhodu. Platí sa len za kozmetiku, pohodlie a analytiku.
          </p>
        </div>
        <div>
          <p className="font-medium text-green">🔓 Žiadna funkčná stena</p>
          <p className="text-sm text-muted">
            Chaty, kalendár, dochádzka, výsledky a notifikácie sú zadarmo bez limitov, navždy.
          </p>
        </div>
        <div>
          <p className="font-medium text-green">🧒 Deti nie sú zákazníci</p>
          <p className="text-sm text-muted">
            Nákup prémiového profilu hráča do 18 rokov musí potvrdiť rodič. Žiadne dark patterns.
          </p>
        </div>
        <div>
          <p className="font-medium text-green">💚 Rodičia a fanúšikovia zadarmo</p>
          <p className="text-sm text-muted">
            Ich rola je podporná — sledujú, povzbudzujú a rozhodujú o dôvere platforme.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
            <div>
              <h2 className="font-display text-xl font-bold" style={{ color: tier.color }}>
                {tier.name}
              </h2>
              <p className="mt-1">
                <span className="font-display text-2xl font-bold">{tier.price}</span>
                <span className="text-sm text-muted"> {tier.period}</span>
              </p>
              <p className="mt-2 text-xs text-muted">{tier.audience}</p>
            </div>
            <ul className="flex flex-1 flex-col gap-2 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span style={{ color: tier.color }}>✓</span>
                  <span className="text-muted">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-line p-5 text-center text-sm text-muted">
        Táto stránka je zatiaľ len informačná — platobný tok (Fynd+ predplatné) ešte nie je
        napojený na žiadneho platobného spracovateľa. Základná appka funguje naplno zadarmo.
      </div>

      <div className="text-center">
        <Link href="/dashboard" className="rounded-full bg-green px-6 py-3 font-medium text-ink hover:brightness-110">
          Späť do appky
        </Link>
      </div>
    </div>
  );
}
