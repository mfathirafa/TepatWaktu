-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Custom Types
create type user_role as enum ('admin', 'customer');
create type warranty_status as enum ('active', 'expiring', 'expired');

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role user_role default 'customer'::user_role not null,
  name text,
  email text not null,
  subscription_tier text default 'free'::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Assets Table
create table public.assets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  brand text,
  category text,
  purchase_date date,
  price numeric(10,2),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Receipts Table
create table public.receipts (
  id uuid default uuid_generate_v4() primary key,
  asset_id uuid references public.assets(id) on delete cascade not null,
  file_url text not null,
  file_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Warranties Table
create table public.warranties (
  id uuid default uuid_generate_v4() primary key,
  asset_id uuid references public.assets(id) on delete cascade not null,
  expiry_date date not null,
  duration_months integer,
  status warranty_status default 'active'::warranty_status not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Notifications Table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  asset_id uuid references public.assets(id) on delete set null,
  type text not null,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_read boolean default false not null
);

-- Indexes
create index idx_profiles_email on public.profiles(email);
create index idx_assets_user_id on public.assets(user_id);
create index idx_receipts_asset_id on public.receipts(asset_id);
create index idx_warranties_asset_id on public.warranties(asset_id);
create index idx_warranties_status on public.warranties(status);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_is_read on public.notifications(is_read);

-- RLS Policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.receipts enable row level security;
alter table public.warranties enable row level security;
alter table public.notifications enable row level security;

-- Profiles Policies
create policy "Users can view their own profile."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Admins can view all profiles."
  on public.profiles for select
  using ( (select role from public.profiles where id = auth.uid()) = 'admin' );

-- Assets Policies
create policy "Users can view their own assets."
  on public.assets for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own assets."
  on public.assets for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own assets."
  on public.assets for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own assets."
  on public.assets for delete
  using ( auth.uid() = user_id );

-- Receipts Policies
create policy "Users can view receipts for their assets."
  on public.receipts for select
  using (
    exists (
      select 1 from public.assets
      where assets.id = receipts.asset_id and assets.user_id = auth.uid()
    )
  );

create policy "Users can insert receipts for their assets."
  on public.receipts for insert
  with check (
    exists (
      select 1 from public.assets
      where assets.id = receipts.asset_id and assets.user_id = auth.uid()
    )
  );

create policy "Users can update receipts for their assets."
  on public.receipts for update
  using (
    exists (
      select 1 from public.assets
      where assets.id = receipts.asset_id and assets.user_id = auth.uid()
    )
  );

create policy "Users can delete receipts for their assets."
  on public.receipts for delete
  using (
    exists (
      select 1 from public.assets
      where assets.id = receipts.asset_id and assets.user_id = auth.uid()
    )
  );

-- Warranties Policies
create policy "Users can view warranties for their assets."
  on public.warranties for select
  using (
    exists (
      select 1 from public.assets
      where assets.id = warranties.asset_id and assets.user_id = auth.uid()
    )
  );

create policy "Users can insert warranties for their assets."
  on public.warranties for insert
  with check (
    exists (
      select 1 from public.assets
      where assets.id = warranties.asset_id and assets.user_id = auth.uid()
    )
  );

create policy "Users can update warranties for their assets."
  on public.warranties for update
  using (
    exists (
      select 1 from public.assets
      where assets.id = warranties.asset_id and assets.user_id = auth.uid()
    )
  );

create policy "Users can delete warranties for their assets."
  on public.warranties for delete
  using (
    exists (
      select 1 from public.assets
      where assets.id = warranties.asset_id and assets.user_id = auth.uid()
    )
  );

-- Notifications Policies
create policy "Users can view their own notifications."
  on public.notifications for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own notifications."
  on public.notifications for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own notifications."
  on public.notifications for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own notifications."
  on public.notifications for delete
  using ( auth.uid() = user_id );

-- Triggers for updated_at
create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_current_timestamp_updated_at();

create trigger set_assets_updated_at
  before update on public.assets
  for each row execute procedure public.set_current_timestamp_updated_at();

create trigger set_warranties_updated_at
  before update on public.warranties
  for each row execute procedure public.set_current_timestamp_updated_at();

-- Trigger for new user signup (auto-create profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, subscription_tier)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer', 'free');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
