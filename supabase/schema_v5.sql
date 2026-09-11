-- Fynd — schema_v5: demo hráči pre rebríčky (Leaderboards) — len ukážkové dáta.
-- Spustiť AŽ PO schema.sql, schema_v2.sql, schema_v3.sql a schema_v4.sql.
--
-- Vytvorí 12 fiktívnych hráčov (fake auth.users + profiles, e-maily @fynd.demo,
-- nedajú sa nimi nikde prihlásiť — heslo je náhodné) v MFK Nová Baňa, s
-- tréningami/dochádzkou/zápasmi/hodnoteniami, aby rebríčky vo všetkých
-- dimenziách (XP, dochádzka, góly, streak, hodnotenie, fair play) mali čo
-- zobraziť. Bezpečne spustiteľné viackrát — ak demo hráči už existujú, nič
-- sa nepridá znova. Neskôr sa dajú zmazať jednoducho: pozri koniec súboru.

create extension if not exists pgcrypto with schema extensions;

do $$
declare
  v_club_id uuid;
  v_u15_id uuid;
  v_u13_id uuid;
  v_a_id uuid;
  v_admin_id uuid;
begin
  if exists (select 1 from auth.users where email = 'demo.jan.horvath@fynd.demo') then
    return; -- demo dáta už existujú
  end if;

  select id into v_club_id from public.clubs where slug = 'mfk-nova-bana';
  if v_club_id is null then
    raise notice 'MFK Nová Baňa neexistuje — spusti najprv schema_v2.sql';
    return;
  end if;

  select id into v_u15_id from public.categories where club_id = v_club_id and name = 'U15 — Dorast';
  select id into v_u13_id from public.categories where club_id = v_club_id and name = 'U13 — Prípravka';
  select id into v_a_id from public.categories where club_id = v_club_id and name = 'A-mužstvo';
  select id into v_admin_id from public.profiles order by created_at asc limit 1;

  -- ============================================================
  -- 1. 12 fiktívnych hráčov (auth.users → handle_new_user vytvorí profiles)
  -- ============================================================
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  )
  select
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
    d.email, extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('full_name', d.full_name),
    now(), now(), '', '', '', ''
  from (values
    ('demo.jan.horvath@fynd.demo', 'Ján Horváth'),
    ('demo.martin.kovac@fynd.demo', 'Martin Kováč'),
    ('demo.lukas.varga@fynd.demo', 'Lukáš Varga'),
    ('demo.adam.balaz@fynd.demo', 'Adam Baláž'),
    ('demo.filip.toth@fynd.demo', 'Filip Tóth'),
    ('demo.david.simko@fynd.demo', 'Dávid Šimko'),
    ('demo.matej.novak@fynd.demo', 'Matej Novák'),
    ('demo.peter.molnar@fynd.demo', 'Peter Molnár'),
    ('demo.samuel.kral@fynd.demo', 'Samuel Kráľ'),
    ('demo.tomas.petrik@fynd.demo', 'Tomáš Petrík'),
    ('demo.jakub.urban@fynd.demo', 'Jakub Urban'),
    ('demo.michal.dvorsky@fynd.demo', 'Michal Dvorský')
  ) as d(email, full_name);

  -- ============================================================
  -- 2. Členstvá podľa kategórií
  -- ============================================================
  insert into public.club_memberships (club_id, profile_id, category_id, role)
  select v_club_id, u.id, v_u15_id, 'player'
  from auth.users u
  where u.email in (
    'demo.jan.horvath@fynd.demo', 'demo.martin.kovac@fynd.demo', 'demo.lukas.varga@fynd.demo',
    'demo.adam.balaz@fynd.demo', 'demo.filip.toth@fynd.demo', 'demo.david.simko@fynd.demo'
  );

  insert into public.club_memberships (club_id, profile_id, category_id, role)
  select v_club_id, u.id, v_u13_id, 'player'
  from auth.users u
  where u.email in (
    'demo.matej.novak@fynd.demo', 'demo.peter.molnar@fynd.demo',
    'demo.samuel.kral@fynd.demo', 'demo.tomas.petrik@fynd.demo'
  );

  insert into public.club_memberships (club_id, profile_id, category_id, role)
  select v_club_id, u.id, v_a_id, 'player'
  from auth.users u
  where u.email in ('demo.jakub.urban@fynd.demo', 'demo.michal.dvorsky@fynd.demo');

  -- ============================================================
  -- 3. Tréningy (U15: 8x za posledné ~3 týždne, U13: 6x)
  -- ============================================================
  insert into public.trainings (club_id, category_id, starts_at, location, created_by)
  select v_club_id, v_u15_id, now() - (n * interval '2.5 days') + interval '17 hours', 'Ihrisko MFK Nová Baňa', v_admin_id
  from generate_series(1, 8) as n;

  insert into public.trainings (club_id, category_id, starts_at, location, created_by)
  select v_club_id, v_u13_id, now() - (n * interval '3 days') + interval '16 hours', 'Ihrisko MFK Nová Baňa', v_admin_id
  from generate_series(1, 6) as n;

  -- ============================================================
  -- 4. Dochádzka — každý hráč má iný vzorec (pre pestré % aj streaky)
  -- ============================================================
  with u15_t as (
    select id, row_number() over (order by starts_at) as n from public.trainings where category_id = v_u15_id
  ),
  pattern as (
    select * from (values
      ('demo.jan.horvath@fynd.demo',   array[1,2,3,4,5,6,7,8]),
      ('demo.martin.kovac@fynd.demo',  array[1,2,3,4,5,6,8]),
      ('demo.lukas.varga@fynd.demo',   array[1,3,4,6,8]),
      ('demo.adam.balaz@fynd.demo',    array[1,2,3,4,5,6,7,8]),
      ('demo.filip.toth@fynd.demo',    array[2,3,4,6,7,8]),
      ('demo.david.simko@fynd.demo',   array[1,5,8])
    ) as p(email, present_ns)
  )
  insert into public.training_attendance (training_id, profile_id, status, marked_by)
  select t.id, u.id, 'present', v_admin_id
  from u15_t t
  join pattern p on t.n = any(p.present_ns)
  join auth.users u on u.email = p.email;

  with u13_t as (
    select id, row_number() over (order by starts_at) as n from public.trainings where category_id = v_u13_id
  ),
  pattern as (
    select * from (values
      ('demo.matej.novak@fynd.demo',  array[1,2,3,4,5,6]),
      ('demo.peter.molnar@fynd.demo', array[1,2,3,4,6]),
      ('demo.samuel.kral@fynd.demo',  array[1,3,4,6]),
      ('demo.tomas.petrik@fynd.demo', array[2,5])
    ) as p(email, present_ns)
  )
  insert into public.training_attendance (training_id, profile_id, status, marked_by)
  select t.id, u.id, 'present', v_admin_id
  from u13_t t
  join pattern p on t.n = any(p.present_ns)
  join auth.users u on u.email = p.email;

  -- XP za dochádzku (rovnaká logika ako public.mark_attendance: +10 XP/prítomnosť)
  insert into public.xp_events (profile_id, type, amount, related_training_id, note)
  select profile_id, 'training_attendance', 10, training_id, 'Účasť na tréningu'
  from public.training_attendance
  where status = 'present'
    and training_id in (select id from public.trainings where category_id in (v_u15_id, v_u13_id));

  -- ============================================================
  -- 5. Zápasy a góly (Góly dimenzia)
  -- ============================================================
  insert into public.matches (club_id, category_id, opponent_name, is_home, competition, starts_at, status, score_home, score_away, created_by)
  select v_club_id, v_u15_id, 'FK Demo Tešíny', true, 'Krajská súťaž U15', now() - interval '9 days', 'finished', 4, 2, v_admin_id;

  insert into public.matches (club_id, category_id, opponent_name, is_home, competition, starts_at, status, score_home, score_away, created_by)
  select v_club_id, v_a_id, 'FK Demo Baník', false, 'V. liga', now() - interval '5 days', 'finished', 1, 3, v_admin_id;

  insert into public.match_events (match_id, minute, type, team, player_id, source)
  select m.id, mins.minute, 'goal', 'home', u.id, 'manual'
  from public.matches m
  join lateral (values (12), (54)) as mins(minute) on true
  join auth.users u on u.email = 'demo.jan.horvath@fynd.demo'
  where m.opponent_name = 'FK Demo Tešíny';

  insert into public.match_events (match_id, minute, type, team, player_id, source)
  select m.id, 33, 'goal', 'home', u.id, 'manual'
  from public.matches m join auth.users u on u.email = 'demo.filip.toth@fynd.demo'
  where m.opponent_name = 'FK Demo Tešíny';

  insert into public.match_events (match_id, minute, type, team, player_id, source)
  select m.id, 71, 'goal', 'home', u.id, 'manual'
  from public.matches m join auth.users u on u.email = 'demo.adam.balaz@fynd.demo'
  where m.opponent_name = 'FK Demo Tešíny';

  insert into public.match_events (match_id, minute, type, team, player_id, source)
  select m.id, mins.minute, 'goal', 'away', u.id, 'manual'
  from public.matches m
  join lateral (values (22), (68)) as mins(minute) on true
  join auth.users u on u.email = 'demo.jakub.urban@fynd.demo'
  where m.opponent_name = 'FK Demo Baník';

  insert into public.match_events (match_id, minute, type, team, player_id, source)
  select m.id, 80, 'goal', 'away', u.id, 'manual'
  from public.matches m join auth.users u on u.email = 'demo.michal.dvorsky@fynd.demo'
  where m.opponent_name = 'FK Demo Baník';

  -- ============================================================
  -- 6. Pozápasové hodnotenia (★ dimenzia)
  -- ============================================================
  insert into public.post_match_ratings (match_id, rater_id, target_id, target_type, stars)
  select m.id, v_admin_id, u.id, 'teammate', s.stars
  from public.matches m
  join (values
    ('demo.jan.horvath@fynd.demo', 5),
    ('demo.adam.balaz@fynd.demo', 4),
    ('demo.filip.toth@fynd.demo', 4),
    ('demo.martin.kovac@fynd.demo', 3)
  ) as s(email, stars) on true
  join auth.users u on u.email = s.email
  where m.opponent_name = 'FK Demo Tešíny';

  insert into public.post_match_ratings (match_id, rater_id, target_id, target_type, stars)
  select m.id, v_admin_id, u.id, 'teammate', s.stars
  from public.matches m
  join (values
    ('demo.jakub.urban@fynd.demo', 5),
    ('demo.michal.dvorsky@fynd.demo', 4)
  ) as s(email, stars) on true
  join auth.users u on u.email = s.email
  where m.opponent_name = 'FK Demo Baník';

  -- ============================================================
  -- 7. Bonusové/postihové XP (rôznorodé celkové XP aj Fair Play dimenzia)
  -- ============================================================
  insert into public.xp_events (profile_id, type, amount, note)
  select u.id, 'manual_adjustment', b.amount, 'Sezónny bonus (ukážkové dáta)'
  from (values
    ('demo.jan.horvath@fynd.demo', 150),
    ('demo.adam.balaz@fynd.demo', 300),
    ('demo.david.simko@fynd.demo', 100),
    ('demo.matej.novak@fynd.demo', 40),
    ('demo.jakub.urban@fynd.demo', 1050),
    ('demo.michal.dvorsky@fynd.demo', 650)
  ) as b(email, amount)
  join auth.users u on u.email = b.email;

  insert into public.xp_events (profile_id, type, amount, note)
  select u.id, 'yellow_card_penalty', -20, 'Žltá karta (ukážkové dáta)'
  from auth.users u where u.email in ('demo.lukas.varga@fynd.demo', 'demo.samuel.kral@fynd.demo');

  insert into public.xp_events (profile_id, type, amount, note)
  select u.id, 'red_card_penalty', -50, 'Červená karta (ukážkové dáta)'
  from auth.users u where u.email = 'demo.david.simko@fynd.demo';

end $$;

-- Zmazanie všetkých demo hráčov a ich dát (kedykoľvek neskôr, jeden príkaz —
-- kaskádovito zmaže aj ich profiles/memberships/xp_events/attendance/ratings):
-- delete from auth.users where email like '%@fynd.demo';
-- (zápasy/tréningy vytvorené v kroku 3 a 5 ostanú — zmaž ich ručne, ak treba)
