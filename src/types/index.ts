export interface SkillItem {
  name: string;
  level?: "learning" | "proficient"  | "intermediate";
}

export interface SkillCategory {
  id: string;
  title: string;
  dirName: string;
  icon: string;
  skills: SkillItem[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  challenges: string;
  tech: string[];
  githubUrl: string;
  liveUrl?: string;
  accent: "green" | "cyan" | "amber";
  status: "shipped" | "in-progress";
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  detail: string;
}

export interface TerminalLine {
  type: "input" | "output" | "system";
  content: string;
}

/* ── Achievement Atlas ───────────────────────────────────────────────
 * The 3D map's data model. A `domain` groups achievements into one of the
 * four "constellations" in the scene; `weight` (1–5) drives node size and
 * glow intensity, so your strongest achievements read as the brightest stars.
 */
export type AtlasDomain = "academics" | "engineering" | "skills" | "goals";

export interface AtlasAchievement {
  id: string;
  title: string;
  domain: AtlasDomain;
  /** One-line summary, used for the tooltip and the HUD list. */
  summary: string;
  /** Longer copy shown in the inspector panel when the node is selected. */
  detail?: string;
  /** Chronology label, e.g. "2024 – 2028". Displayed in the inspector. */
  period?: string;
  /** 1–5. Drives node scale and emissive intensity. */
  weight: number;
  /** Optional source link (repo, certificate, transcript). */
  href?: string;
  /** Small facts rendered as chips in the inspector. */
  meta?: string[];
}

/** A laid-out node: an achievement plus its computed position in 3D space. */
export interface AtlasNode extends AtlasAchievement {
  position: [number, number, number];
  /** Distance from the origin, used to order the camera fly-through. */
  radius: number;
}

export interface AtlasDomainMeta {
  id: AtlasDomain;
  label: string;
  /** Hex colour driving node emissive, links, and HUD accents. */
  color: string;
  /** Base angle (radians) the domain's plume grows from. */
  angle: number;
  blurb: string;
}

export type CommandId =
  | "help"
  | "whoami"
  | "about"
  | "skills"
  | "projects"
  | "education"
  | "resume"
  | "github"
  | "linkedin"
  | "contact"
  | "clear";
