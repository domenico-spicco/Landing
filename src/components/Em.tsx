import type { ReactNode } from "react";

/** Svolta retorica nei titoli: Newsreader Italic, una occorrenza per sezione. */
export default function Em({ children }: { children: ReactNode }) {
  return <em className="em-turn">{children}</em>;
}
