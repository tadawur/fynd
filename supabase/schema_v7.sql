-- Fynd — schema_v7: demo obsah pre Straty a nálezy (Lost & Found) — len ukážkové dáta.
-- Spustiť AŽ PO schema.sql .. schema_v6.sql (potrebuje demo hráčov zo schema_v5.sql).
-- Idempotentné — pri opakovanom spustení sa demo položky nezdvojujú (guard cez title+club).

do $$
declare
  v_club_id uuid;
  v_jan uuid;
  v_filip uuid;
  v_adam uuid;
  v_matej uuid;
  v_david uuid;
  v_martin uuid;
  v_item1 uuid;
  v_item2 uuid;
begin
  select id into v_club_id from public.clubs where slug = 'mfk-nova-bana';
  if v_club_id is null then
    raise notice 'Klub mfk-nova-bana neexistuje, schema_v7 preskočená.';
    return;
  end if;

  if exists (
    select 1 from public.lost_found_items
    where club_id = v_club_id and title = 'Čierne kopačky Nike Mercurial'
  ) then
    return; -- už seednuté
  end if;

  select p.id into v_jan from public.profiles p join auth.users u on u.id = p.id where u.email = 'demo.jan.horvath@fynd.demo';
  select p.id into v_filip from public.profiles p join auth.users u on u.id = p.id where u.email = 'demo.filip.toth@fynd.demo';
  select p.id into v_adam from public.profiles p join auth.users u on u.id = p.id where u.email = 'demo.adam.balaz@fynd.demo';
  select p.id into v_matej from public.profiles p join auth.users u on u.id = p.id where u.email = 'demo.matej.novak@fynd.demo';
  select p.id into v_david from public.profiles p join auth.users u on u.id = p.id where u.email = 'demo.david.simko@fynd.demo';
  select p.id into v_martin from public.profiles p join auth.users u on u.id = p.id where u.email = 'demo.martin.kovac@fynd.demo';

  if v_jan is null then
    raise notice 'Demo hráči (schema_v5.sql) neexistujú, schema_v7 preskočená.';
    return;
  end if;

  insert into public.lost_found_items (club_id, reported_by, kind, title, description, status, created_at)
  values
    (v_club_id, v_jan,    'lost',  'Čierne kopačky Nike Mercurial', 'Ostali po tréningu v šatni, veľkosť 42. Odmena zaručená 😄', 'open', now() - interval '2 days')
  returning id into v_item1;

  insert into public.lost_found_items (club_id, reported_by, kind, title, description, status, created_at)
  values
    (v_club_id, v_filip,  'found', 'Modrá fľaša na pitie', 'Našiel som pri lavičkách po sobotňajšom zápase. Má nálepku FC Barcelona.', 'open', now() - interval '5 days')
  returning id into v_item2;

  insert into public.lost_found_items (club_id, reported_by, kind, title, description, status, created_at) values
    (v_club_id, v_adam,   'lost',  'Sivá mikina s kapucňou', 'Veľkosť M, zabudnutá na striedačke.', 'resolved', now() - interval '9 days'),
    (v_club_id, v_matej,  'found', 'Chránič holení (pár)', 'Čierne s bielym logom, ležali pri bránke.', 'open', now() - interval '1 day'),
    (v_club_id, v_david,  'lost',  'Náramok — čierny s iniciálkami D.Š.', 'Asi mi spadol pri rozcvičke.', 'open', now() - interval '3 days'),
    (v_club_id, v_martin, 'found', 'Kľúče od bicykla', 'Viseli na plote pri vchode do areálu.', 'resolved', now() - interval '12 days');

  -- krátka konverzácia pod prvou položkou (Ján stratil kopačky, Filip mu odpovedá)
  insert into public.lost_found_messages (item_id, profile_id, content, created_at) values
    (v_item1, v_filip, 'Videl som podobné kopačky v šatni U15, spýtaj sa trénera 👀', now() - interval '2 days' + interval '3 hours'),
    (v_item1, v_jan,   'Vďaka, idem sa spýtať!', now() - interval '2 days' + interval '4 hours');

  insert into public.lost_found_messages (item_id, profile_id, content, created_at) values
    (v_item2, v_adam, 'To by mohla byť moja, mám presne takú. Kde presne ležala?', now() - interval '4 days');

end $$;
