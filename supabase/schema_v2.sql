-- Fynd — schema_v2: rozšírenie F1 základu o F2 (XP/Odmeňovňa/odznaky), F3 (kluby directory,
-- live ticker/manuálne eventy, hodnotenia, straty a nálezy, fotky), notifikačné centrum.
-- Spustiť AŽ PO schema.sql, v Supabase SQL Editore, v tomto istom projekte.

-- ============================================================
-- 0. PROFILES — rozšírenie
-- ============================================================

alter table public.profiles
  add column if not exists bio text,
  add column if not exists photo_url text,
  add column if not exists avatar_config jsonb not null default '{"hair":"short","kit_color":"#00D97E","background":"navy","frame":"none"}'::jsonb,
  add column if not exists socials jsonb not null default '{}'::jsonb,
  add column if not exists leaderboard_visibility text not null default 'public'
    check (leaderboard_visibility in ('public', 'club_only')),
  add column if not exists onboarded boolean not null default false;

-- ============================================================
-- 1. KLUB SLEDOVANIE + NOTIFIKÁCIE (F3)
-- ============================================================

create table if not exists public.club_follows (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  club_id uuid not null references public.clubs (id) on delete cascade,
  notify jsonb not null default '{
    "goals": true, "yellow_cards": false, "red_cards": true, "half_time": false,
    "full_time": true, "match_reminder": true, "match_day": true, "announcements": true
  }'::jsonb,
  created_at timestamptz not null default now(),
  unique (profile_id, club_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  club_id uuid references public.clubs (id) on delete cascade,
  type text not null, -- 'goal' | 'yellow_card' | 'red_card' | 'half_time' | 'full_time' | 'training_change'
                       -- | 'announcement' | 'streak_risk' | 'xp_milestone' | 'reward_status' | 'lost_found'
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_profile_idx on public.notifications (profile_id, created_at desc);

-- ============================================================
-- 2. BADGES (F2)
-- ============================================================

create table if not exists public.badges (
  slug text primary key,
  name text not null,
  emoji text not null,
  description text not null,
  xp_reward integer not null default 100
);

insert into public.badges (slug, name, emoji, description, xp_reward) values
  ('first-step', 'Prvý krok', '🎯', 'Zúčastnil sa prvého tréningu', 100),
  ('week-streak', 'Týždenný streak', '🔥', '7 tréningov v rade', 100),
  ('scorer', 'Strelec', '⚽', 'Strelil prvý gól', 100),
  ('team-player', 'Tímový hráč', '🤝', 'Zaznamenal 3 asistencie', 100),
  ('regular', 'Pravidelník', '📅', 'Absolvoval 10 tréningov', 100),
  ('monthly-streak', 'Mesačný streak', '🏆', '30 tréningov v rade', 100),
  ('captain', 'Kapitán', '👑', 'Priemerné hodnotenie 5★ od spoluhráčov', 100),
  ('hat-trick', 'Hetrik hrdina', '🎩', '3 góly v jednom zápase', 100),
  ('season-hero', 'Hrdina sezóny', '🛡️', 'Dohral celú sezónu', 100),
  ('iron-man', 'Železný muž', '💪', 'Žiadna absencia za mesiac', 100),
  ('sniper', 'Snajper', '🎯', '10 gólov v sezóne', 100),
  ('explorer', 'Objaviteľ', '🌍', 'Prezrel 5 rôznych klubov', 100),
  ('social-player', 'Sociálny hráč', '🤜', 'Prepojil 3 sociálne účty', 100)
on conflict (slug) do nothing;

create table if not exists public.player_badges (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  badge_slug text not null references public.badges (slug) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (profile_id, badge_slug)
);

-- ============================================================
-- 3. ODMEŇOVŇA (F2)
-- ============================================================

create table if not exists public.reward_items (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  name text not null,
  xp_cost integer not null check (xp_cost > 0),
  min_level integer not null default 1,
  quantity integer, -- null = neobmedzené
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create type public.reward_order_status as enum ('pending', 'fulfilled', 'rejected');

create table if not exists public.reward_orders (
  id uuid primary key default gen_random_uuid(),
  reward_item_id uuid not null references public.reward_items (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  xp_cost_at_order integer not null,
  status public.reward_order_status not null default 'pending',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles (id)
);

-- Kozmetické profilové skiny (pozadia) kupované za XP
create table if not exists public.profile_skins (
  slug text primary key,
  name text not null,
  xp_cost integer not null default 0, -- 0 = predvolený/free skin
  css_gradient text not null
);

insert into public.profile_skins (slug, name, xp_cost, css_gradient) values
  ('navy', 'Navy (predvolený)', 0, 'linear-gradient(135deg, #06101E, #0D1B2E)'),
  ('emerald-pulse', 'Emerald Pulse', 250, 'linear-gradient(135deg, #06101E, #0D3B2E)'),
  ('gold-rush', 'Gold Rush', 300, 'linear-gradient(135deg, #1A1200, #3A2A00)'),
  ('coral-storm', 'Coral Storm', 300, 'linear-gradient(135deg, #1A0606, #3A1414)'),
  ('aurora', 'Aurora', 500, 'linear-gradient(135deg, #06101E, #1A2C42, #00D97E)')
on conflict (slug) do nothing;

create table if not exists public.player_owned_skins (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  skin_slug text not null references public.profile_skins (slug) on delete cascade,
  acquired_at timestamptz not null default now(),
  unique (profile_id, skin_slug)
);

-- ============================================================
-- 4. ZÁPASY / LIVE TICKER (F3, manuálny vstup = Sportnet fallback)
-- ============================================================

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  opponent_name text not null,
  is_home boolean not null default true,
  competition text,
  starts_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'finished')),
  score_home integer not null default 0,
  score_away integer not null default 0,
  source text not null default 'manual' check (source in ('manual', 'sportnet')),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.match_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  minute integer not null,
  type text not null check (type in ('kickoff', 'goal', 'yellow_card', 'red_card', 'half_time', 'full_time')),
  team text check (team in ('home', 'away')),
  player_id uuid references public.profiles (id),
  note text,
  source text not null default 'manual' check (source in ('manual', 'sportnet')),
  created_at timestamptz not null default now()
);

create table if not exists public.match_lineups (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'player' check (role in ('player', 'coach', 'referee')),
  unique (match_id, profile_id)
);

-- ============================================================
-- 5. POZÁPASOVÉ HODNOTENIA (F2)
-- ============================================================

create table if not exists public.post_match_ratings (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  rater_id uuid not null references public.profiles (id) on delete cascade,
  target_id uuid not null references public.profiles (id) on delete cascade, -- hodnotená osoba (spoluhráč alebo tréner)
  target_type text not null check (target_type in ('referee', 'coach', 'teammate')),
  stars integer not null check (stars between 1 and 5),
  created_at timestamptz not null default now(),
  unique (match_id, rater_id, target_id, target_type)
);

-- ============================================================
-- 6. STRATY A NÁLEZY (F3)
-- ============================================================

create table if not exists public.lost_found_items (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  reported_by uuid not null references public.profiles (id),
  match_id uuid references public.matches (id) on delete set null,
  kind text not null default 'lost' check (kind in ('lost', 'found')),
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.lost_found_messages (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.lost_found_items (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. FOTKY (Photographer / Graphic Designer role, F3)
-- ============================================================

create table if not exists public.photo_sets (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  match_id uuid references public.matches (id) on delete set null,
  uploaded_by uuid not null references public.profiles (id),
  title text not null,
  visibility text not null default 'club' check (visibility in ('club', 'restricted', 'designer_only')),
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  photo_set_id uuid not null references public.photo_sets (id) on delete cascade,
  storage_path text not null,
  tagged_profile_id uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 8. XP / LEVEL / STREAK / BADGE LOGIKA (funkcie + triggery)
-- ============================================================

create or replace function public.level_for_xp(p_xp integer)
returns integer language sql immutable as $$
  select case
    when p_xp >= 20000 then 10
    when p_xp >= 12000 then 9
    when p_xp >= 8000 then 8
    when p_xp >= 5500 then 7
    when p_xp >= 3500 then 6
    when p_xp >= 2000 then 5
    when p_xp >= 1000 then 4
    when p_xp >= 500 then 3
    when p_xp >= 200 then 2
    else 1
  end;
$$;

create or replace function public.level_name(p_level integer)
returns text language sql immutable as $$
  select case p_level
    when 1 then 'Začiatočník'
    when 2 then 'Sľubný mladík'
    when 3 then 'Nádejný hráč'
    when 4 then 'Nádejný talent'
    when 5 then 'Stálica tímu'
    when 6 then 'Kľúčový hráč'
    when 7 then 'Šampión'
    when 8 then 'Kapitán'
    when 9 then 'Hviezda'
    else 'Legenda'
  end;
$$;

create or replace function public.recompute_profile_xp(p_profile_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_total integer;
begin
  select coalesce(sum(amount), 0) into v_total from public.xp_events where profile_id = p_profile_id;
  if v_total < 0 then v_total := 0; end if;
  update public.profiles
    set xp = v_total, level = public.level_for_xp(v_total), updated_at = now()
    where id = p_profile_id;
end;
$$;

create or replace function public.trg_xp_events_recompute()
returns trigger language plpgsql as $$
begin
  perform public.recompute_profile_xp(coalesce(new.profile_id, old.profile_id));
  return null;
end;
$$;

drop trigger if exists xp_events_recompute on public.xp_events;
create trigger xp_events_recompute
  after insert or update or delete on public.xp_events
  for each row execute procedure public.trg_xp_events_recompute();

-- Odznak: udelí odznak (ak ešte nemá) a pripíše +100 XP; no-op ak už má
create or replace function public.award_badge(p_profile_id uuid, p_badge_slug text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_xp integer;
begin
  insert into public.player_badges (profile_id, badge_slug)
  values (p_profile_id, p_badge_slug)
  on conflict (profile_id, badge_slug) do nothing;

  if found then
    select xp_reward into v_xp from public.badges where slug = p_badge_slug;
    insert into public.xp_events (profile_id, type, amount, note)
    values (p_profile_id, 'manual_adjustment', coalesce(v_xp, 0), 'Odznak: ' || p_badge_slug);
    insert into public.notifications (profile_id, type, title, body)
    values (p_profile_id, 'xp_milestone', 'Nový odznak!', 'Získal si odznak ' || p_badge_slug);
  end if;
end;
$$;

-- Aktuálny streak hráča: počet po sebe idúcich tréningov (podľa dátumu, zoradených dozadu)
-- s dochádzkou 'present', počítaný od najnovšieho tréningu dozadu bez medzery.
create or replace function public.current_streak(p_profile_id uuid)
returns integer language plpgsql stable as $$
declare
  v_streak integer := 0;
  r record;
begin
  for r in
    select ta.status
    from public.training_attendance ta
    join public.trainings t on t.id = ta.training_id
    where ta.profile_id = p_profile_id and t.starts_at <= now()
    order by t.starts_at desc
  loop
    exit when r.status <> 'present';
    v_streak := v_streak + 1;
  end loop;
  return v_streak;
end;
$$;

-- Označenie dochádzky (tréner) + automatické XP + odznaky + streak notifikácie.
-- SECURITY DEFINER, aby hráči nemohli priamo zapisovať do xp_events; oprávnenie sa
-- kontroluje explicitne (musí byť tréner/admin klubu tréningu).
create or replace function public.mark_attendance(
  p_training_id uuid, p_profile_id uuid, p_status public.attendance_status
)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_club_id uuid;
  v_is_coach boolean;
  v_streak integer;
  v_attended_count integer;
begin
  select club_id into v_club_id from public.trainings where id = p_training_id;

  select exists(
    select 1 from public.club_memberships
    where profile_id = auth.uid() and club_id = v_club_id and role in ('coach', 'club_admin')
  ) into v_is_coach;

  if not v_is_coach then
    raise exception 'Iba tréner alebo admin klubu môže označiť dochádzku';
  end if;

  insert into public.training_attendance (training_id, profile_id, status, marked_by)
  values (p_training_id, p_profile_id, p_status, auth.uid())
  on conflict (training_id, profile_id) do update set status = excluded.status, marked_by = auth.uid(), marked_at = now();

  if p_status = 'present' then
    insert into public.xp_events (profile_id, type, amount, related_training_id, note)
    values (p_profile_id, 'training_attendance', 10, p_training_id, 'Účasť na tréningu');

    v_streak := public.current_streak(p_profile_id);
    if v_streak > 0 and v_streak % 7 = 0 then
      insert into public.xp_events (profile_id, type, amount, related_training_id, note)
      values (p_profile_id, 'streak_bonus', 50, p_training_id, v_streak || '-dňový streak bonus');
      insert into public.notifications (profile_id, type, title, body)
      values (p_profile_id, 'xp_milestone', 'Streak bonus! 🔥', v_streak || ' tréningov v rade — +50 XP');
    end if;

    if v_streak = 1 then perform public.award_badge(p_profile_id, 'first-step'); end if;
    if v_streak >= 7 then perform public.award_badge(p_profile_id, 'week-streak'); end if;
    if v_streak >= 30 then perform public.award_badge(p_profile_id, 'monthly-streak'); end if;

    select count(*) into v_attended_count from public.training_attendance
      where profile_id = p_profile_id and status = 'present';
    if v_attended_count >= 10 then perform public.award_badge(p_profile_id, 'regular'); end if;
  end if;
end;
$$;

-- Odoslanie pozápasového hodnotenia (+15 XP jednorazovo za zápas, ak vyplní aspoň jedno hodnotenie)
create or replace function public.submit_rating(
  p_match_id uuid, p_target_id uuid, p_target_type text, p_stars integer
)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_already_rated_this_match boolean;
begin
  select exists(
    select 1 from public.post_match_ratings where match_id = p_match_id and rater_id = auth.uid()
  ) into v_already_rated_this_match;

  insert into public.post_match_ratings (match_id, rater_id, target_id, target_type, stars)
  values (p_match_id, auth.uid(), p_target_id, p_target_type, p_stars)
  on conflict (match_id, rater_id, target_id, target_type) do update set stars = excluded.stars;

  if not v_already_rated_this_match then
    insert into public.xp_events (profile_id, type, amount, note)
    values (auth.uid(), 'post_match_rating', 15, 'Pozápasové hodnotenie');
  end if;
end;
$$;

-- Nákup odmeny: overí XP, level, dostupnosť; XP sa odpočíta až pri potvrdení (fulfilled)
create or replace function public.redeem_reward(p_reward_item_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_item record;
  v_profile record;
  v_order_id uuid;
begin
  select * into v_item from public.reward_items where id = p_reward_item_id and active;
  if not found then raise exception 'Odmena nie je dostupná'; end if;

  select * into v_profile from public.profiles where id = auth.uid();
  if v_profile.xp < v_item.xp_cost then raise exception 'Nedostatok XP'; end if;
  if v_profile.level < v_item.min_level then raise exception 'Nedostatočný level'; end if;

  insert into public.reward_orders (reward_item_id, profile_id, xp_cost_at_order)
  values (p_reward_item_id, auth.uid(), v_item.xp_cost)
  returning id into v_order_id;

  return v_order_id;
end;
$$;

-- Klub potvrdí/zamietne objednávku odmeny — XP sa strháva len pri fulfilled.
create or replace function public.resolve_reward_order(p_order_id uuid, p_approve boolean)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_order record;
  v_club_id uuid;
  v_is_admin boolean;
begin
  select ro.*, ri.club_id into v_order from public.reward_orders ro
    join public.reward_items ri on ri.id = ro.reward_item_id
    where ro.id = p_order_id;

  select exists(
    select 1 from public.club_memberships
    where profile_id = auth.uid() and club_id = v_order.club_id and role = 'club_admin'
  ) into v_is_admin;
  if not v_is_admin then raise exception 'Iba admin klubu môže vybaviť objednávku'; end if;

  if p_approve then
    update public.reward_orders set status = 'fulfilled', resolved_at = now(), resolved_by = auth.uid()
      where id = p_order_id;
    insert into public.xp_events (profile_id, type, amount, note)
      values (v_order.profile_id, 'manual_adjustment', -v_order.xp_cost_at_order, 'Odmena vybavená');
    insert into public.notifications (profile_id, type, title, body)
      values (v_order.profile_id, 'reward_status', 'Odmena vybavená ✅', 'Tvoja objednávka bola potvrdená klubom.');
  else
    update public.reward_orders set status = 'rejected', resolved_at = now(), resolved_by = auth.uid()
      where id = p_order_id;
    insert into public.notifications (profile_id, type, title, body)
      values (v_order.profile_id, 'reward_status', 'Odmena zamietnutá', 'Tvoja objednávka bola zamietnutá klubom.');
  end if;
end;
$$;

-- Kúpa profilového skinu
create or replace function public.buy_skin(p_skin_slug text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_skin record;
  v_xp integer;
begin
  select * into v_skin from public.profile_skins where slug = p_skin_slug;
  select xp into v_xp from public.profiles where id = auth.uid();
  if v_xp < v_skin.xp_cost then raise exception 'Nedostatok XP'; end if;

  insert into public.player_owned_skins (profile_id, skin_slug) values (auth.uid(), p_skin_slug)
    on conflict do nothing;

  if v_skin.xp_cost > 0 then
    insert into public.xp_events (profile_id, type, amount, note)
      values (auth.uid(), 'manual_adjustment', -v_skin.xp_cost, 'Kúpa skinu: ' || p_skin_slug);
  end if;
end;
$$;

-- ============================================================
-- 9. RLS pre nové tabuľky
-- ============================================================

alter table public.club_follows enable row level security;
alter table public.notifications enable row level security;
alter table public.badges enable row level security;
alter table public.player_badges enable row level security;
alter table public.reward_items enable row level security;
alter table public.reward_orders enable row level security;
alter table public.profile_skins enable row level security;
alter table public.player_owned_skins enable row level security;
alter table public.matches enable row level security;
alter table public.match_events enable row level security;
alter table public.match_lineups enable row level security;
alter table public.post_match_ratings enable row level security;
alter table public.lost_found_items enable row level security;
alter table public.lost_found_messages enable row level security;
alter table public.photo_sets enable row level security;
alter table public.photos enable row level security;

create policy "club_follows: own" on public.club_follows
  for all to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "notifications: own" on public.notifications
  for select to authenticated using (profile_id = auth.uid());
create policy "notifications: update own (read flag)" on public.notifications
  for update to authenticated using (profile_id = auth.uid());

create policy "badges: read all" on public.badges for select to authenticated using (true);
create policy "player_badges: read all" on public.player_badges for select to authenticated using (true);

create policy "reward_items: read for club members" on public.reward_items
  for select to authenticated using (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid())
  );
create policy "reward_items: manage as admin" on public.reward_items
  for all to authenticated using (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid() and role = 'club_admin')
  ) with check (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid() and role = 'club_admin')
  );

create policy "reward_orders: read own or club admin" on public.reward_orders
  for select to authenticated using (
    profile_id = auth.uid()
    or reward_item_id in (
      select ri.id from public.reward_items ri
      join public.club_memberships m on m.club_id = ri.club_id
      where m.profile_id = auth.uid() and m.role = 'club_admin'
    )
  );

create policy "profile_skins: read all" on public.profile_skins for select to authenticated using (true);
create policy "player_owned_skins: read own" on public.player_owned_skins
  for select to authenticated using (profile_id = auth.uid());

create policy "matches: read for club members" on public.matches
  for select to authenticated using (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid())
    or club_id in (select club_id from public.club_follows where profile_id = auth.uid())
  );
create policy "matches: write for coach/admin" on public.matches
  for all to authenticated using (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid() and role in ('coach','club_admin'))
  ) with check (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid() and role in ('coach','club_admin'))
  );

create policy "match_events: read for club members/followers" on public.match_events
  for select to authenticated using (
    match_id in (
      select mt.id from public.matches mt
      where mt.club_id in (select club_id from public.club_memberships where profile_id = auth.uid())
         or mt.club_id in (select club_id from public.club_follows where profile_id = auth.uid())
    )
  );
create policy "match_events: write for coach/admin" on public.match_events
  for insert to authenticated with check (
    match_id in (
      select mt.id from public.matches mt
      join public.club_memberships m on m.club_id = mt.club_id
      where m.profile_id = auth.uid() and m.role in ('coach','club_admin')
    )
  );

create policy "match_lineups: read for club members" on public.match_lineups
  for select to authenticated using (
    match_id in (select id from public.matches where club_id in (
      select club_id from public.club_memberships where profile_id = auth.uid()
    ))
  );

create policy "post_match_ratings: read own submitted" on public.post_match_ratings
  for select to authenticated using (rater_id = auth.uid());
create policy "post_match_ratings: insert own" on public.post_match_ratings
  for insert to authenticated with check (rater_id = auth.uid());

create policy "lost_found_items: read for club members" on public.lost_found_items
  for select to authenticated using (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid())
  );
create policy "lost_found_items: insert for club members" on public.lost_found_items
  for insert to authenticated with check (
    reported_by = auth.uid()
    and club_id in (select club_id from public.club_memberships where profile_id = auth.uid())
  );
create policy "lost_found_items: update by reporter or club admin" on public.lost_found_items
  for update to authenticated using (
    reported_by = auth.uid()
    or club_id in (select club_id from public.club_memberships where profile_id = auth.uid() and role in ('coach','club_admin'))
  );

create policy "lost_found_messages: read for club members" on public.lost_found_messages
  for select to authenticated using (
    item_id in (select id from public.lost_found_items where club_id in (
      select club_id from public.club_memberships where profile_id = auth.uid()
    ))
  );
create policy "lost_found_messages: insert for club members" on public.lost_found_messages
  for insert to authenticated with check (
    profile_id = auth.uid()
    and item_id in (select id from public.lost_found_items where club_id in (
      select club_id from public.club_memberships where profile_id = auth.uid()
    ))
  );

create policy "photo_sets: read for club members" on public.photo_sets
  for select to authenticated using (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid())
  );
create policy "photo_sets: insert for photographer/admin" on public.photo_sets
  for insert to authenticated with check (
    uploaded_by = auth.uid()
    and club_id in (select club_id from public.club_memberships where profile_id = auth.uid() and role in ('photographer','club_admin'))
  );

create policy "photos: read for club members" on public.photos
  for select to authenticated using (
    photo_set_id in (select id from public.photo_sets where club_id in (
      select club_id from public.club_memberships where profile_id = auth.uid()
    ))
  );
create policy "photos: insert by set owner" on public.photos
  for insert to authenticated with check (
    photo_set_id in (select id from public.photo_sets where uploaded_by = auth.uid())
  );

-- ============================================================
-- 10. SEED: MFK Nová Baňa + kategórie (podľa docs/chat-permissions.md)
-- ============================================================

insert into public.clubs (name, slug, region, founded_year)
values ('MFK Nová Baňa', 'mfk-nova-bana', 'Banskobystrický kraj', 1919)
on conflict (slug) do nothing;

insert into public.categories (club_id, name)
select id, cat from public.clubs, unnest(array[
  'A-mužstvo', 'U19 — Dorast', 'U15 — Dorast', 'U13 — Prípravka', 'U11 — Prípravka', 'U9 — Najmladší'
]) as cat
where slug = 'mfk-nova-bana'
on conflict (club_id, name) do nothing;
