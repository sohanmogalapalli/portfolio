import { HTMLAttributes, ReactNode } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

/**
 * Reusable glassmorphism container used across the site for
 * terminal windows, cards, and panels.
 */
export default function GlassPanel({ children, hover = false, className = "", ...rest }: GlassPanelProps) {
  return (
    <div
      className={`glass-panel ${hover ? "glass-panel-hover" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
