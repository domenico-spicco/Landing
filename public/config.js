/* ============================================================
   Spicco Deck — configurazione ambiente (Supabase)

   Compila questi valori con quelli del TUO progetto Supabase dedicato
   (NON il Supabase di produzione Spicco). Li trovi in:
   Supabase Dashboard → Project Settings → API.

   Finché i valori restano i placeholder "YOUR-...", il deck funziona
   comunque in modalità default/demo (config di fallback + override via
   query string), senza chiamare Supabase.
   ============================================================ */
window.SPICCO_CONFIG = {
  SUPABASE_URL: 'https://YOUR-PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR-ANON-KEY',
  // Base pubblica dei link generati dal pannello (senza slash finale)
  DECK_BASE_URL: 'https://spicco.ai/deck'
};

window.SPICCO_CONFIG.isConfigured = function () {
  var c = window.SPICCO_CONFIG;
  return !!c.SUPABASE_URL && c.SUPABASE_URL.indexOf('YOUR-PROJECT') === -1 &&
         !!c.SUPABASE_ANON_KEY && c.SUPABASE_ANON_KEY.indexOf('YOUR-') === -1;
};

// Crea (una volta) il client Supabase se la libreria UMD è caricata e i valori
// sono compilati. Ritorna null altrimenti.
window.SPICCO_CONFIG.client = function () {
  var c = window.SPICCO_CONFIG;
  if (!c.isConfigured()) return null;
  if (!window.supabase || !window.supabase.createClient) return null;
  if (!c._client) c._client = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  return c._client;
};
