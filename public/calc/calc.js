/* ============================================================
   Spicco — Calcolatore ROI (Step 6)

   Overlay/modal apribile dal bottone in slide 6 (window.__spiccoOpenCalc()).
   Pre-compilato dalla config (volume branch e market) ma con input modificabili
   dal prospect.

   - Versione B2C: modulo conversione funnel + modulo brand/clienti persi.
   - Versione B2B: modulo conversione funnel + cost-to-hire (NIENTE clienti persi).
   - Ogni coefficiente vive in COEFFICIENTS con {value, source, source_label}
     e la fonte e' mostrata accanto al risultato.

   ATTENZIONE: le formule definitive NON sono in questa spec. Qui la STRUTTURA
   e input/output sono pronti; ogni calcolo e' marcato // FORMULA-DRAFT ed e' un
   placeholder da sostituire quando arriveranno le formule ufficiali.
   ============================================================ */
(function () {
  'use strict';

  // ---- Coefficienti (con fonte mostrata nel UI) ----
  var COEFFICIENTS = {
    non_completion:        { value: 0.92,  source: 'SHRM/Appcast', source_label: '92% di chi avvia non completa' },
    conversion_multiplier: { value: 3.5,   source: 'Appcast',      source_label: 'moltiplicatore conversione 3,5x' },
    apply_rate_from:       { value: 0.036, source: 'Appcast',      source_label: 'apply rate di partenza 3,6%' },
    apply_rate_to:         { value: 0.125, source: 'Appcast',      source_label: 'apply rate ottimizzato 12,5%' },
    // Solo B2C
    client_share:          { value: 0.18,  source: 'Virgin Media × Ph.Creative, LinkedIn Talent Connect 2016', source_label: '18% dei candidati è già cliente' },
    churn_after_rejection: { value: 0.06,  source: 'Virgin Media × Ph.Creative, LinkedIn Talent Connect 2016', source_label: '6% disdice dopo un rifiuto' }
  };

  var eur = function (n) {
    if (!isFinite(n)) return '—';
    return '€ ' + Math.round(n).toLocaleString('it-IT');
  };
  var intfmt = function (n) { return isFinite(n) ? Math.round(n).toLocaleString('it-IT') : '—'; };
  var num = function (id) { var el = document.getElementById(id); return el ? (parseFloat(el.value) || 0) : 0; };

  // ---- FORMULE (DRAFT — placeholder, da sostituire) ----
  function computeFunnel(cfg) {
    var applications = num('calc-applications');
    var costPerHire = num('calc-cost-hire');
    // FORMULA-DRAFT: candidati persi = candidature avviate × % non completamento
    var lostCandidates = applications * COEFFICIENTS.non_completion.value;
    // FORMULA-DRAFT: spesa sprecata = candidati persi × (costo di acquisizione stimato)
    //               (qui uso una frazione del cost-to-hire come proxy — placeholder)
    var wasted = lostCandidates * (costPerHire * 0.15);
    // FORMULA-DRAFT: recuperabile portando l'apply rate da 3,6% a 12,5%
    var recoverable = wasted * (1 - COEFFICIENTS.apply_rate_from.value / COEFFICIENTS.apply_rate_to.value);
    return { lostCandidates: lostCandidates, wasted: wasted, recoverable: recoverable };
  }

  function computeCostToHire(cfg) {
    var positions = num('calc-positions');
    var costPerHire = num('calc-cost-hire');
    // FORMULA-DRAFT: cost-to-hire annuo aggredibile
    var annual = positions * costPerHire;
    // FORMULA-DRAFT: quota risparmiabile riducendo re-sourcing e time-to-fill
    var saving = annual * 0.20;
    return { annual: annual, saving: saving };
  }

  function computeClientsLost(cfg) {
    var applications = num('calc-applications');
    var clientValue = num('calc-client-value');
    // FORMULA-DRAFT: clienti persi = candidature × % già clienti × % churn dopo rifiuto
    var clientsLost = applications * COEFFICIENTS.client_share.value * COEFFICIENTS.churn_after_rejection.value;
    // FORMULA-DRAFT: fatturato perso = clienti persi × valore cliente
    var revenueLost = clientsLost * clientValue;
    return { clientsLost: clientsLost, revenueLost: revenueLost };
  }

  // ---- UI ----
  var built = false;
  function fieldRow(label, id, value, suffix) {
    return '<label style="display:flex;flex-direction:column;gap:6px;font:600 14px/1.2 \'Hanken Grotesk\';color:var(--ink)">' + label +
      '<span style="display:flex;align-items:center;gap:8px"><input id="' + id + '" type="number" value="' + value +
      '" style="flex:1;min-width:0;font:500 18px/1 \'Hanken Grotesk\';padding:11px 12px;border:1px solid var(--c-d6d5d0);border-radius:9px;background:var(--bg);color:var(--ink)">' +
      (suffix ? '<span style="font:500 14px/1 \'Hanken Grotesk\';color:var(--c-8a857c)">' + suffix + '</span>' : '') + '</span></label>';
  }
  function resultRow(label, valueId, sourceLabel) {
    return '<div style="display:flex;flex-direction:column;gap:3px;padding:14px 0;border-top:1px solid var(--c-efeae0)">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px">' +
      '<span style="font:500 16px/1.3 \'Hanken Grotesk\';color:var(--ink)">' + label + '</span>' +
      '<span id="' + valueId + '" style="font:800 24px/1 \'Hanken Grotesk\';color:var(--accent-strong)">—</span></div>' +
      '<span style="font-family:\'Newsreader\';font-style:italic;font-size:13px;color:var(--c-8a857c)">Fonte: ' + sourceLabel + '</span></div>';
  }

  function moduleCard(title, bodyHtml) {
    return '<div style="background:var(--bg-warm);border:1px solid var(--c-efeae0);border-radius:16px;padding:22px 22px 8px">' +
      '<div style="font:700 15px/1 \'Hanken Grotesk\';letter-spacing:.1em;text-transform:uppercase;color:var(--petrol);margin-bottom:16px">' + title + '</div>' +
      bodyHtml + '</div>';
  }

  function build() {
    var overlay = document.createElement('div');
    overlay.id = 'spicco-calc-overlay';
    overlay.setAttribute('style', 'position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:rgba(26,20,17,.55);padding:24px;box-sizing:border-box;font-family:\'Hanken Grotesk\',-apple-system,sans-serif');
    overlay.innerHTML =
      '<div role="dialog" aria-modal="true" style="background:var(--bg);color:var(--ink);width:min(920px,100%);max-height:92vh;overflow:auto;border-radius:20px;box-shadow:0 40px 100px rgba(0,0,0,.4)">' +
        '<div style="position:sticky;top:0;background:var(--petrol-deep);color:var(--bg);padding:22px 26px;display:flex;align-items:center;justify-content:space-between;gap:16px">' +
          '<div><div style="font:800 24px/1.1 \'Hanken Grotesk\'" id="calc-title">Quanto vi costa il funnel</div>' +
          '<div style="margin-top:4px;font:400 14px/1.3 \'Hanken Grotesk\';color:rgba(255,255,255,.7)">Numeri modificabili. Le fonti sono accanto a ogni risultato.</div></div>' +
          '<button type="button" id="calc-close" aria-label="Chiudi" style="flex:none;width:40px;height:40px;border-radius:50%;border:none;cursor:pointer;background:rgba(255,255,255,.14);color:var(--bg);font-size:22px;line-height:1">×</button>' +
        '</div>' +
        '<div style="padding:26px;display:grid;grid-template-columns:1fr 1fr;gap:22px" id="calc-body"></div>' +
        '<div style="padding:0 26px 22px;font:400 12px/1.4 \'Hanken Grotesk\';color:var(--c-8a857c)">Stime indicative a scopo illustrativo. Formule in versione preliminare (FORMULA-DRAFT), coefficienti da fonti pubbliche citate.</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    overlay.querySelector('#calc-close').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    built = true;
    return overlay;
  }

  function renderBody(cfg) {
    var market = (cfg && cfg.market) || 'b2c';
    var volume = (cfg && cfg.volume) || 'tanti';
    // default applicazioni in base al volume branch (prefill, modificabile)
    var defApplications = volume === 'pochi' ? 1200 : 20000;

    var funnel = moduleCard('Conversione funnel',
      fieldRow('Candidature avviate / anno', 'calc-applications', defApplications, '') +
      fieldRow('Cost-to-hire medio', 'calc-cost-hire', 4500, '€') +
      '<div style="margin-top:10px">' +
      resultRow('Candidati persi / anno', 'calc-out-lost', COEFFICIENTS.non_completion.source) +
      resultRow('Budget di attraction sprecato', 'calc-out-wasted', COEFFICIENTS.non_completion.source) +
      resultRow('Recuperabile con Spicco', 'calc-out-recover', COEFFICIENTS.conversion_multiplier.source) +
      '</div>');

    var second;
    if (market === 'b2b') {
      second = moduleCard('Cost-to-hire',
        fieldRow('Posizioni aperte / anno', 'calc-positions', 40, '') +
        '<div style="margin-top:10px">' +
        resultRow('Cost-to-hire annuo', 'calc-out-cth-annual', 'stima interna') +
        resultRow('Risparmio potenziale', 'calc-out-cth-saving', COEFFICIENTS.conversion_multiplier.source) +
        '</div>');
    } else {
      second = moduleCard('Brand · clienti persi',
        fieldRow('Valore medio cliente (LTV)', 'calc-client-value', 800, '€') +
        '<div style="margin-top:10px">' +
        resultRow('Clienti persi / anno', 'calc-out-clients', COEFFICIENTS.client_share.source) +
        resultRow('Fatturato perso / anno', 'calc-out-revenue', COEFFICIENTS.churn_after_rejection.source) +
        '</div>');
    }

    var body = document.getElementById('calc-body');
    body.innerHTML = funnel + second;
    // titolo con company_name
    var named = cfg && cfg.company_name && cfg.company_name !== 'il vostro brand';
    document.getElementById('calc-title').textContent = named ? ('Quanto costa a ' + cfg.company_name) : 'Quanto costa alla vostra azienda';

    // listeners
    Array.prototype.forEach.call(body.querySelectorAll('input'), function (inp) {
      inp.addEventListener('input', function () { recompute(cfg); });
    });
    recompute(cfg);
  }

  function recompute(cfg) {
    var market = (cfg && cfg.market) || 'b2c';
    var f = computeFunnel(cfg);
    var set = function (id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; };
    set('calc-out-lost', intfmt(f.lostCandidates));
    set('calc-out-wasted', eur(f.wasted));
    set('calc-out-recover', eur(f.recoverable));
    if (market === 'b2b') {
      var c = computeCostToHire(cfg);
      set('calc-out-cth-annual', eur(c.annual));
      set('calc-out-cth-saving', eur(c.saving));
    } else {
      var cl = computeClientsLost(cfg);
      set('calc-out-clients', intfmt(cl.clientsLost));
      set('calc-out-revenue', eur(cl.revenueLost));
    }
  }

  function open() {
    var cfg = window.__spiccoConfig || { market: 'b2c', volume: 'tanti', company_name: 'il vostro brand' };
    var overlay = built ? document.getElementById('spicco-calc-overlay') : build();
    renderBody(cfg);
    overlay.style.display = 'flex';
  }
  function close() {
    var overlay = document.getElementById('spicco-calc-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  window.__spiccoOpenCalc = open;
  window.__spiccoCloseCalc = close;
  window.SPICCO_COEFFICIENTS = COEFFICIENTS; // esposto per test/aggiornamenti
})();
