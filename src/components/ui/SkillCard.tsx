import { ReactElement } from "react";
import { motion } from "framer-motion";
import { FiCode, FiCpu, FiCloud, FiTool } from "react-icons/fi";
import type { SkillCategory } from "@/types";
import GlassPanel from "./GlassPanel";

const ICONS: Record<string, ReactElement> = {
  code: <FiCode />,
  brain: <FiCpu />,
  cloud: <FiCloud />,
  tool: <FiTool />,
};

export default function SkillCard({ category, index }: { category: SkillCategory; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
    >
      <GlassPanel hover className="p-6 h-full group">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-term-green text-lg group-hover:scale-110 transition-transform">
            {ICONS[category.icon]}
          </span>
          <p className="font-mono text-sm text-ink-primary font-semibold">{category.title}</p>
        </div>
        <p className="font-mono text-[11px] text-ink-faint mb-4">{category.dirName}/</p>

        <ul className="space-y-2">
          {category.skills.map((skill) => (
            <li
              key={skill.name}
              className="flex items-center justify-between font-mono text-sm text-ink-muted group-hover:text-ink-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-term-greenDim">›</span>
                {skill.name}
              </span>
              {skill.level === "learning" && (
                <span className="text-[10px] text-term-amber border border-term-amber/30 rounded px-1.5 py-0.5">
                  learning
                </span>
              )}
            </li>
          ))}
        </ul>
      </GlassPanel>
    </motion.div>
  );
}
