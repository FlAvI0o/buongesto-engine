import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CornerButton } from '@/components/Dna/Buttons/CornerButton'; 
import { OpticalReveal } from '@/components/Dna/OpticalReveal';

const Home: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);

  // Sblocco lo scroll molto prima (1.2 secondi invece di 4.5) per renderlo "snappy"
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLocked(false);
    }, 1200); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full bg-[#F5F5F3] text-[#1A1A1A] ${isLocked ? 'h-[100dvh] overflow-hidden' : 'min-h-screen overflow-x-hidden'}`}>
      
      {/* --- BACKGROUND NOISE --- */}
      <div className="fixed inset-0 z-10 pointer-events-none opacity-[0.04] mix-blend-darken"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* --- SCROLLABLE CONTENT WRAPPER --- */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto border-x border-[#1A1A1A]/5">
        
        {/* =========================================
            SECTION 1: THE MANIFESTO (HERO)
            ========================================= */}
        <section className="min-h-[100dvh] flex flex-col justify-end p-8 lg:p-16 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 lg:divide-x divide-[#1A1A1A]/10 border-b border-[#1A1A1A]/10 pb-16">
            
            <div className="lg:col-span-8 flex flex-col justify-end">
              <h1 className="font-light text-6xl md:text-8xl leading-[1.1] text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                
                {/* Animazioni molto più veloci */}
                <OpticalReveal delay={0.2} duration={1.5} deepFocus={true}>
                  <span className="-mr-[0.1em] block lowercase tracking-tighter">buongesto.</span>
                </OpticalReveal>

                <div className="mt-8">
                  <OpticalReveal delay={0.6} duration={1.2}>
                    <span className="block font-sans text-[12px] tracking-[0.3em] font-light uppercase text-[#1A1A1A]/60" style={{ fontFamily: "'Inter', sans-serif" }}>
                      great cause great things.
                    </span>
                  </OpticalReveal>
                </div>
              </h1>
            </div>

            <div className="lg:col-span-4 lg:pl-16 flex flex-col justify-end gap-12">
              
              {/* PARAGRAFO DESTRO: Copy più amichevole e collaborativo */}
              <div className="font-sans text-[15px] tracking-[0.01em] font-light leading-[1.8] max-w-[340px] text-[#1A1A1A]/80">
                <OpticalReveal delay={0.8} duration={1.2}>
                  a form of digital art to make fundraising more engaging and felt.
                </OpticalReveal>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                <Link to="/apply" className="w-full">
                  <CornerButton className="w-full justify-center border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F5F3] transition-colors">
                    GET IN TOUCH
                  </CornerButton>
                </Link>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 text-center mt-2">
                  Contact us to learn more and join the cause.
                </span>
              </motion.div>
            </div>

          </div>
        </section>


        {/* =========================================
            SECTION 2: IL MESSAGGIO POSITIVO
            ========================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={isLocked ? 'invisible' : 'visible'} 
        >
          <section className="bg-transparent relative">
            <div className="px-8 py-32 lg:px-16 flex flex-col items-center text-center">
               <p className="tracking-[0.2em] font-light text-2xl md:text-4xl leading-[1.2] text-[#1A1A1A] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                 The canvas is ready.
               </p>
               <p className="font-sans text-[15px] tracking-[0.02em] font-light leading-[1.8] max-w-[450px] text-[#1A1A1A]/70 mx-auto">
                 everything goes to the cause. make a piece of art and help us change the world together.
               </p>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="border-t border-[#1A1A1A]/10 px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-transparent">
             <div className="flex items-center gap-6">
               <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/60">
                 Buongesto Engine
               </span>
             </div>
             <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/60">
               Built for good.
             </span>
          </footer>
        </motion.div>

      </div>
    </div>
  );
};

export default Home;