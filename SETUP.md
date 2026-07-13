# SETUP — Spicco Deck Dinamico

Guida per mettere online il deck dinamico. Richiede **un progetto Supabase
dedicato** (NON il Supabase di produzione Spicco) e un progetto Vercel nuovo.

## 0. Struttura

```
/public
  /deck/index.html      il deck (evoluzione del file fornito)
  /deck/deck-config.js  legge lo slug, carica la config, applyConfig()
  /deck/assets/         font + runtime DC estratti
  /admin/index.html     pannello generazione link (login)
  /admin/admin.js
  /calc/calc.js         calcolatore ROI (modal aperto dal deck)
  /config.js            SUPABASE_URL / ANON_KEY (da compilare)
  /vercel.json          rewrite /deck/{slug}
/supabase/schema.sql    schema + RLS + storage (da eseguire su Supabase)
```

Finché `config.js` non è compilato, il deck funziona in **modalità demo**:
config di default + override via query string (utile per i test), e il pannello
mostra un banner "Supabase non configurato".

## 1. Supabase (Step 3-4)

1. Crea un **nuovo progetto** Supabase dedicato a questo deck.
2. SQL Editor → incolla ed esegui tutto `supabase/schema.sql`. Crea:
   - tabelle `deck_links` e `deck_views`
   - policy RLS (lettura pubblica dei link per slug, insert pubblico delle view,
     tutto il resto solo autenticati)
   - bucket Storage `deck-assets` (lettura pubblica, scrittura autenticata)
   - vista `deck_link_stats` (conteggio aperture + aperture `via=marketing`)
3. **Utenti admin**: Authentication → Users → *Add user* (email + password).
   Nessuna registrazione pubblica: gli account si creano solo qui a mano.
4. Project Settings → API: copia **Project URL** e **anon public key**.
5. Incollali in `public/config.js`:
   ```js
   window.SPICCO_CONFIG = {
     SUPABASE_URL: 'https://xxxxx.supabase.co',
     SUPABASE_ANON_KEY: 'ey....',
     DECK_BASE_URL: 'https://spicco.ai/deck'
   };
   ```
   (`DECK_BASE_URL` è la base dei link mostrati dal pannello.)

> Nota Lovable: se importi questo codice in un progetto Lovable collegato a
> Supabase, esegui comunque `schema.sql` sul progetto Supabase che vuoi usare e
> compila `config.js` con URL + anon key di quel progetto.

## 2. Vercel (deploy)

1. Nuovo progetto Vercel che punta a questo repo.
2. **Root Directory: `public`** (Settings → General → Root Directory). Così il
   sito servito ha `index.html` in `/deck/`, `/admin/`, ecc., e `vercel.json`
   viene letto correttamente.
3. Nessun build command (sito statico). Deploy.
4. Il rewrite in `public/vercel.json` fa sì che `spicco.ai/deck/{slug}` serva
   `/deck/index.html`; il JS legge lo slug dal path e carica la config.
   I file reali (deck-config.js, assets, admin) vengono serviti direttamente
   (i rewrite si applicano solo se non esiste un file corrispondente).
5. Dominio: punta `spicco.ai` (o un sottodominio di staging) al progetto.

## 3. Come funziona il flusso

- Il pannello `/admin` (login) genera un record in `deck_links` con uno slug
  `{azienda}-{4char}` (es. `conad-x7k2`) e restituisce il link
  `spicco.ai/deck/conad-x7k2`.
- All'apertura, il deck legge lo slug, fa `select` su `deck_links`, applica le
  varianti (volume/role/market/pack) e i campi (company_name, logo, screenshot,
  pilot_spots), e registra una riga in `deck_views`.
- **Link gemello (marketing)**: creando un link con ruolo *marketing*, il
  pannello crea in automatico un secondo record identico con ruolo *ta* e slug
  proprio, e salva lo slug del gemello in `twin_slug`. Nel deck (slide 16,
  variante marketing) il bottone "Copia il link per il team HR" copia
  `spicco.ai/deck/{twin_slug}?via=marketing`. Il parametro `via` finisce in
  `deck_views.referrer` ed è evidenziato nel pannello.
- **Config live**: modificando un record dal pannello, il link già inviato
  riflette subito le modifiche (nessun nuovo link).

## 4. Fallback

Se lo slug non esiste o il fetch fallisce, il deck parte in configurazione
default: volume=tanti, role=ta, market=b2c, pack=aurello,
company_name="il vostro brand", nessun logo, screenshot generici attuali.

## 5. Test in locale

```bash
cd public && python3 -m http.server 8099
# demo/override via query string (nessun Supabase necessario):
# http://localhost:8099/deck/index.html?volume=pochi&role=marketing&market=b2b&pack=adriatec&company_name=Conad
```

## 6. Calcolatore ROI — formule preliminari

Il calcolatore (`public/calc/calc.js`) ha struttura, input/output e coefficienti
con fonti già pronti, ma le **formule sono placeholder** marcati
`// FORMULA-DRAFT`. Vanno sostituite con quelle definitive quando arrivano.
I coefficienti sono in `COEFFICIENTS` (esposto anche come
`window.SPICCO_COEFFICIENTS`).

## 7. Punti aperti

Vedi `NOTE-DISCREPANZE.md` per due punti dove lo spec assume un deck diverso da
quello reale (screenshot slide 7, anteprima slide 9) e le scelte fatte.
