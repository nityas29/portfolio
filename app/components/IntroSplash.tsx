"use client";

import { motion, useMotionValue, useMotionTemplate, animate, AnimationPlaybackControls } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { INTRO_KEY } from "../lib/intro";
import ScatterStar from "./ScatterStar";

/*
  Intro: the pink star bounces up onto the navy screen, tilts into a wink, then spins down into
  the nav logo while a circle opening from the logo reveals the site.
  Plays once per browser session (see INTRO_SCRIPT in layout.tsx, which hides
  it before first paint on repeat visits or with reduced motion).

  Artwork from Figma "loading animation elements" (file 6Mr4yl4ipVjjQ0BsEf3SzU,
  frame 189:329). The star frames are 227 x 233.42; the logo frame (225 x 225)
  sits at LOGO_OFFSET inside them so the eyes line up exactly.
*/

const FRAME_W = 227;
const FRAME_H = 233.42;
const LOGO_SIZE = 225;
const LOGO_OFFSET = { x: 0.7, y: 0.9 };
const NAVY = "#181e24";

// timing (seconds)
const FLY_IN = 0.95; // rises past center, dips, settles (must match .intro-rise in globals.css)
const BEAT = 0.12; // eyes open for a moment before the wink
const WINK_HOLD = 0.45; // wink (with a tilt) before it takes off
const WINK_TILT = -14; // degrees, negative leans left
const FLIGHT = 0.9; // spin + travel to the logo
const REVEAL_DELAY = 0.55; // into the flight, when the circle starts opening
const REVEAL = 0.75;

const FAILSAFE_MS = 8000; // must match the intro-failsafe delay in globals.css

const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

// decided once per page load, so React's dev-mode double mount can't make the
// second mount think the intro was "already seen" and skip it
let decision: "play" | "skip" | null = null;

function decide(): "play" | "skip" {
  if (decision) return decision;
  let seen = false;
  try {
    seen = sessionStorage.getItem(INTRO_KEY) === "1";
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {}
  // ?intro in the URL replays it on demand
  if (/[?&]intro(=|&|$)/.test(window.location.search)) {
    decision = "play";
    return decision;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  decision = seen || reduce ? "skip" : "play";
  return decision;
}

export default function IntroSplash() {
  // the star group is centered on screen by CSS; x/y are offsets from there
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  const openOpacity = useMotionValue(1);
  const winkOpacity = useMotionValue(0);
  const logoOpacity = useMotionValue(0);
  const legsY = useMotionValue(0);
  const legsOpacity = useMotionValue(1);
  const radius = useMotionValue(0);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const overlayOpacity = useMotionValue(1);
  const mask = useMotionTemplate`radial-gradient(circle at ${cx}px ${cy}px, transparent ${radius}px, #000 calc(${radius}px + 1px))`;

  const finishRef = useRef<() => void>(() => {});
  // the fly-in is a CSS animation (.intro-rise in globals.css) so it plays from
  // first paint, even while the JS is still loading
  const riseRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const html = document.documentElement;
    // JS arrived after the CSS failsafe already hid the overlay: don't replay
    // the intro on top of the site
    const tooLate = performance.now() > FAILSAFE_MS - 300;
    if (decide() === "skip" || tooLate) {
      // re-applied here too: in dev, React resets <html> attributes on remount
      html.dataset.intro = "skip";
      return;
    }
    html.dataset.intro = "playing";
    // always reveal the top of the page: on a reload while scrolled down, the
    // browser restores the old position after load, so hold it at the top
    // for as long as the intro runs
    const pinTop = () => {
      if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "instant" });
    };
    pinTop();
    window.addEventListener("scroll", pinTop);
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const running: AnimationPlaybackControls[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let finished = false;
    const wait = (s: number) => new Promise<void>((r) => timers.push(setTimeout(r, s * 1000)));
    const run = (c: AnimationPlaybackControls) => {
      running.push(c);
      return c;
    };

    function finish() {
      if (finished) return;
      finished = true;
      running.forEach((c) => c.stop());
      timers.forEach(clearTimeout);
      html.style.overflow = prevOverflow;
      html.dataset.intro = "done";
      window.removeEventListener("scroll", pinTop);
      try {
        history.scrollRestoration = "auto";
      } catch {}
    }

    // click or Esc: fade straight to the site
    function skip() {
      if (finished) return;
      running.forEach((c) => c.stop());
      animate(overlayOpacity, 0, { duration: 0.25, ease: "easeOut" }).then(finish);
    }
    finishRef.current = skip;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && skip();
    window.addEventListener("keydown", onKey);

    (async () => {
      // wait for the CSS fly-in to land (resolves at once if it already has)
      try {
        const anims = riseRef.current?.getAnimations() ?? [];
        await Promise.all(anims.map((a) => a.finished));
      } catch {
        await wait(FLY_IN);
      }
      if (finished) return;
      await wait(BEAT);
      if (finished) return;
      openOpacity.set(0);
      winkOpacity.set(1);
      run(animate(rotate, WINK_TILT, { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }));
      await wait(WINK_HOLD);
      if (finished) return;

      // where the nav logo is right now (works at any screen size)
      const logo = document.getElementById("nav-logo")?.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const target = logo
        ? { x: logo.left + logo.width / 2, y: logo.top + logo.height / 2, size: logo.width }
        : { x: 36, y: 36, size: 40 };
      const s = target.size / LOGO_SIZE;
      // logo frame center vs. star frame center, in frame units
      const dx = LOGO_OFFSET.x + LOGO_SIZE / 2 - FRAME_W / 2;
      const dy = LOGO_OFFSET.y + LOGO_SIZE / 2 - FRAME_H / 2;
      const endX = target.x - vw / 2 - dx * s;
      const endY = target.y - vh / 2 - dy * s;

      cx.set(target.x);
      cy.set(target.y);
      const flight = { duration: FLIGHT, ease: EASE_IN_OUT };
      run(animate(x, endX, flight));
      run(animate(y, endY, flight));
      run(animate(scale, s, flight));
      run(animate(rotate, 360, flight));
      // boots drop away early
      run(animate(legsY, 40, { duration: 0.35, ease: "easeIn" }));
      run(animate(legsOpacity, 0, { duration: 0.3, ease: "easeIn" }));
      // halfway through the spin, the star becomes the outlined logo
      run(animate(logoOpacity, 1, { duration: 0.25, delay: FLIGHT * 0.4 }));
      run(animate(winkOpacity, 0, { duration: 0.25, delay: FLIGHT * 0.4 }));

      await wait(REVEAL_DELAY);
      if (finished) return;
      const maxR = Math.hypot(Math.max(target.x, vw - target.x), Math.max(target.y, vh - target.y));
      await run(animate(radius, maxR + 2, { duration: REVEAL, ease: [0.55, 0, 0.45, 1] }));
      finish();
    })();

    return () => {
      window.removeEventListener("keydown", onKey);
      finish();
    };
  }, [x, y, scale, rotate, openOpacity, winkOpacity, logoOpacity, legsY, legsOpacity, radius, cx, cy, overlayOpacity]);

  const layer = { position: "absolute" as const, left: 0, top: 0, width: FRAME_W, height: FRAME_H };

  return (
    <motion.div
      className="intro-splash fixed inset-0 z-[100]"
      aria-hidden="true"
      onClick={() => finishRef.current()}
      style={{ opacity: overlayOpacity }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: NAVY, maskImage: mask, WebkitMaskImage: mask }}
      >
        {INTRO_STARS.map((st, i) => (
          <ScatterStar
            key={i}
            color={st.color}
            size={st.size}
            className="intro-twinkle"
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              transform: "translate(-50%, -50%)",
              animationDelay: `${(i * 0.37) % 1.6}s`,
            }}
          />
        ))}
      </motion.div>
      <div ref={riseRef} className="intro-rise absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          width: FRAME_W,
          height: FRAME_H,
          marginLeft: -FRAME_W / 2,
          marginTop: -FRAME_H / 2,
          x,
          y,
          scale,
          rotate,
        }}
      >
        <motion.div style={{ ...layer, y: legsY, opacity: legsOpacity }}>
          <Image src="/assets/intro/star-legs-boots.png" alt="" width={908} height={934} priority style={layer} />
        </motion.div>
        <motion.div style={{ ...layer, opacity: openOpacity }}>
          <Image src="/assets/intro/star-open-body.png" alt="" width={908} height={934} priority style={layer} />
        </motion.div>
        <motion.div style={{ ...layer, opacity: winkOpacity }}>
          <Image src="/assets/intro/star-wink-body.png" alt="" width={908} height={934} priority style={layer} />
        </motion.div>
        <motion.div
          style={{
            position: "absolute",
            left: LOGO_OFFSET.x,
            top: LOGO_OFFSET.y,
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            opacity: logoOpacity,
          }}
        >
          <Image
            src="/assets/intro/logo.png"
            alt=""
            width={900}
            height={900}
            priority
            style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
          />
        </motion.div>
      </motion.div>
      </div>
    </motion.div>
  );
}

// background stars: white, kept clear of the center
const INTRO_STARS: { x: number; y: number; size: number; color: string }[] = [
  { x: 8, y: 12, size: 16, color: "#ffffff" },
  { x: 22, y: 6, size: 12, color: "#ffffff" },
  { x: 38, y: 16, size: 14, color: "#ffffff" },
  { x: 57, y: 9, size: 18, color: "#ffffff" },
  { x: 74, y: 14, size: 12, color: "#ffffff" },
  { x: 91, y: 8, size: 16, color: "#ffffff" },
  { x: 14, y: 31, size: 12, color: "#ffffff" },
  { x: 86, y: 29, size: 14, color: "#ffffff" },
  { x: 5, y: 48, size: 18, color: "#ffffff" },
  { x: 27, y: 44, size: 12, color: "#ffffff" },
  { x: 73, y: 46, size: 12, color: "#ffffff" },
  { x: 95, y: 52, size: 16, color: "#ffffff" },
  { x: 16, y: 66, size: 14, color: "#ffffff" },
  { x: 84, y: 68, size: 18, color: "#ffffff" },
  { x: 33, y: 78, size: 16, color: "#ffffff" },
  { x: 66, y: 81, size: 14, color: "#ffffff" },
  { x: 9, y: 88, size: 12, color: "#ffffff" },
  { x: 50, y: 92, size: 12, color: "#ffffff" },
  { x: 92, y: 90, size: 14, color: "#ffffff" },
];
