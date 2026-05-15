import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CornerButton } from "../Dna/Buttons/CornerButton"; 
import { Link } from "react-router-dom";

interface ClaritySphereProps {
  delayStart?: number;
}

export default function ClaritySphere({ delayStart = 0 }: ClaritySphereProps) {
  const [stage, setStage] = useState("void");

  useEffect(() => {
    const start = setTimeout(() => {
      setStage("arrival");
      setTimeout(() => setStage("breath"), 900);
      
      setTimeout(() => {
        setStage("fossil");
        window.dispatchEvent(new CustomEvent("df-camera-push", { detail: "deep" }));
      }, 2100);

      setTimeout(() => setStage("content"), 3300);
    }, delayStart);

    return () => {
      clearTimeout(start);
      window.dispatchEvent(new CustomEvent("df-camera-push", { detail: "normal" }));
    };
  }, [delayStart]);

  return (
    <div className="relative w-full h-screen bg-transparent overflow-hidden flex items-center justify-center font-sans selection:bg-df-primary selection:text-white">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          stage === "arrival"
            ? { opacity: 1, scale: 1, y: 0 }
            : stage === "breath"
            ? { scale: 1.05 }
            : (stage === "fossil" || stage === "content")
            ? { opacity: 1, scale: 1.9, y: -50 }
            : { opacity: 1, scale: 1 }
        }
        transition={
          stage === "breath"
            ? { duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
            : { duration: 1.0, ease: [0.22, 1, 0.36, 1], repeat: 0 }
        }
        // AGGIUNTO: Ottimizzazione hardware senza causare blur
        style={{ 
          backfaceVisibility: "hidden", 
          WebkitFontSmoothing: "antialiased" 
        }}
        className="absolute z-10 flex items-center justify-center"
      >
        <div className="relative w-[320px] h-[320px] md:w-[520px] md:h-[520px] flex items-center justify-center">
          
          <motion.div 
            animate={{
              opacity: (stage === "fossil" || stage === "content") ? 0.08 : 1,
              filter: (stage === "fossil" || stage === "content") ? "grayscale(100%)" : "none",
            }}
            transition={{ duration: 0.8 }}
            // AGGIUNTO: Delega il calcolo dei filtri pesanti alla GPU
            style={{ willChange: "opacity, filter" }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-100 to-white shadow-[25px_25px_70px_#d1d1d1,-25px_-25px_70px_#ffffff] overflow-hidden"
          >
            <div className="absolute inset-0 rounded-full bg-black/5 mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/70 via-transparent to-transparent opacity-60 pointer-events-none" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{
              // Rimane a 0 per TUTTE le fasi iniziali (void, arrival, breath). 
              // Si intravede a 0.25 solo durante l'esplosione, e va a 1 quando si assesta.
              opacity: (stage === "fossil") ? 0.25 : (stage === "content") ? 1 : 0
            }}
            transition={{ duration: stage === "content" ? 1.2 : 0.8 }}
            style={{ willChange: "opacity" }}
            className="relative z-10 flex flex-col items-center justify-center space-y-4"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-df-steel">
              DeckForge
            </span>

            <motion.h2
              className="font-sans uppercase tracking-[0.6em] font-light text-3xl md:text-5xl text-center leading-[1.1]"
              animate={{
                // Usa i nuovi codici HEX per df-obsidian e df-steel
                color: stage === "content" ? "#050404" : "#888888" 
              }}
              transition={{ duration: 1.2 }}
              style={{
                WebkitTextStroke: "0px",
                textShadow: "none"
              }}
            >
              VISION<br />COMES<br />FIRST
            </motion.h2>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {stage === "content" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="absolute bottom-[15%] z-30 flex flex-col items-center"
          >
            <Link to="/scheduling">
              <CornerButton > 
                Start the Forge
              </CornerButton>
            </Link>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.5 }}
              className="mt-6 font-mono text-[9px] uppercase tracking-[0.4em] text-df-steel"
            >
              System Ready
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}