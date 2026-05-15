import React, { useMemo } from "react";

type FramerProps = {
  children?: React.ReactNode;
  className?: string;
};

export function Framer({ children, className = "" }: FramerProps) {
  // Helper to get a random number within a range
  const jitter = (base: number, range: number) => base + (Math.random() * range - range / 2);

  // CONFIGURATION FOR PAGE-SCALE
  const INSET = 40; // Pixels to push away from the screen edge
  const SIZE = 120; // Larger corner size for editorial feel
  const BASE_THICKNESS = 16; // Chunky, confident lines

  const paths = useMemo(() => {
    const generatePath = (type: "TL" | "TR" | "BL" | "BR") => {
      // Thicker jitter for hand-drawn but premium feel
      const thickness = jitter(BASE_THICKNESS, 4); 
      
      let d = "";
      // Quadratic Bezier curves with larger scale and randomized "hand-forged" pull
      if (type === "TL") d = `M ${jitter(SIZE, 15)} ${jitter(8, 2)} Q ${jitter(8, 5)} ${jitter(8, 5)} ${jitter(8, 2)} ${jitter(SIZE, 15)}`;
      if (type === "TR") d = `M ${jitter(0, 15)} ${jitter(8, 2)} Q ${jitter(SIZE - 8, 5)} ${jitter(8, 5)} ${jitter(SIZE - 8, 2)} ${jitter(SIZE, 15)}`;
      if (type === "BL") d = `M ${jitter(SIZE, 15)} ${jitter(SIZE - 8, 2)} Q ${jitter(8, 5)} ${jitter(SIZE - 8, 5)} ${jitter(8, 2)} ${jitter(0, 15)}`;
      if (type === "BR") d = `M ${jitter(0, 15)} ${jitter(SIZE - 8, 2)} Q ${jitter(SIZE - 8, 5)} ${jitter(SIZE - 8, 5)} ${jitter(SIZE - 8, 2)} ${jitter(0, 15)}`;

      return { d, thickness };
    };

    return {
      tl: generatePath("TL"),
      tr: generatePath("TR"),
      bl: generatePath("BL"),
      br: generatePath("BR"),
    };
  }, []);

  const CornerSVG = ({ pathData, thickness }: { pathData: string, thickness: number }) => (
    <svg 
      width={SIZE + 20} 
      height={SIZE + 20} 
      viewBox={`0 0 ${SIZE + 20} ${SIZE + 20}`} 
      fill="none" 
      // Using df-primary color logic
      className="filter drop-shadow-[0_0_25px_rgba(147,51,234,0.3)]" 
    >
      <path
        d={pathData}
        stroke="#9333ea" // Updated to df.primary
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-100"
      />
    </svg>
  );

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Randomized Corners with Inset Positioning */}
      <div className="absolute" style={{ top: INSET, left: INSET }}>
        <CornerSVG pathData={paths.tl.d} thickness={paths.tl.thickness} />
      </div>
      <div className="absolute" style={{ top: INSET, right: INSET }}>
        <CornerSVG pathData={paths.tr.d} thickness={paths.tr.thickness} />
      </div>
      <div className="absolute" style={{ bottom: INSET, left: INSET }}>
        <CornerSVG pathData={paths.bl.d} thickness={paths.bl.thickness} />
      </div>
      <div className="absolute" style={{ bottom: INSET, right: INSET }}>
        <CornerSVG pathData={paths.br.d} thickness={paths.br.thickness} />
      </div>

      {/* Content Area */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}