create or replace function public.handle_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, image_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  )
  on conflict (id)
  do update set
    full_name = excluded.full_name,
    image_url = excluded.image_url,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_profile_sync on auth.users;
create trigger on_auth_user_profile_sync
after insert or update on auth.users
for each row
execute function public.handle_profile_from_auth();
