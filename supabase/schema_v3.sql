-- Fynd — schema_v3: doplnenie chýbajúcich RLS zápisových politík (self-service join,
-- tréningy, oznamy) a kategóriové chat oprávnenia vrátane U9 pravidla (docs/chat-permissions.md).
-- Spustiť AŽ PO schema.sql a schema_v2.sql, v tom istom Supabase projekte.

-- ============================================================
-- 1. CHÝBAJÚCE ZÁPISOVÉ RLS POLITIKY (F1 doplnenie)
-- ============================================================

-- Self-service vstup do klubu/kategórie (onboarding)
drop policy if exists "memberships: insert own" on public.club_memberships;
create policy "memberships: insert own" on public.club_memberships
  for insert to authenticated with check (profile_id = auth.uid());

drop policy if exists "memberships: update own" on public.club_memberships;
create policy "memberships: update own" on public.club_memberships
  for update to authenticated using (profile_id = auth.uid());

drop policy if exists "memberships: delete own" on public.club_memberships;
create policy "memberships: delete own" on public.club_memberships
  for delete to authenticated using (profile_id = auth.uid());

-- Tréningy: vytváranie/úprava trénerom alebo adminom klubu
drop policy if exists "trainings: write by coach/admin" on public.trainings;
create policy "trainings: write by coach/admin" on public.trainings
  for all to authenticated using (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid() and role in ('coach', 'club_admin'))
  ) with check (
    club_id in (select club_id from public.club_memberships where profile_id = auth.uid() and role in ('coach', 'club_admin'))
  );

-- Oznamy: vytváranie trénerom/adminom (broadcast do kategórie alebo celého klubu)
drop policy if exists "announcements: insert by coach/admin" on public.announcements;
create policy "announcements: insert by coach/admin" on public.announcements
  for insert to authenticated with check (
    created_by = auth.uid()
    and club_id in (select club_id from public.club_memberships where profile_id = auth.uid() and role in ('coach', 'club_admin'))
  );

-- ============================================================
-- 2. CHAT KANÁLY — TYP + KATEGÓRIOVÉ OPRÁVNENIA (docs/chat-permissions.md)
-- ============================================================

alter table public.chat_channels
  add column if not exists kind text not null default 'category'
    check (kind in ('category', 'coaches', 'management', 'marketing'));

-- Helper: má aktuálny používateľ prístup k danému chat kanálu?
-- U9 — Najmladší: hráči (role='player') NEMAJÚ priamy prístup — iba rodičia a tréner (child-safety, nie technické obmedzenie).
create or replace function public.can_access_chat_channel(p_channel_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.chat_channels cc
    left join public.categories cat on cat.id = cc.category_id
    join public.club_memberships m on m.club_id = cc.club_id
    where cc.id = p_channel_id
      and m.profile_id = auth.uid()
      and (
        (cc.kind = 'coaches' and m.role in ('coach', 'club_admin'))
        or (cc.kind in ('management', 'marketing') and m.role = 'club_admin')
        or (
          cc.kind = 'category'
          and m.category_id = cc.category_id
          and not (cat.name = 'U9 — Najmladší' and m.role = 'player')
        )
      )
  );
$$;

drop policy if exists "chat_channels: read for club members" on public.chat_channels;
create policy "chat_channels: read for accessible" on public.chat_channels
  for select to authenticated using (public.can_access_chat_channel(id));

drop policy if exists "chat_messages: read for channel members" on public.chat_messages;
create policy "chat_messages: read for accessible channel" on public.chat_messages
  for select to authenticated using (public.can_access_chat_channel(channel_id));

drop policy if exists "chat_messages: insert for channel members" on public.chat_messages;
create policy "chat_messages: insert for accessible channel" on public.chat_messages
  for insert to authenticated with check (
    profile_id = auth.uid() and public.can_access_chat_channel(channel_id)
  );

-- ============================================================
-- 3. SEED: chat kanály pre MFK Nová Baňa (1 na kategóriu + interný trénerský)
-- ============================================================

insert into public.chat_channels (club_id, category_id, name, kind)
select c.id, cat.id, cat.name, 'category'
from public.clubs c
join public.categories cat on cat.club_id = c.id
where c.slug = 'mfk-nova-bana'
on conflict do nothing;

insert into public.chat_channels (club_id, category_id, name, kind)
select id, null, 'Tréneri', 'coaches' from public.clubs where slug = 'mfk-nova-bana'
on conflict do nothing;

-- ============================================================
-- 4. Odmeňovňa — pár ukážkových odmien pre MFK Nová Baňa (testovacie dáta)
-- ============================================================

insert into public.reward_items (club_id, name, xp_cost, min_level)
select id, item, cost, 1 from public.clubs, (values
  ('Klubový nákrčník', 200),
  ('Fľaša na pitie MFK', 150),
  ('Tréning s A-mužstvom', 800),
  ('Vstupenka na domáci zápas pre kamaráta', 400)
) as t(item, cost)
where slug = 'mfk-nova-bana'
on conflict do nothing;

-- ============================================================
-- 5. REALTIME pre chat_messages (potrebné pre živý chat v appke)
-- ============================================================

do $$
begin
  alter publication supabase_realtime add table public.chat_messages;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.match_events;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.matches;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.notifications;
exception
  when duplicate_object then null;
end $$;

-- ============================================================
-- 6. Manuálne XP udalosti zo zápasu (karty, účasť v zápase) — volané z app vrstvy
-- (webapp/src/app/dashboard/matches/actions.ts), keďže hráč nemá priame INSERT právo
-- do xp_events. SECURITY DEFINER s explicitnou kontrolou, že volajúci je
-- tréner/admin klubu, ktorého je cieľový hráč členom.
-- ============================================================

create or replace function public.award_match_xp(
  p_profile_id uuid, p_xp_type public.xp_event_type, p_amount integer, p_note text
)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_is_coach boolean;
begin
  select exists(
    select 1 from public.club_memberships me
    join public.club_memberships target on target.club_id = me.club_id
    where me.profile_id = auth.uid() and me.role in ('coach', 'club_admin')
      and target.profile_id = p_profile_id
  ) into v_is_coach;

  if not v_is_coach then
    raise exception 'Iba tréner/admin spoločného klubu môže upraviť XP hráča';
  end if;

  insert into public.xp_events (profile_id, type, amount, note)
  values (p_profile_id, p_xp_type, p_amount, p_note);
end;
$$;

-- ============================================================
-- 7. notifications — INSERT politika (systémové notifikácie posiela appka
-- z app vrstvy pri zmene tréningu / oznamu / zápasovej udalosti; obmedzené na
-- trénerov/adminov daného klubu, aby hráč nemohol notifikovať cudzích používateľov).
-- ============================================================

drop policy if exists "notifications: insert by club coach/admin" on public.notifications;
create policy "notifications: insert by club coach/admin" on public.notifications
  for insert to authenticated with check (
    club_id is null
    or club_id in (
      select club_id from public.club_memberships
      where profile_id = auth.uid() and role in ('coach', 'club_admin')
    )
  );
