/**
 * Diagramma Sezione 5: l'ATS del cliente al centro, Spicco come layer intorno
 * con i quattro momenti disposti sul percorso. Palette del design system.
 */
export default function AxsDiagram() {
  const moments = [
    { label: "La job giusta", x: 143, y: 120, dy: -26 },
    { label: "La pagina", x: 497, y: 120, dy: -26 },
    { label: "La conversazione", x: 497, y: 360, dy: 38 },
    { label: "Il feedback", x: 143, y: 360, dy: 38 },
  ] as const;

  return (
    <svg
      viewBox="0 0 640 480"
      role="img"
      aria-label="Diagramma: il vostro ATS al centro, Spicco come layer di esperienza intorno, con i quattro momenti del percorso del candidato"
      className="h-auto w-full"
    >
      <ellipse
        cx="320"
        cy="240"
        rx="250"
        ry="170"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
      />

      {moments.map((m) => (
        <g key={m.label}>
          <circle cx={m.x} cy={m.y} r="7" fill="var(--accent)" />
          <circle cx={m.x} cy={m.y} r="12" fill="none" stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="2" />
          <text
            x={m.x}
            y={m.y + m.dy}
            textAnchor="middle"
            fill="var(--ink)"
            fontSize="17"
            fontWeight="700"
          >
            {m.label}
          </text>
        </g>
      ))}

      <rect x="216" y="206" width="208" height="68" rx="14" fill="var(--surface)" stroke="var(--ink)" strokeOpacity="0.12" />
      <text x="320" y="247" textAnchor="middle" fill="var(--ink)" fontSize="19" fontWeight="800">
        Il vostro ATS
      </text>

      <rect x="284" y="54" width="72" height="32" rx="16" fill="var(--surface)" stroke="var(--accent)" />
      <text x="320" y="75" textAnchor="middle" fill="var(--accent-strong)" fontSize="15" fontWeight="700">
        Spicco
      </text>

      <text
        x="320"
        y="446"
        textAnchor="middle"
        fill="var(--accent-strong)"
        fontSize="12"
        fontWeight="500"
        letterSpacing="0.5"
      >
        AXS · Applicant Experience System
      </text>
    </svg>
  );
}
