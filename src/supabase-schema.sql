-- Casa em Dia / Organizador Contas Familiar — Supabase Produção MVP
-- Execute no SQL Editor do Supabase.
-- Depois, ative Realtime para: bills, payments, family_members.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  avatar_url text,
  color text not null default '#4DA3FF',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null,
  amount numeric(12,2) not null check (amount > 0),
  due_date date not null,
  category text not null default 'Casa',
  status text not null default 'pending' check (status in ('pending', 'paid')),
  assigned_to uuid references public.profiles(id) on delete set null,
  is_recurring boolean not null default false,
  recurrence_day int check (recurrence_day between 1 and 31),
  installment_current int check (installment_current is null or installment_current > 0),
  installment_total int check (installment_total is null or installment_total > 0),
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  paid_by uuid references public.profiles(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  paid_at timestamptz not null default now(),
  snapshot_title text not null,
  notes text
);

create index if not exists idx_family_members_user_id on public.family_members(user_id);
create index if not exists idx_family_members_family_id on public.family_members(family_id);
create index if not exists idx_bills_family_due_date on public.bills(family_id, due_date);
create index if not exists idx_bills_family_status on public.bills(family_id, status);
create index if not exists idx_payments_family_paid_at on public.payments(family_id, paid_at desc);
create index if not exists idx_payments_bill_id on public.payments(bill_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists set_families_updated_at on public.families;
create trigger set_families_updated_at before update on public.families for each row execute function public.set_updated_at();

drop trigger if exists set_bills_updated_at on public.bills;
create trigger set_bills_updated_at before update on public.bills for each row execute function public.set_updated_at();

create or replace function public.is_family_member(target_family_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members fm
    where fm.family_id = target_family_id
      and fm.user_id = auth.uid()
  );
$$;

create or replace function public.is_family_admin(target_family_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members fm
    where fm.family_id = target_family_id
      and fm.user_id = auth.uid()
      and fm.role in ('owner', 'admin')
  );
$$;

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.bills enable row level security;
alter table public.payments enable row level security;

-- Profiles
create policy "profiles_select_self_or_family" on public.profiles
for select using (
  id = auth.uid()
  or exists (
    select 1
    from public.family_members me
    join public.family_members other on other.family_id = me.family_id
    where me.user_id = auth.uid()
      and other.user_id = profiles.id
  )
);

create policy "profiles_insert_self" on public.profiles
for insert with check (id = auth.uid());

create policy "profiles_update_self" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

-- Families
create policy "families_select_member" on public.families
for select using (public.is_family_member(id));

create policy "families_insert_creator" on public.families
for insert with check (created_by = auth.uid());

create policy "families_update_admin" on public.families
for update using (public.is_family_admin(id)) with check (public.is_family_admin(id));

-- Family members
create policy "family_members_select_member" on public.family_members
for select using (public.is_family_member(family_id));

create policy "family_members_insert_self_or_admin" on public.family_members
for insert with check (
  user_id = auth.uid()
  or public.is_family_admin(family_id)
);

create policy "family_members_update_admin" on public.family_members
for update using (public.is_family_admin(family_id)) with check (public.is_family_admin(family_id));

create policy "family_members_delete_admin" on public.family_members
for delete using (public.is_family_admin(family_id));

-- Bills
create policy "bills_select_member" on public.bills
for select using (public.is_family_member(family_id));

create policy "bills_insert_member" on public.bills
for insert with check (public.is_family_member(family_id) and created_by = auth.uid());

create policy "bills_update_member" on public.bills
for update using (public.is_family_member(family_id)) with check (public.is_family_member(family_id));

create policy "bills_delete_member" on public.bills
for delete using (public.is_family_member(family_id));

-- Payments
create policy "payments_select_member" on public.payments
for select using (public.is_family_member(family_id));

create policy "payments_insert_member" on public.payments
for insert with check (public.is_family_member(family_id) and paid_by = auth.uid());

create policy "payments_update_admin" on public.payments
for update using (public.is_family_admin(family_id)) with check (public.is_family_admin(family_id));

create policy "payments_delete_admin" on public.payments
for delete using (public.is_family_admin(family_id));

-- Opcional: criar perfil automaticamente quando usuário for criado.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
