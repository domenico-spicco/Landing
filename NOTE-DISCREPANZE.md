# Note e discrepanze spec ↔ deck reale

Durante l'implementazione degli Step 2 e 7 ho trovato alcuni punti in cui lo
spec assume un deck leggermente diverso da quello fornito. Lo spec dice di
fermarsi e chiedere in caso di ambiguità: elenco qui le scelte fatte, così puoi
confermarle o correggerle.

## 1. Slide 7 (Oggi) — screenshot e nome "Marta"

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

## 2. Slide 9 (Come funziona) — anteprima con "Marta"

Lo spec definisce il contenuto pack solo per le slide 11-12-13 (La pagina, Vera,
Il feedback). Ma anche la slide 9 "Come funziona" contiene un'anteprima
compatta della chat Vera e del feedback, con "Marta" / "Store Manager · Milano"
/ "CV_Marta_Rossi.pdf" e frasi specifiche del retail.

Non essendoci nello spec un testo adriatec per questa anteprima, **l'ho lasciata
come esempio aurello (Marta) per entrambi i pack**: riscriverla avrebbe
richiesto inventare copy non fornito. Ne risulta una piccola incoerenza (nel
deck adriatec la slide 9 mostra ancora Marta, poi le 11-13 mostrano Luca).

➡️ **Da decidere con te**: se vuoi l'anteprima coerente col pack, mandami il
testo adriatec breve per le due colonne (chat Vera + feedback) della slide 9 e
lo aggiungo come variante pack.

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
