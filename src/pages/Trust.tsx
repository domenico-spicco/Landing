import { Link } from "react-router-dom";
import Em from "../components/Em";
import Reveal from "../components/Reveal";
import usePageMeta from "../components/usePageMeta";
import { IconCheck, IconEye, IconListX, IconStamp } from "../components/icons";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-sm font-medium uppercase tracking-widest text-accent-strong">{children}</p>
  );
}

const principleCards = [
  {
    icon: IconListX,
    title: "Nessun punteggio, nessuna classifica",
    body: "Spicco non assegna score e non ordina i candidati. Restituisce profili completi e informazioni organizzate: la valutazione è vostra.",
  },
  {
    icon: IconStamp,
    title: "Ogni comunicazione è approvata",
    body: "Nessun messaggio parte in automatico. Il feedback ai candidati viene inviato solo dopo l'approvazione del vostro team, e ogni approvazione resta tracciata.",
  },
  {
    icon: IconEye,
    title: "Il candidato sa sempre con chi parla",
    body: "La conversazione di candidatura si dichiara per quello che è. Trasparenza verso il candidato, dal primo momento.",
  },
];

const guarantees = [
  "Nessuno scarto automatico: nessun candidato viene escluso da un algoritmo",
  "Nessuna analisi video, audio, biometrica o emotiva",
  "Nessun uso dei dati dei vostri candidati per addestrare modelli",
  "Nessuna vendita o condivisione di dati con terze parti",
  "I dati dei candidati restano nel vostro processo e confluiscono nel vostro ATS",
];

export default function Trust() {
  usePageMeta(
    "Trust Center — Spicco",
    "Spicco opera nella selezione del personale, un ambito che le normative europee regolano con attenzione. Per questo è stato progettato con un principio semplice: la tecnologia raccoglie e organizza, le persone decidono.",
  );

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 md:pt-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Progettato conforme. <Em>Prima ancora che lo chiediate.</Em>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            Spicco opera nella selezione del personale, un ambito che le normative europee regolano
            con attenzione. Per questo è stato progettato con un principio semplice: la tecnologia
            raccoglie e organizza, le persone decidono.
          </p>
        </div>
      </section>

      {/* Sezione 1 · Come funziona */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="max-w-3xl">
          <Eyebrow>Il principio</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            La tecnologia organizza. <Em>Il recruiter decide.</Em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            Spicco accompagna il candidato lungo tutto il percorso: dall'annuncio alla pagina di
            candidatura, dalla conversazione al feedback finale. In ogni passaggio, il ruolo dello
            strumento è lo stesso: raccogliere informazioni, organizzarle e presentarle al vostro
            team in modo chiaro.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">
            Le decisioni di selezione restano dove sono sempre state: nelle mani dei vostri
            recruiter. Spicco non valuta, non ordina, non scarta.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {principleCards.map((card) => (
            <Reveal
              key={card.title}
              className="flex flex-col rounded-2xl bg-surface p-6 shadow-[0_4px_24px_rgba(26,26,24,0.08)]"
            >
              <card.icon className="h-6 w-6 text-accent-strong" />
              <h3 className="mt-4 text-xl font-bold">{card.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/80">{card.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sezione 2 · Conforme per progettazione */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="max-w-3xl">
          <Eyebrow>EU AI Act e GDPR</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Le regole europee non sono un ostacolo. <Em>Sono il nostro disegno.</Em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            Le normative europee su AI e protezione dei dati chiedono una cosa precisa a chi opera
            nel recruiting: supervisione umana reale, trasparenza verso i candidati e controllo sui
            dati. Spicco è stato costruito partendo da questi requisiti, non adattato dopo.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">
            Per questo non troverete in Spicco analisi video o biometriche, valutazioni automatiche
            della personalità o meccanismi di esclusione algoritmica: scelte di progettazione, prima
            ancora che obblighi normativi.
          </p>
        </Reveal>
        <Reveal className="mt-12 max-w-3xl rounded-2xl bg-surface p-8 shadow-[0_4px_24px_rgba(26,26,24,0.08)]">
          <ul className="flex flex-col gap-4">
            {guarantees.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Sezione 3 · Pensato per il vostro team legale */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="max-w-3xl">
          <Eyebrow>La documentazione</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Arriviamo <Em>con le risposte</Em>, non con le domande.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            Sappiamo come funziona l'adozione di un nuovo strumento in azienda: prima o poi la
            conversazione arriva sul tavolo di DPO, legal e IT. Spicco è pensato per rendere quel
            passaggio semplice.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">
            In fase di valutazione ricevete un pacchetto completo di documentazione: accordi sul
            trattamento dei dati, valutazioni d'impatto predisposte, testi pronti per le vostre
            informative e piena visibilità sul funzionamento dello strumento. Il vostro team legale
            parte da documenti lavorati, non da una pagina bianca.
          </p>
          <p className="mt-8 text-lg font-bold">
            Se il vostro DPO ha domande, mettetelo al tavolo dal primo incontro. Preferiamo così.
          </p>
        </Reveal>
      </section>

      {/* Sezione 4 · CTA finale */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="rounded-2xl bg-surface px-8 py-12 text-center shadow-[0_4px_24px_rgba(26,26,24,0.08)] sm:px-12 sm:py-16">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Trenta minuti, <Em>con chi volete voi</Em>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink/80">
            HR, IT, legal: portate chi deve dire sì. Vi mostriamo Spicco e la documentazione nella
            stessa call.
          </p>
          <Link
            to="/parliamone"
            className="mt-8 inline-block cursor-pointer rounded-lg bg-accent-strong px-8 py-3 font-bold text-surface transition-opacity duration-200 hover:opacity-90"
          >
            Parliamone
          </Link>
        </Reveal>
      </section>
    </>
  );
}
