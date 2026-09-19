import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import Terminal from "@/components/Terminal/Terminal";
import ParticleField from "@/components/ui/ParticleField";

export default function Hero() {
  function handleNavigate(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 bg-grid-fade" aria-hidden="true" />
      <ParticleField />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="eyebrow mb-4 text-center"
      >
        
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-center font-mono font-extrabold text-2xl sm:text-4xl md:text-6xl tracking-tight text-ink-primary mb-3"
      >
        Hi, I'm <span className="text-term-green">Sohan</span>
        <span className="text-term-greenDim">.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12 }}
        className="text-center text-ink-muted max-w-md mb-8 sm:mb-10 text-xs sm:text-base"
      >
        Type a command below, or just watch the session run itself.
      </motion.p>

      <Terminal onNavigate={handleNavigate} />

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        onClick={() => handleNavigate("about")}
        className="mt-10 sm:mt-14 flex flex-col items-center gap-2 text-ink-faint hover:text-term-green transition-colors"
        aria-label="Scroll to explore the portfolio"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.3em]">scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiChevronDown className="text-lg" />
        </motion.span>
      </motion.button>
    </section>
  );
}
