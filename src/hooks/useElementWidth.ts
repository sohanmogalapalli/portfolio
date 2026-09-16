import { useEffect, useState } from "react";

/**
 * Tracks an element's rendered width via ResizeObserver. Used to size the
 * contribution grid so its ~53 week columns always fit the container instead
 * of overflowing and looking clipped.
 */
export function useElementWidth<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!element) return;

    const measure = () => setWidth(element.getBoundingClientRect().width);

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [element]);

  return { ref: setElement, width };
}
