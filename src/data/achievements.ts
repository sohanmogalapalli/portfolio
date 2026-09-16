import type { AtlasAchievement, AtlasDomainMeta } from "@/types";
import { education, profile } from "./profile";
import { projects } from "./projects";
import { skillCategories } from "./skills";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ADD YOUR REAL ACHIEVEMENTS HERE
 * ─────────────────────────────────────────────────────────────────────────
 * Everything else in this file is derived from your existing data files, so
 * it can never drift out of sync. This array is the only part you maintain
 * by hand. Anything you add shows up as a new star in the 3D map.
 *
 * Nothing is invented for you — the map currently plots only what is already
 * in profile.ts / projects.ts / skills.ts. Add real entries below, e.g.:
 *
 *   {
 *     id: "smart-india-hackathon",
 *     title: "Smart India Hackathon — Finalist",
 *     domain: "academics",
 *     summary: "Top 5 of 240 teams in the internal round",
 *     detail: "Built a real-time crop disease classifier...",
 *     period: "2025",
 *     weight: 4,
 *     href: "https://...",
 *     meta: ["Team of 6", "Runner-up"],
 *   }
 *
 * `domain` is one of: "academics" | "engineering" | "skills" | "goals"
 * `weight` is 1–5 — higher means a bigger, brighter node.
 */
export const MANUAL_ACHIEVEMENTS: AtlasAchievement[] = [];

/** The four constellations the map is organised into. */
export const ATLAS_DOMAINS: AtlasDomainMeta[] = [
  {
    id: "academics",
    label: "Academics",
    color: "#FBBF24",
    angle: Math.PI * 0.25,
    blurb: "Degree, grades, and coursework",
  },
  {
    id: "engineering",
    label: "Engineering",
    color: "#38BDF8",
    angle: Math.PI * 0.75,
    blurb: "Things built and shipped",
  },
  {
    id: "skills",
    label: "Toolkit",
    color: "#4ADE80",
    angle: Math.PI * 1.25,
    blurb: "Languages, frameworks, and systems",
  },
  {
    id: "goals",
    label: "Trajectory",
    color: "#A78BFA",
    angle: Math.PI * 1.75,
    blurb: "Where this is heading next",
  },
];

/* ── Derived from profile.ts ─────────────────────────────────────────── */

const academicAchievements: AtlasAchievement[] = [
  {
    id: "vit-cse",
    title: "B.Tech Computer Science & Engineering",
    domain: "academics",
    summary: `${profile.institution} · ${education[0]?.period ?? ""}`.trim(),
    detail: `Admitted to ${education[0]?.degree ?? "Computer Science and Engineering"} at ${profile.institution}, ${profile.location}.`,
    period: education[0]?.period,
    weight: 5,
    meta: ["VIT Vellore", "B.Tech"],
  },
  {
    id: "cgpa",
    title: "9.49 / 10.0 CGPA",
    domain: "academics",
    summary: "Consistent top-band academic record at VIT",
    detail:
      "Maintaining a 9.49/10.0 CGPA across the Computer Science and Engineering curriculum at VIT Vellore.",
    weight: 5,
    meta: ["9.49 / 10.0"],
  },
  {
    id: "coursework",
    title: "Core CS Coursework",
    domain: "academics",
    summary: "Data Structures · OS · DBMS · Networks · AI · Cloud",
    detail:
      "Relevant coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks, Artificial Intelligence, and Cloud Computing.",
    weight: 4,
    meta: ["DSA", "Operating Systems", "DBMS", "Computer Networks", "AI", "Cloud"],
  },
];

/* ── Derived from projects.ts ────────────────────────────────────────── */

const projectAchievements: AtlasAchievement[] = projects.map((project) => ({
  id: `project-${project.id}`,
  title: project.title,
  domain: "engineering" as const,
  summary: project.tagline,
  detail: project.description,
  weight: project.status === "shipped" ? 4 : 3,
  href: project.githubUrl.startsWith("http") ? project.githubUrl : undefined,
  meta: [project.status === "shipped" ? "Shipped" : "In progress", ...project.tech.slice(0, 5)],
}));

/* ── Derived from skills.ts ──────────────────────────────────────────── */

const skillAchievements: AtlasAchievement[] = skillCategories.map((category) => {
  const proficient = category.skills.filter((skill) => skill.level === "proficient").length;

  return {
    id: `skill-${category.id}`,
    title: category.title,
    domain: "skills" as const,
    summary: `${category.skills.length} tracked skills · ${proficient} at proficient level`,
    detail: `Working knowledge across ${category.skills.map((skill) => skill.name).join(", ")}.`,
    // Clamped so the toolkit never outshines the genuinely notable achievements.
    weight: Math.min(4, Math.max(2, 1 + Math.round(proficient / 2))),
    meta: category.skills.slice(0, 6).map((skill) => skill.name),
  };
});

/* ── Derived from profile.ts status/objective ────────────────────────── */

const goalAchievements: AtlasAchievement[] = [
  {
    id: "open-to-internships",
    title: profile.status,
    domain: "goals",
    summary: "Actively looking for an engineering internship",
    detail: profile.objective,
    weight: 5,
    meta: ["Available now"],
  },
  {
    id: "focus-areas",
    title: "Focus Areas",
    domain: "goals",
    summary: profile.interests.slice(0, 3).join(" · "),
    detail: `Current focus: ${profile.interests.join(", ")}.`,
    weight: 4,
    meta: profile.interests.slice(0, 4),
  },
];

/**
 * Everything plotted on the map, brightest first so the highest-weight
 * achievements settle closest to the core.
 */
export const achievements: AtlasAchievement[] = [
  ...MANUAL_ACHIEVEMENTS,
  ...academicAchievements,
  ...projectAchievements,
  ...skillAchievements,
  ...goalAchievements,
].sort((a, b) => b.weight - a.weight);
