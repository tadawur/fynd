-- Fynd — schema_v8: sezónny vizuál appky (Nastavenia → ručný výber).
-- Spustiť AŽ PO schema.sql .. schema_v7.sql. Idempotentné.

alter table public.profiles
  add column if not exists season_theme text not null default 'default';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_season_theme_check'
  ) then
    alter table public.profiles
      add constraint profiles_season_theme_check
      check (season_theme in ('default', 'jar', 'leto', 'jesen', 'zima'));
  end if;
end $$;
