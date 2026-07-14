# Note e discrepanze spec ↔ deck reale

Durante l'implementazione degli Step 2 e 7 ho trovato alcuni punti in cui lo
spec assume un deck leggermente diverso da quello fornito. Lo spec dice di
fermarsi e chiedere in caso di ambiguità: elenco qui le scelte fatte, così puoi
confermarle o correggerle.

## 1. Slide 7 (Oggi) — screenshot e nome "Marta"  [RISOLTO]

> AGGIORNAMENTO: i due screenshot ora si agganciano ai mockup "momento 1" e
> "momento 2" della slide 7. Sono opzionali (fallback ai mockup attuali) e si
> adattano da soli al riquadro (object-fit: cover, allineati in alto) senza
> deformazioni ne' overflow, qualsiasi dimensione abbia l'immagine caricata.
> Il generatore ha due campi upload dedicati. Il nome "Marta" e' unificato
> (vedi punto 2).

Storico del punto:


Lo spec mappa la slide 7 così: «screenshot_1, screenshot_2 con fallback alle
immagini attuali; nome persona segue il pack (Marta/Luca)».

Nel deck reale la slide "Oggi" **non ha immagini**: i quattro "momenti" sono
mockup costruiti in HTML/CSS (un annuncio testuale, un form, una mail no-reply,
una casella vuota), non `<img>`. E il nome "Marta" **non compare nel testo
visibile** della slide: sta solo nelle *speaker-notes* (le note del presentatore).

Scelte fatte:
- **Nome**: ho reso pack-dependent le speaker-notes della slide 7
  (`data-notes-adriatec`): per pack=adriatec diventano "Luca si candida da
  un'azienda dove vorrebbe crescere…". Questo realizza «sostituire Marta con
  Luca nel testo narrativo».
- **screenshot_1 / screenshot_2**: il meccanismo `data-field` li supporta
  (immagine con fallback al `src` attuale), ma nella slide Oggi **non c'è un
  `<img>` a cui agganciarli**. Non ho inventato slot immagine.

➡️ **Da decidere con te**: vuoi che i due screenshot personalizzati compaiano
da qualche parte (es. sostituendo uno/due dei mockup CSS della slide 7 con
un'immagine del prospect, oppure sulla slide 11 "La pagina")? Dimmi dove e
aggancio i `data-field="screenshot_1/2"`.

## 2. Nome candidato — RISOLTO: sempre "Marta"

In origine il pack adriatec usava "Luca" (come da spec), mentre l'anteprima
della slide 9 restava su "Marta": una piccola incoerenza.

Su richiesta, il nome del candidato è ora **"Marta" in tutto il deck** (Luca
rimosso ovunque). Il pack adriatec mantiene azienda/ruolo propri
(Adriatec · Junior Operations Manager, "Marta Bianchi"); il pack aurello resta
"Marta Rossi". La slide 9 e le slide 11-13 sono quindi coerenti.

## 2-bis. Anteprime "Come funziona" e "Come si fa" ora seguono il pack  [RISOLTO]

Le due slide di anteprima ("Cosa facciamo / Quattro momenti" e "Come si crea
una posizione") mostravano contenuti fissi aurello (Store Manager · Milano,
Brand Aurello, aurello.it, Verde Aurello / Oro caldo, criteri di Vera da
retail) anche quando il pack selezionato era adriatec. Ora sono pack-dependent
(`data-if-pack`), coerenti con le slide 11-13:

- pack **aurello**: Store Manager · Milano, Aurello · Talent Team, CV_Marta_Rossi,
  Brand Aurello, aurello.it, Verde Aurello / Oro caldo, tono "caloroso,
  artigianale", criteri "team / weekend / distanza".
- pack **adriatec**: Junior Operations Manager · Bologna, Adriatec · Talent Team,
  CV_Marta_Bianchi, Brand Adriatec, adriatec.it, Blu Adriatec / Grigio acciaio,
  tono "professionale, concreto", criteri "fornitori-produzione / gestionali-ERP
  / tempi-scorte".

Nota: lo spec non forniva copy adriatec per queste due anteprime; il testo
adriatec e' stato adattato in modo coerente col contesto adriatec gia' fissato
(industria, fornitori, ERP, produzione). Se vuoi wording diverso, dimmelo.

## 2-ter. Personalizzazione nel file scaricato dal generatore  [RISOLTO]

Nel file .html autonomo scaricato dal generatore, il runtime del deck e'
inlinato e converte la sorgente in stage *prima* che il nostro loader riesca a
staccarla: la config (azienda, pack, ecc.) veniva quindi ignorata e il file
mostrava sempre l'aurello di default. E' un bug che non si notava finche' si
usava il pack aurello di default. Ora `deck-config.js` ha un percorso di
fallback: se la sorgente e' gia' stata convertita, applica la config al DOM
gia' renderizzato (rimozione blocchi non pertinenti + riempimento campi),
ripetendo per qualche istante per resistere a un rendering tardivo. Verificato:
azienda iniettata, pack applicato, nessun residuo dell'altro pack.

## 3. Numeri di slide negli occhielli ("03 ·", "05 ·", "11 ·"…)

Come da spec ("se i numeri sono hardcoded nei titoli tipo '04 ·', lasciarli come
sono — non rinumerare dinamicamente in v1"), gli occhielli restano fissi. Quindi
nel branch volume=pochi (dove "Il carico" sparisce) la numerazione visibile non
si ricompatta. È voluto per la v1.

## 4. Quirk di contrasto nel contenuto aurello (Vera / Il feedback)

Alcuni testi enfatizzati del pack aurello usano `color:#FFFFFF` su bolle/box
chiari, risultando quasi invisibili (es. i box "COSA CI È PIACIUTO DI TE" e
alcune parole in grassetto nella chat). È un quirk del deck originale: per la
regola «i contenuti non elencati restano esattamente come sono, refusi inclusi»
**l'ho lasciato invariato nel pack aurello**. Nel nuovo contenuto adriatec ho
invece usato un colore leggibile. Se vuoi, posso correggere anche l'aurello.
