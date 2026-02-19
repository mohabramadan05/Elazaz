alter table if exists public.orders
add column if not exists paymob_order_id text;

create unique index if not exists orders_paymob_order_id_uidx
on public.orders (paymob_order_id)
where paymob_order_id is not null;
