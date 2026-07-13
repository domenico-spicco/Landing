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
  // 1) default; 2) se c'e' uno slug e Supabase e' configurato, fetch da DB e
  // registrazione della view; 3) override via query string (utile in test).
  // Qualsiasi errore -> resta il default (fallback richiesto dallo spec).
  function slugFromLocation() {
    // Path atteso: /deck/{slug}. Con index.html o path vuoto -> nessuno slug.
    try {
      var parts = window.location.pathname.split('/').filter(Boolean);
      var i = parts.indexOf('deck');
      if (i >= 0 && parts[i + 1] && parts[i + 1].toLowerCase() !== 'index.html') return decodeURIComponent(parts[i + 1]);
    } catch (e) {}
    try {
      var q = new URLSearchParams(window.location.search);
      if (q.get('slug')) return q.get('slug');
    } catch (e) {}
    return null;
  }

  function mapRowToConfig(row) {
    return {
      slug: row.slug,
      company_name: row.company_name || DEFAULT_CONFIG.company_name,
      logo_url: row.logo_url || null,
      screenshot_1_url: row.screenshot_1_url || null,
      screenshot_2_url: row.screenshot_2_url || null,
      volume: row.volume_branch || DEFAULT_CONFIG.volume,
      role: row.role || DEFAULT_CONFIG.role,
      market: row.market || DEFAULT_CONFIG.market,
      pack: row.pack || DEFAULT_CONFIG.pack,
      pilot_spots: (row.pilot_spots == null ? DEFAULT_CONFIG.pilot_spots : row.pilot_spots),
      twin_slug: row.twin_slug || null
    };
  }

  function applyQueryOverrides(cfg) {
    try {
      var q = new URLSearchParams(window.location.search);
      IF_KEYS.forEach(function (k) { if (q.has(k)) cfg[k] = q.get(k); });
      ['company_name', 'logo_url', 'screenshot_1_url', 'screenshot_2_url', 'twin_slug'].forEach(function (k) {
        if (q.has(k)) cfg[k] = q.get(k);
      });
      if (q.has('pilot_spots')) cfg.pilot_spots = parseInt(q.get('pilot_spots'), 10);
    } catch (e) {}
    return cfg;
  }

  function recordView(client, slug) {
    try {
      var via = null;
      try { via = new URLSearchParams(window.location.search).get('via'); } catch (e) {}
      client.from('deck_views').insert({
        slug: slug,
        referrer: via || document.referrer || null,
        user_agent: navigator.userAgent || null
      }).then(function () {}, function () {}); // best-effort, non blocca
    } catch (e) {}
  }

  function resolveConfig() {
    var cfg = {};
    for (var k in DEFAULT_CONFIG) cfg[k] = DEFAULT_CONFIG[k];

    var slug = slugFromLocation();
    var client = (window.SPICCO_CONFIG && window.SPICCO_CONFIG.client) ? window.SPICCO_CONFIG.client() : null;

    if (slug && client) {
      return client.from('deck_links').select('*').eq('slug', slug).maybeSingle()
        .then(function (res) {
          if (res && res.data) {
            cfg = mapRowToConfig(res.data);
            recordView(client, slug);
          }
          return applyQueryOverrides(cfg);
        })
        .catch(function () { return applyQueryOverrides(cfg); });
    }
    // niente Supabase / niente slug: default + override query (demo/test)
    return Promise.resolve(applyQueryOverrides(cfg));
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
      case 'calc_button_label': {
        var named = cfg.company_name && cfg.company_name !== 'il vostro brand';
        var who = named ? ('a ' + cfg.company_name) : 'alla vostra azienda';
        return 'Quanto costa ' + who + '? → Apri il calcolatore';
      }
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
      case 'demo_href': {
        var name = cfg.company_name || 'il vostro brand';
        return 'mailto:domenico@spicco.ai?subject=' + encodeURIComponent('Demo Spicco per ' + name);
      }
      case 'twin_link':
        return 'https://spicco.ai/deck/' + (cfg.twin_slug || '') + '?via=marketing';
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
      if (elx.tagName === 'IMG') {
        if (v != null) { elx.setAttribute('src', v); elx.style.display = ''; }
        else if (elx.hasAttribute('data-hide-if-empty')) { elx.style.display = 'none'; }
        // altrimenti: nessun valore -> lascia il src attuale (fallback screenshot)
        return;
      }
      if (v == null) return; // niente valore -> lascia il contenuto attuale
      elx.textContent = v;
    });

    // 3) href/attr con template ({company_name}, {twin_slug}, ...)
    Array.prototype.slice.call(root.querySelectorAll('[data-tpl-href]')).forEach(function (elx) {
      elx.setAttribute('href', tpl(elx.getAttribute('data-tpl-href'), cfg));
    });
    Array.prototype.slice.call(root.querySelectorAll('[data-tpl-text]')).forEach(function (elx) {
      elx.textContent = tpl(elx.getAttribute('data-tpl-text'), cfg);
    });
    // href/copy calcolati da un field (con encoding corretto)
    Array.prototype.slice.call(root.querySelectorAll('[data-href-field]')).forEach(function (elx) {
      var v = fieldValue(elx.getAttribute('data-href-field'), cfg, elx);
      if (v != null) elx.setAttribute('href', v);
    });
    Array.prototype.slice.call(root.querySelectorAll('[data-copy-field]')).forEach(function (elx) {
      var v = fieldValue(elx.getAttribute('data-copy-field'), cfg, elx);
      if (v != null) elx.setAttribute('data-copy', v);
    });
    // speaker-notes per pack (presenter view)
    Array.prototype.slice.call(root.querySelectorAll('[data-notes-adriatec]')).forEach(function (elx) {
      if (cfg.pack === 'adriatec') elx.setAttribute('data-speaker-notes', elx.getAttribute('data-notes-adriatec'));
    });
  }

  // copia negli appunti (bottone "Copia il link per il team HR")
  window.__spiccoCopy = function (btn) {
    var text = btn.getAttribute('data-copy') || '';
    var done = function () {
      var old = btn.getAttribute('data-label-original') || btn.textContent;
      if (!btn.getAttribute('data-label-original')) btn.setAttribute('data-label-original', old);
      btn.textContent = 'Link copiato ✓';
      setTimeout(function () { btn.textContent = btn.getAttribute('data-label-original'); }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copia il link:', text); });
    } else {
      window.prompt('Copia il link:', text);
    }
  };

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
