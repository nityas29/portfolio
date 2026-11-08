# Portfolio site: handoff context

Read this first. It summarizes the project, how it is deployed, decisions already made, and what is unfinished, so work can continue without re-deriving anything. Also read `AGENTS.md` and `INTERACTIONS.md` in this repo (the Next.js version here has breaking changes from older versions, so check the docs in `node_modules/next/dist/docs` before assuming old APIs).

## The project

Personal portfolio for **Nitya Shankar** (UW Informatics '28, HCI track), used for product management and product design internship applications. It is a Next.js site with a home page, an About page, and two full case studies (Page Friends and EcoStack). A third project card ("Assimilation on the Menu") is a "coming soon" placeholder with no page yet.

- **Stack:** Next.js 16 (App Router, Turbopack), React, TypeScript (strict), Tailwind CSS v4 (tokens mapped in `app/globals.css` via `@theme inline`), Framer Motion, `next/image`, `next/font/google`.
- **Dev:** `npm run dev` then http://localhost:3000. Typecheck and lint: `npx tsc --noEmit && npx eslint app`.
- **Live sites:** Vercel (`portfolio-nityas29.vercel.app`, also `nityashankar.vercel.app`). A GitHub Pages deployment is set up in code but not confirmed live (see Deployment).

## Repo layout

```
app/
  layout.tsx              fonts (DM Mono, DM Sans, Londrina Solid, Balsamiq Sans, Inter) as CSS variables
  globals.css             design tokens, custom cursor, body overflow-x: clip
  page.tsx                home: hero (star characters + scatter stars), projects, experience
  about/page.tsx          about: hero photo, playground strip, "Why Product?"
  projects/page-friends/page.tsx   case study (own palette PF, fonts DM Sans / Balsamiq)
  projects/ecostack/page.tsx       case study (own palette ES, font Inter)
  components/
    Nav.tsx               sticky nav, hides on scroll down
    Footer.tsx            footer with bouncing star characters
    ProjectCard.tsx       home project cards: hover video preview, hover label
    ExperienceAccordion.tsx  data-driven accordion (ExperienceItem type)
    FloatingStar.tsx      idle bob + cursor-repel star (see Gotchas)
    AboutHeroStars.tsx    entrance fly-out animation for About photo stars
    ScatterStar.tsx, PlaygroundRow.tsx, ...
  lib/basePath.ts         BASE_PATH constant (see Deployment)
public/assets/            images and transcoded demo videos (committed)
public/resume.pdf         resume linked from Nav and Footer
public/videos/            raw source recordings, gitignored on purpose
.github/workflows/deploy-pages.yml   GitHub Pages deploy
```

## Git and deployment

- **Remote:** `https://github.com/nityas29/portfolio` (public, branch `main`). Vercel auto-deploys every push to `main`.
- **Commit identity matters.** Local git is set to `Nitya Shankar <nityas29@uw.edu>`, the verified email of the `nityas29` GitHub account. Vercel's free Hobby plan blocked deployments when commits were authored under a different email (`nityashankar2009@gmail.com`, which maps to a different GitHub account). History was rewritten with `git filter-branch` and force-pushed to fix this. Do not commit under any other email.
- **GitHub Pages (added, needs finishing):**
  - `next.config.ts` uses `output: "export"` and `images.unoptimized: true`. `basePath` and `assetPrefix` come from the env var `NEXT_PUBLIC_BASE_PATH` (empty on Vercel, `/portfolio` in the GitHub Actions workflow). One config serves both hosts.
  - `next/image` and `next/link` apply basePath automatically. Raw `<video src>` and `<a href="/resume.pdf">` do not, so those use `BASE_PATH` from `app/lib/basePath.ts`. Any new raw reference to a `public/` file must use it too.
  - The workflow builds with `NEXT_PUBLIC_BASE_PATH=/portfolio`, adds `.nojekyll` (otherwise Jekyll drops the `_next/` folder), and deploys via `actions/deploy-pages`.
  - **Still to do:** confirm it is pushed, then in the repo go to Settings > Pages > Source and select **GitHub Actions**. Target URL: `https://nityas29.github.io/portfolio/`. The user chose to keep both Vercel and Pages live.
- Raw `.mov` files in `public/videos/` are gitignored. Web copies in `public/assets/` were made with ffmpeg: `scale=880:-2, libx264, yuv420p, crf 23, no audio, +faststart`.

## State of the working tree (verify with `git status` and `git log origin/main..main`)

At the time of this handoff, these were done in the working copy but may be unpushed or uncommitted:

1. GitHub Pages config and workflow (commit `64ee67c`).
2. EcoStack "VIEW PROTOTYPE" link fixed to the final Figma Make prototype (commit `65b02a3`).
3. Custom cursor: white arrow with navy outline site-wide (`globals.css`), hidden over project cards via the `.cursor-hidden` class, where the "VIEW CASE STUDY" / "COMING SOON" label now replaces the cursor (label is centered on the pointer). Uncommitted.
4. **Mobile responsive pass** across Nav, Footer, home, About, ProjectCard, ExperienceAccordion, PlaygroundRow, and both case studies (smaller side padding, stacked layouts, 2-column team grid, lightbox 92% wide on phones, decorative badge stars and hover label hidden below `md`, hero stacks until `lg`, `overflow-x: clip` on body). Uncommitted and **not yet verified**: typecheck, lint, and a visual check at 375px and 768px have not been run.

## Next steps

1. Run `npx tsc --noEmit && npx eslint app`, fix anything, and check the site in browser device mode at 375px, 768px, and desktop. Likely rough spots: About hero stars (`AboutHeroStars.tsx` uses fixed pixel offsets), case study hero and tables, EcoStack and Page Friends feature-matrix sections, tap behavior on project cards.
2. Commit with the correct identity and push to `main`. Confirm the Vercel deploy is green.
3. Enable GitHub Pages (Actions source) and verify `nityas29.github.io/portfolio` loads with images, videos, nav, and resume link.
4. Optional: build the "Assimilation on the Menu" case study page (the card currently has `comingSoon`).

## Decisions and gotchas worth knowing

- **Case studies mirror each other** (hero banner, overview, problem, research, modeling, solution with videos, decisions, reflection, click-to-zoom images). `ExpandableImage` is intentionally duplicated in each page file, with its own native non-passive `wheel` listener (React's `onWheel` is passive, so `preventDefault` silently fails). Keep parallel sections at matching font sizes across the two case studies. Each case study has its own brand palette and fonts, separate from the portfolio's.
- **FloatingStar** had stars flying off screen in production. Root cause was a spring being re-targeted by rapid mousemove events. Fix: tweens instead of springs, and `useTransform` clamps on the rendered motion values so a star can never move more than its own size from rest. Return-to-rest is a deliberately slow tween (no snapping). Do not reintroduce springs there.
- **Hero stars** use the higher-resolution `star-guy-*-v2/v3.png` assets. A decorative star behind the "Y" in NITYA was intentionally removed from `HERO_SCATTER_STARS`.
- **EcoStack palette swatch** is pure CSS divs sized from the Figma file's exact geometry (154x260 after a deliberate 30% reduction), not an image.
- Figma sources: EcoStack frames are in file `6Mr4yl4ipVjjQ0BsEf3SzU`.
- **Local dev gotcha:** the project lives in `~/Desktop`, which syncs to iCloud. Evicted files made `npm run dev` hang with no output and made file reads fail. Fix: right-click the folder in Finder and choose Download Now, or move the project out of Desktop (for example `~/portfolio-site`).
- Fonts load from Google Fonts at build time, so builds need internet access (fine on Vercel and GitHub Actions).

## Working with Nitya

- Prefers concise, direct responses and iterative work: show changes, take targeted feedback.
- Writing in her voice: warm, genuine, professional, plain language. **No em dashes.** Minimal buzzwords, concrete details over inflated language.
- Do not invent metrics or claims about her work. Only use facts from her resume and the site.
- Commits and pushes: she has run `git push` herself from Terminal in the past. Never put tokens or passwords in files or commands.
