/* ============================================================
   Applica la palette "nebbia-petrolio" al deck (tema chiaro).
   Ribalta il tema scuro->chiaro: sfondi nebbia, testo petrolio scuro,
   accento terracotta. Agisce su public/deck/index.html.
   Uso: node scripts/theme-nebbia.cjs
   ============================================================ */
const fs = require('fs');
const path = require('path');
const FILE = path.resolve(__dirname, '../public/deck/index.html');
let html = fs.readFileSync(FILE, 'utf8');

// non toccare lo script x-dc (logica JS)
const cut = html.indexOf('<script type="text/x-dc"');
let head = html.slice(0, cut);
const tail = html.slice(cut);

// ---- 1. testo bianco (var(--bg) come colore) -> testo petrolio scuro ----
head = head.split('color:var(--bg)').join('color:var(--text-main)');

// ---- 2. bianchi trasparenti (rgba 255,255,255,X) ----
// .16 = bordo card -> #DBDDD5 ; tutti gli altri -> petrolio scuro stessa alpha
head = head.replace(/rgba\(255,\s*255,\s*255,\s*\.16\)/g, '#DBDDD5');
head = head.replace(/rgba\(255,\s*255,\s*255,\s*(0|\.[0-9]+)\)/g, function (_m, a) { return 'rgba(18,51,56,' + a + ')'; });

// ---- 3. ombre nere -> ombre calde petrolio ----
head = head.replace(/rgba\(0,\s*0,\s*0,\s*(0|\.[0-9]+)\)/g, function (_m, a) { return 'rgba(18,40,44,' + a + ')'; });

// ---- 4. tinte accento arancio -> terracotta ----
head = head.replace(/rgba\(245,\s*146,\s*74,\s*(0|\.[0-9]+)\)/g, function (_m, a) { return 'rgba(201,100,66,' + a + ')'; });

// ---- 5. glow petrolio della cover -> soft spotlight chiaro ----
head = head.replace(/rgba\(38,\s*88,\s*96,\s*\.92\)/g, 'rgba(255,255,255,.85)')
           .replace(/rgba\(38,\s*88,\s*96,\s*\.7\)/g, 'rgba(255,255,255,.45)')
           .replace(/rgba\(38,\s*88,\s*96,\s*0\)/g, 'rgba(255,255,255,0)');

// ---- 6. valori :root (blocco dc-color-tokens) ----
function setVar(name, val) {
  const re = new RegExp('(' + name.replace(/[-]/g, '\\-') + ':\\s*)([^;]+)(;)');
  head = head.replace(re, '$1' + val + '$3');
}
setVar('--petrol-deep', '#EEF0EA');  // sfondo slide
setVar('--petrol', '#FFFFFF');       // card contenuto
setVar('--accent', '#C96442');       // terracotta
setVar('--accent-strong', '#C96442');
setVar('--c-b9afa3', '#9A9184');     // puntini mascotte
setVar('--c-a1968a', 'rgba(18,51,56,.55)'); // fonti/citazioni
// nuovo: testo principale petrolio scuro
head = head.replace('<style id="dc-color-tokens">\n:root{\n', '<style id="dc-color-tokens">\n:root{\n  --text-main: #123338;\n');

// ---- 7. correzioni post-tema ----
// i bottoni terracotta pieni tengono il testo bianco (non petrolio)
head = head.split('background:var(--accent-strong);color:var(--text-main)').join('background:var(--accent-strong);color:#FFFFFF');
// didascalie slide "Oggi" (--linen-50 era quasi-bianco) -> testo petrolio soft
head = head.replace(/--linen-50:\s*var\(--c-fcfbf8\)/, '--linen-50:   rgba(18,51,56,.6)');
// pannelli mockup chiari slide "Oggi": bordo + ombra per staccarli dal fondo nebbia
head = head.split('background:var(--c-edece8);border-radius:12px;overflow:hidden;height:360px;filter:grayscale(.4)')
           .join('background:var(--c-edece8);border:1px solid #DBDDD5;box-shadow:0 8px 24px rgba(18,40,44,.1);border-radius:12px;overflow:hidden;height:360px;filter:grayscale(.4)');
head = head.split('background:var(--c-e7e6e2);border-radius:12px;overflow:hidden;height:360px;display:flex;flex-direction:column;filter:grayscale(.45)')
           .join('background:var(--c-e7e6e2);border:1px solid #DBDDD5;box-shadow:0 8px 24px rgba(18,40,44,.1);border-radius:12px;overflow:hidden;height:360px;display:flex;flex-direction:column;filter:grayscale(.45)');

// ---- 8. letterali rgb() (senza alpha) sfuggiti alla tokenizzazione hex ----
head = head.replace(/color:\s*rgb\(255,\s*255,\s*255\)/g, 'color:#123338');   // testo bianco su slide chiara
head = head.replace(/color:\s*rgb\(245,\s*146,\s*74\)/g, 'color:rgb(201,100,66)'); // arancio -> terracotta

// ---- 9. testo su superfici che restano SCURE (card nere) -> chiaro ----
// pill/card con background:var(--c-1f1d1b): il testo (ex bianco) torna bianco
head = head.replace(/<[a-zA-Z][^>]*background:var\(--c-1f1d1b\)[^>]*>/g, function (tag) {
  return tag.split('color:var(--text-main)').join('color:#FFFFFF');
});
head = head.replace(/('Hanken Grotesk';color:)var\(--text-main\)(">Domenico)/g, '$1#FFFFFF$2');

// ---- 10. testo semaforo (--c-e7e2d8, chiaro) su card ora bianca -> scuro ----
head = head.replace(/color:var\(--c-e7e2d8\)/g, 'color:var(--text-main)');

fs.writeFileSync(FILE, head + tail);

// report
const leftWhite = (head.match(/rgba\(255,\s*255,\s*255/g) || []).length;
console.log('scritto', FILE);
console.log('rgba(255,255,255) rimasti (cover glow):', leftWhite);
console.log('--text-main aggiunto:', head.indexOf('--text-main: #123338;') > -1);
