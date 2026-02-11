-- Storage policies for users bucket (profile images)

-- Ensure RLS is enabled on storage objects (usually already enabled)
alter table if exists storage.objects enable row level security;

-- Allow authenticated users to upload to their own folder: {user_id}/...
drop policy if exists "users_upload_own_folder" on storage.objects;
create policy "users_upload_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'users'
  and name like auth.uid() || '/%'
);

-- Allow authenticated users to update files in their own folder
drop policy if exists "users_update_own_folder" on storage.objects;
create policy "users_update_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'users'
  and name like auth.uid() || '/%'
)
with check (
  bucket_id = 'users'
  and name like auth.uid() || '/%'
);

-- Allow authenticated users to delete files in their own folder
drop policy if exists "users_delete_own_folder" on storage.objects;
create policy "users_delete_own_folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'users'
  and name like auth.uid() || '/%'
);

-- Allow anyone to read profile images (public)
drop policy if exists "users_public_read" on storage.objects;
create policy "users_public_read"
on storage.objects
for select
to public
using (bucket_id = 'users');
