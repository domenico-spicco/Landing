import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="cursor-pointer self-start" aria-label="Spicco, pagina iniziale">
          <Logo />
        </Link>
        <nav
          className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6"
          aria-label="Navigazione footer"
        >
          <Link
            to="/trust"
            className="cursor-pointer font-medium text-ink transition-colors duration-200 hover:text-accent-strong"
          >
            Trust Center
          </Link>
          <Link
            to="/parliamone"
            className="cursor-pointer font-medium text-ink transition-colors duration-200 hover:text-accent-strong"
          >
            Parliamone
          </Link>
          <Link
            to="/privacy"
            className="cursor-pointer font-medium text-ink transition-colors duration-200 hover:text-accent-strong"
          >
            Privacy
          </Link>
          <a
            href="mailto:domenico@spicco.ai"
            className="cursor-pointer font-medium text-accent-strong transition-opacity duration-200 hover:opacity-80"
          >
            domenico@spicco.ai
          </a>
        </nav>
        <p className="text-sm text-ink/60">© 2026 Spicco</p>
      </div>
    </footer>
  );
}
