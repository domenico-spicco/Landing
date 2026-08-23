import usePageMeta from "../components/usePageMeta";

export default function Privacy() {
  usePageMeta("Privacy — Spicco");

  return (
    <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight">Privacy</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">
        [Informativa privacy in validazione legale. Per qualsiasi domanda scrivete a{" "}
        <a
          href="mailto:domenico@spicco.ai"
          className="cursor-pointer font-medium text-accent-strong transition-opacity duration-200 hover:opacity-80"
        >
          domenico@spicco.ai
        </a>
        .]
      </p>
    </section>
  );
}
