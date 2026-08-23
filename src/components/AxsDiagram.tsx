import { useEffect, useState } from "react";

/**
 * Diagramma Sezione 5: il flusso del candidato. La candidatura arriva su
 * Spicco, il profilo passa al vostro ATS, il feedback torna al candidato
 * attraverso Spicco. Un punto animato percorre il circuito (disattivato
 * con prefers-reduced-motion: restano le frecce statiche).
 * Palette del design system, con fallback espliciti sui token.
 */

const CIRCUIT =
  "M115,172 C175,95 275,95 338,163 L425,163 C480,95 560,95 612,172 " +
  "L612,228 C560,305 480,305 425,237 L338,237 C275,305 175,305 115,228 L115,172";

const ink = "var(--ink, #1A1A18)";
const accent = "var(--accent, #C96442)";
const accentStrong = "var(--accent-strong, #A94A28)";
const surface = "var(--surface, #FFFFFF)";

export default function AxsDiagram() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <svg
      viewBox="0 0 720 400"
      role="img"
      aria-label="Diagramma del flusso: la candidatura arriva su Spicco, il profilo passa al vostro ATS e il feedback torna al candidato attraverso Spicco"
      className="h-auto w-full"
    >
      <defs>
        <marker
          id="flow-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={accent} />
        </marker>
      </defs>

      {/* Le quattro tratte del percorso */}
      <g fill="none" stroke={accent} strokeWidth="2" markerEnd="url(#flow-arrow)">
        <path d="M115,172 C175,95 275,95 338,163" />
        <path d="M425,163 C480,95 560,95 612,172" />
        <path d="M612,228 C560,305 480,305 425,237" />
        <path d="M338,237 C275,305 175,305 115,228" />
      </g>

      {/* Etichette delle tratte */}
      <text x="228" y="82" textAnchor="middle" fill={accentStrong} fontSize="15" fontWeight="500">
        La candidatura
      </text>
      <text x="518" y="82" textAnchor="middle" fill={accentStrong} fontSize="15" fontWeight="500">
        Il profilo
      </text>
      <text x="228" y="326" textAnchor="middle" fill={accentStrong} fontSize="15" fontWeight="500">
        Il feedback
      </text>

      {/* Stazione: il candidato */}
      <circle cx="90" cy="200" r="36" fill={surface} stroke={ink} strokeOpacity="0.12" />
      <g
        fill="none"
        stroke={ink}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="90" cy="192" r="8" />
        <path d="M74 218 a16 16 0 0 1 32 0" />
      </g>
      <text x="90" y="266" textAnchor="middle" fill={ink} fontSize="16" fontWeight="700">
        Il candidato
      </text>

      {/* Stazione: Spicco */}
      <rect x="298" y="170" width="132" height="60" rx="30" fill={surface} stroke={accent} />
      <g stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none">
        <line x1="330" y1="188" x2="330" y2="212" />
        <line x1="319.6" y1="194" x2="340.4" y2="206" />
        <line x1="319.6" y1="206" x2="340.4" y2="194" />
      </g>
      <text x="357" y="206" fill={ink} fontSize="17" fontWeight="800">
        Spicco
      </text>

      {/* Stazione: il vostro ATS */}
      <rect x="545" y="170" width="150" height="60" rx="14" fill={surface} stroke={ink} strokeOpacity="0.12" />
      <text x="620" y="206" textAnchor="middle" fill={ink} fontSize="17" fontWeight="800">
        Il vostro ATS
      </text>

      {/* Punto animato che percorre il circuito */}
      {animate && (
        <circle r="7" fill={accentStrong}>
          <animateMotion dur="9s" repeatCount="indefinite" path={CIRCUIT} />
        </circle>
      )}

      <text
        x="360"
        y="380"
        textAnchor="middle"
        fill={accentStrong}
        fontSize="12"
        fontWeight="500"
        letterSpacing="0.5"
      >
        AXS · Applicant Experience System
      </text>
    </svg>
  );
}
