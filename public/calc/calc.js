/* ============================================================
   Spicco — Calcolatore ROI (Step 6, formule DEFINITIVE)

   Portato dal deck/landing v6 (spiccolandingv6_11.html). Overlay/modal
   apribile dal bottone in slide 6 (window.__spiccoOpenCalc()).
   Pre-compilato dalla config (volume branch → candidature/anno) ma con tutti
   gli input modificabili dal prospect.

   Modello: danno di employer brand. Non piu' split B2C/B2B: un unico
   calcolatore con LTV per settore. Formule e coefficienti sono quelli
   ufficiali; le fonti sono citate nel UI.
   ============================================================ */
(function () {
  'use strict';

  // LTV suggerito per settore (fatturato annuo per cliente × 3)
  var SECTORS = { telco: 1800, banca: 1200, assicurazioni: 2100, utility: 2700, gdo: 3000, moda: 900, ecommerce: 750, automotive: 9000, ristorazione: 600 };

  // Coefficienti (con fonte) — richiesti dallo spec, usati nelle formule.
  var COEFFICIENTS = {
    pct_switch_default: { value: 6,    source: 'Virgin Media × Ph.Creative, LinkedIn Talent Connect 2016', source_label: '6% disdice dopo una cattiva esperienza (consigliato 5–8%)' },
    neg_low:            { value: 0.55, source: 'CareerArc/QuestionPro', source_label: 'quota candidati con esperienza negativa (min 55%)' },
    neg_high:           { value: 0.60, source: 'CareerArc/QuestionPro', source_label: 'quota candidati con esperienza negativa (max 60%)' },
    share_private:      { value: 0.69, source: 'LinkedIn Business', source_label: '69% ne parla nella propria rete personale' },
    reach_private:      { value: 9,    source: 'TARP/White House Office of Consumer Affairs (per analogia)', source_label: 'reach medio del passaparola diretto: 9 persone' },
    impact_mult_low:    { value: 1.8,  source: 'stima Spicco', source_label: 'moltiplicatore impatto totale (min)' },
    impact_mult_high:   { value: 2.5,  source: 'stima Spicco', source_label: 'moltiplicatore impatto totale (max)' }
  };
  var MULT_LOW = COEFFICIENTS.impact_mult_low.value, MULT_HIGH = COEFFICIENTS.impact_mult_high.value;
  var NEG_LOW = COEFFICIENTS.neg_low.value, NEG_HIGH = COEFFICIENTS.neg_high.value;
  var SHARE_PRIV = COEFFICIENTS.share_private.value, REACH_PRIV = COEFFICIENTS.reach_private.value;

  var eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  var num = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 });

  var roiState = { applications: 30000, pctClients: 18, pctSwitch: 6, sector: 'banca', ltv: 1200 };
  var built = false;

  function setText(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }

  // ---- Formule ufficiali ----
  function renderRoi() {
    var s = roiState, app = +s.applications || 0, pc = +s.pctClients || 0, ps = +s.pctSwitch || 0, ltv = +s.ltv || 0;
    var clientsLost = app * (pc / 100) * (ps / 100), directDamage = clientsLost * ltv;
    var impactLow = directDamage * MULT_LOW, impactHigh = directDamage * MULT_HIGH;
    var espostoLow = app * NEG_LOW * SHARE_PRIV * REACH_PRIV, espostoHigh = app * NEG_HIGH * SHARE_PRIV * REACH_PRIV;
    setText('out-pctswitchlabel', ps + '%');
    setText('out-clientslost', num.format(Math.round(clientsLost)));
    setText('out-directdamage', eur.format(Math.round(directDamage)));
    setText('out-esposte', num.format(Math.round(espostoLow)) + ' – ' + num.format(Math.round(espostoHigh)));
    setText('out-total', eur.format(Math.round(impactLow)) + ' – ' + eur.format(Math.round(impactHigh)));
  }

  // ---- input handlers ----
  window.onApplications = function (i) { roiState.applications = i.value === '' ? 0 : Math.max(0, parseInt(i.value, 10) || 0); renderRoi(); };
  window.onPctClients = function (i) { roiState.pctClients = i.value === '' ? 0 : Math.min(100, Math.max(0, parseFloat(i.value) || 0)); renderRoi(); };
  window.onPctSwitch = function (i) { roiState.pctSwitch = parseFloat(i.value) || 0; renderRoi(); };
  window.onSector = function (sel) { roiState.sector = sel.value; roiState.ltv = SECTORS[sel.value]; var l = document.getElementById('in-ltv'); if (l) l.value = roiState.ltv; renderRoi(); };
  window.onLtv = function (i) { roiState.ltv = i.value === '' ? 0 : Math.max(0, parseInt(i.value, 10) || 0); renderRoi(); };

  // hover/focus inline-style polyfill (come nell'originale)
  function parseStyle(str) { var o = {}; (str || '').split(';').forEach(function (d) { var i = d.indexOf(':'); if (i > -1) { var p = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if (p && v) o[p] = v; } }); return o; }
  function wire(root, attr, on, off) {
    root.querySelectorAll('[' + attr + ']').forEach(function (el) {
      var ex = parseStyle(el.getAttribute(attr)), orig = {};
      Object.keys(ex).forEach(function (p) { orig[p] = el.style[p] || ''; });
      on.forEach(function (ev) { el.addEventListener(ev, function () { Object.keys(ex).forEach(function (p) { el.style[p] = ex[p]; }); }); });
      off.forEach(function (ev) { el.addEventListener(ev, function () { Object.keys(ex).forEach(function (p) { el.style[p] = orig[p]; }); }); });
    });
  }

  function modalHtml() {
    return '' +
    '<div data-calc-backdrop style="position:fixed;inset:0;z-index:120;display:flex;align-items:flex-start;justify-content:center;padding:32px 20px;background:rgba(20,16,12,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);overflow:auto">' +
      '<div data-calc-dialog style="width:100%;max-width:720px;background:#FFFFFF;border-radius:22px;box-shadow:0 40px 100px rgba(18,40,44,.28);overflow:hidden;position:relative">' +
        '<div style="padding:30px 34px 24px;border-bottom:1px solid #DBDDD5;position:relative">' +
          '<div style="display:flex;align-items:center;gap:10px;color:#C96442;font:600 13px/1 \'Hanken Grotesk\';letter-spacing:.16em;text-transform:uppercase;margin-bottom:14px">' +
            '<span style="width:14px;height:14px;display:inline-block"><svg viewBox="0 0 100 100" style="width:100%;height:100%;display:block"><g stroke="currentColor" stroke-width="13" stroke-linecap="round"><line x1="50" y1="11" x2="50" y2="89"></line><line x1="16.5" y1="30.5" x2="83.5" y2="69.5"></line><line x1="16.5" y1="69.5" x2="83.5" y2="30.5"></line></g></svg></span>' +
            '<span>Calcolatore ROI</span></div>' +
          '<h3 style="margin:0 0 8px;font:800 clamp(24px,3.4vw,34px)/1.1 \'Hanken Grotesk\';letter-spacing:-.02em;color:#123338;max-width:520px">Quanto fatturato stai mettendo a rischio?</h3>' +
          '<p style="margin:0;font:400 16px/1.45 \'Hanken Grotesk\';color:rgba(18,51,56,.68);max-width:520px">Valori suggeriti per settore. Modifica tutto sui tuoi numeri.</p>' +
          '<button data-calc-close aria-label="Chiudi" style="position:absolute;top:22px;right:22px;width:44px;height:44px;border-radius:50%;border:1px solid #DBDDD5;background:#FBF7F1;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(18,51,56,.68)" data-hover-style="background:#E3E5DD">' +
            '<svg viewBox="0 0 24 24" style="width:18px;height:18px" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"></path></svg></button>' +
        '</div>' +
        '<div style="padding:26px 34px 4px;display:flex;flex-direction:column;gap:22px">' +
          '<div><label style="display:block;font:600 15px/1.3 \'Hanken Grotesk\';color:#123338;margin-bottom:8px">Candidature ricevute all\'anno</label>' +
            '<input type="number" min="0" id="in-applications" value="30000" oninput="onApplications(this)" style="width:100%;background:#FFFFFF;border:1px solid #DBDDD5;border-radius:10px;padding:13px 15px;font:600 17px/1 \'Hanken Grotesk\';color:#123338;outline:none" data-focus-style="border-color:#C96442;box-shadow:0 0 0 3px rgba(201,100,66,.18)"></div>' +
          '<div><label style="display:block;font:600 15px/1.3 \'Hanken Grotesk\';color:#123338;margin-bottom:8px">Quanti dei tuoi candidati sono anche clienti?</label>' +
            '<div style="display:flex;align-items:center;gap:10px"><input type="number" min="0" max="100" id="in-pctclients" value="18" oninput="onPctClients(this)" style="flex:1;background:#FFFFFF;border:1px solid #DBDDD5;border-radius:10px;padding:13px 15px;font:600 17px/1 \'Hanken Grotesk\';color:#123338;outline:none" data-focus-style="border-color:#C96442;box-shadow:0 0 0 3px rgba(201,100,66,.18)"><span style="font:600 17px/1 \'Hanken Grotesk\';color:rgba(18,51,56,.55)">%</span></div>' +
            '<div style="margin-top:7px;font:400 13.5px/1.4 \'Hanken Grotesk\';color:rgba(18,51,56,.55)">Non lo sai con precisione? Usa la tua quota di mercato: è la stima più conservativa.</div></div>' +
          '<div><div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px"><label style="font:600 15px/1.3 \'Hanken Grotesk\';color:#123338">Di questi, quanti ne perdi dopo una cattiva esperienza?</label>' +
            '<span style="font:700 17px/1 \'Hanken Grotesk\';color:#C96442"><span id="out-pctswitchlabel">6%</span></span></div>' +
            '<input type="range" min="0" max="20" step="1" id="in-pctswitch" value="6" oninput="onPctSwitch(this)" style="width:100%;accent-color:#C96442;cursor:pointer">' +
            '<div style="margin-top:7px;font:400 13.5px/1.4 \'Hanken Grotesk\';color:rgba(18,51,56,.55)">Virgin Media ha misurato il 6%. Consigliato: 5–8%.</div></div>' +
          '<div><label style="display:block;font:600 15px/1.3 \'Hanken Grotesk\';color:#123338;margin-bottom:8px">Il tuo settore</label>' +
            '<div style="position:relative"><select id="in-sector" onchange="onSector(this)" style="width:100%;appearance:none;-webkit-appearance:none;background:#FFFFFF;border:1px solid #DBDDD5;border-radius:10px;padding:13px 40px 13px 15px;font:600 16px/1.2 \'Hanken Grotesk\';color:#123338;outline:none;cursor:pointer" data-focus-style="border-color:#C96442;box-shadow:0 0 0 3px rgba(201,100,66,.18)">' +
              '<option value="telco">Telco/Mobile · €1.800</option>' +
              '<option value="banca" selected>Banca/Finanza · €1.200</option>' +
              '<option value="assicurazioni">Assicurazioni · €2.100</option>' +
              '<option value="utility">Utility/Energia · €2.700</option>' +
              '<option value="gdo">GDO/Retail alimentare · €3.000</option>' +
              '<option value="moda">Moda/Abbigliamento · €900</option>' +
              '<option value="ecommerce">E-commerce · €750</option>' +
              '<option value="automotive">Automotive · €9.000</option>' +
              '<option value="ristorazione">Ristorazione/QSR · €600</option></select>' +
              '<span style="position:absolute;right:14px;top:50%;transform:translateY(-50%);pointer-events:none;color:rgba(18,51,56,.55)"><svg viewBox="0 0 24 24" style="width:18px;height:18px" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></span></div></div>' +
          '<div><label style="display:block;font:600 15px/1.3 \'Hanken Grotesk\';color:#123338;margin-bottom:8px">LTV (€)</label>' +
            '<input type="number" min="0" id="in-ltv" value="1200" oninput="onLtv(this)" style="width:100%;background:#FFFFFF;border:1px solid #DBDDD5;border-radius:10px;padding:13px 15px;font:600 17px/1 \'Hanken Grotesk\';color:#123338;outline:none" data-focus-style="border-color:#C96442;box-shadow:0 0 0 3px rgba(201,100,66,.18)">' +
            '<div style="margin-top:7px;font:400 13.5px/1.4 \'Hanken Grotesk\';color:rgba(18,51,56,.55)">Calcoliamo l\'LTV come fatturato annuo per cliente × 3. Modificalo coi tuoi numeri.</div></div>' +
        '</div>' +
        '<div style="padding:24px 34px 34px;display:flex;flex-direction:column;gap:18px">' +
          '<div style="background:#FBF7F1;border:1px solid #DBDDD5;border-radius:14px;padding:20px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap">' +
            '<div><div style="font:600 12px/1 \'Hanken Grotesk\';letter-spacing:.12em;text-transform:uppercase;color:#C96442;margin-bottom:6px">Danno diretto / anno</div>' +
            '<div style="font:400 13.5px/1.35 \'Hanken Grotesk\';color:rgba(18,51,56,.55)">≈ <span id="out-clientslost">324</span> clienti attuali persi</div></div>' +
            '<div style="font:800 clamp(28px,4vw,38px)/1 \'Hanken Grotesk\';letter-spacing:-.02em;color:#C96442"><span id="out-directdamage">€0</span></div></div>' +
          '<div style="background:#FBF7F1;border:1px solid #DBDDD5;border-radius:14px;padding:20px 22px;display:flex;flex-direction:column;gap:8px">' +
            '<div style="font:600 12px/1 \'Hanken Grotesk\';letter-spacing:.12em;text-transform:uppercase;color:#C96442">Persone esposte / anno</div>' +
            '<div style="font:800 clamp(28px,4vw,38px)/1 \'Hanken Grotesk\';letter-spacing:-.02em;color:#C96442"><span id="out-esposte">0</span></div>' +
            '<div style="font:400 13.5px/1.4 \'Hanken Grotesk\';color:rgba(18,51,56,.7)">persone potenzialmente raggiunte da un giudizio negativo sul vostro employer brand, tramite passaparola diretto</div></div>' +
          '<div style="margin-top:-8px;font:400 12px/1.5 \'Hanken Grotesk\';color:rgba(18,51,56,.55)">Stima basata su: quota di candidati che vive un\'esperienza negativa (55-60%, fonte CareerArc/QuestionPro), quota che ne parla nella propria rete personale (69%, fonte LinkedIn Business), reach medio del passaparola diretto (9 persone, fonte TARP/White House Office of Consumer Affairs, studio customer experience applicato per analogia). Il calcolo esclude la condivisione pubblica online (social, review site), che amplierebbe ulteriormente l\'esposizione reale — è quindi una stima conservativa per difetto.</div>' +
          '<div style="background:#C96442;border-radius:16px;padding:24px 26px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;box-shadow:0 16px 40px rgba(201,100,66,.28)">' +
            '<div style="font:700 16px/1.3 \'Hanken Grotesk\';color:#FFFFFF;max-width:260px">Impatto potenziale totale / anno</div>' +
            '<div style="font:800 clamp(32px,5vw,50px)/1 \'Hanken Grotesk\';letter-spacing:-.03em;color:#FFFFFF"><span id="out-total">€0</span></div></div>' +
          '<div style="margin-top:-8px;font:400 13.5px/1.4 \'Hanken Grotesk\';color:rgba(18,51,56,.55)">Il diretto conta solo i clienti attuali persi. Il range include clienti potenziali scoraggiati dal passaparola negativo.</div>' +
          '<div style="background:#EEF0EA;border-radius:14px;padding:18px 22px;font:400 14.5px/1.5 \'Hanken Grotesk\';color:rgba(18,51,56,.68)"><span style="color:#123338;font-weight:600">E questo senza contare l\'anima 1:</span> far droppare i candidati migliori prima di assumerli ha un costo a parte - una mis-hire vale fino al <span style="color:#123338;font-weight:600">30% dello stipendio annuo</span> del ruolo.</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function build() {
    var modal = document.createElement('div');
    modal.id = 'spicco-roi-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:100000;font-family:\'Hanken Grotesk\',-apple-system,sans-serif';
    modal.style.display = 'none';
    modal.innerHTML = modalHtml();
    document.body.appendChild(modal);
    modal.querySelector('[data-calc-backdrop]').addEventListener('click', function (e) { if (e.target === e.currentTarget) close(); });
    modal.querySelector('[data-calc-close]').addEventListener('click', close);
    wire(modal, 'data-hover-style', ['mouseenter'], ['mouseleave']);
    wire(modal, 'data-focus-style', ['focus'], ['blur']);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    built = true;
    return modal;
  }

  function prefill() {
    var cfg = window.__spiccoConfig || {};
    // volume branch -> candidature/anno (pochi = scenario ridotto)
    if (cfg.volume === 'pochi') { roiState.applications = 3000; }
    else if (cfg.volume === 'tanti') { roiState.applications = 30000; }
    var inApp = document.getElementById('in-applications');
    if (inApp) inApp.value = roiState.applications;
  }

  function open() {
    var modal = built ? document.getElementById('spicco-roi-modal') : build();
    prefill();
    renderRoi();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  function close() {
    var modal = document.getElementById('spicco-roi-modal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  window.__spiccoOpenCalc = open;
  window.__spiccoCloseCalc = close;
  window.openCalc = open;      // compat con l'onclick originale
  window.closeCalc = close;
  window.SPICCO_COEFFICIENTS = COEFFICIENTS;
})();
