import { FiTarget, FiBookOpen, FiHeart } from "react-icons/fi";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import GlassPanel from "@/components/ui/GlassPanel";
import { profile, education } from "@/data/profile";

export default function About() {
  return (
    <section id="about" className="relative px-4 sm:px-6 py-24 md:py-32 max-w-5xl mx-auto" aria-label="About">
      <Reveal>
        <SectionLabel comment="cat about.md" title="About" />
      </Reveal>

      <div className="grid md:grid-cols-5 gap-6">
        <Reveal className="md:col-span-3" delay={0.05}>
          <GlassPanel className="p-6 sm:p-8 h-full">
            <p className="font-mono text-xs text-term-greenDim mb-4">SUMMARY</p>
            <p className="text-ink-primary leading-relaxed mb-6">{profile.summary}</p>

            <p className="font-mono text-xs text-term-greenDim mb-4">OBJECTIVE</p>
            <p className="text-ink-muted leading-relaxed">{profile.objective}</p>
          </GlassPanel>
        </Reveal>

        <div className="md:col-span-2 flex flex-col gap-6">
          <Reveal delay={0.1}>
            <GlassPanel hover className="p-6">
              <div className="flex items-center gap-2 mb-4 text-term-green">
                <FiBookOpen />
                <p className="font-mono text-xs uppercase tracking-wider">Education</p>
              </div>
              {education.map((e) => (
                <div key={e.institution}>
                  <p className="text-ink-primary font-semibold">{e.institution}</p>
                  <p className="text-ink-muted text-sm">{e.degree}</p>
                  <p className="text-ink-faint text-xs font-mono mt-1">{e.period}</p>
                  <p className="text-ink-muted text-sm mt-3 leading-relaxed">{e.detail}</p>
                </div>
              ))}
            </GlassPanel>
          </Reveal>

          <Reveal delay={0.15}>
            <GlassPanel hover className="p-6">
              <div className="flex items-center gap-2 mb-4 text-term-green">
                <FiHeart />
                <p className="font-mono text-xs uppercase tracking-wider">Interests</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="font-mono text-xs px-2.5 py-1 rounded-md bg-term-green/10 text-term-green border border-term-green/20"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </GlassPanel>
          </Reveal>

          <Reveal delay={0.2}>
            <GlassPanel hover className="p-6">
              <div className="flex items-center gap-2 mb-2 text-term-amber">
                <FiTarget />
                <p className="font-mono text-xs uppercase tracking-wider">Status</p>
              </div>
              <p className="text-ink-primary text-sm font-medium">{profile.status}</p>
            </GlassPanel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
