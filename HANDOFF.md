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

## Current state (as of the last session)

Everything is committed and pushed. `origin/main` is at `72d958a`, the working tree is clean, and `npx tsc --noEmit` and `npx eslint app` both pass. Recent commits, newest first:

- `72d958a` Hero scatter stars stay in the side margins below `lg` (on phones they were landing on the centered text). Desktop keeps the original scatter (`HERO_SCATTER_STARS`); phones and tablets use `HERO_SCATTER_STARS_MOBILE` in `app/page.tsx`.
- `1528ff7` Mobile responsive pass across Nav, Footer, home, About, ProjectCard, ExperienceAccordion, PlaygroundRow, and both case studies. Smaller side padding, stacked layouts, 2-column team grid, lightbox 92% wide on phones, decorative badge stars and the hover label hidden below `md`, hero stacks until `lg`, `overflow-x: clip` on body. Added this file.
- `cfa4807` Custom cursor: white arrow with navy outline site-wide (`globals.css`), hidden over project cards via the `.cursor-hidden` class, where the "VIEW CASE STUDY" / "COMING SOON" label replaces the cursor (label is centered on the pointer).
- `65b02a3` EcoStack "VIEW PROTOTYPE" link points at the final Figma Make prototype.
- `64ee67c` GitHub Pages config and workflow.

The mobile layout was checked by the user in a phone-sized browser view, and the home hero works (the star overlap above was fixed afterward). The rest of the mobile pass has been code-reviewed but not visually checked page by page.

## Next steps

1. Do a visual pass at 375px, 768px, and desktop on every page, and fix anything rough. Likely spots: About hero stars (`AboutHeroStars.tsx` uses fixed pixel offsets and an entrance animation), the case study hero and feature sections, tap behavior on project cards (the hover video preview and label are desktop-only by design), and the star character cluster at the top of the home hero.
2. Enable GitHub Pages: repo Settings > Pages > Source > **GitHub Actions**. The workflow is already pushed. Then verify `https://nityas29.github.io/portfolio/` loads with images, videos, nav links, and the resume link. Not yet confirmed live.
3. Confirm the latest Vercel deployment is green.
4. Optional: build the "Assimilation on the Menu" case study page (its card currently has `comingSoon`).

## Decisions and gotchas worth knowing

- **Case studies mirror each other** (hero banner, overview, problem, research, modeling, solution with videos, decisions, reflection, click-to-zoom images). `ExpandableImage` is intentionally duplicated in each page file, with its own native non-passive `wheel` listener (React's `onWheel` is passive, so `preventDefault` silently fails). Keep parallel sections at matching font sizes across the two case studies. Each case study has its own brand palette and fonts, separate from the portfolio's.
- **FloatingStar** had stars flying off screen in production. Root cause was a spring being re-targeted by rapid mousemove events. Fix: tweens instead of springs, and `useTransform` clamps on the rendered motion values so a star can never move more than its own size from rest. Return-to-rest is a deliberately slow tween (no snapping). Do not reintroduce springs there. Current model: push is eased toward its target once per frame (exponential smoothing in `useAnimationFrame`), the idle bob is a separate always-running motion value added on top (restarting the bob keyframes from 0 on mouse leave was what caused the old snap-back), and click/Enter spins the star 360° (`spinOnClick`, off in the Footer where the star is already a button). The blue hero star passes `eyes`: it renders `star-guy-blue-v3-noiris.png` plus an SVG of irises that follow the cursor and blinking eyelids, clipped by `star-guy-blue-v3-eyemask.png`. Both PNGs were generated from `star-guy-blue-v3.png`; if that art changes, they and the iris coordinates in `FloatingStar.tsx` need regenerating.
- **Hero stars** use the higher-resolution `star-guy-*-v2/v3.png` assets. A decorative star behind the "Y" in NITYA was intentionally removed from `HERO_SCATTER_STARS`.
- **EcoStack palette swatch** is pure CSS divs sized from the Figma file's exact geometry (154x260 after a deliberate 30% reduction), not an image.
- Figma sources: EcoStack frames are in file `6Mr4yl4ipVjjQ0BsEf3SzU`.
- **Local dev gotcha (resolved):** the project used to live in an iCloud-synced Desktop, and evicted files made `npm run dev` hang with no output and made file reads fail. The user turned off Desktop & Documents sync and the project is back on the normal local Desktop at `~/Desktop/portfolio site`. If `npm run dev` hangs with no output again, check for iCloud cloud-only files (`ls -lO` shows `dataless`) and consider moving the project to `~/portfolio-site`.
- **Intro animation** (`app/components/IntroSplash.tsx`, rendered in `app/layout.tsx`): the pink star bounces up from below (squash and stretch), tilts into a wink, spins into the nav logo, and a circle opening from the logo reveals the site. Plays once per browser session (`sessionStorage` key in `app/lib/intro.ts`). An inline script in `<head>` sets `data-intro="skip"` before first paint on repeat visits or with reduced motion; CSS in `globals.css` hides the overlay and has an 8s no-JS failsafe (the fly-in itself is a CSS animation, `.intro-rise`, so it plays even before the JS loads; the JS waits for it to land, then does the wink and flight). Click or Esc skips it. Timing constants are at the top of the component. To replay it any time, add `?intro` to the URL (e.g. `localhost:3000/?intro`). A plain reload, a tab opened from a link (Chrome copies sessionStorage), or a duplicated tab all skip it by design. While it plays, the page is held at scroll top so a reload while scrolled down still reveals the hero. Art comes from Figma frame "loading animation elements" (`189:329` in file `6Mr4yl4ipVjjQ0BsEf3SzU`), exported to `public/assets/intro/` with the frame background removed and the legs and boots split onto their own layer. The nav logo uses the same `intro/logo.png` so the hand-off is pixel-identical.
- **Footer game** (`app/components/FooterGame.tsx`, rendered inside `Footer.tsx`, lg and up only): a runner modeled on Chrome's offline dino game. The game area runs from `GAME_LEFT` (30% of the footer, at least 400px) to the right edge and clips cleanly at its left edge; the pink strip along the bottom is the ground and holds the copyright. Art is from Figma "gamified bottom bar" (`186:11`), saved as SVGs in `public/assets/game/` (`star-guy.svg` was assembled from the Figma vector parts at their exact positions, because Figma's PNG export bakes in a dark background). All game numbers are in Figma px and drawn at 80% (`S`). Physics follow the dino: hold to jump higher (letting go early clamps the rise once a minimum height is reached), speed ramps up over about 1.5 minutes, rock gaps grow with speed, the same rock never shows 3 times in a row, no rocks for the first second, clouds move at rock speed, and the high score is kept in `localStorage`. The game pauses when the footer is off screen or the tab is hidden. Rocks vary in size (0.7x to 1.3x, randomly mirrored) and spacing (normal gaps, occasional long breathers, occasional tight pairs of small rocks). The minimum gap was set by simulation to sit just above the band of gaps that can't be beaten, so don't lower `GAP_TIME`/`GAP_BASE` without rechecking. Controls: click or tap the area; after the first click, Space/Up work page-wide while the game is on screen (and restart 750ms after a crash). Tablets keep the two bouncy stars and phones keep the small scatter stars.
- Fonts load from Google Fonts at build time, so builds need internet access (fine on Vercel and GitHub Actions).

## Working with Nitya

- Prefers concise, direct responses and iterative work: show changes, take targeted feedback.
- Writing in her voice: warm, genuine, professional, plain language. **No em dashes.** Minimal buzzwords, concrete details over inflated language.
- Do not invent metrics or claims about her work. Only use facts from her resume and the site.
- Commits and pushes: she has run `git push` herself from Terminal in the past. Never put tokens or passwords in files or commands.
