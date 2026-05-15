import { useEffect } from "react";
import Lenis from "lenis";

type DiagnosisLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

// Layout con smooth scroll ma SENZA background 3D
export function DiagnosisLayout({ children, className = "" }: DiagnosisLayoutProps) {
  useEffect(() => {
    // 1. INIZIALIZZAZIONE DELLO SCROLL DI LUSSO (Lenis)
    const lenis = new Lenis({
      // lerp lega matematicamente la pagina alla tua rotella. 
      // 0.1 significa che frena quasi subito e morbidamente, senza farti slittare.
      lerp: 0.1, 
      smoothWheel: true,
      wheelMultiplier: 1, // Rimesso a 1 così scende di una quantità naturale
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => { 
      // Distruzione del motore al cambio pagina
      lenis.destroy();
    };
  }, []);

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* NIENTE CANVAS DEL BACKGROUND QUI */}
      <main>
        {children}
      </main>
    </div>
  );
}