import { useEffect } from "react";

const DEFAULT_TITLE = "Spicco — Vincete i candidati migliori. Senza perdere tutti gli altri.";

export default function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ?? DEFAULT_TITLE;
    if (description) {
      const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (meta) meta.content = description;
    }
  }, [title, description]);
}
