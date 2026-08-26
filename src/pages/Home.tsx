import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BrowserFrame from "../components/BrowserFrame";
import AxsDiagram from "../components/AxsDiagram";
import Em from "../components/Em";
import Reveal from "../components/Reveal";
import usePageMeta from "../components/usePageMeta";
import { IconListX, IconShieldCheck, IconUserCheck } from "../components/icons";

// Sezione 6 (bivio verticale): le pagine verticali non esistono ancora.
// Tenere il flag a false finché non sono pubblicate. Mai linkare pagine vuote.
const SHOW_VERTICALS = false;

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-sm font-medium uppercase tracking-widest text-accent-strong">{children}</p>
  );
}

const ROTATING_WORDS = ["convertire", "personalizzare", "analizzare"];

// Parole a rotazione della Sezione 3: roll verticale, una alla volta.
// Con prefers-reduced-motion la lista è mostrata statica.
function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATING_WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);

  if (reduced) {
    return <span className="em-turn text-accent-strong">{ROTATING_WORDS.join(", ")}</span>;
  }

  return (
    <>
      <span className="sr-only">{ROTATING_WORDS.join(", ")}</span>
      <span aria-hidden="true" className="relative block h-[1.25em] overflow-hidden">
        {ROTATING_WORDS.map((word, i) => {
          const leaving = i === (index + ROTATING_WORDS.length - 1) % ROTATING_WORDS.length;
          return (
            <span
              key={word}
              className="em-turn absolute inset-x-0 text-accent-strong transition-all duration-500 ease-out"
              style={{
                transform:
                  i === index
                    ? "translateY(0)"
                    : leaving
                      ? "translateY(-110%)"
                      : "translateY(110%)",
                opacity: i === index ? 1 : 0,
              }}
            >
              {word}
            </span>
          );
        })}
      </span>
    </>
  );
}

const momentCards = [
  {
    image: "/media/momento-1.webp",
    imageWidth: 720,
    imageHeight: 838,
    alt: "Anteprima: bozza di job description con le verifiche di Spicco",
    title: "La job giusta",
    body: "Annunci chiari, senza bias, validati su dati di mercato. Attraggono candidature in target prima ancora che il processo inizi.",
  },
  {
    image: "/media/momento-2.webp",
    imageWidth: 720,
    imageHeight: 787,
    alt: "Anteprima: pagina di candidatura con il brand dell'azienda",
    title: "La pagina",
    body: "Una pagina di candidatura con il vostro brand, non un form anonimo. Fa venire voglia di candidarsi.",
  },
  {
    image: "/media/momento-3.webp",
    imageWidth: 720,
    imageHeight: 838,
    alt: "Anteprima: conversazione di candidatura",
    title: "La conversazione",
    body: "Se il profilo è in linea, è velocissimo. Se no, il candidato ha modo di raccontare quello che un CV non dice.",
  },
  {
    image: "/media/momento-4.webp",
    imageWidth: 720,
    imageHeight: 838,
    alt: "Anteprima: feedback personalizzato inviato al candidato",
    title: "Il feedback",
    body: "Una risposta sempre, anche il no, con dignità. Mai un no-reply, mai il silenzio.",
  },
];

const trustBadges = [
  {
    icon: IconUserCheck,
    text: "Il recruiter decide sempre. Spicco raccoglie e organizza, non valuta e non scarta.",
  },
  {
    icon: IconListX,
    text: "Nessun punteggio, nessuna classifica. Nessuna analisi biometrica o emotiva, mai.",
  },
  {
    icon: IconShieldCheck,
    text: "Conforme a EU AI Act e GDPR by-design. Documentazione e DPIA pronte per il vostro team legale.",
  },
];

export default function Home() {
  usePageMeta();

  return (
    <>
      {/* Sezione 1 · Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Vincete i candidati migliori. Senza perdere <Em>tutti gli altri</Em>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
              Ogni candidatura è due cose insieme: un talento da convincere e una persona che
              parlerà di voi. Oggi i vostri strumenti non sono progettati per nessuna delle due.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/parliamone"
                className="cursor-pointer rounded-lg bg-accent-strong px-6 py-3 font-bold text-surface transition-opacity duration-200 hover:opacity-90"
              >
                Parliamone
              </Link>
              <a
                href="#video"
                className="cursor-pointer rounded-lg border border-ink/20 px-6 py-3 font-medium text-ink transition-colors duration-200 hover:border-accent-strong hover:text-accent-strong"
              >
                Guardate come funziona
              </a>
            </div>
          </div>
          <BrowserFrame>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/media/poster.jpg"
              width={1280}
              height={720}
              className="pointer-events-none block h-auto w-full"
              aria-label="Anteprima di una pagina di candidatura creata con Spicco"
            >
              <source src="/media/loop.webm" type="video/webm" />
              <source src="/media/loop.mp4" type="video/mp4" />
            </video>
          </BrowserFrame>
        </div>
      </section>

      {/* Sezione 2 · Video */}
      <section id="video" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            La differenza si vede in 60 secondi.
          </h2>
          <div className="mt-10 overflow-hidden rounded-2xl bg-surface shadow-[0_8px_32px_rgba(26,26,24,0.12)]">
            <video
              controls
              preload="metadata"
              poster="/media/video-poster.jpg"
              width={1920}
              height={1080}
              className="block h-auto w-full"
            >
              <source src="/media/video-completo.mp4" type="video/mp4" />
            </video>
          </div>
        </Reveal>
      </section>

      {/* Sezione 3 · Il problema */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Sales e Marketing hanno strumenti per
            <span className="mt-2 block text-4xl sm:text-5xl">
              <RotatingWord />
            </span>
          </h2>
          <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-ink/80">
            Al recruiting viene chiesta invece sempre la stessa cosa: assumere i migliori,
            velocemente.
          </p>
          <p className="mt-2 text-lg font-bold">
            Ma il mercato è cambiato, e sono cambiati anche i candidati.
          </p>
          <div className="mx-auto mt-12 max-w-md rounded-2xl bg-surface p-8 shadow-[0_4px_24px_rgba(26,26,24,0.08)]">
            <p className="text-5xl font-extrabold tracking-tight text-accent-strong">
              Quasi 6 su 10
            </p>
            <p className="mt-4 leading-relaxed">
              candidati hanno vissuto una cattiva esperienza di candidatura. E il 72% l'ha
              raccontata.
            </p>
            <p className="mt-5 text-sm text-ink/60">Fonte: Future Workplace / CareerArc</p>
          </div>
          <p className="mt-12 text-xl font-bold">
            Gli ATS rendono il recruiting efficiente. Spicco lo rende efficace.
          </p>
        </Reveal>
      </section>

      {/* Sezione 4 · I quattro momenti */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <Eyebrow>Cosa facciamo</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Quattro momenti, <Em>un'unica esperienza</Em>.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">
            Dal primo annuncio all'ultima comunicazione, ogni punto di contatto con chi si candida
            porta il vostro logo. Spicco li presidia tutti.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
          {momentCards.map((card) => (
            <Reveal key={card.title} className="flex flex-col">
              <div className="flex aspect-[720/838] items-center">
                <img
                  src={card.image}
                  alt={card.alt}
                  width={card.imageWidth}
                  height={card.imageHeight}
                  loading="lazy"
                  className="h-auto max-h-full w-full object-contain"
                />
              </div>
              <h3 className="mt-6 text-xl font-bold">{card.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/80">{card.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sezione 5 · Il frame AXS */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Dove ci inseriamo</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Non sostituiamo il vostro ATS. Lo <Em>completiamo</Em>.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
              Il vostro ATS resta il centro del processo: nessuna migrazione, nessun cambio di
              strumento, nessun nuovo sistema da imparare per il team. Spicco è il layer di
              esperienza che lavora sopra: presidia il primo e l'ultimo miglio del candidato e
              riporta tutto dentro l'ATS che usate già.
            </p>
          </div>
          <div className="mx-auto w-full max-w-xl">
            <AxsDiagram />
          </div>
        </Reveal>
      </section>

      {/* Sezione 6 · Il bivio verticale (nascosta finché le pagine verticali non esistono) */}
      {SHOW_VERTICALS && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Il vostro recruiting, <Em>il vostro</Em> problema.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-surface p-8 shadow-[0_4px_24px_rgba(26,26,24,0.08)]">
                <h3 className="text-xl font-bold">Ricevete migliaia di candidature?</h3>
                <p className="mt-3 leading-relaxed text-ink/80">
                  Pipeline piene, ma piene delle persone sbagliate. E una parte di chi si candida è
                  già vostro cliente.
                </p>
              </div>
              <div className="rounded-2xl bg-surface p-8 shadow-[0_4px_24px_rgba(26,26,24,0.08)]">
                <h3 className="text-xl font-bold">Cercate profili che tutti si contendono?</h3>
                <p className="mt-3 leading-relaxed text-ink/80">
                  I candidati buoni sono pochi, hanno alternative, e si parlano tra loro. Ogni
                  esperienza conta doppio.
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Sezione 7 · Striscia trust */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Progettato conforme. <Em>Prima ancora che lo chiediate.</Em>
          </h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {trustBadges.map((badge) => (
              <li
                key={badge.text}
                className="flex items-start gap-4 rounded-2xl bg-surface p-6 shadow-[0_4px_24px_rgba(26,26,24,0.08)]"
              >
                <badge.icon className="h-6 w-6 shrink-0 text-accent-strong" />
                <p className="leading-relaxed">{badge.text}</p>
              </li>
            ))}
          </ul>
          <Link
            to="/trust"
            className="mt-8 inline-block cursor-pointer font-bold text-accent-strong transition-opacity duration-200 hover:opacity-80"
          >
            Visitate il Trust Center →
          </Link>
        </Reveal>
      </section>

      {/* Sezione 8 · Chi c'è dietro + CTA finale */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="max-w-2xl">
          <Eyebrow>Chi siamo</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Una startup con un'idea <Em>precisa</Em>.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/80">
            Spicco nasce dall'incontro tra un ex manager del SaaS enterprise e due imprenditori del
            mondo startup, con una convinzione comune: il recruiting merita gli stessi strumenti di
            personalizzazione che marketing e sales hanno da un decennio. Li stiamo costruendo.
          </p>
        </Reveal>
        <Reveal className="mt-20 rounded-2xl bg-surface px-8 py-12 text-center shadow-[0_4px_24px_rgba(26,26,24,0.08)] sm:px-12 sm:py-16">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Quindici minuti. <Em>Partendo da voi.</Em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink/80">
            Prima capiamo il vostro contesto, poi vi mostriamo Spicco su una posizione vostra reale.
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
