-- ============================================================
-- Tracker Nutrición — esquema Supabase
-- Ejecuta TODO este bloque una sola vez en:
--   Supabase Dashboard > tu proyecto > SQL Editor > New query > Run
-- ============================================================

-- Una fila por usuario con todo su estado como JSON.
create table if not exists public.nutrition_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Solo el dueño puede leer/escribir su fila.
alter table public.nutrition_state enable row level security;

drop policy if exists "own state select" on public.nutrition_state;
create policy "own state select" on public.nutrition_state
  for select using (auth.uid() = user_id);

drop policy if exists "own state insert" on public.nutrition_state;
create policy "own state insert" on public.nutrition_state
  for insert with check (auth.uid() = user_id);

drop policy if exists "own state update" on public.nutrition_state;
create policy "own state update" on public.nutrition_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own state delete" on public.nutrition_state;
create policy "own state delete" on public.nutrition_state
  for delete using (auth.uid() = user_id);

-- ============================================================
-- Además, en el dashboard (una sola vez):
--   1) Authentication > Providers > Email  ->  activa "Email" (magic link).
--      (En proyectos nuevos ya viene habilitado por defecto.)
--   2) Authentication > URL Configuration > Redirect URLs
--      ->  agrega:  https://lucabiottiflores.github.io/tracker-nutricion/**
-- ============================================================
