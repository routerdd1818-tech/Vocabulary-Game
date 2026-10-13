-- ==========================================================================
-- Word Dungeon & Babel Tower - Supabase Schema
-- 執行於 Supabase Dashboard -> SQL Editor 即可完成全套資料表、安全權限與觸發器建立
-- ==========================================================================

-- 1. 建立 profiles 玩家資料表
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  hero_name text not null default '單字勇者',
  tower_floor integer default 1,
  tower_record_floor integer default 1,
  tower_points integer default 0,
  gold integer default 60,
  current_hp integer default 120,
  streak integer default 1,
  equipped_weapon text default 'w1',
  equipped_armor text default 'a1',
  equipped_relic text,
  owned_weapons text[] default array['w1'],
  owned_armors text[] default array['a1'],
  owned_relics text[] default array[]::text[],
  inventory jsonb default '{"potion": 2, "guard_scroll": 1}'::jsonb,
  dungeon_progress integer default 1,
  dungeon_first_cleared integer[] default array[]::integer[],
  vocab_stats jsonb default '{}'::jsonb,
  bestiary_unlocked text[] default array[]::text[],
  leave_pass_expires bigint default 0,
  last_active_timestamp bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. 啟用 Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 策略 1：所有使用者皆可查詢 profiles（供全球通天塔即時排行榜使用）
create policy "Public profiles are viewable by all users"
  on public.profiles for select
  using (true);

-- 策略 2：使用者可新增自己的個人檔案
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 策略 3：使用者只能更新自己的個人檔案（防作弊）
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 3. 自動建立 Profile 觸發器（當玩家透過 Supabase Auth 註冊新帳號時自動觸發）
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, hero_name, last_active_timestamp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'hero_name', '單字勇者'),
    (extract(epoch from now()) * 1000)::bigint
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- 註冊觸發器至 auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. 建立排行榜快速查詢索引
create index if not exists idx_profiles_tower_ranking 
  on public.profiles (tower_record_floor desc, streak desc);
