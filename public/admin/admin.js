/* ============================================================
   Spicco — Pannello admin (Step 4 + 5)
   Login Supabase Auth, generazione link (+ gemello se marketing),
   upload asset, tabella link con conteggio aperture, modifica live.
   ============================================================ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var SC = window.SPICCO_CONFIG;
  var client = null;
  var editingSlug = null; // se valorizzato, il form è in modalità modifica

  function baseUrl() { return (SC && SC.DECK_BASE_URL) ? SC.DECK_BASE_URL.replace(/\/$/, '') : '/deck'; }
  function deckUrl(slug) { return baseUrl() + '/' + slug; }
  function show(el, on) { el.classList[on ? 'remove' : 'add']('hidden'); }
  function msg(el, text, kind) { el.innerHTML = text ? '<div class="msg ' + (kind || 'ok') + '">' + text + '</div>' : ''; }

  function slugify(s) {
    return (s || 'azienda').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'azienda';
  }
  function rand4() {
    var c = 'abcdefghijkmnpqrstuvwxyz23456789', s = '';
    var a = new Uint8Array(4); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach(function (_, i) { a[i] = Math.floor(Math.random() * 256); });
    for (var i = 0; i < 4; i++) s += c[a[i] % c.length];
    return s;
  }
  function newSlug(company) { return slugify(company) + '-' + rand4(); }

  // ---------- init ----------
  function init() {
    if (!SC || !SC.isConfigured()) { show($('configBanner'), true); return; }
    client = SC.client();
    if (!client) { show($('configBanner'), true); return; }
    client.auth.getSession().then(function (res) {
      if (res.data && res.data.session) enterApp(res.data.session);
      else showLogin();
    });
    client.auth.onAuthStateChange(function (_e, session) {
      if (session) enterApp(session); else showLogin();
    });
  }

  function showLogin() {
    show($('appView'), false); show($('loginView'), true);
    $('sessionBox').innerHTML = '';
  }
  function enterApp(session) {
    show($('loginView'), false); show($('appView'), true);
    $('sessionBox').innerHTML = '<span class="muted" style="font-size:13px">' + (session.user.email || '') +
      '</span> <button class="btn-ghost btn-sm" id="logoutBtn">Esci</button>';
    $('logoutBtn').onclick = function () { client.auth.signOut(); };
    loadTable();
  }

  // ---------- login ----------
  $('loginBtn').onclick = function () {
    msg($('loginMsg'), '', 'ok');
    client.auth.signInWithPassword({ email: $('loginEmail').value.trim(), password: $('loginPassword').value })
      .then(function (res) { if (res.error) msg($('loginMsg'), res.error.message, 'err'); });
  };

  // ---------- upload ----------
  function uploadAsset(file, prefix) {
    if (!file) return Promise.resolve(null);
    var ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    var path = prefix + '/' + Date.now() + '-' + rand4() + '.' + ext;
    return client.storage.from('deck-assets').upload(path, file, { upsert: true }).then(function (res) {
      if (res.error) throw res.error;
      return client.storage.from('deck-assets').getPublicUrl(path).data.publicUrl;
    });
  }

  // ---------- form helpers ----------
  function radioVal(name) { var el = document.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : null; }
  function setRadio(name, val) { var el = document.querySelector('input[name="' + name + '"][value="' + val + '"]'); if (el) el.checked = true; }
  function readForm() {
    return {
      company_name: $('f_company').value.trim(),
      volume_branch: radioVal('volume'),
      role: radioVal('role'),
      market: radioVal('market'),
      pack: $('f_pack').value,
      feedback_branch: radioVal('feedback') || 'no',
      pilot_spots: parseInt($('f_pilot').value, 10),
      note: $('f_note').value.trim() || null
    };
  }
  function resetForm() {
    editingSlug = null;
    $('f_company').value = ''; $('f_pilot').value = '2'; $('f_note').value = '';
    $('f_logo').value = ''; $('f_shot1').value = ''; $('f_shot2').value = '';
    setRadio('volume', 'tanti'); setRadio('role', 'ta'); setRadio('market', 'b2c'); $('f_pack').value = 'aurello'; setRadio('feedback', 'no');
    $('formTitle').textContent = 'Genera un nuovo link';
    $('genBtn').textContent = 'Genera link';
    show($('cancelEditBtn'), false);
    show($('genLinks'), false);
  }
  $('cancelEditBtn').onclick = resetForm;

  // ---------- insert with slug-collision retry ----------
  function insertLink(record, tries) {
    tries = tries || 0;
    return client.from('deck_links').insert(record).select().single().then(function (res) {
      if (res.error) {
        if (res.error.code === '23505' && tries < 5) { // duplicate primary key -> new slug
          record.slug = newSlug(record.company_name); return insertLink(record, tries + 1);
        }
        throw res.error;
      }
      return res.data;
    });
  }

  // ---------- generate / update ----------
  $('genBtn').onclick = function () {
    var form = readForm();
    if (!form.company_name) { msg($('formMsg'), 'Inserisci il nome azienda.', 'err'); return; }
    if (isNaN(form.pilot_spots)) form.pilot_spots = 2;
    msg($('formMsg'), 'Carico gli asset…', 'ok');
    $('genBtn').disabled = true;

    Promise.all([
      uploadAsset($('f_logo').files[0], 'logo'),
      uploadAsset($('f_shot1').files[0], 'shots'),
      uploadAsset($('f_shot2').files[0], 'shots')
    ]).then(function (urls) {
      var assets = {};
      if (urls[0]) assets.logo_url = urls[0];
      if (urls[1]) assets.screenshot_1_url = urls[1];
      if (urls[2]) assets.screenshot_2_url = urls[2];

      if (editingSlug) return doUpdate(form, assets);
      return doCreate(form, assets);
    }).then(function () {
      msg($('formMsg'), '', 'ok'); $('genBtn').disabled = false; loadTable();
    }).catch(function (e) {
      msg($('formMsg'), 'Errore: ' + (e.message || e), 'err'); $('genBtn').disabled = false;
    });
  };

  function doUpdate(form, assets) {
    var patch = Object.assign({}, form, assets);
    return client.from('deck_links').update(patch).eq('slug', editingSlug).then(function (res) {
      if (res.error) throw res.error;
      showGenerated([{ slug: editingSlug, role: form.role }], 'Link aggiornato (le modifiche sono già live).');
      resetForm();
    });
  }

  function doCreate(form, assets) {
    if (form.role === 'marketing') {
      // Step 4: crea prima il gemello TA, poi il record marketing con twin_slug.
      var twin = Object.assign({ slug: newSlug(form.company_name), role: 'ta', twin_slug: null }, form, assets);
      return insertLink(twin).then(function (twinRow) {
        var mkt = Object.assign({ slug: newSlug(form.company_name), role: 'marketing', twin_slug: twinRow.slug }, form, assets);
        return insertLink(mkt).then(function (mktRow) {
          showGenerated([
            { slug: mktRow.slug, role: 'marketing', label: 'Link marketing (da inviare al referente marketing)' },
            { slug: twinRow.slug, role: 'ta', label: 'Link gemello TA/HR (generato in automatico)' }
          ], 'Creati 2 link: marketing + gemello TA.');
          resetForm();
        });
      });
    }
    var rec = Object.assign({ slug: newSlug(form.company_name), twin_slug: null }, form, assets);
    return insertLink(rec).then(function (row) {
      showGenerated([{ slug: row.slug, role: form.role }], 'Link creato.');
      resetForm();
    });
  }

  function showGenerated(links, note) {
    var box = $('genLinks');
    var html = '<div style="font-weight:700;margin-bottom:8px">' + (note || '') + '</div>';
    links.forEach(function (l) {
      var url = deckUrl(l.slug);
      html += '<div class="link-row">' + (l.label ? '<div style="flex-basis:100%;font-size:13px;font-weight:600" class="muted">' + l.label + '</div>' : '') +
        '<code>' + url + '</code>' +
        '<button class="btn-ghost btn-sm" data-copy="' + url + '">Copia</button></div>';
    });
    box.innerHTML = html;
    show(box, true);
    Array.prototype.forEach.call(box.querySelectorAll('[data-copy]'), function (b) {
      b.onclick = function () { copy(b.getAttribute('data-copy'), b); };
    });
  }

  function copy(text, btn) {
    var done = function () { var o = btn.textContent; btn.textContent = 'Copiato ✓'; setTimeout(function () { btn.textContent = o; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copia:', text); });
    else window.prompt('Copia:', text);
  }

  // ---------- table ----------
  function loadTable() {
    Promise.all([
      client.from('deck_links').select('*').order('created_at', { ascending: false }),
      client.from('deck_link_stats').select('*')
    ]).then(function (r) {
      if (r[0].error) throw r[0].error;
      var links = r[0].data || [];
      var stats = {}; (r[1].data || []).forEach(function (s) { stats[s.slug] = s; });
      renderTable(links, stats);
    }).catch(function (e) {
      $('tableWrap').innerHTML = '<div class="msg err">Errore nel caricamento: ' + (e.message || e) + '</div>';
    });
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function renderTable(links, stats) {
    if (!links.length) { $('tableWrap').innerHTML = '<p class="muted">Nessun link ancora. Generane uno qui sopra.</p>'; return; }
    var rows = links.map(function (l) {
      var st = stats[l.slug] || { opens: 0, opens_via_marketing: 0 };
      var opens = st.opens || 0;
      var cfg = '<span class="pill">' + esc(l.volume_branch) + '</span><span class="pill">' + esc(l.role) +
        '</span><span class="pill">' + esc(l.market) + '</span><span class="pill">' + esc(l.pack) +
        '</span><span class="pill">feedback: ' + esc(l.feedback_branch || 'no') + '</span>';
      var twinCell = '';
      if (l.twin_slug) {
        var tw = stats[l.twin_slug] || { opens: 0 };
        twinCell = '<div class="twin">gemello TA: ' + (tw.opens || 0) + ' aperture</div>';
      }
      var date = l.created_at ? new Date(l.created_at).toLocaleDateString('it-IT') : '';
      return '<tr>' +
        '<td><code>' + esc(l.slug) + '</code><div style="margin-top:6px"><button class="btn-ghost btn-sm" data-copy="' + esc(deckUrl(l.slug)) + '">Copia link</button></div></td>' +
        '<td><b>' + esc(l.company_name) + '</b>' + (l.note ? '<div class="muted" style="font-size:12px;margin-top:3px">' + esc(l.note) + '</div>' : '') + '</td>' +
        '<td>' + cfg + '</td>' +
        '<td>' + esc(date) + '</td>' +
        '<td><span class="opens">' + opens + '</span>' + (st.opens_via_marketing ? '<div class="twin">via mkt: ' + st.opens_via_marketing + '</div>' : '') + twinCell + '</td>' +
        '<td><button class="btn-ghost btn-sm" data-edit="' + esc(l.slug) + '">Modifica</button></td>' +
        '</tr>';
    }).join('');
    $('tableWrap').innerHTML = '<table><thead><tr><th>Slug</th><th>Azienda</th><th>Config</th><th>Creato</th><th>Aperture</th><th></th></tr></thead><tbody>' + rows + '</tbody></table>';

    var wrap = $('tableWrap');
    Array.prototype.forEach.call(wrap.querySelectorAll('[data-copy]'), function (b) { b.onclick = function () { copy(b.getAttribute('data-copy'), b); }; });
    Array.prototype.forEach.call(wrap.querySelectorAll('[data-edit]'), function (b) {
      b.onclick = function () { startEdit(links.find(function (x) { return x.slug === b.getAttribute('data-edit'); })); };
    });
  }

  function startEdit(l) {
    if (!l) return;
    editingSlug = l.slug;
    $('f_company').value = l.company_name || '';
    $('f_pilot').value = (l.pilot_spots == null ? 2 : l.pilot_spots);
    $('f_note').value = l.note || '';
    setRadio('volume', l.volume_branch); setRadio('role', l.role); setRadio('market', l.market); $('f_pack').value = l.pack; setRadio('feedback', l.feedback_branch || 'no');
    $('f_logo').value = ''; $('f_shot1').value = ''; $('f_shot2').value = '';
    $('formTitle').textContent = 'Modifica link · ' + l.slug + ' (config live)';
    $('genBtn').textContent = 'Salva modifiche';
    show($('cancelEditBtn'), true);
    msg($('formMsg'), 'Modifica del link già inviato: gli asset restano quelli attuali se non ne carichi di nuovi. Il ruolo non genera un nuovo gemello.', 'ok');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  init();
})();
