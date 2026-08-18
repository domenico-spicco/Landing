/* ============================================================
   Spicco — Generatore pubblico (senza login)
   Compila la config dal form, la inietta nel template standalone
   (deck-standalone.html) e scarica il deck personalizzato autonomo.
   Nessun Supabase, nessun account.
   ============================================================ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var MARKER = 'window.SPICCO_FIXED_CONFIG = null;';
  var templateCache = null;

  function msg(text, kind) { $('msg').innerHTML = text ? '<div class="msg ' + (kind || 'ok') + '">' + text + '</div>' : ''; }
  function radioVal(name) { var el = document.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : null; }
  function slugify(s) {
    return (s || 'deck').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'deck';
  }
  function readFileAsDataURL(file) {
    return new Promise(function (resolve, reject) {
      if (!file) return resolve(null);
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function buildConfig() {
    return Promise.all([
      readFileAsDataURL($('f_logo').files[0]),
      readFileAsDataURL(($('f_shot1') || {}).files ? $('f_shot1').files[0] : null),
      readFileAsDataURL(($('f_shot2') || {}).files ? $('f_shot2').files[0] : null)
    ]).then(function (res) {
      var pilot = parseInt($('f_pilot').value, 10); if (isNaN(pilot)) pilot = 2;
      var cfg = {
        company_name: $('f_company').value.trim() || 'il vostro brand',
        volume: radioVal('volume'),
        role: radioVal('role'),
        market: radioVal('market'),
        pack: $('f_pack').value,
        feedback: radioVal('feedback') || 'no',
        processo_lungo: radioVal('processo_lungo') || 'si',
        lang: radioVal('lang') || 'it',
        pilot_spots: pilot,
        logo_url: res[0] || null,
        screenshot_1_url: res[1] || null,
        screenshot_2_url: res[2] || null
      };
      return cfg;
    });
  }

  function getTemplate() {
    if (templateCache) return Promise.resolve(templateCache);
    return fetch('deck-standalone.html', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('template non trovato (' + r.status + ')');
      return r.text();
    }).then(function (t) {
      if (t.indexOf(MARKER) === -1) throw new Error('slot config non trovato nel template');
      templateCache = t; return t;
    });
  }

  function personalize(template, cfg, autoprint) {
    var inject = 'window.SPICCO_FIXED_CONFIG = ' + JSON.stringify(cfg) + ';';
    if (autoprint) inject += ' window.SPICCO_AUTOPRINT = true;';
    // funzione di replace: evita l'interpretazione di $ nella stringa config
    return template.replace(MARKER, function () { return inject; });
  }

  function withDeck(action, autoprint) {
    msg('Preparo il deck…', 'ok');
    Promise.all([buildConfig(), getTemplate()]).then(function (r) {
      var html = personalize(r[1], r[0], autoprint);
      action(html, r[0]);
      if (!autoprint) msg('', 'ok');
    }).catch(function (e) { msg('Errore: ' + (e.message || e), 'err'); });
  }

  $('downloadBtn').onclick = function () {
    var fmt = radioVal('format') || 'html';
    if (fmt === 'pdf') {
      // PDF: apre il deck in una scheda; il deck fa partire la stampa del
      // browser (una slide per pagina) e l'utente sceglie "Salva come PDF".
      withDeck(function (html) {
        var blob = new Blob([html], { type: 'text/html' });
        var url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(function () { URL.revokeObjectURL(url); }, 120000);
        msg('Si apre il deck e parte la finestra di stampa: scegli "Salva come PDF" e tieni l\'orientamento orizzontale.', 'ok');
      }, true);
      return;
    }
    withDeck(function (html, cfg) {
      var blob = new Blob([html], { type: 'text/html' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'deck-' + slugify(cfg.company_name) + '.html';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    }, false);
  };

  $('previewBtn').onclick = function () {
    withDeck(function (html) {
      var blob = new Blob([html], { type: 'text/html' });
      var url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    });
  };
})();
