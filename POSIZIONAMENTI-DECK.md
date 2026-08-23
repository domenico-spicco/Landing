# Posizionamenti del deck dinamico Spicco

Estratto strutturato di **tutti i contenuti** del deck e di come cambiano in
base alle scelte fatte nel generatore. Ogni deck generato è una combinazione di
queste variabili: sotto trovi, slide per slide, la parte fissa e ogni variante
con il testo completo.

> I testi qui sotto sono in **italiano**. Con la variabile **Lingua = English**
> l'intero deck (e il calcolatore) viene tradotto in inglese: stessa struttura e
> stessi posizionamenti, solo in un'altra lingua. Le note per il relatore
> restano in italiano.

---

## 1. Le variabili (le scelte del generatore)

| Variabile | Valori | Default | Cosa controlla |
|---|---|---|---|
| **Volume candidature** | `tanti` / `pochi` | tanti | Slide 02, 03 e la slide 04 ("Il carico"): storytelling sovraccarico-da-volumi vs pochi-candidati/burocrazia |
| **Ruolo destinatario** | `ta` (TA/HR) / `marketing` | ta | Slide 15 e 16: taglio per chi seleziona vs per il referente marketing (+ link gemello) |
| **Mercato** | `b2c` / `b2b` | b2c | Slide 01 e 05: il candidato come cliente (B2C) vs come parte dell'ecosistema (B2B); in B2B sparisce il bottone calcolatore |
| **Pack (brand esempio)** | `aurello` (retail) / `adriatec` (industria) | aurello | Slide 09–14: l'esempio concreto usato (Store Manager retail vs Junior Operations Manager industria) |
| **Feedback ai candidati** | `no` / `si` | no | Slide 03, 06, 07: rischio "silenzio" vs rischio "feedback generico/template" |
| **Processo di candidatura lungo** | `si` / `no` | si | Slide 03: prima card "La candidatura" (il 92% di abbandono vs le leve per più candidature) |
| **Lingua** | `it` / `en` | it | Tutte le slide + calcolatore: italiano o inglese |
| **Posti pilota** | 0 / 1 / 2 | 2 | Slide 16: "Due/Uno sono ancora disponibili" / "Sono tutti assegnati" |
| **Formato** | HTML / PDF | HTML | Solo output (file autonomo vs stampa PDF), non cambia i contenuti |

**Personalizzazione libera** (non è una scelta a due valori, si inserisce nel generatore):
- **Nome azienda** → sostituisce "il vostro brand" ovunque compaia (titoli, chiusure, bottone calcolatore, ecc.). Default: "il vostro brand".
- **Logo** → mostrato al posto del segnaposto (se caricato).
- **Screenshot 1 e 2** → immagini della pagina di candidatura reale del cliente (se caricate).

---

## 2. Catalogo slide (contenuto + varianti)

Numerazione = occhiello visibile nel deck.

### Cover
- **Titolo:** "Vincete i candidati migliori senza perdere *gli ambassador che si candidano*."
- Logo/nome brand personalizzabile. Nessuna variante condizionale.

### 01 · La storia
- **Titolo:** "L'anno scorso sono tornato a fare il candidato."
- **Testo — dipende da Mercato:**
  - **B2C:** "Per la prima volta ho pensato male di brand che amavo. Non per il «no», per *come me l'hanno fatto vivere.* E da uno di quei brand, da cliente, **ho smesso di comprare.**"
  - **B2B:** "…E di uno di quei brand ho iniziato a parlare male, ripromettendomi di **non candidarmi più.**" *(in B2B il candidato non è un cliente che smette di comprare)*

### 02 · Dall'altra parte
- **Titolo:** "Il mondo sta cambiando."
- **Testo — dipende da Volume:**
  - **Tanti:** "I recruiter annegano nei volumi. La tecnologia vi ha resi *più veloci* - non *più memorabili*."
  - **Pochi:** "I recruiter non annegano nei volumi: annegano nel processo. La tecnologia vi ha resi *più veloci* - non *più memorabili*."
- **Chiusura (fissa):** "Gli ATS rendono il recruiting *efficiente*. Spicco lo rende *efficace*."

### 03 · I dati (occhiello: "Il paradosso del volume" / "Il funnel che perde prima di iniziare")
Slide a 3 card. Cambia molto in base a **Volume**, **Processo lungo** e **Feedback**.

- **Kicker + intro — dipende da Volume:**
  - **Tanti** — kicker "Il paradosso del volume". Intro (se Processo lungo = **sì**): "Ricevete più candidature che mai. Ma i candidati migliori… abbandonano per primi davanti a un processo lento. Il risultato: pipeline piene, ma piene delle persone sbagliate."
  - **Pochi** — kicker "Il funnel che perde prima di iniziare". Intro (se Processo lungo = **sì**): "Attrarre candidati costa: annunci, employer branding, tempo. E poi il 92% di chi avvia la candidatura non la completa. Non basta attrarre: le perdete anche sulla porta…"
  - **Con Processo lungo = no** (entrambi i volumi) l'intro si sposta sulle leve: "…Le candidature giuste non dipendono dal volume: dipendono dalle leve dell'esperienza, dalla prima riga dell'annuncio al processo di candidatura."

- **Card 1 "La candidatura" — dipende da Processo lungo:**
  - **Sì:** **92%** "di chi avvia non completa. Chi ha alternative non aspetta: restano i più pazienti, non i più bravi." — *Fonte: SHRM/Appcast* (variante pochi: "form lunghi, login obbligatori, mobile… ogni abbandono è budget sprecato").
  - **No:** icona **"+↑"** + "Le candidature giuste crescono con più leve insieme: un linguaggio senza bias, una job description chiara, un processo di candidatura semplice e il giusto equilibrio tra seniority e requisiti." + chiusura "Più candidature in target, meno sprechi a valle." *(nessun numero)*

- **Card 2 "Il silenzio / La sostanza" — dipende da Feedback:**
  - **No → "Il silenzio":** **75%** "non riceve mai risposta, 61% viene ghostato dopo un colloquio…" — *Fonte: Starred*
  - **Sì → "La sostanza":** **+126%** "referral in più da chi riceve un feedback specifico dopo il colloquio. Un template generico non sposta niente: conta la sostanza, non la risposta." — *Fonte: Talent Board CandE 2024*

- **Card 3 "Il rifiuto" (fissa nel contenuto, testo leggermente diverso per volume):**
  - Tanti: **48%** "non capisce perché è stato scartato, 70% non si ricandiderebbe…" — *Fonte: Starred/Randstad*
  - Pochi: **70%** "di chi vive un processo negativo non si ricandiderebbe…"

### 04 · Il carico — SLIDE MUTUAMENTE ESCLUSIVA per Volume
- **Titolo (comune):** "Non è colpa vostra."
- **Volume = tanti → "Il carico che grava sui recruiter" (occhiello "Il carico sui recruiter"):**
  - Intro: "I recruiter annegano nei volumi. Hanno strumenti per assumere, non per gestire tutti gli altri."
  - Card: **3%** tasso candidature/colloquio (era 15% nel 2016) · **27%** dei TA leader con carichi ingestibili · **35%** del tempo nella pianificazione colloqui · **56%** non riceve candidati qualificati.
  - Chiusura: "Gli strumenti che avete servono ad assumere. Nessuno ha ancora costruito uno strumento per *gestire tutti gli altri*."
- **Volume = pochi → "Il carico che non si vede":**
  - Intro: "Non annegate nei volumi. Annegate nella burocrazia: compliance, coordinamento, amministrazione…"
  - Card: **30-40%** tempo in attività amministrative (SHRM) · **11-50%** settimana HR in compliance, +57% cresciuto (HR.com 2025) · **+23%** competenze richieste in 5 anni (Deloitte 2025).
  - Chiusura: "Gli strumenti che avete servono a restare in regola e a gestire il processo. Nessuno vi aiuta a *occuparvi di attrarre*, quando la burocrazia vi ha già preso il tempo."

### 05 · Il costo
- **Titolo:** "Non è un tema HR. Sono due voci di P&L."
- **Costo 1 · Il funnel (fisso):** "Il form vi impone una scelta: corto converte ma non vi dice nulla… Lungo seleziona, ma perde i candidati: fino al 92% di chi avvia non completa." + "In entrambi i casi il cost-to-hire sale…" + "Il problema non è la lunghezza del form. È il form."
- **Costo 2 — dipende da Mercato:**
  - **B2C → "Il brand":** "Una parte di chi si candida è già tuo cliente. Trattato male, disdice - e lo racconta." + "Il 72% di chi vive un'esperienza negativa la racconta…" + **Virgin Media: 4,4 M£** di fatturato perso l'anno.
  - **B2B → "L'ecosistema":** "Nel B2B chi si candida da voi è dipendente di un competitor, di un fornitore, di un futuro cliente." + "In un mercato stretto il passaparola non si diluisce: si concentra." + "3,5 volte meno propenso a ricandidarsi."
- **Chiusura — dipende da Mercato:**
  - B2C: "Non è un'ipotesi. Sono due voci di conto economico."
  - B2B: "Il primo è un'equazione. Il secondo è la regola dei mercati stretti."
- **Bottone calcolatore — solo B2C:** "Quanto costa a [azienda]? → Apri il calcolatore". *In B2B il bottone non compare* (il calcolatore stima clienti/LTV persi, non pertinente in B2B).

### 06 · Il costo di non fare nulla
- **Titolo:** "Mentre aspettate, il rumore cresce, insieme al rischio."
- Muro di 8 card sparse. 5 fisse (bias annuncio, recensione RAL, requisiti non essenziali, linguaggio a rischio, toni di genere). **3 card dipendono da Feedback:**
  - Post pubblico M.R. — No: "Zero feedback dopo 3 colloqui. Mai più con [Azienda]." · Sì: "Copia-incolla con il mio nome cambiato. Si vedeva lontano un chilometro."
  - r/lavoro — No: "Perché le aziende ancora ghostano i candidati nel 2026?" · Sì: "Il feedback automatico è peggio del silenzio?"
  - DM anonimo — No: "3 mesi senza risposta. Ho accettato altrove." · Sì: "Feedback finto, frasi fatte. Zero riferimento a me."

### 07 · Oggi (occhiello "Il vostro processo, visto da fuori")
- **Titolo:** "Quattro momenti che vive oggi chi si candida da voi." + "È il *volto pubblico* del vostro brand nel recruiting."
- Momenti 01–03 fissi (job description muro di testo, form 28 step, no-reply automatico). **Momento 04 dipende da Feedback:**
  - **No:** box "Silenzio" (nessun nuovo messaggio, "30 giorni dopo"). Caption: "E poi, *il silenzio.*"
  - **Sì:** scatola email in stile Momento 03 con oggetto "Esito della candidatura" e testo template con placeholder non sostituiti "Gentile **[NOME]**, dopo attenta valutazione del tuo profilo per la posizione di **[RUOLO]**…". Caption: "E poi, *lo stesso template.*"
- **Chiusura (fissa):** "Quattro touchpoint. Nessuno progettato. Tutti con il vostro logo sopra."

### 08 · Dove ci inseriamo
- **Titolo:** "Abbiamo creato l'AXS. *L'alleato strategico degli ATS.*" Nessuna variante condizionale (spiega i tre layer: Attrai & coinvolgi / Selezione & processo / Feedback & ambassador, con l'ATS del cliente al centro).

### 09 · Come funziona (occhiello "Cosa facciamo")
- **Titolo:** "Quattro momenti, un'unica esperienza."
- **Dipende da Pack** (esempio concreto): con **aurello** gli esempi sono retail (Store Manager · Milano), con **adriatec** industria (Junior Operations Manager · Bologna). Cambiano job description, landing, conversazione con Vera, feedback.

### 10 · Come si fa (occhiello "Come si crea una posizione")
- **Titolo:** "Una posizione pronta in *5 minuti*."
- **Dipende da Pack:** setup brand (Aurello: colori "Verde Aurello / Oro caldo", tono "caloroso, artigianale" · Adriatec: "Blu Adriatec / Grigio acciaio", tono "professionale, concreto") e l'esempio di posizione aperta (Store Manager retail vs Junior Operations Manager industria), le domande di Vera configurate, ecc.

### 11 · La job giusta (occhiello "La strategia sulla posizione")
- **Titolo:** "Non pubblichiamo una job, *rendiamo il recruiting strategico*." Contenuto fisso (JD senza bias, il semaforo su RAL/requisiti/mercato, "dati non opinioni").

### 12 · La pagina (occhiello "La pagina di candidatura")
- **Titolo:** "Una pagina che fa venire voglia di *candidarsi*."
- **Dipende da Pack:** la landing di esempio è brandizzata Aurello (retail) o Adriatec (industria), con offerta/RAL e team coerenti. Qui si inseriscono anche gli **screenshot reali** del cliente se caricati.

### 13 · Vera (occhiello "La conversazione con Vera")
- **Titolo:** "Se sei in linea, è *velocissimo*. Se no, hai *modo di raccontarti*."
- **Dipende da Pack:** la conversazione di esempio (profilo in linea vs da approfondire) è calata su Store Manager (Aurello) o Junior Operations Manager (Adriatec).

### 14 · Il feedback
- **Titolo:** "Una risposta sempre. *Anche il no, con dignità.*" + "Mai un no-reply, mai il silenzio."
- **Dipende da Pack:** le due email di esempio (candidatura ricevuta / no con dignità) sono firmate Aurello o Adriatec, con contenuti coerenti col ruolo.
- **Chiusura (fissa):** "Ogni candidato scartato esce parlando bene di voi - i candidati diventano ambassador."

### 15 · Compliant-by-design
- **Titolo:** "Progettato conforme all'EU AI Act e al GDPR."
- **Dipende da Ruolo:**
  - **TA/HR:** taglio completo — "Prima ancora che lo chiediate." + Human-in-the-loop, nessun punteggio/classifica, DPIA pronta.
  - **Marketing:** taglio più sintetico da inoltrare — "Conforme a EU AI Act e GDPR by-design. Il vostro team HR e IT riceverà la documentazione completa."

### 16 · Il prossimo passo
- **Dipende da Ruolo:**
  - **TA/HR:** "Vi mostriamo Spicco in 30 minuti. Con una posizione reale vostra." + CTA "Richiedete la demo" + posti pilota (**Posti pilota**: "Due/Uno sono ancora disponibili" oppure "Sono tutti assegnati: parliamone comunque").
  - **Marketing:** "Questo è il vostro brand nel momento in cui nessuno lo presidia. Ma la decisione vive in chi si occupa di selezione. Condividete questo deck con il team HR…" + bottone "Copia il link per il team HR" (apre la versione TA già personalizzata, con tracciamento `via=marketing`).

---

## 3. Il calcolatore ROI (dal bottone in slide 05, solo B2C)

Bilingue (it/en). Input: candidature/anno (precompilato dal Volume: 30.000 se
"tanti", 3.000 se "pochi"), % candidati che sono anche clienti o potenziali,
% persi dopo una cattiva esperienza (default 6%, fonte Virgin Media), settore
con LTV suggerito, LTV modificabile. Settori disponibili: Telco, Banca/Finanza,
Assicurazioni, Utility, GDO, **Travel & Hospitality**, Moda, E-commerce,
Automotive, Ristorazione. Output: danno diretto/anno, persone esposte/anno,
impatto potenziale totale.

---

## 4. Riepilogo: cosa tocca ogni variabile

- **Volume** → 02 (intro), 03 (kicker/intro/card), 04 (quale slide "Il carico")
- **Ruolo** → 15 (taglio compliance), 16 (CTA demo vs link team HR)
- **Mercato** → 01 (finale storia), 05 (Costo 2 + chiusura + bottone calcolatore)
- **Pack** → 09, 10, 12, 13, 14 (esempio Aurello retail vs Adriatec industria)
- **Feedback** → 03 (2ª card), 06 (3 card), 07 (Momento 04)
- **Processo lungo** → 03 (1ª card + intro)
- **Lingua** → tutto il deck + calcolatore
- **Posti pilota** → 16 (disponibilità)
- **Nome azienda / logo / screenshot** → ovunque compaia il brand + slide 12
