-- Fynd — schema_v9: svetlý/tmavý režim + sviatočné sezónne témy.
-- Spustiť AŽ PO schema.sql .. schema_v8.sql. Idempotentné.

-- 1) Svetlý/tmavý režim appky (nezávislý od season_theme)
alter table public.profiles
  add column if not exists color_mode text not null default 'dark';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_color_mode_check'
  ) then
    alter table public.profiles
      add constraint profiles_color_mode_check
      check (color_mode in ('dark', 'light'));
  end if;
end $$;

-- 2) Rozšírenie season_theme o sviatočné témy (Halloween, Vianoce, Veľká noc)
do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'profiles_season_theme_check'
  ) then
    alter table public.profiles drop constraint profiles_season_theme_check;
  end if;

  alter table public.profiles
    add constraint profiles_season_theme_check
    check (season_theme in ('default', 'jar', 'leto', 'jesen', 'zima', 'halloween', 'vianoce', 'velkanoc'));
end $$;
