/* ============================================================
   Spicco Deck — config loader (Step 2/3)

   Personalizza il deck all'apertura in base a una config (da Supabase in
   Step 3, per ora default + override via query string per i test).

   Meccanismo: il runtime DC costruisce lo stage da <x-dc> al boot
   (window.__dcBoot, auto-chiamato su DOMContentLoaded dopo il caricamento di
   React). Qui STACCHIAMO <x-dc> dal DOM prima che il boot lo trovi, applichiamo
   la config al sottoalbero staccato (rimuovendo i nodi non pertinenti PRIMA che
   parta la logica animazioni, cosi' non restano timer/contatori orfani),
   riattacchiamo e chiamiamo __dcBoot() a mano.

   La logica JS del deck non viene toccata.
   ============================================================ */
(function () {
  'use strict';

  var DEFAULT_CONFIG = {
    slug: null,
    company_name: 'il vostro brand',
    logo_url: null,
    screenshot_1_url: null,
    screenshot_2_url: null,
    volume: 'tanti',   // 'pochi' | 'tanti'
    role: 'ta',        // 'ta' | 'marketing'
    market: 'b2c',     // 'b2b' | 'b2c'
    pack: 'aurello',   // 'aurello' | 'adriatec'
    pilot_spots: 2,
    twin_slug: null
  };

  var IF_KEYS = ['volume', 'role', 'market', 'pack'];

  // ---- config resolution -------------------------------------------------
  // Step 3 sostituira' resolveConfig con la fetch da Supabase basata sullo slug.
  // Per ora: default + override via query string (?volume=pochi&role=marketing...).
  function resolveConfig() {
    var cfg = {};
    for (var k in DEFAULT_CONFIG) cfg[k] = DEFAULT_CONFIG[k];
    try {
      var q = new URLSearchParams(window.location.search);
      IF_KEYS.forEach(function (k) { if (q.has(k)) cfg[k] = q.get(k); });
      ['company_name', 'logo_url', 'screenshot_1_url', 'screenshot_2_url', 'twin_slug'].forEach(function (k) {
        if (q.has(k)) cfg[k] = q.get(k);
      });
      if (q.has('pilot_spots')) cfg.pilot_spots = parseInt(q.get('pilot_spots'), 10);
    } catch (e) { /* ignore */ }
    return Promise.resolve(cfg);
  }

  // ---- field values ------------------------------------------------------
  function pilotSpotsText(n) {
    if (n === 2) return 'Due sono ancora disponibili';
    if (n === 1) return 'Uno è ancora disponibile';
    if (n === 0) return 'Sono tutti assegnati: parliamone comunque';
    return 'Due sono ancora disponibili';
  }

  function fieldValue(field, cfg, el) {
    switch (field) {
      case 'company_name':
        return cfg.company_name || (el && el.getAttribute('data-fallback')) || 'il vostro brand';
      case 'pilot_spots':
        return String(cfg.pilot_spots);
      case 'pilot_spots_text':
        return pilotSpotsText(cfg.pilot_spots);
      case 'logo':
        return cfg.logo_url || null;
      case 'screenshot_1':
        return cfg.screenshot_1_url || null; // null -> lascia src attuale (fallback)
      case 'screenshot_2':
        return cfg.screenshot_2_url || null;
      case 'twin_slug':
        return cfg.twin_slug || null;
      default:
        return cfg[field] != null ? String(cfg[field]) : null;
    }
  }

  function tpl(str, cfg) {
    return String(str).replace(/\{(\w+)\}/g, function (m, key) {
      var v = fieldValue(key, cfg);
      return v == null ? '' : v;
    });
  }

  // ---- apply config ------------------------------------------------------
  function applyConfig(root, cfg) {
    // 1) rimuovi i nodi con data-if-* che non corrispondono
    IF_KEYS.forEach(function (key) {
      var attr = 'data-if-' + key;
      var want = String(cfg[key]);
      Array.prototype.slice.call(root.querySelectorAll('[' + attr + ']')).forEach(function (elx) {
        if (elx.getAttribute(attr) !== want) {
          if (elx.parentNode) elx.parentNode.removeChild(elx);
        }
      });
    });

    // 2) placeholder testuali / immagini
    Array.prototype.slice.call(root.querySelectorAll('[data-field]')).forEach(function (elx) {
      var f = elx.getAttribute('data-field');
      var v = fieldValue(f, cfg, elx);
      if (v == null) return; // niente valore -> lascia il contenuto/attuale (fallback)
      if (elx.tagName === 'IMG') { elx.setAttribute('src', v); }
      else { elx.textContent = v; }
    });

    // 3) href/attr con template ({company_name}, {twin_slug}, ...)
    Array.prototype.slice.call(root.querySelectorAll('[data-tpl-href]')).forEach(function (elx) {
      elx.setAttribute('href', tpl(elx.getAttribute('data-tpl-href'), cfg));
    });
    Array.prototype.slice.call(root.querySelectorAll('[data-tpl-text]')).forEach(function (elx) {
      elx.textContent = tpl(elx.getAttribute('data-tpl-text'), cfg);
    });
  }

  // ---- boot gating -------------------------------------------------------
  function bootWhenReady() {
    var tries = 0;
    (function wait() {
      if (typeof window.__dcBoot === 'function') { window.__dcBoot(); return; }
      if (tries++ < 400) setTimeout(wait, 25);
      else console.error('[spicco] __dcBoot mai disponibile');
    })();
  }

  function start() {
    var xdc = document.querySelector('x-dc');
    if (!xdc) { return; } // niente da fare
    var placeholder = document.createComment('x-dc-config-gate');
    xdc.parentNode.replaceChild(placeholder, xdc);

    var booted = false;
    function reattachAndBoot(cfg) {
      if (booted) return; booted = true;
      try { if (cfg) applyConfig(xdc, cfg); } catch (e) { console.error('[spicco] applyConfig error', e); }
      if (placeholder.parentNode) placeholder.parentNode.replaceChild(xdc, placeholder);
      window.__spiccoConfig = cfg || null;
      bootWhenReady();
    }

    // safety: se qualcosa va storto entro 6s, riattacca con default e bootta
    var safety = setTimeout(function () { reattachAndBoot(DEFAULT_CONFIG); }, 6000);

    resolveConfig().then(function (cfg) {
      clearTimeout(safety);
      reattachAndBoot(cfg);
    }).catch(function (e) {
      clearTimeout(safety);
      console.error('[spicco] resolveConfig error', e);
      reattachAndBoot(DEFAULT_CONFIG);
    });
  }

  if (document.readyState === 'loading') {
    // Esegui appena possibile: siamo gia' in fondo al body, x-dc e' parsato.
    start();
  } else {
    start();
  }
})();
