-- ============================================================
-- Spicco Deck Dinamico — schema Supabase (progetto DEDICATO)
--
-- Esegui questo file nel SQL Editor del tuo progetto Supabase dedicato
-- (NON il Supabase di produzione Spicco). Idempotente: puoi rilanciarlo.
-- ============================================================

-- ---------- Tabelle ----------
create table if not exists public.deck_links (
  slug              text primary key,
  company_name      text not null,
  logo_url          text,
  screenshot_1_url  text,
  screenshot_2_url  text,
  volume_branch     text not null check (volume_branch in ('pochi','tanti')),
  role              text not null check (role in ('ta','marketing')),
  market            text not null check (market in ('b2b','b2c')),
  pack              text not null check (pack in ('aurello','adriatec')),
  feedback_branch   text not null default 'no' check (feedback_branch in ('si','no')),
  pilot_spots       int default 2,
  twin_slug         text,
  note              text,
  created_at        timestamptz default now()
);

create table if not exists public.deck_views (
  id          bigint generated always as identity primary key,
  slug        text references public.deck_links(slug) on delete set null,
  opened_at   timestamptz default now(),
  referrer    text,
  user_agent  text
);

create index if not exists deck_views_slug_idx on public.deck_views (slug);

-- ---------- Row Level Security ----------
alter table public.deck_links enable row level security;
alter table public.deck_views enable row level security;

-- deck_links: lettura pubblica (lo slug e' la chiave "segreta").
-- Scrittura/aggiornamento/cancellazione: solo utenti autenticati (pannello).
drop policy if exists deck_links_public_read on public.deck_links;
create policy deck_links_public_read
  on public.deck_links for select
  to anon, authenticated
  using (true);

drop policy if exists deck_links_auth_insert on public.deck_links;
create policy deck_links_auth_insert
  on public.deck_links for insert
  to authenticated
  with check (true);

drop policy if exists deck_links_auth_update on public.deck_links;
create policy deck_links_auth_update
  on public.deck_links for update
  to authenticated
  using (true) with check (true);

drop policy if exists deck_links_auth_delete on public.deck_links;
create policy deck_links_auth_delete
  on public.deck_links for delete
  to authenticated
  using (true);

-- deck_views: insert pubblico (tracciamento aperture), lettura solo autenticati.
drop policy if exists deck_views_public_insert on public.deck_views;
create policy deck_views_public_insert
  on public.deck_views for insert
  to anon, authenticated
  with check (true);

drop policy if exists deck_views_auth_read on public.deck_views;
create policy deck_views_auth_read
  on public.deck_views for select
  to authenticated
  using (true);

-- ---------- Storage: bucket deck-assets (loghi e screenshot) ----------
insert into storage.buckets (id, name, public)
  values ('deck-assets', 'deck-assets', true)
  on conflict (id) do update set public = true;

-- lettura pubblica degli asset
drop policy if exists deck_assets_public_read on storage.objects;
create policy deck_assets_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'deck-assets');

-- scrittura/aggiornamento/cancellazione: solo autenticati
drop policy if exists deck_assets_auth_write on storage.objects;
create policy deck_assets_auth_write
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'deck-assets');

drop policy if exists deck_assets_auth_update on storage.objects;
create policy deck_assets_auth_update
  on storage.objects for update
  to authenticated
  using (bucket_id = 'deck-assets') with check (bucket_id = 'deck-assets');

drop policy if exists deck_assets_auth_delete on storage.objects;
create policy deck_assets_auth_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'deck-assets');

-- ---------- Vista comoda: conteggio aperture per slug ----------
create or replace view public.deck_link_stats as
  select l.slug,
         l.company_name,
         l.role,
         l.market,
         l.volume_branch,
         l.feedback_branch,
         l.pack,
         l.twin_slug,
         l.created_at,
         count(v.id) as opens,
         count(v.id) filter (where v.referrer ilike '%via=marketing%') as opens_via_marketing
  from public.deck_links l
  left join public.deck_views v on v.slug = l.slug
  group by l.slug;

-- Nota: gli utenti admin si creano a mano dalla dashboard Supabase
-- (Authentication → Users → Add user). Nessuna registrazione pubblica.
