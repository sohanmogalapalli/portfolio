import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import SkillCard from "@/components/ui/SkillCard";
import { skillCategories } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="relative px-4 sm:px-6 py-24 md:py-32 max-w-6xl mx-auto" aria-label="Skills">
      <Reveal>
        <SectionLabel comment="ls -la skills/" title="Skills" />
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {skillCategories.map((cat, i) => (
          <SkillCard key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </section>
  );
}
