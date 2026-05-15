import { useState, useEffect } from "react";

interface ForgeSplashProps {
  onComplete?: () => void;
}

export function ForgeSplash({ onComplete }: ForgeSplashProps) {
  const [phase, setPhase] = useState<
    "text1" | "text2" | "reveal" | "complete"
  >("text1");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text2"), 1000);
    const t2 = setTimeout(() => setPhase("reveal"), 2200);
    const t3 = setTimeout(() => {
      setPhase("complete");
      onComplete?.();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <>
      {phase !== "complete" && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center text-center px-6">
          <div className="space-y-6">
            <h2 className="text-df-dark text-3xl md:text-4xl font-extralight tracking-[0.4em] uppercase italic animate-df-rise-soft">
              The story<span className="text-df-primary font-bold">...</span>
            </h2>

            <h2 className="text-df-dark text-xl md:text-3xl font-black tracking-tighter opacity-0 animate-[df-rise-soft_1.2s_cubic-bezier(0.22,1,0.36,1)_1s_forwards]">
              gets <span className="text-df-primary">funds.</span>
            </h2>
          </div>
        </div>
      )}
    </>
  );
}
