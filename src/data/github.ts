/**
 * GitHub integration constants, types, and derivations.
 *
 * Data comes from two places, for one unavoidable reason:
 *
 *  1. api.github.com — profile and repository data. CORS-enabled, so it can be
 *     called straight from the browser. Unauthenticated limit: 60 requests/hour
 *     per IP, and this section makes two.
 *  2. github-contributions-api.jogruber.de — the contribution calendar.
 *     GitHub's REST API does not expose per-day contribution counts at all.
 *     The only official source is the GraphQL `contributionsCollection` field,
 *     which requires a token, and shipping a token in frontend code would leak
 *     it to every visitor. Every contribution heatmap you have ever seen on a
 *     static site uses a proxy like this one.
 *
 * For reference, `github-readme-stats.vercel.app` used to be the shortcut here,
 * but that shared deployment now returns HTTP 503 DEPLOYMENT_PAUSED — it was
 * the cause of a broken section and is deliberately not used any more.
 */

export const GITHUB_USERNAME = "sohanmogalapalli";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
export const GITHUB_API = "https://api.github.com";
export const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";

export interface GithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
  topics?: string[];
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionData {
  total: number;
  days: ContributionDay[];
}

/**
 * Calendar palette matched to the site's terminal greens. Level 0 is a
 * translucent white rather than GitHub's near-black #161b22, which was
 * effectively invisible against this site's dark panels.
 */
export const CALENDAR_THEME = {
  light: ["#e4e4e7", "#14532d", "#15803d", "#22c55e", "#4ade80"],
  dark: ["rgba(255,255,255,0.07)", "#14532d", "#15803d", "#22c55e", "#4ade80"],
};

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Python: "#3572A5",
  Java: "#B07219",
  C: "#555555",
  "C++": "#F34B7D",
  "C#": "#178600",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Rust: "#DEA584",
  Go: "#00ADD8",
  Shell: "#89E051",
  Jupyter: "#DA5B0B",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
};

export function languageColor(language: string | null): string {
  if (!language) return "#6B7280";
  return LANGUAGE_COLORS[language] ?? "#4ADE80";
}

/** Public, non-forked repos, most-starred first. */
export function meaningfulRepos(repos: GithubRepo[]): GithubRepo[] {
  return repos
    .filter((repo) => !repo.fork)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    );
}

export function totalStars(repos: GithubRepo[]): number {
  return meaningfulRepos(repos).reduce((sum, repo) => sum + repo.stargazers_count, 0);
}

export interface LanguageCount {
  language: string;
  count: number;
  share: number;
}

/**
 * GitHub's API reports one primary language per repository, not byte counts,
 * so this counts repositories per language. Labelled accordingly in the UI
 * rather than being presented as a percentage of code written.
 */
export function languageBreakdown(repos: GithubRepo[]): LanguageCount[] {
  const counts = new Map<string, number>();

  meaningfulRepos(repos).forEach((repo) => {
    if (!repo.language) return;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  });

  const total = [...counts.values()].reduce((sum, value) => sum + value, 0);
  if (total === 0) return [];

  return [...counts.entries()]
    .map(([language, count]) => ({ language, count, share: count / total }))
    .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language));
}

/** Human-readable relative time, e.g. "3 days ago". */
export function relativeTime(iso: string): string {
  const elapsed = Date.now() - new Date(iso).getTime();
  const days = Math.floor(elapsed / 86_400_000);

  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export function accountAge(createdAt: string): string {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000);
  const months = Math.floor(days / 30);

  if (months < 1) return `${days}d`;
  if (months < 24) return `${months}mo`;
  return `${Math.floor(months / 12)}y`;
}
