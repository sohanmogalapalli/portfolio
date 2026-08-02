import { useEffect, useState } from "react";

/**
 * Types out a string character by character.
 * Returns the currently visible substring and whether typing has finished.
 */
export function useTypewriter(fullText: string, speedMs = 28, startDelayMs = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    let index = 0;
    let interval: ReturnType<typeof setInterval>;

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        index += 1;
        setDisplayed(fullText.slice(0, index));
        if (index >= fullText.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speedMs);
    }, startDelayMs);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [fullText, speedMs, startDelayMs]);

  return { displayed, done };
}
