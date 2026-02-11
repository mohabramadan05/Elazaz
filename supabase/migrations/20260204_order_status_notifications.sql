create or replace function public.notify_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.notifications (user_id, title, description, status)
    values (
      new.user_id,
      format('تحديث حالة الطلب رقم %s', new.id),
      format('تم تحديث حالة طلبك رقم %s إلى: %s', new.id, new.status),
      'unread'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_order_status_change_notify on public.orders;
create trigger on_order_status_change_notify
after update of status on public.orders
for each row
when (old.status is distinct from new.status)
execute function public.notify_order_status_change();
