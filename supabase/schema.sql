-- PIXOGAMEONLINE — Supabase Schema
-- Jalankan seluruh file ini di Supabase Dashboard → SQL Editor.

-- ============ TABLES ============

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon_url text not null default '',
  icon_width integer not null default 120,
  icon_height integer not null default 120,
  range_label text not null default '',
  user_id_label text not null default 'User ID',
  user_id_placeholder text not null default '12345678',
  server_id_label text not null default 'Server ID',
  server_id_placeholder text not null default '1000',
  server_id_required boolean not null default false,
  hide_server_id boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pricing (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  nominal_label text not null,
  price integer not null check (price > 0),
  category text not null default 'nominal' check (category in ('nominal', 'pass')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- ============ INDEXES ============

create index if not exists idx_games_active_sort on public.games (is_active, sort_order);
create index if not exists idx_pricing_game_sort on public.pricing (game_id, sort_order);

-- ============ TRIGGERS: updated_at ============

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_games_updated on public.games;
create trigger trg_games_updated before update on public.games
  for each row execute function public.set_updated_at();

drop trigger if exists trg_pricing_updated on public.pricing;
create trigger trg_pricing_updated before update on public.pricing
  for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated on public.settings;
create trigger trg_settings_updated before update on public.settings
  for each row execute function public.set_updated_at();

-- ============ ROW LEVEL SECURITY ============

alter table public.games enable row level security;
alter table public.pricing enable row level security;
alter table public.settings enable row level security;
alter table public.admin_users enable row level security;

-- Public read (untuk landing page & halaman top-up)
drop policy if exists "games public read" on public.games;
create policy "games public read"
  on public.games for select to anon, authenticated using (true);

drop policy if exists "pricing public read" on public.pricing;
create policy "pricing public read"
  on public.pricing for select to anon, authenticated using (true);

drop policy if exists "settings public read" on public.settings;
create policy "settings public read"
  on public.settings for select to anon, authenticated using (true);

-- Hanya user yang terdaftar di admin_users yang bisa menulis
-- SECURITY DEFINER: wajib, agar is_admin() tidak memicu rekursi RLS
-- (policy admin_users memanggil is_admin(), dan is_admin() membaca admin_users).
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  );
$$;

drop policy if exists "games admin write" on public.games;
create policy "games admin write"
  on public.games for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "pricing admin write" on public.pricing;
create policy "pricing admin write"
  on public.pricing for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write"
  on public.settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_users self read" on public.admin_users;
create policy "admin_users self read"
  on public.admin_users for select to authenticated using (id = auth.uid() or public.is_admin());

-- Otomatis daftarkan user Supabase sebagai admin bila emailnya ada di whitelist
-- settings key 'admin_emails' (array jsonb, contoh: ["admin@example.com"])
create or replace function public.handle_new_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.settings s
    where s.key = 'admin_emails'
      and new.email = any (array(select jsonb_array_elements_text(s.value)))
  ) then
    insert into public.admin_users (user_id, email)
    values (new.id, new.email)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_handle_new_admin on auth.users;
create trigger trg_handle_new_admin after insert on auth.users
  for each row execute function public.handle_new_admin();
