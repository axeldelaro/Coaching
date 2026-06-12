-- ============================================================
-- RECOMP — Schéma Supabase
-- À coller dans : Supabase Dashboard → SQL Editor → Run
-- ============================================================
-- Sécurité : Row Level Security (RLS) activée partout.
-- Chaque utilisateur ne peut lire/écrire QUE ses propres lignes.
-- Les données sont chiffrées au repos (AES-256) côté Supabase.

-- 1) Profils utilisateurs ------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  pseudo text,
  anamnese jsonb default '{}'::jsonb,   -- âge, taille, poids, sexe, blessures, allergies, matériel...
  targets jsonb default '{}'::jsonb,    -- kcal, protéines, lipides, glucides, bmr, tdee
  program jsonb default '{}'::jsonb,    -- programme modulable (séances/exercices)
  settings jsonb default '{}'::jsonb,   -- rappels, préférences
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profil: lecture propre" on public.profiles
  for select using (auth.uid() = id);
create policy "profil: insertion propre" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profil: mise à jour propre" on public.profiles
  for update using (auth.uid() = id);

-- 2) Journal unifié (séances, mesures, carnet, nutrition) ----
create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  kind text not null check (kind in ('workout','journal','meals')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists logs_user_day on public.logs (user_id, day desc);

alter table public.logs enable row level security;

create policy "logs: lecture propre" on public.logs
  for select using (auth.uid() = user_id);
create policy "logs: insertion propre" on public.logs
  for insert with check (auth.uid() = user_id);
create policy "logs: mise à jour propre" on public.logs
  for update using (auth.uid() = user_id);
create policy "logs: suppression propre" on public.logs
  for delete using (auth.uid() = user_id);

-- 3) Classement Mondial (Leaderboard) ------------------------
create table if not exists public.leaderboard (
  id uuid primary key references auth.users (id) on delete cascade,
  pseudo text not null,
  level int default 1,
  xp int default 0,
  workouts int default 0,
  updated_at timestamptz default now()
);
alter table public.leaderboard enable row level security;
create policy "leaderboard: lecture publique" on public.leaderboard for select using (auth.role() = 'authenticated');
create policy "leaderboard: maj propre" on public.leaderboard for all using (auth.uid() = id);

-- 4) Catalogue Global (Synchronisation) ----------------------
create table if not exists public.global_recipes (
  id text primary key,
  data jsonb not null,
  updated_by uuid references auth.users (id),
  updated_at timestamptz default now()
);
alter table public.global_recipes enable row level security;
create policy "global_recipes: lecture publique" on public.global_recipes for select using (true);
create policy "global_recipes: admin maj" on public.global_recipes for all using (auth.role() = 'authenticated'); -- Ou resserrer sur des UIDs spécifiques

create table if not exists public.global_exercises (
  id text primary key,
  data jsonb not null,
  updated_by uuid references auth.users (id),
  updated_at timestamptz default now()
);
alter table public.global_exercises enable row level security;
create policy "global_exercises: lecture publique" on public.global_exercises for select using (true);
create policy "global_exercises: admin maj" on public.global_exercises for all using (auth.role() = 'authenticated');

-- 5) Abonnements Push Notifications --------------------------
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subscription jsonb not null,
  created_at timestamptz default now()
);
alter table public.push_subscriptions enable row level security;
create policy "push: lecture propre" on public.push_subscriptions for select using (auth.uid() = user_id);
create policy "push: insertion propre" on public.push_subscriptions for insert with check (auth.uid() = user_id);
create policy "push: suppression propre" on public.push_subscriptions for delete using (auth.uid() = user_id);

-- 6) RLS pour Supabase Storage (Bucket "photos") -------------
-- À créer manuellement dans le dashboard : Storage -> New bucket "photos"
-- Puis exécuter ces policies :
create policy "Photos privées" on storage.objects for select using ( bucket_id = 'photos' and auth.uid() = owner );
create policy "Ajout de photos" on storage.objects for insert with check ( bucket_id = 'photos' and auth.uid() = owner );
create policy "Suppression de photos" on storage.objects for delete using ( bucket_id = 'photos' and auth.uid() = owner );
