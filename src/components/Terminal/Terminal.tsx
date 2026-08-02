import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TerminalChrome from "./TerminalChrome";
import { profile } from "@/data/profile";
import { runCommand, isKnownCommand } from "@/data/terminalCommands";
import type { TerminalLine } from "@/types";

const BOOT_SCRIPT: TerminalLine[] = [
  { type: "input", content: "whoami" },
  { type: "output", content: profile.name },
  { type: "input", content: "role" },
  { type: "output", content: profile.role },
  { type: "output", content: profile.institution },
  { type: "input", content: "interests" },
  { type: "output", content: profile.interests.join(", ") },
  { type: "input", content: "status" },
  { type: "output", content: profile.status },
];

/** Types a single line of text character by character, then calls onDone. */
function TypedLine({
  text,
  speed = 26,
  onDone,
  prefix,
  className,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
  prefix?: string;
  className?: string;
}) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    if (text.length === 0) {
      onDone?.();
      return;
    }
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className={className}>
      {prefix}
      {shown}
    </span>
  );
}

export default function Terminal({ onNavigate }: { onNavigate: (sectionId: string) => void }) {
  const [bootIndex, setBootIndex] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const [revealedBoot, setRevealedBoot] = useState<TerminalLine[]>([]);

  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [busyTyping, setBusyTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Advance boot sequence: reveal one line at a time.
  useEffect(() => {
    if (bootIndex >= BOOT_SCRIPT.length) {
      setBootComplete(true);
      return;
    }
  }, [bootIndex]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [revealedBoot, history, bootIndex]);

  function handleBootLineDone() {
    setRevealedBoot((prev) => [...prev, BOOT_SCRIPT[bootIndex]]);
    setTimeout(() => setBootIndex((i) => i + 1), 220);
  }

  function focusInput() {
    inputRef.current?.focus();
  }

  function executeCommand(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, { type: "input", content: trimmed }]);
    setInput("");

    const result = runCommand(trimmed);

    if (result.action === "clear") {
      setHistory([]);
      return;
    }

    setBusyTyping(true);
    setHistory((prev) => [
      ...prev,
      ...result.lines.map((line): TerminalLine => ({ type: "output", content: line })),
    ]);
    setBusyTyping(false);

    if (result.navigateTo) {
      setTimeout(() => onNavigate(result.navigateTo as string), 350);
    }
    if (result.action === "open-resume") {
      setTimeout(() => window.open(profile.resumeUrl, "_blank"), 350);
    }
    if (result.action === "open-link" && result.href) {
      setTimeout(() => window.open(result.href, "_blank", "noopener,noreferrer"), 350);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    executeCommand(input);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className="glass-panel shadow-glow overflow-hidden"
        onClick={focusInput}
        role="presentation"
      >
        <TerminalChrome />
        <div
          ref={scrollRef}
          className="font-mono text-[13px] sm:text-sm leading-relaxed px-5 py-5 h-[340px] sm:h-[380px] overflow-y-auto"
        >
          {/* Boot sequence */}
          {revealedBoot.map((line, idx) =>
            line.type === "input" ? (
              <div key={`boot-${idx}`} className="text-ink-primary">
                <span className="text-term-greenDim">$ </span>
                {line.content}
              </div>
            ) : (
              <div key={`boot-${idx}`} className="text-term-green pl-0 mb-2">
                {line.content}
              </div>
            )
          )}

          {!bootComplete && bootIndex < BOOT_SCRIPT.length && (
            <div>
              {BOOT_SCRIPT[bootIndex].type === "input" ? (
                <div className="text-ink-primary">
                  <span className="text-term-greenDim">$ </span>
                  <TypedLine text={BOOT_SCRIPT[bootIndex].content} onDone={handleBootLineDone} />
                  <span className="caret animate-blink" />
                </div>
              ) : (
                <div className="text-term-green mb-2">
                  <TypedLine text={BOOT_SCRIPT[bootIndex].content} speed={14} onDone={handleBootLineDone} />
                </div>
              )}
            </div>
          )}

          {/* Interactive history */}
          {bootComplete &&
            history.map((line, idx) =>
              line.type === "input" ? (
                <div key={`h-${idx}`} className="text-ink-primary mt-1">
                  <span className="text-term-greenDim">$ </span>
                  {line.content}
                </div>
              ) : (
                <div key={`h-${idx}`} className="text-ink-muted whitespace-pre-wrap">
                  {line.content}
                </div>
              )
            )}

          {/* Live prompt */}
          {bootComplete && (
            <form onSubmit={handleSubmit} className="flex items-center mt-1">
              <span className="text-term-greenDim mr-1">$</span>
              <input
                ref={inputRef}
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal command input"
                placeholder="type 'help'"
                className="flex-1 bg-transparent outline-none text-ink-primary placeholder:text-ink-faint caret-term-green"
                disabled={busyTyping}
              />
              <span className="caret animate-blink" aria-hidden="true" />
            </form>
          )}
        </div>
      </div>

      {/* Quick command chips */}
      {bootComplete && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center" role="group" aria-label="Quick terminal commands">
          {["about", "skills", "projects", "resume", "contact"].map((c) => (
            <button
              key={c}
              onClick={() => executeCommand(c)}
              className="font-mono text-xs px-3 py-1.5 rounded-full border border-border-glass text-ink-muted hover:text-term-green hover:border-term-green/50 transition-colors bg-white/[0.02]"
              disabled={!isKnownCommand(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
