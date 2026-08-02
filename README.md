# Sohan — Terminal Portfolio

A premium, interactive terminal-themed portfolio built with React, TypeScript, Tailwind CSS, and Framer Motion. The hero is a fully working fake terminal: it types out a boot sequence, then hands control to you — type `help` to see every real command.

---

## Tech stack

- **React 18 + Vite** — build tooling and dev server
- **TypeScript** — strict mode, throughout
- **Tailwind CSS** — theme tokens for the terminal palette live in `tailwind.config.js`
- **Framer Motion** — page reveal, scroll-triggered reveals, hover micro-interactions
- **React Icons** (`react-icons/fi`) — Feather icon set

---

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (defaults to `http://localhost:5173`).

Other scripts:

```bash
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint
```

Requires Node.js 18+.

---

## Folder structure

```
src/
├── components/
│   ├── Terminal/
│   │   ├── Terminal.tsx        # interactive hero terminal (boot sequence + live prompt)
│   │   └── TerminalChrome.tsx  # window title bar / traffic-light controls
│   ├── Navbar/
│   │   └── Navbar.tsx          # floating pill navbar with scroll-spy
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── GithubStats.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   └── ui/                     # reusable primitives
│       ├── GlassPanel.tsx
│       ├── Reveal.tsx          # scroll-triggered fade/slide-in wrapper
│       ├── SectionLabel.tsx    # "// comment" + heading pattern
│       ├── ParticleField.tsx   # ambient floating background particles
│       ├── SkillCard.tsx
│       └── ProjectCard.tsx
├── data/                        # all site content lives here — edit these to update the site
│   ├── profile.ts               # name, summary, objective, education, contact links
│   ├── skills.ts                 # skill categories
│   ├── projects.ts               # project cards
│   └── terminalCommands.ts       # command registry powering the terminal
├── hooks/
│   └── useTypewriter.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css                    # theme tokens, glass utilities, terminal caret, reduced-motion handling
```

**To update your content** (bio, skills, projects, links), you only need to edit the files in `src/data/` — the components read from there, nothing is hardcoded in JSX.

---

## The terminal

Commands are defined in `src/data/terminalCommands.ts`. Supported commands:

`help`, `whoami`, `about`, `skills`, `projects`, `education`, `resume`, `github`, `linkedin`, `contact`, `clear`

Commands that map to a page section (`about`, `skills`, `projects`, `education`, `contact`) smooth-scroll the page there after printing their output. `resume` opens `/public/resume.pdf` in a new tab, `github`/`linkedin` open the profile URLs from `src/data/profile.ts`, and `clear` wipes the terminal history.

To add a new command, add a case to the `switch` in `runCommand()` (in `terminalCommands.ts`) and add its id to the `CommandId` union in `src/types/index.ts`.

---

## Replacing placeholder content

- **Resume**: replace `public/resume.pdf` with your real resume (same filename, or update `resumeUrl` in `src/data/profile.ts`).
- **Email / GitHub / LinkedIn**: update `src/data/profile.ts`.
- **Project repo & demo links**: update `githubUrl` / `liveUrl` in `src/data/projects.ts`.
- **GitHub stats section**: `src/components/sections/GithubStats.tsx` currently renders illustrative placeholders (a randomized contribution grid, static language percentages). Wire it up to a live source when you're ready — e.g. the GitHub REST API, or an embeddable stats image service — and swap the placeholder markup for real data.
- **OG image**: add an `og-image.png` to `public/` (referenced in `index.html`'s Open Graph tags) for nicer social link previews.

---

## Accessibility & performance notes

- All interactive elements have visible focus rings (`:focus-visible`) and `aria-label`s.
- `prefers-reduced-motion` is respected: scroll reveals and the particle field are disabled for users who request reduced motion.
- Images/heavy sections are not blocking initial paint; the bundle is a single small JS chunk (~90 KB gzipped) with code-split-friendly structure if you add routes later.
- Semantic landmarks (`header`, `main`, `footer`, section `aria-label`s) and a skip-to-content link are included.

---

## Deployment

### Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Vite**. Build command `npm run build`, output directory `dist` (Vercel usually auto-detects both).
4. Deploy — no environment variables are required.

Or via CLI:

```bash
npm i -g vercel
vercel
```

### GitHub Pages

1. In `vite.config.ts`, set `base` to your repo name:
   ```ts
   base: "/your-repo-name/",
   ```
2. Build and deploy using `gh-pages` (already in `devDependencies`):
   ```bash
   npm run build
   npx gh-pages -d dist
   ```
3. In your repo's **Settings → Pages**, set the source to the `gh-pages` branch.

If you're deploying to a custom domain or a user/organization page (`username.github.io`), keep `base: "./"` (the default already set in this project) instead of a repo-name subpath.

---

## License

This project is yours to use, modify, and deploy as your personal portfolio.
