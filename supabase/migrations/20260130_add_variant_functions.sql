create or replace function public.get_variant_by_id(p_variant_id uuid)
returns table (
  product_id uuid,
  product_name text,
  product_description text,
  product_is_active boolean,
  product_created_at timestamptz,
  product_remaining_amount numeric,
  product_sold_amount numeric,
  category_id uuid,
  category_name text,
  variant_id uuid,
  variant_price numeric,
  variant_discount_price numeric,
  variant_sku text,
  color_id uuid,
  color_name text,
  color_hex text,
  size_id uuid,
  size_name text,
  main_image_url text,
  images text[],
  is_wishlisted boolean,
  reviews_count integer,
  reviews_avg numeric,
  reviews jsonb
)
language sql
stable
as $$
  select
    p.id            as product_id,
    p.name          as product_name,
    p.description   as product_description,
    p.is_active     as product_is_active,
    p.created_at    as product_created_at,
    p.remaining_amount as product_remaining_amount,
    p.sold_amount as product_sold_amount,
    c.id            as category_id,
    c.name          as category_name,
    v.id            as variant_id,
    v.price         as variant_price,
    v.discount_price         as variant_discount_price,
    v.sku           as variant_sku,
    v.color_id      as color_id,
    col.name        as color_name,
    col.hex_code    as color_hex,
    v.size_id       as size_id,
    sz.name         as size_name,
    main_img.image_url as main_image_url,
    coalesce(imgs.images, array[]::text[]) as images,
    exists (
      select 1
      from public.wishlist_variants wv
      where wv.variant_id = v.id
        and wv.user_id = auth.uid()
    ) as is_wishlisted,
    coalesce(rev.count, 0) as reviews_count,
    rev.avg as reviews_avg,
    rev.items as reviews
  from public.products p
  join public.categories c on c.id = p.category_id
  join public.product_variants v on v.product_id = p.id
  left join public.colors col on col.id = v.color_id
  left join public.sizes  sz  on sz.id  = v.size_id
  left join lateral (
    select vi.image_url
    from public.variant_images vi
    where vi.variant_id = v.id
    order by vi.is_main desc, vi.created_at desc
    limit 1
  ) main_img on true
  left join lateral (
    select array_agg(vi.image_url order by vi.is_main desc, vi.created_at desc) as images
    from public.variant_images vi
    where vi.variant_id = v.id
  ) imgs on true
  left join lateral (
    select
      count(*)::int as count,
      round(avg(r.rating)::numeric, 2) as avg,
      jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'product_id', r.product_id,
          'user_id', r.user_id,
          'rating', r.rating,
          'comment', r.comment,
          'created_at', r.created_at
        )
        order by r.created_at desc
      ) as items
    from public.reviews r
    where r.product_id = p.id
  ) rev on true
  where p.is_active = true
    and v.id = p_variant_id;
$$;

create or replace function public.get_variants_by_product_id(p_product_id uuid)
returns table (
  product_id uuid,
  product_name text,
  product_description text,
  product_is_active boolean,
  product_created_at timestamptz,
  category_id uuid,
  category_name text,
  variant_id uuid,
  variant_price numeric,
  variant_discount_price numeric,
  variant_sku text,
  color_id uuid,
  color_name text,
  color_hex text,
  size_id uuid,
  size_name text,
  main_image_url text,
  images text[],
  is_wishlisted boolean
)
language sql
stable
as $$
  select
    p.id            as product_id,
    p.name          as product_name,
    p.description   as product_description,
    p.is_active     as product_is_active,
    p.created_at    as product_created_at,
    c.id            as category_id,
    c.name          as category_name,
    v.id            as variant_id,
    v.price         as variant_price,
    v.discount_price         as variant_discount_price,
    v.sku           as variant_sku,
    v.color_id      as color_id,
    col.name        as color_name,
    col.hex_code    as color_hex,
    v.size_id       as size_id,
    sz.name         as size_name,
    main_img.image_url as main_image_url,
    coalesce(imgs.images, array[]::text[]) as images,
    exists (
      select 1
      from public.wishlist_variants wv
      where wv.variant_id = v.id
        and wv.user_id = auth.uid()
    ) as is_wishlisted
  from public.products p
  join public.categories c on c.id = p.category_id
  join public.product_variants v on v.product_id = p.id
  left join public.colors col on col.id = v.color_id
  left join public.sizes  sz  on sz.id  = v.size_id
  left join lateral (
    select vi.image_url
    from public.variant_images vi
    where vi.variant_id = v.id
    order by vi.is_main desc, vi.created_at desc
    limit 1
  ) main_img on true
  left join lateral (
    select array_agg(vi.image_url order by vi.is_main desc, vi.created_at desc) as images
    from public.variant_images vi
    where vi.variant_id = v.id
  ) imgs on true
  where p.is_active = true
    and p.id = p_product_id
  order by v.created_at desc;
$$;

create or replace function public.get_related_variants_by_category(
  p_category_id uuid,
  p_product_id uuid,
  p_limit integer default 4
)
returns table (
  product_id uuid,
  product_name text,
  product_description text,
  product_is_active boolean,
  product_created_at timestamptz,
  category_id uuid,
  category_name text,
  variant_id uuid,
  variant_price numeric,
  variant_discount_price numeric,
  variant_sku text,
  color_id uuid,
  color_name text,
  color_hex text,
  size_id uuid,
  size_name text,
  main_image_url text,
  images text[],
  is_wishlisted boolean
)
language sql
stable
as $$
  select
    p.id            as product_id,
    p.name          as product_name,
    p.description   as product_description,
    p.is_active     as product_is_active,
    p.created_at    as product_created_at,
    c.id            as category_id,
    c.name          as category_name,
    v.id            as variant_id,
    v.price         as variant_price,
    v.discount_price         as variant_discount_price,
    v.sku           as variant_sku,
    v.color_id      as color_id,
    col.name        as color_name,
    col.hex_code    as color_hex,
    v.size_id       as size_id,
    sz.name         as size_name,
    main_img.image_url as main_image_url,
    coalesce(imgs.images, array[]::text[]) as images,
    exists (
      select 1
      from public.wishlist_variants wv
      where wv.variant_id = v.id
        and wv.user_id = auth.uid()
    ) as is_wishlisted
  from public.products p
  join public.categories c on c.id = p.category_id
  join public.product_variants v on v.product_id = p.id
  left join public.colors col on col.id = v.color_id
  left join public.sizes  sz  on sz.id  = v.size_id
  left join lateral (
    select vi.image_url
    from public.variant_images vi
    where vi.variant_id = v.id
    order by vi.is_main desc, vi.created_at desc
    limit 1
  ) main_img on true
  left join lateral (
    select array_agg(vi.image_url order by vi.is_main desc, vi.created_at desc) as images
    from public.variant_images vi
    where vi.variant_id = v.id
  ) imgs on true
  where p.is_active = true
    and p.category_id = p_category_id
    and p.id <> p_product_id
  order by p.created_at desc, v.created_at desc
  limit least(p_limit, 12);
$$;
