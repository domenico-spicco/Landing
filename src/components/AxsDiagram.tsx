import { useEffect, useState } from "react";

/**
 * Diagramma Sezione 5: flusso lineare, solo in avanti. La candidatura
 * arriva su Spicco, il vostro ATS gestisce il candidato, il feedback
 * torna al candidato attraverso Spicco. Un punto animato percorre la
 * linea (disattivato con prefers-reduced-motion: restano le frecce).
 * Palette del design system, con fallback espliciti sui token.
 */

const ink = "var(--ink, #1A1A18)";
const accent = "var(--accent, #C96442)";
const accentStrong = "var(--accent-strong, #A94A28)";
const surface = "var(--surface, #FFFFFF)";

function SpiccoPill({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y="60" width="130" height="60" rx="30" fill={surface} stroke={accent} />
      <g stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none">
        <line x1={x + 31} y1="78" x2={x + 31} y2="102" />
        <line x1={x + 20.6} y1="84" x2={x + 41.4} y2="96" />
        <line x1={x + 20.6} y1="96" x2={x + 41.4} y2="84" />
      </g>
      <text x={x + 55} y="96" fill={ink} fontSize="17" fontWeight="800">
        Spicco
      </text>
    </g>
  );
}

export default function AxsDiagram() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <svg
      viewBox="0 0 760 210"
      role="img"
      aria-label="Diagramma del flusso: la candidatura arriva su Spicco, il vostro ATS gestisce il candidato, il feedback al candidato passa di nuovo da Spicco"
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
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={accent} />
        </marker>
      </defs>

      {/* Punto animato, disegnato sotto le stazioni: scorre solo in avanti */}
      {animate && (
        <circle r="7" fill={accentStrong}>
          <animateMotion dur="4s" repeatCount="indefinite" path="M40,90 L720,90" />
        </circle>
      )}

      {/* Le due frecce, solo in avanti */}
      <g stroke={accent} strokeWidth="2" markerEnd="url(#flow-arrow)">
        <line x1="170" y1="90" x2="300" y2="90" />
        <line x1="455" y1="90" x2="585" y2="90" />
      </g>

      <SpiccoPill x={40} />

      <rect x="305" y="60" width="150" height="60" rx="14" fill={surface} stroke={ink} strokeOpacity="0.12" />
      <text x="380" y="96" textAnchor="middle" fill={ink} fontSize="17" fontWeight="800">
        Il vostro ATS
      </text>

      <SpiccoPill x={590} />

      {/* Cosa succede in ogni passaggio */}
      <text x="105" y="152" textAnchor="middle" fill={accentStrong} fontSize="15" fontWeight="500">
        La candidatura
      </text>
      <text x="380" y="152" textAnchor="middle" fill={accentStrong} fontSize="15" fontWeight="500">
        La gestione del candidato
      </text>
      <text x="655" y="152" textAnchor="middle" fill={accentStrong} fontSize="15" fontWeight="500">
        Il feedback al candidato
      </text>

      <text
        x="380"
        y="200"
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
