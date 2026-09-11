-- Fynd — schema_v6: Supabase Storage bucket pre profilové fotky.
-- Spustiť AŽ PO schema.sql .. schema_v5.sql.
-- Bezpečné spustiť opakovane (idempotentné).

-- 1) Verejne čitateľný bucket "avatars" (fotky sú zobrazené v appke ako <img src>,
--    preto public read; zápis len pre prihláseného vlastníka priečinka).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- 2) RLS na storage.objects: každý používateľ smie čítať/zapisovať len do
--    vlastného priečinka avatars/{auth.uid()}/... — prvý segment cesty = jeho UUID.

drop policy if exists "avatars: public read" on storage.objects;
create policy "avatars: public read" on storage.objects
  for select to public using (bucket_id = 'avatars');

drop policy if exists "avatars: owner insert" on storage.objects;
create policy "avatars: owner insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: owner update" on storage.objects;
create policy "avatars: owner update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: owner delete" on storage.objects;
create policy "avatars: owner delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
