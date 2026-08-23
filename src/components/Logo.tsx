export function AsteriskMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <g stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" fill="none">
        <line x1="16" y1="4" x2="16" y2="28" />
        <line x1="5.6" y1="10" x2="26.4" y2="22" />
        <line x1="5.6" y1="22" x2="26.4" y2="10" />
      </g>
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <AsteriskMark />
      <span className="text-2xl font-extrabold lowercase leading-none tracking-tight text-ink">
        spicco
      </span>
    </span>
  );
}
