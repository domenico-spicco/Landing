/* ============================================================
   Crea public/genera/genera-standalone.html: UN SOLO file autonomo che
   contiene il form del generatore + il template del deck (in base64).
   Si apre con doppio click (anche offline): compili i dati e scarichi il
   deck personalizzato. Nessun server, nessuna cartella.
   Uso: node scripts/build-generator-standalone.cjs
   (richiede public/genera/deck-standalone.html già costruito)
   ============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const G = path.join(ROOT, 'public/genera');

var indexHtml = fs.readFileSync(path.join(G, 'index.html'), 'utf8');
var generatorJs = fs.readFileSync(path.join(G, 'generator.js'), 'utf8');
var tplB64 = fs.readFileSync(path.join(G, 'deck-standalone.html')).toString('base64');

// getTemplate() legge il template incorporato (base64) invece di fetch()
var embeddedGetTemplate =
  "  function getTemplate() {\n" +
  "    var el = document.getElementById('spicco-embedded-template');\n" +
  "    var b64 = (el.textContent || '').replace(/\\s+/g, '');\n" +
  "    var bin = atob(b64);\n" +
  "    var bytes = Uint8Array.from(bin, function (c) { return c.charCodeAt(0); });\n" +
  "    var t = new TextDecoder('utf-8').decode(bytes);\n" +
  "    if (t.indexOf(MARKER) === -1) return Promise.reject(new Error('slot config non trovato'));\n" +
  "    return Promise.resolve(t);\n" +
  "  }\n";

// sostituisci la funzione getTemplate() originale (fetch) con quella embedded
var patchedJs = generatorJs.replace(/  function getTemplate\(\)[\s\S]*?\n  \}\n/, embeddedGetTemplate);
if (patchedJs === generatorJs) { console.error('getTemplate() non trovata/sostituita'); process.exit(1); }

// blocco template (base64) + generator inline, al posto di <script src="generator.js">
var inject =
  '<script type="text/plain" id="spicco-embedded-template">' + tplB64 + '</script>\n' +
  '<script>' + patchedJs + '</script>';
var out = indexHtml.replace(/<script src="generator\.js"><\/script>/, inject);
if (out === indexHtml) { console.error('tag <script src="generator.js"> non trovato'); process.exit(1); }
// titolo/nota: chiarisci che è il file unico
out = out.replace('<title>Spicco · Genera il tuo deck</title>', '<title>Spicco · Genera il deck (file unico)</title>');

var OUT = path.join(G, 'genera-standalone.html');
fs.writeFileSync(OUT, out);
console.log('scritto', OUT, (fs.statSync(OUT).size / 1024 / 1024).toFixed(2) + ' MB');
