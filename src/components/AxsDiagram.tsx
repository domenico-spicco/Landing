import { useEffect, useState } from "react";

/**
 * Diagramma Sezione 5: flusso lineare, solo in avanti. La candidatura
 * arriva su Spicco, il vostro ATS gestisce il candidato, il feedback
 * torna al candidato attraverso Spicco. Un punto animato percorre la
 * linea (disattivato con prefers-reduced-motion: restano le frecce).
 * Adattivo: orizzontale da sm in su, verticale sotto (le etichette
 * restano leggibili sugli schermi stretti).
 * Palette del design system, con fallback espliciti sui token.
 */

const ink = "var(--ink, #1A1A18)";
const accent = "var(--accent, #C96442)";
const accentStrong = "var(--accent-strong, #A94A28)";
const surface = "var(--surface, #FFFFFF)";

const AXS_LABEL = "AXS · Applicant Experience System";
const ARIA_LABEL =
  "Diagramma del flusso: la candidatura arriva su Spicco, il vostro ATS gestisce il candidato, il feedback al candidato passa di nuovo da Spicco";

function usePrefersMotion() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return animate;
}

function FlowArrowMarker({ id }: { id: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto"
    >
      <path d="M0,0 L10,5 L0,10 z" fill={accent} />
    </marker>
  );
}

function SpiccoPill({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="130" height="60" rx="30" fill={surface} stroke={accent} />
      <g stroke={accent} strokeWidth="5" strokeLinecap="round" fill="none">
        <line x1={x + 31} y1={y + 18} x2={x + 31} y2={y + 42} />
        <line x1={x + 20.6} y1={y + 24} x2={x + 41.4} y2={y + 36} />
        <line x1={x + 20.6} y1={y + 36} x2={x + 41.4} y2={y + 24} />
      </g>
      <text x={x + 55} y={y + 36} fill={ink} fontSize="17" fontWeight="800">
        Spicco
      </text>
    </g>
  );
}

function AtsBox({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="150" height="60" rx="14" fill={surface} stroke={ink} strokeOpacity="0.12" />
      <text x={x + 75} y={y + 36} textAnchor="middle" fill={ink} fontSize="17" fontWeight="800">
        Il vostro ATS
      </text>
    </g>
  );
}

function StepLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fill={accentStrong} fontSize="15" fontWeight="500">
      {children}
    </text>
  );
}

function HorizontalFlow({ animate }: { animate: boolean }) {
  return (
    <svg viewBox="0 0 760 210" role="img" aria-label={ARIA_LABEL} className="h-auto w-full">
      <defs>
        <FlowArrowMarker id="flow-arrow-h" />
      </defs>

      {/* Punto animato, disegnato sotto le stazioni: scorre solo in avanti */}
      {animate && (
        <circle r="7" fill={accentStrong}>
          <animateMotion dur="4s" repeatCount="indefinite" path="M40,90 L720,90" />
        </circle>
      )}

      {/* Le due frecce, solo in avanti */}
      <g stroke={accent} strokeWidth="2" markerEnd="url(#flow-arrow-h)">
        <line x1="170" y1="90" x2="300" y2="90" />
        <line x1="455" y1="90" x2="585" y2="90" />
      </g>

      <SpiccoPill x={40} y={60} />
      <AtsBox x={305} y={60} />
      <SpiccoPill x={590} y={60} />

      {/* Cosa succede in ogni passaggio */}
      <StepLabel x={105} y={152}>
        La candidatura
      </StepLabel>
      <StepLabel x={380} y={152}>
        La gestione del candidato
      </StepLabel>
      <StepLabel x={655} y={152}>
        Il feedback al candidato
      </StepLabel>

      <text
        x="380"
        y="200"
        textAnchor="middle"
        fill={accentStrong}
        fontSize="12"
        fontWeight="500"
        letterSpacing="0.5"
      >
        {AXS_LABEL}
      </text>
    </svg>
  );
}

function VerticalFlow({ animate }: { animate: boolean }) {
  return (
    <svg viewBox="0 0 360 480" role="img" aria-label={ARIA_LABEL} className="h-auto w-full">
      <defs>
        <FlowArrowMarker id="flow-arrow-v" />
      </defs>

      {animate && (
        <circle r="7" fill={accentStrong}>
          <animateMotion dur="4s" repeatCount="indefinite" path="M180,40 L180,370 " />
        </circle>
      )}

      <g stroke={accent} strokeWidth="2" markerEnd="url(#flow-arrow-v)">
        <line x1="180" y1="112" x2="180" y2="156" />
        <line x1="180" y1="257" x2="180" y2="301" />
      </g>

      <SpiccoPill x={115} y={20} />
      <StepLabel x={180} y={104}>
        La candidatura
      </StepLabel>

      <AtsBox x={105} y={165} />
      <StepLabel x={180} y={249}>
        La gestione del candidato
      </StepLabel>

      <SpiccoPill x={115} y={310} />
      <StepLabel x={180} y={394}>
        Il feedback al candidato
      </StepLabel>

      <text
        x="180"
        y="452"
        textAnchor="middle"
        fill={accentStrong}
        fontSize="12"
        fontWeight="500"
        letterSpacing="0.5"
      >
        {AXS_LABEL}
      </text>
    </svg>
  );
}

export default function AxsDiagram() {
  const animate = usePrefersMotion();

  return (
    <>
      <div className="hidden sm:block">
        <HorizontalFlow animate={animate} />
      </div>
      <div className="mx-auto max-w-xs sm:hidden">
        <VerticalFlow animate={animate} />
      </div>
    </>
  );
}
