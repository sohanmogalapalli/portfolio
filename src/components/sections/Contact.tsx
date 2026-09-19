import { FiMail, FiGithub, FiLinkedin, FiDownload } from "react-icons/fi";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import GlassPanel from "@/components/ui/GlassPanel";
import { profile } from "@/data/profile";

const CONTACT_LINKS = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: FiMail },
  { label: "GitHub", value: "github.com", href: profile.github, icon: FiGithub },
  { label: "LinkedIn", value: "linkedin.com", href: profile.linkedin, icon: FiLinkedin },
];

export default function Contact() {
  return (
    <section id="contact" className="relative px-4 sm:px-6 py-24 md:py-32 max-w-4xl mx-auto" aria-label="Contact">
      <Reveal>
        <SectionLabel comment="mail -s hello" title="Let's connect" />
      </Reveal>

      <Reveal delay={0.05}>
        <GlassPanel className="p-6 sm:p-10">
          <p className="font-mono text-sm text-ink-muted mb-8 leading-relaxed">
            <span className="text-term-greenDim">$</span> echo "I read every email. Hiring, internships, or just
            want to talk about AI and cloud systems? Open a connection below."
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {CONTACT_LINKS.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center gap-2 p-5 rounded-xl border border-border-glass hover:border-term-green/40 hover:bg-white/[0.03] transition-all"
              >
                <Icon className="text-xl text-term-green group-hover:scale-110 transition-transform" />
                <span className="font-mono text-xs text-ink-primary">{label}</span>
                <span className="font-mono text-[11px] text-ink-faint">{value}</span>
              </a>
            ))}
          </div>

          <a
            href={profile.resumeUrl}
            download
            className="w-full flex items-center justify-center gap-2 font-mono text-sm px-5 py-3.5 rounded-xl bg-term-green/10 text-term-green border border-term-green/30 hover:bg-term-green/20 transition-colors"
          >
            <FiDownload /> Download Resume
          </a>
        </GlassPanel>
      </Reveal>
    </section>
  );
}
