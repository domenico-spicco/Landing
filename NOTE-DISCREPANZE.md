# Note e discrepanze spec ↔ deck reale

Durante l'implementazione degli Step 2 e 7 ho trovato alcuni punti in cui lo
spec assume un deck leggermente diverso da quello fornito. Lo spec dice di
fermarsi e chiedere in caso di ambiguità: elenco qui le scelte fatte, così puoi
confermarle o correggerle.

## 1. Slide 7 (Oggi) — screenshot e nome "Marta"  [RISOLTO]

> AGGIORNAMENTO: i due screenshot ora si agganciano ai mockup "momento 1" e
> "momento 2" della slide 7. Sono opzionali (fallback ai mockup attuali) e si
> adattano da soli al riquadro **mostrando l'immagine intera** (object-fit:
> contain, mai tagliata ne' deformata); i margini vuoti che restano quando le
> proporzioni non combaciano vengono riempiti da una **versione sfocata della
> stessa immagine** (stile copertine Spotify/YouTube), cosi' il riquadro e'
> sempre pieno e nulla viene ritagliato, qualsiasi dimensione abbia l'immagine.
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

## 2-quater. "Serve JavaScript" e resa su mobile

Il deck scaricato e' un file autonomo che si **ricostruisce nel browser**
(font, runtime, animazioni sono impacchettati e riassemblati all'apertura): ha
quindi bisogno di JavaScript. Aperto in un contesto dove il JS e' disattivato
- tipicamente le **anteprime** di WhatsApp/Telegram, delle mail, o dei gestori
file su telefono (iOS "Anteprima rapida", preview di Drive) - non mostra il
contenuto. E' un limite del formato "file unico", non un bug: basta aprirlo con
Safari o Chrome. Ora il messaggio no-JS e' una schermata intera in italiano che
lo spiega ("Apri il deck in un browser").

Sul mobile con JS attivo il deck si vede, ma essendo una presentazione a
formato fisso 16:9 risulta piccolo in verticale: meglio in orizzontale o da
desktop. Renderlo davvero responsive richiederebbe rifare l'impaginazione del
deck (fuori scope: non tocchiamo la logica/animazioni del deck).

## 2-quinquies. Nuova slide "Il costo di non fare nulla" (06)  [AGGIUNTA]

Aggiunta dopo la slide "Il costo" (05) la slide "Il costo di non fare nulla"
(occhiello 06): un muro di card sparse - recensioni, post pubblici, DM, bias e
requisiti a rischio - che mostra come il costo cresca da solo mentre si aspetta.
E' **sempre presente in ogni deck** (nessuna condizione data-if). Gli occhielli
delle slide successive sono stati **rinumerati staticamente** (06->07, 07->08,
... 15->16). La slide arriva da un export standalone: convertita al formato
del deck (section, sc-camel-view-box, colori tokenizzati sul tema
nebbia-petrolio) e con la sua animazione di ingresso (.riskcard / cardPop)
aggiunta allo stile del deck.

## 2-sexies. Toggle "Danno feedback ai candidati?" (si/no, default no)  [AGGIUNTO]

Nuovo controllo nel generatore (e nell'admin) che NON crea slide: cambia solo
testi puntuali dentro slide gia' esistenti, lasciando invariati layout,
animazioni, posizioni, bordi e tutte le altre card. Campo config `feedback`
(`si`/`no`, default `no`), gestito come gli altri toggle (`data-if-feedback`).

Punti che cambiano (tutti e soli):
1. Slide 06 "Il costo di non fare nulla": 3 card su 8 (post pubblico M.R.,
   r/lavoro, DM anonimo) cambiano solo il testo. Le altre 5 restano identiche.
2. Journey "oggi" (occhiello 07): solo l'ultimo step (Momento 04). No = box
   "Silenzio" (nessun messaggio, 30 giorni dopo). Si = una scatola email nello
   stesso stile del Momento 03 (grigia, header mittente + oggetto "Esito della
   candidatura", corpo con "Gentile [NOME], dopo attenta valutazione... per la
   posizione di [RUOLO]..." e placeholder non sostituiti in grassetto); la
   caption diventa "E poi, lo stesso template." (invariati gli step 01-03).
3. Metrica hero: la card "Il silenzio" (75%) della slide "I dati" (03), in
   entrambe le varianti di volume. No = "Il silenzio / 75% / non riceve mai
   risposta / Fonte: Starred". Si = "La sostanza / +126% / referral in piu' da
   chi riceve feedback specifico... / Fonte: Talent Board CandE 2024 (230.000+
   risposte)". Le altre due card (candidatura, rifiuto) restano identiche.

Scelte fatte (lo spec non le dettagliava): il titolo card "Il silenzio" nella
variante si diventa "La sostanza"; la caption della journey cambia con lo step
(altrimenti direbbe "silenzio" sotto un'email); testi senza trattino lungo. La
statistica "hero" nel deck e' una delle tre card di "I dati", non una slide a
statistica singola: applicato a entrambe le varianti volume.

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
