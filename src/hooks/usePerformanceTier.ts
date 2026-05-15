import { useState, useEffect } from 'react';

type Tier = 'EVALUATING' | 'HIGH' | 'LOW';

export function usePerformanceTier(): Tier {
  const [tier, setTier] = useState<Tier>('EVALUATING');

  useEffect(() => {
    let frameCount = 0;
    let startTime = 0;
    let animationFrameId: number;
    let isWarm = false;

    const measureFPS = (time: number) => {
      // 1. Fase di Warmup: Aspettiamo che la GPU abbia compilato gli shader
      if (!isWarm) {
        startTime = time;
        isWarm = true;
        animationFrameId = requestAnimationFrame(measureFPS);
        return;
      }

      frameCount++;
      const elapsed = time - startTime;

      // 2. Fase di Misurazione: Valutiamo per 1.5 secondi
      if (elapsed > 1500) {
        const fps = (frameCount / elapsed) * 1000;
        
        // Se tiene i 50+ FPS costanti, è un dispositivo ad alte prestazioni
        if (fps > 50) {
          setTier('HIGH');
        } else {
          setTier('LOW');
        }
        return; // Fine della misurazione
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    // Diamo 500ms di respiro al browser prima di iniziare a contare
    const warmupTimeout = setTimeout(() => {
      animationFrameId = requestAnimationFrame(measureFPS);
    }, 500);

    return () => {
      clearTimeout(warmupTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return tier;
}