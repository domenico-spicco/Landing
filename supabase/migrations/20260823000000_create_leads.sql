-- Tabella leads: fonte di verità per le richieste dal form /parliamone.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  azienda_ruolo text not null,
  assunzioni_anno text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Il form pubblico può solo inserire, mai leggere o modificare.
create policy "anon_insert_leads"
  on public.leads
  for insert
  to anon
  with check (true);
