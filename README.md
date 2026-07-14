# Spicco — Deck Dinamico

Trasformazione del sales deck Spicco (16 slide) in un deck dinamico: un pannello
interno genera link personalizzati per prospect (`spicco.ai/deck/{slug}`), il deck
all'apertura carica una configurazione da Supabase e mostra le varianti di contenuto
corrispondenti.

Stack: HTML/JS/CSS vanilla (deck, pannello, calcolatore) + Supabase (Postgres +
Storage + Auth). Deploy previsto su Vercel come progetto separato.

## Struttura

```
/public
  /deck/index.html         il deck (evoluzione del file HTML standalone fornito)
  /deck/assets/            font (woff2) e runtime JS estratti dal bundle originale
  /genera/index.html       generatore pubblico: form -> scarica il deck autonomo
  /genera/deck-standalone.html  template bundle offline (rigenerato da script)
  /admin/index.html        pannello link online (opzionale, Supabase + login)
  /calc/                   calcolatore ROI (Step 6)
/scripts/build-standalone.cjs  rigenera il template standalone del generatore
```

Due modi d'uso (vedi `SETUP.md`): **A)** generatore pubblico `/genera` che
scarica un file HTML autonomo del deck (nessun account); **B)** link online
personalizzati via `/admin` + Supabase (opzionale).

## Il deck: da bundle a file editabile

Il file fornito (`Spicco_-_Sales_Deck_v2__standalone__2_.html`) era un "bundle"
auto-scompattante: il markup reale viveva in uno `<script type="__bundler/template">`
con placeholder UUID, e gli asset (20 font woff2 + runtime DC + React) in un manifest
base64/gzip che il bundler sostituiva a runtime.

`public/deck/index.html` è la ricostruzione: gli asset sono stati estratti in
`assets/` e referenziati con path relativi, `window.__resources` è iniettato con gli
stessi id. Il rendering è identico all'originale, ma il file è ora leggibile e
modificabile. La logica JS del deck (`<script type="text/x-dc">`, il runtime DC, la
finalizzazione `beforeprint`/`_finalizeAll`) non è stata toccata.

## Vincoli rispettati

- La logica JS del deck non si modifica (animazioni, timer, stampa/PDF).
- La struttura delle 16 `<section data-label>` non si riordina/rinomina.
- Nessuna nuova dipendenza oltre al client Supabase JS via CDN.

## Verifica in locale

```
cd public && python3 -m http.server 8099
# apri http://localhost:8099/deck/index.html
```
Il deck va servito via HTTP (non `file://`): il runtime DC carica il proprio JS con
`fetch()`, bloccato da CORS sotto `file://`.

## Stato

Vedi `SETUP.md` per gli step che richiedono account esterni (Supabase, Vercel).
