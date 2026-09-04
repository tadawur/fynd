-- Fynd — F1 (Core MVP) databázová schéma pre Supabase (PostgreSQL)
-- Zodpovedá docs/roadmap.md (Phase 1) a docs/features.md
-- Spustiť v Supabase SQL Editore na novom projekte.

-- ============================================================
-- 1. PROFILES (rozšírenie auth.users)
-- ============================================================

create type public.profile_role as enum ('player', 'coach', 'parent', 'club_admin', 'photographer', 'designer');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role public.profile_role not null default 'player',
  xp integer not null default 0,
  level integer not null default 1,
  birth_date date, -- pre vekové kategórie (U9, U15, ...) a age-gate na sociálne siete (15+)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Verejný profil hráča/trénera/rodiča, 1:1 s auth.users.';

-- Automaticky vytvorí profil pri registrácii (auth.users insert)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. KLUBY, KATEGÓRIE, ČLENSTVÁ
-- ============================================================

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  region text,
  founded_year integer,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  name text not null, -- napr. "U9", "U15", "A-tím"
  created_at timestamptz not null default now(),
  unique (club_id, name)
);

create type public.membership_role as enum ('player', 'coach', 'parent', 'club_admin', 'photographer', 'designer');

create table public.club_memberships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  club_id uuid not null references public.clubs (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  role public.membership_role not null default 'player',
  created_at timestamptz not null default now(),
  unique (profile_id, club_id, category_id)
);

-- ============================================================
-- 3. TRÉNINGY, DOCHÁDZKA, STREAK
-- ============================================================

create table public.trainings (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  starts_at timestamptz not null,
  location text,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

create type public.attendance_status as enum ('present', 'absent', 'excused');

create table public.training_attendance (
  id uuid primary key default gen_random_uuid(),
  training_id uuid not null references public.trainings (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  status public.attendance_status not null default 'present',
  marked_by uuid references public.profiles (id),
  marked_at timestamptz not null default now(),
  unique (training_id, profile_id)
);

-- Pohľad na aktuálny streak: počet po sebe idúcich tréningov (podľa dátumu)
-- s dochádzkou 'present' pre daného hráča, počítané od najnovšieho tréningu dozadu.
-- Zjednodušené pre F1 — plnohodnotný "gap-and-islands" výpočet môže nahradiť neskôr.
create view public.player_recent_attendance as
select
  ta.profile_id,
  t.starts_at,
  ta.status
from public.training_attendance ta
join public.trainings t on t.id = ta.training_id
order by ta.profile_id, t.starts_at desc;

-- ============================================================
-- 4. XP LEDGER (auditovateľný, profiles.xp je odvodený súčet)
-- ============================================================

create type public.xp_event_type as enum (
  'training_attendance', 'streak_bonus', 'post_match_rating',
  'league_promotion_bonus', 'yellow_card_penalty', 'red_card_penalty', 'manual_adjustment'
);

create table public.xp_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type public.xp_event_type not null,
  amount integer not null, -- môže byť záporné (karty)
  related_training_id uuid references public.trainings (id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. CHAT (kategóriové skupiny)
-- ============================================================

create table public.chat_channels (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  category_id uuid references public.categories (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.chat_channels (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 6. OZNAMY
-- ============================================================

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  category_id uuid references public.categories (id) on delete cascade, -- null = celoklubový oznam
  title text not null,
  body text not null,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. ROW LEVEL SECURITY (MVP baseline — sprísniť pred produkciou)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.clubs enable row level security;
alter table public.categories enable row level security;
alter table public.club_memberships enable row level security;
alter table public.trainings enable row level security;
alter table public.training_attendance enable row level security;
alter table public.xp_events enable row level security;
alter table public.chat_channels enable row level security;
alter table public.chat_messages enable row level security;
alter table public.announcements enable row level security;

-- Profily: každý prihlásený používateľ vidí všetky profily (verejné profily v komunite),
-- upravovať môže len svoj vlastný.
create policy "profiles: read for authenticated" on public.profiles
  for select to authenticated using (true);
create policy "profiles: update own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Kluby a kategórie: verejne čitateľné (club discovery), zápis len pre budúcu admin rolu (F1: zatiaľ bez UI).
create policy "clubs: read for authenticated" on public.clubs
  for select to authenticated using (true);
create policy "categories: read for authenticated" on public.categories
  for select to authenticated using (true);

-- Členstvá: vidí len svoje vlastné + členov klubu, kde je používateľ tiež členom.
create policy "memberships: read own or same club" on public.club_memberships
  for select to authenticated using (
    profile_id = auth.uid()
    or club_id in (select club_id from public.club_memberships where profile_id = auth.uid())
  );

-- Tréningy a dochádzka: viditeľné pre členov danej kategórie/klubu.
create policy "trainings: read for club members" on public.trainings
  for select to authenticated using (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid())
  );
create policy "attendance: read own or club member" on public.training_attendance
  for select to authenticated using (
    profile_id = auth.uid()
    or training_id in (
      select t.id from public.trainings t
      join public.club_memberships m on m.club_id = t.club_id
      where m.profile_id = auth.uid()
    )
  );

-- XP: hráč vidí len svoj vlastný ledger.
create policy "xp_events: read own" on public.xp_events
  for select to authenticated using (profile_id = auth.uid());

-- Chat: len členovia príslušného klubu/kategórie.
create policy "chat_channels: read for club members" on public.chat_channels
  for select to authenticated using (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid())
  );
create policy "chat_messages: read for channel members" on public.chat_messages
  for select to authenticated using (
    channel_id in (
      select cc.id from public.chat_channels cc
      join public.club_memberships m on m.club_id = cc.club_id
      where m.profile_id = auth.uid()
    )
  );
create policy "chat_messages: insert for channel members" on public.chat_messages
  for insert to authenticated with check (
    profile_id = auth.uid()
    and channel_id in (
      select cc.id from public.chat_channels cc
      join public.club_memberships m on m.club_id = cc.club_id
      where m.profile_id = auth.uid()
    )
  );

-- Oznamy: čitateľné pre členov klubu.
create policy "announcements: read for club members" on public.announcements
  for select to authenticated using (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid())
  );
