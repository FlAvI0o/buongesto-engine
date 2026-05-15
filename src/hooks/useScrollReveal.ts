// src/hooks/useScrollReveal.ts
import { useState, useEffect, useRef } from "react";

export function useScrollReveal(threshold = 0.2) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  // Updated to match your new DeckForge Motion Layer
  return { ref, active, className: `df-reveal ${active ? "df-reveal-active" : ""}` };
}