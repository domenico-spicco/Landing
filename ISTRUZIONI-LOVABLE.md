# Istruzioni per Lovable — Sito Spicco

Questo progetto è un sito COMPLETO e già funzionante: React + Vite + TypeScript + Tailwind CSS v4 + React Router. Non va ricostruito, va importato e collegato a Supabase.

## Regole non negoziabili

1. NON riscrivere, riformulare o "migliorare" il copy: ogni testo visibile è definitivo e approvato.
2. NON cambiare il design system: colori solo tramite le CSS custom properties in `src/index.css` (`--bg`, `--accent`, `--accent-strong`, `--ink`, `--surface`), font Hanken Grotesk + Newsreader Italic (l'italic solo dove già presente, tramite la classe `em-turn`).
3. NON aggiungere sezioni, testimonial, numeri, loghi clienti, gradienti, carousel, emoji o mockup di laptop.
4. NON usare mai em dash (—) nei testi visibili, e mai le parole: chatbot, screening, demo (come CTA), AI o intelligenza artificiale (ammesse solo nel Trust Center dov'è già presente), punteggio/scoring/ranking riferiti a Spicco (ammessi solo nelle negazioni già scritte).
5. La Sezione 6 della Home (bivio verticale) resta nascosta: il flag `SHOW_VERTICALS` in `src/pages/Home.tsx` resta `false` finché le pagine verticali non esistono.
6. "AXS" compare una sola volta sul sito: la micro-label del diagramma nella Sezione 5. Non aggiungerla altrove.
7. I video in `public/media/` vanno serviti così come sono (loop hero: autoplay muto in loop nel browser frame; video completo: play su click, mai autoplay).

## Cosa deve fare Lovable

1. Importare il progetto senza modificare struttura, pagine o componenti. Rotte: `/`, `/trust`, `/parliamone`, `/privacy` (SPA fallback su index.html).
2. Collegare l'integrazione nativa Supabase.
3. Applicare la migrazione `supabase/migrations/20260823000000_create_leads.sql` (crea la tabella `public.leads` con RLS: gli anonimi possono solo inserire, mai leggere).
4. Deployare la edge function `supabase/functions/notify-lead/index.ts` e impostare il secret `RESEND_API_KEY` (Resend, mittente `notifiche@spicco.ai` verificato sul dominio spicco.ai). La funzione invia la notifica a domenico@spicco.ai.
5. Configurare le variabili d'ambiente del frontend usate da `src/lib/supabase.ts`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   Se l'integrazione Lovable genera un proprio client Supabase, adattare SOLO `src/lib/supabase.ts` per usarlo: il resto del codice del form non va toccato.
6. Verificare il flusso del form `/parliamone` (doppio binario):
   - submit riuscito → riga inserita in `leads` (fonte di verità) → tentativo di notifica email → schermata di conferma;
   - se l'email fallisce ma il DB salva → mostrare comunque la conferma;
   - se il DB fallisce → errore generale con invito a scrivere a domenico@spicco.ai;
   - honeypot: il campo nascosto "sito-web", se compilato, mostra la conferma senza salvare nulla.
7. Analytics: lo script Plausible è già in `index.html` con evento `lead_submit` sul submit riuscito. Se il dominio di pubblicazione non è `spicco.ai`, aggiornare l'attributo `data-domain`. Nessun cookie banner.
8. Pubblicare e collegare il dominio.

## Checklist di verifica finale

- [ ] Le tre pagine si aprono e il copy è identico ai sorgenti
- [ ] Loop hero: parte da solo, muto, in loop, anche su iOS Safari
- [ ] Video Sezione 2: parte solo al click
- [ ] Form: inserimento in `leads` + email di notifica ricevuta
- [ ] Stati del form: errori inline, errore generale, conferma
- [ ] Responsive a 375 / 768 / 1024 / 1440px
- [ ] Anteprima social (OG image `public/og.png`) corretta su LinkedIn
