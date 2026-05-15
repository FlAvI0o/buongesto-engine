import { useState, useEffect, useRef } from "react";

export function useScroll(threshold: number = 0) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [velocity, setVelocity] = useState(0);
  const [y, setY] = useState(0);

  const lastY = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const now = performance.now();

      // isScrolled
      setIsScrolled(currentY > threshold);

      // direction
      if (currentY > lastY.current) {
        setDirection("down");
      } else if (currentY < lastY.current) {
        setDirection("up");
      }

      // velocity (px per ms)
      const deltaY = Math.abs(currentY - lastY.current);
      const deltaTime = now - lastTime.current;
      const v = deltaY / deltaTime;
      setVelocity(v);

      // store
      lastY.current = currentY;
      lastTime.current = now;
      setY(currentY);
    };

    handleScroll(); // run once on mount
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { isScrolled, direction, velocity, y };
}
