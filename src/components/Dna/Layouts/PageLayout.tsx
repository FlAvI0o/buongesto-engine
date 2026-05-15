import { useEffect } from "react";
import Footer from "../Footer.js";
import initBackground from "../Background/HomeBackground.js";
import Lenis from "lenis";

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};
//smooth scroll + background 3D wrapper for pages that need it (Home, Pricing, Clarity, Scheduling)
export function PageLayout({ children, className = "" }: PageLayoutProps) {
  useEffect(() => {
    // 1. INIZIALIZZAZIONE DELLO SCROLL DI LUSSO (Lenis)
    const lenis = new Lenis({
      duration: 1.5, // Più è alto, più è lento e burroso (1.5 è perfetto per il lusso)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva di accelerazione elegante
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Rende la rotella del mouse meno "aggressiva"
      touchMultiplier: 2,   // Su mobile deve rispondere bene al dito
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. INIZIALIZZAZIONE DEL BACKGROUND 3D
    const cleanup = initBackground() as unknown as (() => void) | null;
    
    return () => { 
      // Pulizia quando si cambia pagina per evitare memory leak
      lenis.destroy();
      if (typeof cleanup === "function") cleanup(); 
    };
  }, []);

  return (
    <div className={`relative min-h-screen ${className}`}>
      <canvas
        id="deckforge-bg"
        className="fixed inset-0 w-screen h-screen z-[-1] pointer-events-none contrast-105" 
      />
      <main>
        {children}
      </main>
    </div>
  );
}