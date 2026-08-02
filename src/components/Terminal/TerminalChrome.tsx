interface TerminalChromeProps {
  title?: string;
}

/**
 * The title bar for the fake terminal window: traffic-light window
 * controls on the left, session label centered.
 */
export default function TerminalChrome({ title = "guest@sohan-portfolio: ~" }: TerminalChromeProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-glass bg-white/[0.02] rounded-t-2xl">
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
        <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
      </div>
      <p className="font-mono text-xs text-ink-faint select-none absolute left-1/2 -translate-x-1/2 hidden sm:block">
        {title}
      </p>
      <span className="text-[10px] font-mono text-term-greenDim/70 tracking-wider">zsh</span>
    </div>
  );
}
