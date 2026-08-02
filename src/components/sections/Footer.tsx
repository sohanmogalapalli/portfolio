import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { profile } from "@/data/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border-glass px-4 sm:px-6 py-8" role="contentinfo">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-ink-faint">
        <p>
          <span className="text-term-greenDim">$</span> echo "connection closed · 0 packets lost · built with React
          + Vite"
        </p>

        <div className="flex items-center gap-4">
          <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-term-green transition-colors">
            <FiMail />
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-term-green transition-colors">
            <FiGithub />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-term-green transition-colors">
            <FiLinkedin />
          </a>
        </div>

        <p>&copy; {year} {profile.name}</p>
      </div>
    </footer>
  );
}
