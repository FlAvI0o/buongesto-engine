import React, { useMemo } from "react";

type FramerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Framer({ children, className = "" }: FramerProps) {
  // Helper to get a random number within a range
  const jitter = (base: number, range: number) => base + (Math.random() * range - range / 2);

  // Generate 4 unique paths (one for each corner)
  const paths = useMemo(() => {
    const generatePath = (type: "TL" | "TR" | "BL" | "BR") => {
      const size = 80;
      const thickness = jitter(10, 4); // Randomize thickness slightly per refresh
      
      // We create a "sketchy" L-shape using a Quadratic Bezier Curve
      // Points: Start, Control (the corner bend), End
      let d = "";
      if (type === "TL") d = `M ${jitter(size, 10)} ${jitter(6, 2)} Q ${jitter(6, 4)} ${jitter(6, 4)} ${jitter(6, 2)} ${jitter(size, 10)}`;
      if (type === "TR") d = `M ${jitter(0, 10)} ${jitter(6, 2)} Q ${jitter(size - 6, 4)} ${jitter(6, 4)} ${jitter(size - 6, 2)} ${jitter(size, 10)}`;
      if (type === "BL") d = `M ${jitter(size, 10)} ${jitter(size - 6, 2)} Q ${jitter(6, 4)} ${jitter(size - 6, 4)} ${jitter(6, 2)} ${jitter(0, 10)}`;
      if (type === "BR") d = `M ${jitter(0, 10)} ${jitter(size - 6, 2)} Q ${jitter(size - 6, 4)} ${jitter(size - 6, 4)} ${jitter(size - 6, 2)} ${jitter(0, 10)}`;

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
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="filter drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]">
      <path
        d={pathData}
        stroke="#7c3aed"
        strokeWidth={thickness}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />
    </svg>
  );

  return (
    <div className={`relative p-12 ${className}`}>
      {/* Randomized Corners */}
      <div className="absolute top-0 left-0">
        <CornerSVG pathData={paths.tl.d} thickness={paths.tl.thickness} />
      </div>
      <div className="absolute top-0 right-0">
        <CornerSVG pathData={paths.tr.d} thickness={paths.tr.thickness} />
      </div>
      <div className="absolute bottom-0 left-0">
        <CornerSVG pathData={paths.bl.d} thickness={paths.bl.thickness} />
      </div>
      <div className="absolute bottom-0 right-0">
        <CornerSVG pathData={paths.br.d} thickness={paths.br.thickness} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[350px]">
        {children}
      </div>
    </div>
  );
}