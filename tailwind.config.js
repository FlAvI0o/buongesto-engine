/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* ----------------------------------------
         1. THE LUXURY PALETTE (Unchanged)
      ---------------------------------------- */
      colors: {
        df: {
          obsidian: "#050404", 
          charcoal: "#2a2a2a", 
          steel: "#888888",    
          vapor: "#f8f5ff",    
          alabaster: "#ffffff",
        },
      },

      /* ----------------------------------------
         2. TYPOGRAPHY (Unchanged)
      ---------------------------------------- */
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Tenor Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      
      fontSize: {
        'display': ['clamp(3.5rem, 8vw, 7.5rem)', { lineHeight: '0.9', letterSpacing: '-0.05em' }],
        'hero': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.3em', textTransform: 'uppercase' }],
      },

      /* ----------------------------------------
         3. CINEMATIC PHYSICS (The Upgrade)
      ---------------------------------------- */
      transitionTimingFunction: {
        // The "Rolex" Ease: Sharper start, longer settle. 
        // Feels more expensive than standard ease-out.
        "df-luxury": "cubic-bezier(0.2, 0.8, 0.2, 1)", 
        
      },

      keyframes: {
        // [FIXED] GLASS REVEAL: Now handles Opacity + Blur + Unroll
        "glass-reveal": {
          "0%": { 
            opacity: "0",                     // <--- ADDED: Starts invisible
            backdropFilter: "blur(0px)", 
            backgroundColor: "rgba(255, 255, 255, 0)",
            clipPath: "inset(0 0 100% 0)" 
          },
          "100%": { 
            opacity: "1",                     // <--- ADDED: Ends visible
            backdropFilter: "blur(12px)", 
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            clipPath: "inset(0 0 0% 0)" 
          },
        },
        
        // [ENHANCED] RISE LUXURY: Heavier start (80px) for more drama
        "rise-luxury": {
          "0%": { opacity: "0", transform: "translateY(80px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

        // [ENHANCED] DRAW LINE: Smoother scale up
        "draw-line": {
          "0%": { scale: "0 1", opacity: "0" },
          "100%": { scale: "1 1", opacity: "1" },
        },
        
        // [ENHANCED] GRAIN: Slower, more organic shift
        "grain-shift": {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-5%, -5%)" },
        },

        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        }
      },

      animation: {
        // The "Grid" (Structure)
        "reveal-grid": "draw-line 2.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        
        // The "Voice" (Headline)
        "rise-monolith": "rise-luxury 2.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        
        // The "Atmosphere" (Right Panel)
        "glass-morph": "glass-reveal 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        
        // The "Data" (Metadata)
        "fade-whisper": "fade-in 2s ease-out forwards",
        
        // The "Life" (Background)
        "grain": "grain-shift 12s steps(10) infinite", // Slower = More "Film" like
      },
    },
  },
  plugins: [],
};