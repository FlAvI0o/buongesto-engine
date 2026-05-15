import React from 'react';

interface CornerButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const CornerButton: React.FC<CornerButtonProps> = ({ 
  onClick, 
  children, 
  className = "" 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`relative group px-12 py-5 bg-transparent flex items-center justify-center transition-all duration-1000 ${className}`}
    >
      {/* I MIRINI (CORNER BRACKETS) - IL SIGILLO IMMOBILE */}
      {/* Nessun translate. Solo transizione di colore (40% -> 90%) */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-df-obsidian/40 group-hover:border-df-obsidian/90 transition-colors duration-700" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-df-obsidian/40 group-hover:border-df-obsidian/90 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-df-obsidian/40 group-hover:border-df-obsidian/90 transition-colors duration-700" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-df-obsidian/40 group-hover:border-df-obsidian/90 transition-colors duration-700" />

      {/* IL TESTO BASE */}
      {/* Rallentato a 2000ms */}
      <span className="relative z-10 font-mono text-[9px] uppercase tracking-[0.4em] text-df-obsidian/60 group-hover:text-df-obsidian transition-colors duration-[2000ms]">
        {children}
      </span>

      {/* LA CAMERA STAGNA PER IL RAGGIO DI LUCE */}
      {/* Sigillata internamente per non tagliare i mirini quando si espandono */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-none">
        <div 
          className="absolute inset-0 z-20 skew-x-12 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-[2500ms] ease-in-out"
          style={{
            background: "linear-gradient(to right, transparent, rgba(5, 4, 4, 0.15), transparent)"
          }}
        />
      </div>
      
    </button>
  );
};