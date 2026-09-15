# Portfolio Site — Interaction Requirements

Reference spec for build phase. Do not start coding until this is confirmed against the Figma file.

## Global / Navigation

- **Hero stars (top, 3 of them):**
  - Idle state: gentle bobbing, as if floating in space. Stay closely anchored to original position (small range of motion).
  - On hover: move slightly away from the cursor, as if being pushed ("mouse-phobic" / repel-from-cursor effect).
- **Top nav bar:**
  - "Projects" → smooth-scrolls down to the Projects section on the home page.
  - "Experience" → smooth-scrolls down to the Experience section on the home page.
  - "About" → navigates to the About page.
  - Logo (top left) → navigates back to the hero section on the home page.
- **Bottom nav / footer links:** same behavior as the top bar links above (Projects/Experience scroll, About navigates, logo returns to hero).
- **LinkedIn link:** https://www.linkedin.com/in/nitya-shankar — used for the LinkedIn item in both the top bar and bottom bar.
- **Resume link:** PDF to be provided by Nitya — placeholder until file is attached.

## Projects Section

- Hover tooltip on each project card (or its image/video): "VIEW CASE STUDY", all caps, DM Mono font, pink highlight matching the site's pink palette color.
- On the last project card specifically: tooltip reads "COMING SOON" instead.

## Experience Section

- Each experience item is built from three stacked component states (already designed in Figma): default (outline), hover (colored), and expanded (dropdown content).
- Items are stacked with ~35px spacing between them.
- Hover: transition from outline state to colored state, fade in.
- Click: item expands (third component state), pushing subsequent items down. Multiple items can be expanded at once (independent, not accordion-exclusive).
- Clicking the dropdown arrow while expanded folds it back up to the default state.
- Should behave like a standard, intuitive stacked-dropdown/accordion pattern (just non-exclusive).

## About Page

- "Playground" section has two rows, each independently horizontally scrollable.
- Each row contains mixed personal/creative content — not tied to formal case studies. Reference row (from Nhu's site) mixed: a paper-craft photo, a game concept poster ("The Last Migration"), character sketches, and a brand identity study (logo, color palette, mockup). Confirms the row is a "creative miscellany" shelf, distinct in tone from the polished project cards.
- Each row has a solid white padding/frame on both sides (left and right edges of the scroll container) for a clean scroll edge — confirmed: not a gradient fade, a solid white border/padding.
- Stars around the profile photo animate in on load/entrance: start centered/behind the photo, then fly outward to their final positions.

## Case Study Pages (both Page Friends and EcoStack)

- Progress bar at the top of the page, tracking scroll position through the case study.
- Clicking any image expands it (lightbox-style) so the user can view it larger; clicking outside the expanded image closes it back to normal.
- Videos autoplay and loop.
  - Nitya has 5 screen-recorded videos for Page Friends already provided (uploaded).
  - EcoStack equivalents not yet recorded — see shot list discussed separately (Role-Based Access, Add Facility, Data Entry, Reports, Compliance Hub).
  - Still need: confirmation on whether video files should be dropped directly into this project folder once ready.
- "View Prototype" button on Page Friends case study (next to "Meet Page Friends") should link to:
  https://www.figma.com/proto/ZYZfvO1RgOb7DVtGhY7PLr/Page-Friends-Hi-Fi--Copy-?node-id=45-14&t=uF6nh3RXlYqFrppZ-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=45%3A14&show-proto-sidebar=1

## Open items before build

- [x] Resume PDF received (resume_ux_design (2).pdf) — note: lists "Musemap" as project #2, not EcoStack; flagged to Nitya in case resume needs to be updated to match the portfolio
- [x] "Nhu scroll" reference image received — playground row content style confirmed; solid white padding border confirmed (not a gradient fade)
- [x] EcoStack feature videos received and sorted into videos/ecostack/ (role-based-access.mov, data-entry.mov, reports.mov, compliance-hub.mov, add-facility.mov)
- [ ] Figma wireframe file fully pulled in (in progress — large file, working through node-by-node extraction)
