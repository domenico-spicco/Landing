/* ============================================================
   Costruisce public/genera/deck-standalone.html: un file "bundle" autonomo
   (font + runtime inclusi, funziona anche via file://) che il generatore
   pubblico usa come template. La config viene iniettata dal generatore
   sostituendo `window.SPICCO_FIXED_CONFIG = null;`.

   Riusa il wrapper/bundler e gli asset del file ORIGINALE (provati come
   standalone) e ne sostituisce solo il template con il deck personalizzabile.
   Uso: node scripts/build-standalone.cjs <originalBundle.html>
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ORIG = process.argv[2];
if (!ORIG) { console.error('Passa il path del bundle originale'); process.exit(1); }
const ROOT = path.resolve(__dirname, '..');
const DECK = path.join(ROOT, 'public/deck/index.html');

const orig = fs.readFileSync(ORIG, 'utf8');
let deck = fs.readFileSync(DECK, 'utf8');
const deckConfigJs = fs.readFileSync(path.join(ROOT, 'public/deck/deck-config.js'), 'utf8');
const calcJs = fs.readFileSync(path.join(ROOT, 'public/calc/calc.js'), 'utf8');

// ---- 1. Trasforma il deck editabile in "template" del bundle ----
// rimuovi lo script window.__resources (lo reinietta il bundler con i blob)
deck = deck.replace(/<script>window\.__resources = [\s\S]*?<\/script>\s*/, '');
// rimuovi supabase CDN e config.js (non servono nel file offline a config fissa)
deck = deck.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2"><\/script>\s*/, '');
deck = deck.replace(/<script src="\.\.\/config\.js"><\/script>\s*/, '');
// inlinea calc.js e deck-config.js
function inlineScript(js) { return '<script>' + js.replace(/<\/script/gi, '<\\/script') + '</script>'; }
deck = deck.replace(/<script src="\.\.\/calc\/calc\.js"><\/script>/, inlineScript(calcJs));
deck = deck.replace(/<script src="deck-config\.js"><\/script>/, inlineScript(deckConfigJs));
// riporta i riferimenti agli asset da "assets/{uuid}.{ext}" al solo {uuid}
deck = deck.replace(/assets\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.(?:woff2|js)/g, '$1');

// ---- 2. Codifica il template come nel bundle originale ----
// JSON string, con </script> neutralizzato per non chiudere il tag esterno
let templateJson = JSON.stringify(deck).replace(/<\/script/gi, '<\\u002Fscript').replace(/<\/style/gi, '<\\u002Fstyle');

// ---- 3. Sostituisci il blocco template nell'originale ----
const tmplRe = /(<script type="__bundler\/template">)([\s\S]*?)(<\/script>)/;
if (!tmplRe.test(orig)) { console.error('Blocco template non trovato nel bundle originale'); process.exit(1); }
let out = orig.replace(tmplRe, function (_m, a, _b, c) { return a + templateJson + c; });

// ---- 4. Inietta lo slot della config fissa subito dopo <body> ----
out = out.replace(/<body>/i, '<body>\n<script>window.SPICCO_FIXED_CONFIG = null;</script>');

// ---- 4-bis. Messaggio "serve JavaScript" chiaro e in italiano ----------
// Il file autonomo si ricostruisce nel browser: aperto in un contesto senza JS
// (anteprime di chat / mail / gestori file su mobile) mostrava un piccolo testo
// inglese poco comprensibile. Lo sostituiamo con una schermata intera chiara.
var NOSCRIPT_IT = [
  '<noscript>',
  '<style>#__bundler_loading{display:none}#__bundler_thumbnail{display:none}</style>',
  '<div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#1E4A50;color:#fff;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;padding:28px;text-align:center;z-index:100000">',
  '<div style="max-width:440px">',
  '<div style="font-size:44px;color:#F5924A;line-height:1;margin-bottom:16px">&#10035;</div>',
  '<div style="font-size:20px;font-weight:700;margin-bottom:10px">Apri il deck in un browser</div>',
  '<div style="font-size:15px;line-height:1.55;color:#B7D2D5">Questo file si apre con Safari o Chrome, sul telefono o sul computer. Le anteprime di chat, mail o gestori file non lo mostrano perche&#769; ha bisogno di JavaScript per ricostruirsi. Per una resa migliore, aprilo in orizzontale o da desktop.</div>',
  '</div>',
  '</div>',
  '</noscript>'
].join('');
if (/<noscript>[\s\S]*?<\/noscript>/.test(out)) {
  out = out.replace(/<noscript>[\s\S]*?<\/noscript>/, function () { return NOSCRIPT_IT; });
} else {
  console.warn('ATTENZIONE: blocco <noscript> non trovato, messaggio IT non iniettato');
}

// ---- 5. Scrivi ----
const OUT = path.join(ROOT, 'public/genera/deck-standalone.html');
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log('scritto', OUT, (fs.statSync(OUT).size / 1024 / 1024).toFixed(2) + ' MB');
console.log('slot config fissa presente:', out.indexOf('window.SPICCO_FIXED_CONFIG = null;') > -1);
