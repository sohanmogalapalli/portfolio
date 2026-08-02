import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTerminal, FiMenu, FiX } from "react-icons/fi";

const LINKS = [
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "projects", label: "projects" },
  { id: "github-stats", label: "github" },
  { id: "contact", label: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl"
    >
      <nav
        className={`flex items-center justify-between gap-4 px-4 sm:px-5 py-2.5 rounded-full border transition-all duration-300 font-mono ${
          scrolled
            ? "bg-base/80 backdrop-blur-xl border-border-glass shadow-panel"
            : "bg-white/[0.02] backdrop-blur-md border-white/[0.06]"
        }`}
        aria-label="Primary"
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 text-term-green text-sm font-semibold"
          aria-label="Back to top"
        >
          <FiTerminal className="text-base" />
          <span className="hidden sm:inline">sohan@dev</span>
        </button>

        <ul className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => goTo(link.id)}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  active === link.id
                    ? "text-term-green bg-term-green/10"
                    : "text-ink-muted hover:text-ink-primary"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-ink-primary text-lg"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 glass-panel md:hidden p-3 flex flex-col gap-1 font-mono"
        >
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => goTo(link.id)}
              className="text-left px-3 py-2 text-sm rounded-lg text-ink-muted hover:text-term-green hover:bg-white/[0.04]"
            >
              {link.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
