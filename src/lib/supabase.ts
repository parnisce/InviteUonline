import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Integration will not work.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

/*
  DATABASE SCHEMA PLAN (To be run in Supabase SQL Editor):

  -- 1. Profiles (extending Auth users)
  create table profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    avatar_url text,
    updated_at timestamp with time zone
  );

  -- 2. Events table
  create table events (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users,
    event_type text not null, -- 'Birthday', 'Wedding', etc.
    title text not null,
    slug text unique not null,
    description text,
    event_date timestamp with time zone,
    location text,
    banner_url text,
    gallery_urls text[], -- Array of image links
    theme_color text default '#10b981',
    is_published boolean default false,
    payment_status text default 'pending', -- 'pending', 'paid'
    event_details jsonb, -- Specific form data (e.g. spouse names for Wedding)
    created_at timestamp with time zone default now()
  );

  -- 3. RSVPs (Guest responses)
  create table rsvps (
    id uuid default gen_random_uuid() primary key,
    event_id uuid references events on delete cascade,
    name text not null,
    email text,
    status text, -- 'attending', 'declined', 'maybe'
    guests_count int default 1,
    dietary_notes text,
    custom_responses jsonb,
    created_at timestamp with time zone default now()
  );

  -- RLS (Row Level Security)
  alter table events enable row level security;
  create policy "Users can manage their own events" on events for all using (auth.uid() = user_id);
  create policy "Public can view published events" on events for select using (is_published = true);

  alter table rsvps enable row level security;
  create policy "Event owners can view RSVPs" on rsvps for select using (
    exists (select 1 from events where id = rsvps.event_id and user_id = auth.uid())
  );
  create policy "Public can submit RSVPs" on rsvps for insert with check (true);
*/
