import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Em from "../components/Em";
import usePageMeta from "../components/usePageMeta";
import { supabase } from "../lib/supabase";

type FieldErrors = {
  nome?: string;
  email?: string;
  aziendaRuolo?: string;
  privacy?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClasses =
  "w-full rounded-lg border border-ink/20 bg-surface px-4 py-3 text-ink transition-colors duration-200 placeholder:text-ink/40 hover:border-ink/40 focus:border-accent-strong focus:outline-none";

export default function Parliamone() {
  usePageMeta(
    "Parliamone — Spicco",
    "Prima capiamo il vostro contesto: come assumete oggi, cosa funziona e cosa no. Poi vi mostriamo Spicco su una posizione vostra reale.",
  );

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [aziendaRuolo, setAziendaRuolo] = useState("");
  const [assunzioniAnno, setAssunzioniAnno] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [generalError, setGeneralError] = useState(false);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!nome.trim()) next.nome = "Inserite nome e cognome.";
    if (!email.trim()) next.email = "Inserite la vostra email aziendale.";
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = "Inserite un indirizzo email valido.";
    if (!aziendaRuolo.trim()) next.aziendaRuolo = "Indicate azienda e ruolo.";
    if (!privacy) next.privacy = "Il consenso privacy è necessario per inviare la richiesta.";
    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setGeneralError(false);

    // Honeypot: i bot che lo compilano vedono la conferma senza che nulla venga salvato.
    if (honeypot) {
      setStatus("success");
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    const lead = {
      nome: nome.trim(),
      email: email.trim(),
      azienda_ruolo: aziendaRuolo.trim(),
      assunzioni_anno: assunzioniAnno.trim() || null,
    };

    try {
      if (!supabase) throw new Error("supabase-non-configurato");

      // Binario 1: salvataggio a DB, fonte di verità.
      const { error: dbError } = await supabase.from("leads").insert(lead);
      if (dbError) throw dbError;

      // Binario 2: notifica email. Se fallisce, il lead è comunque al sicuro nel DB.
      try {
        await supabase.functions.invoke("notify-lead", { body: lead });
      } catch {
        // Notifica non riuscita: nessun errore mostrato, il salvataggio è andato a buon fine.
      }

      window.plausible?.("lead_submit");
      setStatus("success");
    } catch {
      setStatus("idle");
      setGeneralError(true);
    }
  }

  if (status === "success") {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
        <div className="rounded-2xl bg-surface px-8 py-12 text-center shadow-[0_4px_24px_rgba(26,26,24,0.08)] sm:px-12">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            Richiesta ricevuta.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">
            Vi scriviamo entro un giorno lavorativo per trovare un quarto d'ora che funzioni per
            entrambi.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 md:py-24">
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
        Quindici minuti, <Em>partendo da voi</Em>.
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">
        Prima capiamo il vostro contesto: come assumete oggi, cosa funziona e cosa no. Poi vi
        mostriamo Spicco su una posizione vostra reale.
      </p>

      <form className="mt-10 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="nome" className="mb-2 block text-sm font-medium">
            Nome e cognome
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            autoComplete="name"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputClasses}
            aria-invalid={Boolean(errors.nome)}
          />
          {errors.nome && <p className="mt-2 text-sm text-accent-strong">{errors.nome}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email aziendale
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="mt-2 text-sm text-accent-strong">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="azienda-ruolo" className="mb-2 block text-sm font-medium">
            Azienda e ruolo
          </label>
          <input
            id="azienda-ruolo"
            name="azienda-ruolo"
            type="text"
            autoComplete="organization"
            required
            value={aziendaRuolo}
            onChange={(e) => setAziendaRuolo(e.target.value)}
            className={inputClasses}
            aria-invalid={Boolean(errors.aziendaRuolo)}
          />
          {errors.aziendaRuolo && (
            <p className="mt-2 text-sm text-accent-strong">{errors.aziendaRuolo}</p>
          )}
        </div>

        <div>
          <label htmlFor="assunzioni-anno" className="mb-2 block text-sm font-medium">
            Quante assunzioni fate circa in un anno?
          </label>
          <input
            id="assunzioni-anno"
            name="assunzioni-anno"
            type="text"
            value={assunzioniAnno}
            onChange={(e) => setAssunzioniAnno(e.target.value)}
            className={inputClasses}
          />
        </div>

        {/* Honeypot anti-spam: nascosto agli utenti, i bot lo compilano. */}
        <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
          <label htmlFor="sito-web">Sito web</label>
          <input
            id="sito-web"
            name="sito-web"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              required
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
              className="mt-1 h-4 w-4 cursor-pointer accent-(--accent-strong)"
              aria-invalid={Boolean(errors.privacy)}
            />
            <span className="text-sm leading-relaxed text-ink/80">
              [Testo consenso privacy, in validazione legale]{" "}
              <Link
                to="/privacy"
                className="cursor-pointer font-medium text-accent-strong transition-opacity duration-200 hover:opacity-80"
              >
                Informativa privacy
              </Link>
            </span>
          </label>
          {errors.privacy && <p className="mt-2 text-sm text-accent-strong">{errors.privacy}</p>}
        </div>

        {generalError && (
          <p className="rounded-lg border border-accent-strong/40 bg-surface px-4 py-3 text-sm leading-relaxed">
            Qualcosa non ha funzionato e la richiesta non è stata inviata. Riprovate tra qualche
            minuto oppure scriveteci direttamente a{" "}
            <a
              href="mailto:domenico@spicco.ai"
              className="cursor-pointer font-medium text-accent-strong transition-opacity duration-200 hover:opacity-80"
            >
              domenico@spicco.ai
            </a>
            .
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="cursor-pointer rounded-lg bg-accent-strong px-8 py-3 font-bold text-surface transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
          >
            {status === "loading" ? "Invio in corso…" : "Inviate la richiesta"}
          </button>
          <p className="mt-4 text-sm text-ink/70">
            Vi rispondiamo entro un giorno lavorativo, dall'email di una persona, non da un
            no-reply.
          </p>
        </div>
      </form>
    </section>
  );
}
