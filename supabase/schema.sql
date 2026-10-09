-- ==============================================================================
-- LOST & FOUND CHENNAI - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Tagline: "Lost Today, Found Together"
-- College Project: 2nd Year Information Technology Demonstration Schema
-- ==============================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";

-- 2. Profiles Table (Linked with Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  area text default 'Chennai Central',
  avatar_url text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Items Table (Lost & Found Listings in Chennai)
create table if not exists public.items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('lost', 'found')) not null,
  title text not null,
  category text check (category in ('electronics', 'wallets', 'keys', 'documents', 'jewellery', 'bags', 'pets', 'vehicles', 'clothing', 'other')) not null,
  description text not null,
  image_url text not null,
  date_occurred date not null,
  area text not null,
  location_description text not null,
  latitude double precision not null,
  longitude double precision not null,
  status text check (status in ('active', 'resolved')) default 'active' not null,
  reward text,
  verification_question text,
  contact_preference text check (contact_preference in ('chat', 'verified_only')) default 'chat',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Conversations Table (Private In-App Messaging)
create table if not exists public.conversations (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references public.items(id) on delete cascade not null,
  participant1_id uuid references public.profiles(id) on delete cascade not null,
  participant2_id uuid references public.profiles(id) on delete cascade not null,
  last_message text default '',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (item_id, participant1_id, participant2_id)
);

-- 5. Messages Table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  is_verification_prompt boolean default false,
  is_resolved_notification boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Safety Reports & Moderation
create table if not exists public.reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  reported_user_id uuid references public.profiles(id) on delete set null,
  item_id uuid references public.items(id) on delete set null,
  reason text not null,
  details text,
  status text check (status in ('pending', 'investigating', 'resolved')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;

-- Profiles: Anyone can view basic profiles, user can update their own
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select using (true);

create policy "Users can update their own profile" 
  on public.profiles for update using (auth.uid() = id);

-- Items: Anyone can browse active items; authenticated users can insert and update their own
create policy "Items are publicly viewable" 
  on public.items for select using (true);

create policy "Authenticated users can create items" 
  on public.items for insert with check (auth.uid() = user_id);

create policy "Users can update their own items" 
  on public.items for update using (auth.uid() = user_id);

create policy "Users can delete their own items" 
  on public.items for delete using (auth.uid() = user_id);

-- Conversations: Only participants can view their conversations
create policy "Participants can view their conversations" 
  on public.conversations for select 
  using (auth.uid() = participant1_id or auth.uid() = participant2_id);

create policy "Authenticated users can create conversations" 
  on public.conversations for insert 
  with check (auth.uid() = participant1_id or auth.uid() = participant2_id);

-- Messages: Only participants can read and send messages in their conversation
create policy "Participants can view messages" 
  on public.messages for select 
  using (
    exists (
      select 1 from public.conversations c 
      where c.id = messages.conversation_id 
      and (c.participant1_id = auth.uid() or c.participant2_id = auth.uid())
    )
  );

create policy "Participants can insert messages" 
  on public.messages for insert 
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversations c 
      where c.id = messages.conversation_id 
      and (c.participant1_id = auth.uid() or c.participant2_id = auth.uid())
    )
  );

-- Reports: Authenticated users can insert reports
create policy "Users can file reports" 
  on public.reports for insert with check (auth.uid() = reporter_id);

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION (for uploaded item photos)
-- ==============================================================================
-- Run via Supabase SQL editor:
-- insert into storage.buckets (id, name, public) values ('item-photos', 'item-photos', true);
-- create policy "Item photos are publicly accessible" on storage.objects for select using (bucket_id = 'item-photos');
-- create policy "Authenticated users can upload item photos" on storage.objects for insert with check (bucket_id = 'item-photos' and auth.role() = 'authenticated');

-- ==============================================================================
-- REALTIME SUBSCRIPTION ENABLER
-- ==============================================================================
-- alter publication supabase_realtime add table public.items;
-- alter publication supabase_realtime add table public.messages;
-- alter publication supabase_realtime add table public.conversations;
