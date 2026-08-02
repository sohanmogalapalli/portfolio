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
