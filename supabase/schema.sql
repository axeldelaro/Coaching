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
