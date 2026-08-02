import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiFolder } from "react-icons/fi";
import type { Project } from "@/types";
import GlassPanel from "./GlassPanel";

const ACCENT_MAP = {
  green: { text: "text-term-green", border: "hover:border-term-green/40", glow: "hover:shadow-glowSoft" },
  cyan: { text: "text-term-cyan", border: "hover:border-term-cyan/40", glow: "" },
  amber: { text: "text-term-amber", border: "hover:border-term-amber/40", glow: "" },
} as const;

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accent = ACCENT_MAP[project.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <GlassPanel className={`p-6 sm:p-7 h-full flex flex-col transition-all duration-300 ${accent.border} ${accent.glow}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiFolder className={`text-lg ${accent.text}`} />
            <h3 className="font-mono text-lg font-semibold text-ink-primary">{project.title}</h3>
          </div>
          <span
            className={`text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full border ${
              project.status === "shipped"
                ? "text-term-green border-term-green/30"
                : "text-term-amber border-term-amber/30"
            }`}
          >
            {project.status === "shipped" ? "shipped" : "in progress"}
          </span>
        </div>

        <p className={`font-mono text-xs mb-3 ${accent.text}`}>{project.tagline}</p>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">{project.description}</p>

        <div className="mb-4">
          <p className="font-mono text-[11px] text-ink-faint uppercase tracking-wider mb-2">Key features</p>
          <ul className="space-y-1.5">
            {project.features.map((f) => (
              <li key={f} className="text-sm text-ink-muted flex gap-2">
                <span className={accent.text}>▸</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-5">
          <p className="font-mono text-[11px] text-ink-faint uppercase tracking-wider mb-2">Challenge solved</p>
          <p className="text-sm text-ink-muted leading-relaxed">{project.challenges}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] px-2 py-1 rounded-md bg-white/[0.04] text-ink-muted border border-white/[0.06]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-3">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 font-mono text-xs px-4 py-2.5 rounded-lg border border-border-glass text-ink-primary hover:border-term-green/50 hover:text-term-green transition-colors"
          >
            <FiGithub /> Code
          </a>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 font-mono text-xs px-4 py-2.5 rounded-lg bg-term-green/10 text-term-green border border-term-green/30 hover:bg-term-green/20 transition-colors"
            >
              <FiExternalLink /> Live demo
            </a>
          ) : (
            <span className="flex-1 flex items-center justify-center gap-2 font-mono text-xs px-4 py-2.5 rounded-lg border border-white/[0.06] text-ink-faint cursor-not-allowed">
              <FiExternalLink /> In progress
            </span>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  );
}
