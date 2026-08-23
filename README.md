# Sito Spicco

Sito vetrina di Spicco: Home `/`, Trust Center `/trust`, Parliamone `/parliamone` (più `/privacy` placeholder). Solo italiano, registro voi.

Stack: React + Vite + TypeScript + Tailwind CSS v4, React Router, Supabase (form).

## Sviluppo

```bash
npm install
npm run dev      # sviluppo locale
npm run build    # build di produzione in dist/
npm run preview  # anteprima della build
```

## Configurazione del form (/parliamone)

Il form usa un doppio binario: salvataggio nella tabella `leads` di Supabase (fonte di verità) e notifica email a domenico@spicco.ai via edge function con Resend. Se l'email fallisce ma il DB salva, l'utente vede comunque la conferma. Senza configurazione il form mostra l'errore generale con l'invito a scrivere a domenico@spicco.ai.

1. Creare un progetto Supabase e applicare la migrazione:
   ```bash
   supabase link --project-ref <PROJECT_REF>
   supabase db push
   ```
   (oppure eseguire `supabase/migrations/20260823000000_create_leads.sql` nel SQL editor).
2. Deploy della edge function di notifica:
   ```bash
   supabase secrets set RESEND_API_KEY=<chiave Resend>
   supabase functions deploy notify-lead
   ```
   Il mittente `notifiche@spicco.ai` va verificato sul dominio in Resend.
3. Variabili d'ambiente del frontend (vedi `.env.example`):
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

Anti-spam: campo honeypot nascosto lato client (i bot che lo compilano vedono la conferma senza invio) e rate limit basilare per IP sulla edge function.

## Asset

- `public/media/loop.webm` / `loop.mp4`: loop muto dell'hero, nel browser frame.
- `public/media/poster.jpg`: poster del loop (primo frame), dimensioni esplicite per l'LCP.
- `public/media/video-completo.mp4`: video before/after della Sezione 2 (compresso, sorgente 1080p).
- `public/og.png`: immagine OG 1200x630 (poster + claim).
- `public/favicon.svg`: asterisco del logo.

## Note di build

- Design system in `src/index.css`: colori come CSS custom properties (`--bg`, `--accent`, `--accent-strong`, `--ink`, `--surface`), font Hanken Grotesk + Newsreader Italic (solo per la svolta retorica nei titoli, classe `em-turn`).
- La Sezione 6 della Home (bivio verticale) è nel codice ma nascosta dal flag `SHOW_VERTICALS` in `src/pages/Home.tsx`: attivarla solo quando le pagine verticali esistono.
- Scroll reveal e transizioni rispettano `prefers-reduced-motion`.
- Analytics: Plausible con evento `lead_submit` sul submit riuscito del form (nessun cookie banner necessario). Aggiornare `data-domain` in `index.html` se il dominio non è `spicco.ai`.
- Il deploy deve servire `index.html` per ogni rotta (SPA fallback).
