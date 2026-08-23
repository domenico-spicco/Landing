import type { ReactNode } from "react";

/** Finestra browser minimale: barra con tre pallini, angoli arrotondati, ombra morbida. */
export default function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_8px_32px_rgba(26,26,24,0.12)]">
      <div className="flex items-center gap-1.5 border-b border-ink/10 px-4 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
      </div>
      {children}
    </div>
  );
}
