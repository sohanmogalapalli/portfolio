import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: string;
  delay: string;
  opacity: number;
}

/**
 * Ambient floating dots rendered with pure CSS animation (no per-frame JS),
 * kept to a small count to stay performant. Disabled entirely when the
 * user prefers reduced motion.
 */
export default function ParticleField({ count = 22 }: { count?: number }) {
  const shouldReduceMotion = useReducedMotion();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 1,
      duration: `${6 + Math.random() * 8}s`,
      delay: `${Math.random() * 6}s`,
      opacity: Math.random() * 0.4 + 0.15,
    }));
  }, [count]);

  if (shouldReduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-term-green animate-float"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: p.duration,
            animationDelay: p.delay,
            boxShadow: "0 0 6px rgba(74,222,128,0.6)",
          }}
        />
      ))}
    </div>
  );
}
