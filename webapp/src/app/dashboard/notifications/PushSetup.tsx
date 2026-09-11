"use client";

import { useEffect, useState } from "react";
import {
  subscribeToPush,
  unsubscribeFromPush,
  getExistingPushSubscription,
  isPushSupported,
} from "@/lib/fynd/push";
import { IconBell } from "@/components/icons/BrandIcons";

type Status = "checking" | "unsupported" | "denied" | "off" | "on";

export function PushSetup() {
  const [status, setStatus] = useState<Status>("checking");
  const [busy, setBusy] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isPushSupported()) {
        setStatus("unsupported");
        return;
      }
      if (typeof Notification !== "undefined" && Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      const sub = await getExistingPushSubscription();
      setStatus(sub ? "on" : "off");
    })();
  }, []);

  async function handleEnable() {
    setBusy(true);
    const res = await subscribeToPush();
    setBusy(false);
    setStatus(res.ok ? "on" : res.reason === "denied" ? "denied" : "off");
  }

  async function handleDisable() {
    setBusy(true);
    await unsubscribeFromPush();
    setBusy(false);
    setStatus("off");
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <IconBell className="h-6 w-6 shrink-0" />
        <div className="flex-1">
          <p className="font-medium">Push notifikácie</p>
          <p className="text-sm text-muted">
            {status === "on" && "Zapnuté na tomto zariadení."}
            {status === "off" &&
              "Dostávaj upozornenia na oznamy, tréningy, chat aj zápasy naživo — aj keď appku nemáš otvorenú."}
            {status === "denied" &&
              "Notifikácie sú zablokované v nastaveniach prehliadača/telefónu — povoľ ich tam a skús znova."}
            {status === "unsupported" &&
              "Tento prehliadač web push nepodporuje. Na iPhone appku najprv pridaj na plochu (návod nižšie)."}
            {status === "checking" && "Zisťujem stav…"}
          </p>
        </div>
        {status === "off" && (
          <button
            onClick={handleEnable}
            disabled={busy}
            className="shrink-0 rounded-full bg-green px-4 py-2 text-sm font-medium text-ink disabled:opacity-50"
          >
            Zapnúť
          </button>
        )}
        {status === "on" && (
          <button
            onClick={handleDisable}
            disabled={busy}
            className="shrink-0 rounded-full border border-line px-4 py-2 text-sm text-muted hover:bg-card"
          >
            Vypnúť
          </button>
        )}
      </div>

      <button
        onClick={() => setShowInstall((v) => !v)}
        className="mt-3 text-sm text-green hover:underline"
      >
        {showInstall ? "Skryť návod" : "Ako si appku otvoriť/nainštalovať na telefóne"}
      </button>

      {showInstall && (
        <div className="mt-3 flex flex-col gap-3 rounded-xl border border-line bg-card p-3 text-sm text-muted">
          <div>
            <p className="mb-1 font-medium text-fg">iPhone (Safari)</p>
            <p>
              Otvor <span className="text-fg">fynd.fans</span> v Safari → ikona zdieľania (štvorček
              so šípkou hore) → „Pridať na plochu“. Appku potom vždy otváraj cez ikonu na ploche —
              na iPhone push notifikácie inak nefungujú (obmedzenie Applu, nie appky).
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-fg">Android (Chrome)</p>
            <p>
              Otvor <span className="text-fg">fynd.fans</span> v Chrome → ponuka (tri bodky) →
              „Pridať na plochu“ / „Nainštalovať appku“. Prípadne počkaj na ponuku, ktorá sa
              zobrazí sama.
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium text-fg">Počítač</p>
            <p>
              V Chrome/Edge klikni na ikonu inštalácie v adresnom riadku, alebo appku pokojne
              používaj priamo v prehliadači — notifikácie fungujú aj tak.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
