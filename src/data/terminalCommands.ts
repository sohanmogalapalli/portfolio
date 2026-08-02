import { profile } from "./profile";
import { skillCategories } from "./skills";
import { projects } from "./projects";
import { education } from "./profile";
import type { CommandId } from "@/types";

export interface CommandOutput {
  lines: string[];
  navigateTo?: string;
  action?: "clear" | "open-resume" | "open-link";
  href?: string;
}

const AVAILABLE_COMMANDS: CommandId[] = [
  "help",
  "whoami",
  "about",
  "skills",
  "projects",
  "education",
  "resume",
  "github",
  "linkedin",
  "contact",
  "clear",
];

export function isKnownCommand(input: string): input is CommandId {
  return AVAILABLE_COMMANDS.includes(input.trim().toLowerCase() as CommandId);
}

export function runCommand(rawInput: string): CommandOutput {
  const cmd = rawInput.trim().toLowerCase();

  switch (cmd) {
    case "help":
      return {
        lines: [
          "Available commands:",
          "",
          ...AVAILABLE_COMMANDS.filter((c) => c !== "help").map(
            (c) => `  ${c.padEnd(12)} ${describeCommand(c)}`
          ),
        ],
      };

    case "whoami":
      return {
        lines: [profile.name],
      };

    case "about":
      return {
        lines: [
          `role        ${profile.role}`,
          `institution ${profile.institution}`,
          "",
          profile.summary,
        ],
        navigateTo: "about",
      };

    case "skills":
      return {
        lines: skillCategories.flatMap((cat) => [
          `${cat.dirName}/`,
          ...cat.skills.map((s) => `  ${s.name}${s.level === "learning" ? "  (learning)" : ""}`),
        ]),
        navigateTo: "skills",
      };

    case "projects":
      return {
        lines: projects.map((p) => `${p.title} — ${p.tagline}`),
        navigateTo: "projects",
      };

    case "education":
      return {
        lines: education.flatMap((e) => [
          `${e.institution} — ${e.degree}`,
          `${e.period}`,
          "",
        ]),
        navigateTo: "about",
      };

    case "status":
      return { lines: [profile.status] };

    case "interests":
      return { lines: profile.interests };

    case "role":
      return { lines: [profile.role, profile.institution] };

    case "resume":
      return {
        lines: ["Opening resume.pdf ..."],
        action: "open-resume",
      };

    case "github":
      return {
        lines: [`Opening ${profile.github} ...`],
        action: "open-link",
        href: profile.github,
      };

    case "linkedin":
      return {
        lines: [`Opening ${profile.linkedin} ...`],
        action: "open-link",
        href: profile.linkedin,
      };

    case "contact":
      return {
        lines: [`email    ${profile.email}`, `github   ${profile.github}`, `linkedin ${profile.linkedin}`],
        navigateTo: "contact",
      };

    case "clear":
      return { lines: [], action: "clear" };

    default:
      return {
        lines: [`command not found: ${rawInput}`, `type 'help' to see available commands`],
      };
  }
}

function describeCommand(c: CommandId): string {
  const map: Record<CommandId, string> = {
    help: "show this list of commands",
    whoami: "print my name",
    about: "professional summary & objective",
    skills: "list technical skills by category",
    projects: "list featured projects",
    education: "education history",
    resume: "download my resume",
    github: "open my GitHub profile",
    linkedin: "open my LinkedIn profile",
    contact: "show contact details",
    clear: "clear the terminal",
  };
  return map[c];
}
