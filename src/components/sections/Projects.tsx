import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section id="projects" className="relative px-4 sm:px-6 py-24 md:py-32 max-w-6xl mx-auto" aria-label="Projects">
      <Reveal>
        <SectionLabel comment="ls projects/ --detailed" title="Projects" />
      </Reveal>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
