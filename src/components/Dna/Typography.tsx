import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

// Il Titolo Monumentale (Tenor Sans)
export const HeroText: React.FC<TextProps> = ({ children, className = "" }) => (
  <h1 className={`font-sans text-hero text-black uppercase leading-[0.9] tracking-[0.1em] ${className}`}>
    {children}
  </h1>
);

// Il Testo di Supporto (Elegante e leggero)
export const Lead: React.FC<TextProps> = ({ children, className = "" }) => (
  <p className={`font-sans text-lg md:text-xl text-black/60 font-light leading-relaxed tracking-wide ${className}`}>
    {children}
  </p>
);

// La micro-copy tecnica (JetBrains Mono)
export const Meta: React.FC<TextProps> = ({ children, className = "" }) => (
  <span className={`font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-black/40 ${className}`}>
    {children}
  </span>
);