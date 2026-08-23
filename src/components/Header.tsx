import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-bg transition-shadow duration-200 ${
        scrolled ? "shadow-[0_1px_12px_rgba(26,26,24,0.08)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="cursor-pointer" aria-label="Spicco, pagina iniziale">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6" aria-label="Navigazione principale">
          <Link
            to="/trust"
            className="hidden cursor-pointer text-sm font-medium text-ink transition-colors duration-200 hover:text-accent-strong sm:inline"
          >
            Trust Center
          </Link>
          <Link
            to="/parliamone"
            className="cursor-pointer rounded-lg bg-accent-strong px-4 py-2 text-sm font-bold text-surface transition-opacity duration-200 hover:opacity-90"
          >
            Parliamone
          </Link>
        </nav>
      </div>
    </header>
  );
}
