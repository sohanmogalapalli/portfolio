import { useMemo } from "react";
import type { ReactNode } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { FiAlertCircle, FiArrowUpRight, FiClock, FiFolder, FiGithub, FiStar, FiUsers } from "react-icons/fi";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import GlassPanel from "@/components/ui/GlassPanel";
import { useGithubProfile } from "@/hooks/useGithubProfile";
import { useGithubContributions } from "@/hooks/useGithubContributions";
import { useElementWidth } from "@/hooks/useElementWidth";
import {
  CALENDAR_THEME,
  GITHUB_PROFILE_URL,
  GITHUB_USERNAME,
  accountAge,
  languageBreakdown,
  languageColor,
  meaningfulRepos,
  relativeTime,
  totalStars,
} from "@/data/github";
import type { GithubRepo } from "@/data/github";

/* ── Small pieces ────────────────────────────────────────────────────── */

function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <GlassPanel hover className="p-4">
      <div className="mb-2 flex items-center gap-2 text-term-green">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-[0.15em]">{label}</span>
      </div>
      <p className="font-mono text-2xl font-bold text-ink-primary">{value}</p>
      {hint && <p className="mt-1 font-mono text-[10px] text-ink-faint">{hint}</p>}
    </GlassPanel>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <GlassPanel className="border-term-amber/25 p-4">
      <div className="flex items-start gap-3">
        <FiAlertCircle className="mt-0.5 shrink-0 text-term-amber" />
        <div className="text-sm leading-relaxed text-ink-muted">{children}</div>
      </div>
    </GlassPanel>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-white/[0.05] ${className}`} />;
}

function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-border-glass p-4 transition-colors hover:border-term-green/40 hover:bg-white/[0.03]"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="truncate font-mono text-sm font-semibold text-ink-primary group-hover:text-term-green">
          {repo.name}
        </span>
        <FiArrowUpRight className="shrink-0 text-ink-faint transition-colors group-hover:text-term-green" />
      </div>

      <p className="mb-3 flex-1 text-[13px] leading-relaxed text-ink-muted">
        {repo.description ?? <span className="italic text-ink-faint">No description yet</span>}
      </p>

      <div className="flex items-center gap-3 font-mono text-[10px] text-ink-faint">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: languageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <FiStar /> {repo.stargazers_count}
          </span>
        )}
        <span className="flex items-center gap-1">
          <FiClock /> {relativeTime(repo.pushed_at)}
        </span>
      </div>
    </a>
  );
}

/* ── Section ─────────────────────────────────────────────────────────── */

export default function GithubStats() {
  const { status, profile, repos, error } = useGithubProfile();
  const contributions = useGithubContributions();
  const { ref: heatmapRef, width } = useElementWidth<HTMLDivElement>();

  const publicRepos = useMemo(() => meaningfulRepos(repos), [repos]);
  const stars = useMemo(() => totalStars(repos), [repos]);
  const languages = useMemo(() => languageBreakdown(repos), [repos]);

  // The grid is a fixed ~53 week columns wide. Derive a block size from the
  // measured container so it always fits, instead of the previous fixed
  // blockSize={13} which overflowed and looked clipped.
  const blockSize = useMemo(() => {
    if (width <= 0) return 11;
    return Math.max(6, Math.min(13, Math.floor((width - 34) / 53) - 3));
  }, [width]);

  const loading = status === "loading";

  return (
    <section
      id="github-stats"
      className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32"
      aria-label="GitHub activity"
    >
      <Reveal>
        <SectionLabel comment={`curl api.github.com/users/${GITHUB_USERNAME}`} title="GitHub Activity" />
      </Reveal>

      {status === "error" && (
        <div className="mb-6">
          <Note>
            <p className="text-ink-primary">Live GitHub data is unavailable right now.</p>
            <p className="mt-1">{error}</p>
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-term-green hover:underline"
            >
              Open the profile directly <FiArrowUpRight />
            </a>
          </Note>
        </div>
      )}

      {/* Stat tiles */}
      <Reveal delay={0.05}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {loading ? (
            [0, 1, 2, 3].map((key) => (
              <GlassPanel key={key} className="p-4">
                <Skeleton className="mb-3 h-3 w-20" />
                <Skeleton className="h-7 w-12" />
              </GlassPanel>
            ))
          ) : (
            <>
              <StatTile
                icon={<FiFolder />}
                label="Repositories"
                value={profile ? String(profile.public_repos) : "—"}
                hint={profile ? `public · ${accountAge(profile.created_at)} old` : undefined}
              />
              <StatTile
                icon={<FiStar />}
                label="Stars earned"
                value={String(stars)}
                hint={stars === 0 ? "none yet" : "across public repos"}
              />
              <StatTile
                icon={<FiUsers />}
                label="Followers"
                value={profile ? String(profile.followers) : "—"}
              />
              <StatTile
                icon={<FiGithub />}
                label="Contributions"
                value={contributions.status === "ready" ? String(contributions.total) : "—"}
                hint="in the last year"
              />
            </>
          )}
        </div>
      </Reveal>

      {/* Contribution calendar */}
      <Reveal delay={0.1}>
        <GlassPanel className="mt-6 p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono text-xs uppercase tracking-wider text-term-green">
              Contribution calendar
            </p>
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-ink-faint transition-colors hover:text-term-green"
            >
              @{GITHUB_USERNAME} →
            </a>
          </div>

          <div ref={heatmapRef} className="overflow-x-auto">
            {contributions.status === "loading" && <Skeleton className="h-[110px] w-full" />}

            {contributions.status === "ready" && (
              <ActivityCalendar
                data={contributions.days}
                theme={CALENDAR_THEME}
                colorScheme="dark"
                blockSize={blockSize}
                blockMargin={3}
                blockRadius={2}
                fontSize={12}
                showColorLegend
                labels={{ totalCount: "{{count}} contributions in the last year" }}
              />
            )}

            {contributions.status === "error" && (
              <p className="py-6 font-mono text-xs leading-relaxed text-ink-faint">
                Contribution history is temporarily unavailable — {contributions.error}. Your
                profile is still linked above.
              </p>
            )}
          </div>
        </GlassPanel>
      </Reveal>

      {/* Languages + repositories */}
      <Reveal delay={0.15}>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <GlassPanel className="p-5 sm:p-6 lg:col-span-1">
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-term-green">
              Languages
            </p>
            <p className="mb-5 font-mono text-[10px] text-ink-faint">
              by primary language per repository
            </p>

            {languages.length === 0 ? (
              <p className="text-[13px] text-ink-faint">
                {loading ? "Loading…" : "No languages reported for public repositories."}
              </p>
            ) : (
              <ul className="space-y-3.5">
                {languages.map((entry) => (
                  <li key={entry.language}>
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[11px]">
                      <span className="flex items-center gap-2 text-ink-primary">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: languageColor(entry.language) }}
                        />
                        {entry.language}
                      </span>
                      <span className="text-ink-faint">{entry.count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(6, Math.round(entry.share * 100))}%`,
                          backgroundColor: languageColor(entry.language),
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassPanel>

          <GlassPanel className="p-5 sm:p-6 lg:col-span-2">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-xs uppercase tracking-wider text-term-green">
                Public repositories
              </p>
              <span className="font-mono text-[10px] text-ink-faint">
                {publicRepos.length} shown
              </span>
            </div>

            {loading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            ) : publicRepos.length === 0 ? (
              <p className="text-[13px] text-ink-faint">No public repositories to show yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {publicRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}
          </GlassPanel>
        </div>
      </Reveal>
    </section>
  );
}
