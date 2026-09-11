# Web Push notifikácie

Ako fungujú push notifikácie vo Fynd appke a čo treba manuálne nastaviť
v Supabase, aby reálne chodili (kód sám o sebe nestačí — treba nasadiť
Edge Function a doplniť pár tajných hodnôt, ktoré z bezpečnostných
dôvodov nie sú v gite).

## Ako to funguje

1. Používateľ v appke (`/dashboard/notifications`) klikne „Zapnúť“ → appka
   sa cez `pushManager.subscribe()` prihlási na push a uloží si
   `endpoint`/kľúče do `push_subscriptions` (Supabase).
2. Keď appka niekomu vytvorí záznam v `notifications` (nový oznam, zmena
   tréningu, tréningová pripomienka, zápasová udalosť, nová chat správa —
   `schema_v3.sql`/`schema_v4.sql`), DB trigger `notifications_send_push`
   zavolá Edge Function `send-push`.
3. `send-push` (Deno, `supabase/functions/send-push`) načíta
   `push_subscriptions` daného používateľa a pošle im Web Push cez VAPID.
4. Service worker (`public/sw.js`) push prijme, zobrazí systémovú
   notifikáciu, a po kliku otvorí appku na správnej stránke.

Tréningové pripomienky (deň vopred) generuje `pg_cron` job
(`queue_training_reminders`, beží každú hodinu) — nie je to naviazané na
žiadnu akciu používateľa.

Na iPhone/iPad web push funguje **len** v appke pridanej na plochu
(Apple obmedzenie od Safari 16.4) — preto je v appke aj krátky návod
„Ako si appku otvoriť/nainštalovať“.

## Postup nastavenia (v tomto poradí)

### 1. Nasadiť Edge Function `send-push`

Potrebuješ [Supabase CLI](https://supabase.com/docs/guides/cli):

```
npm install -g supabase
supabase login
cd fynd
supabase link --project-ref <TVOJ-PROJECT-REF>   # nájdeš v Project Settings → General
supabase functions deploy send-push --no-verify-jwt
```

`--no-verify-jwt` je nutné — funkciu volá DB trigger, nie prihlásený
používateľ, takže nemá Supabase JWT. Namiesto toho je chránená vlastným
zdieľaným tajomstvom (`PUSH_TRIGGER_SECRET`, krok 2).

Ak nechceš CLI, dá sa funkcia vytvoriť aj ručne v Dashboard → Edge
Functions → Create a new function → vložiť obsah
`supabase/functions/send-push/index.ts`.

### 2. Nastaviť secrets funkcie

V Dashboard → Edge Functions → `send-push` → Secrets (alebo cez CLI
`supabase secrets set KĽÚČ=hodnota`) nastav:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT` (napr. `mailto:info@fynd.fans`)
- `PUSH_TRIGGER_SECRET` (ľubovoľný náhodný reťazec — tvoja voľba)

Presné hodnoty pre `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` a navrhnutý
`PUSH_TRIGGER_SECRET` ti Claude poslal v chate (nie sú v gite, keďže ide
o tajné hodnoty). `SUPABASE_URL` a `SUPABASE_SERVICE_ROLE_KEY` netreba
nastavovať — Supabase ich do Edge Functions dopĺňa automaticky.

### 3. Doplniť URL a secret do `schema_v4.sql` a spustiť ho

Po nasadení funkcie skopíruj jej URL (Dashboard → Edge Functions →
`send-push` → zobrazí sa hore, tvar
`https://<project-ref>.supabase.co/functions/v1/send-push`).

V `supabase/schema_v4.sql`, v sekcii 3 (`trigger_send_push`), nahraď:

```sql
v_url text := 'https://REPLACE-ME.supabase.co/functions/v1/send-push';
v_secret text := 'REPLACE-ME-RANDOM-SECRET';
```

skutočnou URL a rovnakou hodnotou, akú si dal do `PUSH_TRIGGER_SECRET`
(krok 2) — **ale túto úpravu rob až v okne Supabase SQL Editora, nie v
súbore v repozitári** (rovnaký postup ako pri `schema_v2.sql`/`schema_v3.sql`:
skopíruj obsah, vlož do SQL Editora, tam uprav tie dva riadky a spusti).
Placeholder hodnoty v `supabase/schema_v4.sql` tak zostanú nezmenené a
bezpečné aj po `git push`.

### 4. Doplniť verejný kľúč do appky (produkčný hosting)

Do premenných prostredia appky (napr. Vercel → Project Settings →
Environment Variables) pridaj:

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<verejný VAPID kľúč>
```

(Do `webapp/.env.local` pre lokálny beh som ho už doplnil.)

### 5. Overiť

- V appke na `/dashboard/notifications` klikni „Zapnúť“ → prehliadač si
  vypýta povolenie na notifikácie.
- Vytvor testovací oznam (`/dashboard/announcements` ako tréner/admin) →
  do pár sekúnd by mala prísť systémová notifikácia.
- Ak nie: skontroluj v Supabase Dashboard → Database → Extensions, že
  `pg_net` a `pg_cron` sú zapnuté, a v Edge Functions → `send-push` →
  Logs, či trigger funkciu vôbec zavolal (prípadná chyba sa tam ukáže).

## Bezpečnosť

`VAPID_PRIVATE_KEY` a `PUSH_TRIGGER_SECRET` **nikdy nepatria do gitu** —
preto sú v `schema_v4.sql` len ako placeholdery a v Edge Function kóde
len ako `Deno.env.get(...)`. Skutočné hodnoty žijú výhradne v Supabase
Edge Function secrets (a `v_url`/`v_secret` priamo v DB funkcii po tom,
čo si placeholdery nahradíš — tá zmena zostáva len v tvojej Supabase DB,
nie v tomto súbore, pokiaľ ho znova nezmeníš a nedáš `git add`).
