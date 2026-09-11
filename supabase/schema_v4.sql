-- Fynd — schema_v4: Web Push notifikácie (docs/push-notifications.md).
-- Spustiť AŽ PO schema.sql, schema_v2.sql a schema_v3.sql.
--
-- DÔLEŽITÉ — poradie krokov (podrobne v docs/push-notifications.md):
--   1. Najprv nasadiť Edge Function "send-push" a nastaviť jej secrets
--      (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT, PUSH_TRIGGER_SECRET).
--   2. Získať URL nasadenej funkcie (https://<project-ref>.supabase.co/functions/v1/send-push).
--   3. Dole v sekcii 3 nahradiť v_url a v_secret skutočnými hodnotami.
--   4. Až potom spustiť tento celý súbor v Supabase SQL Editore.

-- ============================================================
-- 1. PUSH_SUBSCRIPTIONS — jedno zariadenie/prehliadač = jeden riadok
-- ============================================================

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "push_subscriptions: select own" on public.push_subscriptions;
create policy "push_subscriptions: select own" on public.push_subscriptions
  for select to authenticated using (profile_id = auth.uid());

drop policy if exists "push_subscriptions: insert own" on public.push_subscriptions;
create policy "push_subscriptions: insert own" on public.push_subscriptions
  for insert to authenticated with check (profile_id = auth.uid());

drop policy if exists "push_subscriptions: delete own" on public.push_subscriptions;
create policy "push_subscriptions: delete own" on public.push_subscriptions
  for delete to authenticated using (profile_id = auth.uid());

-- ============================================================
-- 2. pg_net — potrebné pre volanie Edge Function z DB triggeru
-- ============================================================

create extension if not exists pg_net with schema extensions;

-- ============================================================
-- 3. TRIGGER: každý nový riadok v notifications → zavolá send-push
-- ============================================================

create or replace function public.trigger_send_push()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_url text := 'https://REPLACE-ME.supabase.co/functions/v1/send-push'; -- TODO: URL nasadenej Edge Function
  v_secret text := 'REPLACE-ME-RANDOM-SECRET'; -- TODO: rovnaká hodnota ako PUSH_TRIGGER_SECRET v secrets funkcie
begin
  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', v_secret),
    body := jsonb_build_object('notification_id', NEW.id)
  );
  return NEW;
end;
$$;

drop trigger if exists notifications_send_push on public.notifications;
create trigger notifications_send_push
  after insert on public.notifications
  for each row execute function public.trigger_send_push();

-- ============================================================
-- 4. TRÉNINGOVÉ PRIPOMIENKY — pg_cron job, deň vopred
-- ============================================================

alter table public.trainings add column if not exists reminded_at timestamptz;

create extension if not exists pg_cron with schema extensions;

create or replace function public.queue_training_reminders()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (profile_id, club_id, type, title, body)
  select distinct m.profile_id, t.club_id, 'training_reminder',
    'Pripomienka tréningu',
    'Tréning ' || to_char(t.starts_at, 'DD.MM. HH24:MI') || coalesce(' · ' || t.location, '')
  from public.trainings t
  join public.club_memberships m
    on m.club_id = t.club_id and m.category_id = t.category_id
  where t.starts_at between now() + interval '23 hours' and now() + interval '25 hours'
    and t.reminded_at is null;

  update public.trainings
  set reminded_at = now()
  where starts_at between now() + interval '23 hours' and now() + interval '25 hours'
    and reminded_at is null;
end;
$$;

do $$
begin
  if not exists (select 1 from cron.job where jobname = 'queue-training-reminders') then
    perform cron.schedule(
      'queue-training-reminders',
      '0 * * * *', -- každú celú hodinu — reminded_at zabraňuje duplicitám
      $cron$select public.queue_training_reminders();$cron$
    );
  end if;
end $$;

-- ============================================================
-- 5. CHAT SPRÁVY — fanout notifikácia pre členov kanála (okrem odosielateľa)
-- Rovnaká U9/kind logika ako public.can_access_chat_channel() (schema_v3) —
-- pri zmene jednej treba zmeniť aj druhú.
-- ============================================================

create or replace function public.fanout_chat_message_notification()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_channel record;
  v_sender_name text;
begin
  select cc.id, cc.club_id, cc.category_id, cc.kind, cc.name, cat.name as category_name
  into v_channel
  from public.chat_channels cc
  left join public.categories cat on cat.id = cc.category_id
  where cc.id = NEW.channel_id;

  select coalesce(full_name, 'Niekto') into v_sender_name
  from public.profiles where id = NEW.profile_id;

  insert into public.notifications (profile_id, club_id, type, title, body)
  select m.profile_id, v_channel.club_id, 'chat_message',
    v_sender_name || ' · ' || v_channel.name,
    left(NEW.content, 140)
  from public.club_memberships m
  where m.club_id = v_channel.club_id
    and m.profile_id <> NEW.profile_id
    and (
      (v_channel.kind = 'coaches' and m.role in ('coach', 'club_admin'))
      or (v_channel.kind in ('management', 'marketing') and m.role = 'club_admin')
      or (
        v_channel.kind = 'category'
        and m.category_id = v_channel.category_id
        and not (v_channel.category_name = 'U9 — Najmladší' and m.role = 'player')
      )
    );

  return NEW;
end;
$$;

drop trigger if exists chat_messages_notify on public.chat_messages;
create trigger chat_messages_notify
  after insert on public.chat_messages
  for each row execute function public.fanout_chat_message_notification();
