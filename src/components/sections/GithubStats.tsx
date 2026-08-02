import { FiGithub } from "react-icons/fi";
import {GitHubCalendar} from "react-github-calendar";

import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import GlassPanel from "@/components/ui/GlassPanel";
import { profile } from "@/data/profile";

const USERNAME = "sohanmogalapalli";

export default function GithubStats() {
  return (
    <section
      id="github-stats"
      className="relative px-4 sm:px-6 py-24 md:py-32 max-w-6xl mx-auto"
    >
      <Reveal>
        <SectionLabel
          comment={`curl api.github.com/users/${USERNAME}`}
          title="GitHub Activity"
        />
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Profile Stats */}

        <Reveal className="md:col-span-1">
          <GlassPanel hover className="p-6 h-full">

            <div className="flex items-center gap-2 mb-5 text-term-green">
              <FiGithub />
              <p className="font-mono text-xs uppercase">
                GitHub Profile
              </p>
            </div>

            <img
              src={`https://github-readme-stats.vercel.app/api?username=${USERNAME}&show_icons=true&theme=tokyonight&hide_border=true`}
              alt="GitHub Stats"
              className="w-full rounded-lg"
            />

            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex text-term-green hover:underline font-mono text-xs"
            >
              View GitHub Profile →
            </a>

          </GlassPanel>
        </Reveal>

        {/* Contribution Calendar */}

        <Reveal className="md:col-span-2">
          <GlassPanel hover className="p-6">

            <p className="font-mono text-xs uppercase tracking-wider text-term-green mb-5">
              Contribution Calendar
            </p>

            <div className="overflow-auto">

              <GitHubCalendar
                username={USERNAME}
                colorScheme="dark"
                blockSize={13}
                blockMargin={4}
                fontSize={14}
              />

            </div>

          </GlassPanel>
        </Reveal>

        {/* Top Languages */}

        <Reveal className="md:col-span-3">
          <GlassPanel hover className="p-6">

            <p className="font-mono text-xs uppercase tracking-wider text-term-green mb-5">
              Most Used Languages
            </p>

            <img
              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${USERNAME}&layout=compact&theme=tokyonight&hide_border=true`}
              alt="Top Languages"
              className="mx-auto"
            />

          </GlassPanel>
        </Reveal>

      </div>
    </section>
  );
}