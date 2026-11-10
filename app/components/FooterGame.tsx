"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BASE_PATH } from "../lib/basePath";

/*
  Footer runner game, modeled on Chrome's offline dino game (constants from
  Chromium's offline.js, rescaled to this art and to real seconds).

  Art is from Figma "gamified bottom bar" (file 6Mr4yl4ipVjjQ0BsEf3SzU, node
  186:11). All game numbers below are in Figma px (the 1920-wide frame); the
  site renders that frame at 80%, so everything is multiplied by S on screen.
  The game area runs from GAME_LEFT to the right edge of the footer and clips
  its contents cleanly at its left edge, which is also where the star stands.
*/

const S = 0.8;

// where the game area starts: 30% of the footer, but never closer than 400px
// so it (and the hint to its left) stays clear of the footer links
const GAME_LEFT = "max(400px, 30%)";

// height of the pink ground strip (68 Figma px at 80%); Footer uses it too
export const GROUND_STRIP = 54;

const STAR_W = 188;
const STAR_H = 192.2;

// each rock's top outline as [x, height above ground] points, traced from its
// SVG path, so collisions follow the real lumpy shape instead of a rectangle
// (a box over rock 3's low shelf used to catch the star on empty air)
const ROCKS = [
  {
    src: "/assets/game/rock-1.svg",
    w: 129.065,
    h: 60,
    top: [[0, 20], [1.4, 25.4], [12, 39.5], [17.6, 42.3], [27.1, 42.3], [32.3, 44.6], [44.2, 57.7], [49.4, 60], [89.6, 60], [96, 55.9], [100.3, 46.4], [106.6, 42.3], [118.3, 42.3], [125.2, 36.2], [129, 8], [129.065, 0]],
  },
  {
    src: "/assets/game/rock-2.svg",
    w: 124.229,
    h: 58.588,
    top: [[0, 18], [0.8, 22], [13, 45.5], [17.9, 49.2], [66.2, 58.5], [71.4, 57.4], [98, 39.8], [120, 30.1], [124.2, 22], [124.229, 0]],
  },
  {
    src: "/assets/game/rock-3.svg",
    w: 132.18,
    h: 59,
    top: [[0, 10], [0.8, 14.4], [5.3, 22.8], [10.6, 26.5], [29.5, 28.9], [35.5, 34.4], [39.3, 53.4], [46.2, 59], [74.8, 59], [78.8, 57.8], [104.5, 40.4], [124.8, 27.4], [127.7, 23.5], [131.9, 9], [132.18, 0]],
  },
] as { src: string; w: number; h: number; top: [number, number][] }[];
const CLOUDS = [
  { src: "/assets/game/cloud-1.svg", w: 171.682, h: 81.674 },
  { src: "/assets/game/cloud-2.svg", w: 171.682, h: 81.675 },
  { src: "/assets/game/cloud-3.svg", w: 171.682, h: 81.674 },
];
// where the clouds sit before the game starts (from the Figma frame)
const IDLE_CLOUDS = [
  { x: 184, y: 18.46, v: 0 },
  { x: 465, y: 78, v: 1 },
  { x: 746.32, y: 11, v: 2 },
];

// --- motion (Figma px and seconds) ---
// dino: speed 6 -> 13 px/frame on a 600px canvas, +0.001 per frame
const SPEED_START = 560;
const SPEED_MAX = 1100;
const ACCEL = 5.6; // per second, ~1.5 minutes to top speed
// dino: launch at -10, gravity 0.6, and letting go early clamps the rise to
// DROP_VELOCITY once a minimum height is reached (hold = higher jump)
const GRAVITY = 1812;
const JUMP_VELOCITY = 725; // full hold: rises ~145
const MIN_RISE = 75; // a tap still clears a rock
const DROP_VELOCITY = 320;
// dino: no obstacles for the first moments of a run
const CLEAR_TIME = 1.0;
// dino getGap: minGap = width * speed + minGap * 0.6
// tightened for difficulty: the minimum sits just above the gap a player can't
// beat (too long for one jump, too short to land and jump again), which was
// simulated at ~160 / 220 / 360 for speeds 560 / 800 / 1100
const GAP_TIME = 0.42;
const GAP_BASE = 70;
// the dino's 1x-1.5x range felt too even here, so gaps are looser, with
// occasional long breathers and occasional tight pairs of small rocks
const GAP_RANGE: [number, number] = [1, 1.8];
const LONG_GAP_CHANCE = 0.12;
const LONG_GAP_RANGE: [number, number] = [1.8, 2.6];
const PAIR_CHANCE = 0.2;
const PAIR_GAP: [number, number] = [8, 40];
// every rock gets its own size; big ones need a held jump
const ROCK_SCALE: [number, number] = [0.7, 1.3];
const PAIR_SCALE: [number, number] = [0.65, 0.8];
const MAX_DUPLICATION = 2;
// dino clouds: gap 100-400 on a 600px canvas, sky level 30-71, max 6
const CLOUD_GAP: [number, number] = [160, 640];
const CLOUD_SKY: [number, number] = [11, 78];
const MAX_CLOUDS = 6;
const MAX_ROCKS = 4;
// dino: score = distance * 0.025 on a 600px canvas
const SCORE_COEFFICIENT = 0.025 / 1.6;
const GAMEOVER_CLEAR_TIME = 750; // ms before space/enter can restart

// collision boxes, star-local Figma px (top-left origin). Like the dino,
// they skip the arm tips so near misses feel fair.
const STAR_BOXES = [
  { x: 80, y: 8, w: 28, h: 50 },
  { x: 40, y: 60, w: 108, h: 45 },
  { x: 55, y: 105, w: 78, h: 40 },
  { x: 68, y: 140, w: 60, h: 52 },
];
// forgiveness, in rock art px: the outline is shaved this much on every side
const ROCK_FORGIVE = 4;

// highest point of an outline between art x a and b (a <= b)
function profileMax(top: [number, number][], a: number, b: number) {
  const at = (x: number) => {
    for (let i = 1; i < top.length; i++) {
      const [x0, h0] = top[i - 1];
      const [x1, h1] = top[i];
      if (x <= x1) return h0 + ((h1 - h0) * (x - x0)) / (x1 - x0 || 1);
    }
    return 0;
  };
  let m = Math.max(at(a), at(b));
  for (const [x, h] of top) if (x > a && x < b) m = Math.max(m, h);
  return m;
}

const HI_KEY = "star-game-hi";

type Phase = "idle" | "running" | "over";
type Rock = { x: number; v: number; w: number; h: number; flip: boolean; gap: number; slot: number };
type Cloud = { x: number; y: number; v: number; gap: number; slot: number };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pad = (n: number) => String(Math.floor(n)).padStart(5, "0");

export default function FooterGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");

  const areaRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const rockEls = useRef<(HTMLDivElement | null)[]>([]);
  const cloudEls = useRef<(HTMLDivElement | null)[]>([]);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const hiRef = useRef<HTMLSpanElement>(null);

  // all mutable game state lives here, outside React, and is drawn straight
  // to the DOM each frame
  const g = useRef({
    width: 960, // game area width in Figma px
    speed: SPEED_START,
    runTime: 0,
    distance: 0,
    hi: 0,
    y: 0, // star height above the ground
    vy: 0,
    jumping: false,
    holding: false,
    reachedMin: false,
    landT: 1, // seconds since landing (for the squash)
    walkT: 0,
    rocks: [] as Rock[],
    pairNext: false, // the next rock is the second half of a tight pair
    history: [] as number[],
    clouds: [] as Cloud[],
    crashedAt: 0,
    raf: 0,
    last: 0,
    visible: true,
  });

  const draw = useCallback(() => {
    const s = g.current;
    const star = starRef.current;
    if (star) {
      const running = phaseRef.current === "running";
      // little waddle while running on the ground, squash on landing
      const waddle = running && !s.jumping ? Math.sin(s.walkT * Math.PI * 2 * 3.2) * 3 : 0;
      const squash = s.landT < 0.12 ? 1 - 0.08 * Math.sin((s.landT / 0.12) * Math.PI) : 1;
      star.style.transform = `translate3d(0, ${-s.y * S}px, 0) rotate(${waddle}deg) scale(${2 - squash}, ${squash})`;
    }
    const usedR = new Set(s.rocks.map((r) => r.slot));
    s.rocks.forEach((r) => {
      const el = rockEls.current[r.slot];
      if (el) el.style.transform = `translate3d(${r.x * S}px, 0, 0)${r.flip ? " scaleX(-1)" : ""}`;
    });
    rockEls.current.forEach((el, i) => {
      if (el) el.style.visibility = usedR.has(i) ? "visible" : "hidden";
    });
    const usedC = new Set(s.clouds.map((c) => c.slot));
    s.clouds.forEach((c) => {
      const el = cloudEls.current[c.slot];
      if (el) el.style.transform = `translate3d(${c.x * S}px, ${c.y * S}px, 0)`;
    });
    cloudEls.current.forEach((el, i) => {
      if (el) el.style.visibility = usedC.has(i) ? "visible" : "hidden";
    });
    if (scoreRef.current) scoreRef.current.textContent = pad(s.distance * SCORE_COEFFICIENT);
    if (hiRef.current) hiRef.current.textContent = s.hi > 0 ? `HI ${pad(s.hi)}` : "";
  }, []);

  const freeSlot = (used: { slot: number }[], max: number) => {
    for (let i = 0; i < max; i++) if (!used.some((u) => u.slot === i)) return i;
    return -1;
  };

  const addRock = useCallback(() => {
    const s = g.current;
    const slot = freeSlot(s.rocks, MAX_ROCKS);
    if (slot < 0) return;
    // dino: never the same obstacle type more than twice in a row
    let v = Math.floor(Math.random() * ROCKS.length);
    while (s.history.length >= MAX_DUPLICATION && s.history.every((h) => h === v)) {
      v = Math.floor(Math.random() * ROCKS.length);
    }
    s.history = [v, ...s.history].slice(0, MAX_DUPLICATION);
    const art = ROCKS[v];
    const second = s.pairNext;
    s.pairNext = false;
    const minGap = s.speed * GAP_TIME + GAP_BASE;
    let gap: number;
    let scale: number;
    if (second) {
      // second rock of a pair: small, then a normal gap after it
      scale = rand(...PAIR_SCALE);
      gap = minGap * rand(...GAP_RANGE);
    } else if (Math.random() < PAIR_CHANCE) {
      // small rock with another small one right behind it: one jump clears both
      scale = rand(...PAIR_SCALE);
      gap = rand(...PAIR_GAP);
      s.pairNext = true;
    } else {
      scale = rand(...ROCK_SCALE);
      gap = minGap * rand(...(Math.random() < LONG_GAP_CHANCE ? LONG_GAP_RANGE : GAP_RANGE));
    }
    const w = art.w * scale;
    const h = art.h * scale;
    s.rocks.push({ x: s.width, v, w, h, flip: Math.random() < 0.5, gap, slot });
    const el = rockEls.current[slot];
    if (el) {
      el.style.width = `${w * S}px`;
      el.style.height = `${h * S}px`;
      el.style.backgroundImage = `url(${BASE_PATH}${art.src})`;
    }
  }, []);

  const addCloud = useCallback((x: number, y: number, v: number) => {
    const s = g.current;
    const slot = freeSlot(s.clouds, MAX_CLOUDS);
    if (slot < 0) return;
    s.clouds.push({ x, y, v, gap: rand(...CLOUD_GAP), slot });
    const el = cloudEls.current[slot];
    if (el) el.style.backgroundImage = `url(${BASE_PATH}${CLOUDS[v].src})`;
  }, []);

  const collides = useCallback(() => {
    const s = g.current;
    for (const r of s.rocks) {
      if (r.x > STAR_W || r.x + r.w < 0) continue;
      const art = ROCKS[r.v];
      const k = r.h / art.h; // this rock's size
      for (const b of STAR_BOXES) {
        // the box's x span in the rock's own art units (mirrored if flipped),
        // shaved by the forgiveness and clipped to the rock
        let a = (b.x - r.x) / k;
        let c = (b.x + b.w - r.x) / k;
        if (r.flip) [a, c] = [art.w - c, art.w - a];
        a = Math.max(a, ROCK_FORGIVE);
        c = Math.min(c, art.w - ROCK_FORGIVE);
        if (a >= c) continue;
        const rockTop = (profileMax(art.top, a, c) - ROCK_FORGIVE) * k;
        const boxBottom = s.y + (STAR_H - (b.y + b.h)); // above the ground
        if (boxBottom < rockTop) return true;
      }
    }
    return false;
  }, []);

  const startJump = useCallback(() => {
    const s = g.current;
    if (s.jumping) return;
    s.jumping = true;
    s.reachedMin = false;
    s.vy = JUMP_VELOCITY;
  }, []);

  const endJump = useCallback(() => {
    const s = g.current;
    s.holding = false;
    if (s.jumping && s.reachedMin && s.vy > DROP_VELOCITY) s.vy = DROP_VELOCITY;
  }, []);

  const step = useCallback(
    (dt: number) => {
      const s = g.current;
      s.runTime += dt;
      s.walkT += dt * (s.speed / SPEED_START);
      s.landT += dt;
      s.speed = Math.min(SPEED_MAX, s.speed + ACCEL * dt);
      const dx = s.speed * dt;
      s.distance += dx;

      // jump: hold for the full arc; letting go early clamps the rise
      if (s.jumping) {
        s.y += s.vy * dt;
        s.vy -= GRAVITY * dt;
        if (s.y >= MIN_RISE) {
          s.reachedMin = true;
          if (!s.holding && s.vy > DROP_VELOCITY) s.vy = DROP_VELOCITY;
        }
        if (s.y <= 0) {
          s.y = 0;
          s.vy = 0;
          s.jumping = false;
          s.landT = 0;
        }
      }

      // rocks
      s.rocks.forEach((r) => (r.x -= dx));
      s.rocks = s.rocks.filter((r) => r.x + r.w > 0);
      if (s.runTime > CLEAR_TIME) {
        const last = s.rocks[s.rocks.length - 1];
        if (!last) addRock();
        else if (last.x + last.w + last.gap < s.width) addRock();
      }

      // clouds move with the rocks
      s.clouds.forEach((c) => (c.x -= dx));
      s.clouds = s.clouds.filter((c) => c.x + CLOUDS[c.v].w > 0);
      const lastC = s.clouds[s.clouds.length - 1];
      if (s.clouds.length < MAX_CLOUDS && (!lastC || lastC.x + CLOUDS[lastC.v].w + lastC.gap < s.width)) {
        addCloud(s.width, rand(...CLOUD_SKY), Math.floor(Math.random() * CLOUDS.length));
      }

      if (collides()) {
        const score = Math.floor(s.distance * SCORE_COEFFICIENT);
        if (score > s.hi) {
          s.hi = score;
          try {
            localStorage.setItem(HI_KEY, String(score));
          } catch {}
        }
        s.crashedAt = performance.now();
        phaseRef.current = "over";
        setPhase("over");
      }
    },
    [addRock, addCloud, collides],
  );

  const resume = useCallback(() => {
    const s = g.current;
    if (s.raf || phaseRef.current !== "running" || !s.visible) return;
    s.last = performance.now();
    const tick = (now: number) => {
      if (phaseRef.current !== "running" || !s.visible) {
        s.raf = 0;
        return;
      }
      const dt = Math.min(0.05, (now - s.last) / 1000);
      s.last = now;
      step(dt);
      draw();
      s.raf = phaseRef.current === "running" ? requestAnimationFrame(tick) : 0;
    };
    s.raf = requestAnimationFrame(tick);
  }, [step, draw]);

  const start = useCallback(
    (withJump: boolean) => {
      const s = g.current;
      s.speed = SPEED_START;
      s.runTime = 0;
      s.distance = 0;
      s.y = 0;
      s.vy = 0;
      s.jumping = false;
      s.landT = 1;
      s.rocks = [];
      s.history = [];
      s.pairNext = false;
      phaseRef.current = "running";
      setPhase("running");
      if (withJump) {
        s.holding = true;
        startJump();
      }
      draw();
      resume();
    },
    [draw, resume, startJump],
  );

  // setup: measure the area, load the high score, place the idle clouds
  useEffect(() => {
    const s = g.current;
    try {
      s.hi = Number(localStorage.getItem(HI_KEY)) || 0;
    } catch {}
    s.clouds = [];
    const area = areaRef.current;
    if (area) s.width = area.clientWidth / S;
    // the Figma clouds were laid out on a 960-wide area; spread them to fit
    IDLE_CLOUDS.forEach((c) => addCloud((c.x * s.width) / 960, c.y, c.v));
    const ro = new ResizeObserver(() => {
      if (area) s.width = area.clientWidth / S;
    });
    if (area) ro.observe(area);
    // pause when the footer is off screen or the tab is hidden, like the dino
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting && !document.hidden;
      resume();
    });
    if (area) io.observe(area);
    const onVis = () => {
      s.visible = !document.hidden;
      resume();
    };
    document.addEventListener("visibilitychange", onVis);
    const onUp = () => endJump();
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    draw();
    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [addCloud, draw, endJump, resume]);

  const press = useCallback(() => {
    const s = g.current;
    if (phaseRef.current === "idle") start(true);
    else if (phaseRef.current === "running") {
      s.holding = true;
      startJump();
    }
  }, [start, startJump]);

  // keyboard: Space / Up jump (Enter too when the game itself is focused).
  // Once a game has started they work page-wide while the game is on screen,
  // so clicking elsewhere or the restart button disappearing doesn't break it.
  useEffect(() => {
    const isJumpKey = (e: KeyboardEvent, inArea: boolean) =>
      e.key === " " || e.key === "ArrowUp" || (inArea && e.key === "Enter");
    const applies = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return null;
      const inArea = !!t && !!areaRef.current?.contains(t);
      const active = phaseRef.current !== "idle" && g.current.visible;
      if (!inArea && !active) return null;
      return isJumpKey(e, inArea) ? true : null;
    };
    const onDown = (e: KeyboardEvent) => {
      if (!applies(e)) return;
      e.preventDefault(); // no page scroll while playing
      if (e.repeat) return;
      if (phaseRef.current === "over") {
        if (performance.now() - g.current.crashedAt >= GAMEOVER_CLEAR_TIME) start(false);
        return;
      }
      press();
    };
    const onUp = (e: KeyboardEvent) => {
      if (!applies(e)) return;
      e.preventDefault();
      endJump();
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [press, start, endJump]);

  return (
    <>
      {/* "click to play!" hint, just left of the game area, pointing at the star */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute z-10 pointer-events-none transition-opacity duration-300"
        style={{ left: `calc(${GAME_LEFT} - ${126 * S}px)`, top: 0, opacity: phase === "idle" ? 1 : 0 }}
      >
        <p
          className="absolute font-mono font-light text-black whitespace-nowrap -translate-y-1/2"
          style={{ fontSize: 15 * S, top: 179 * S, left: 0 }}
        >
          click to play!
        </p>
        <div
          className="absolute flex items-center justify-center"
          style={{ left: 72.03 * S, top: 194.44 * S, width: 35.251 * S, height: 20.556 * S }}
        >
          <Image
            src="/assets/game/hint-arrow.svg"
            alt=""
            width={37.061}
            height={7.101}
            style={{ width: 36.561 * S, height: 7.101 * S, maxWidth: "none", transform: "rotate(25.6deg)" }}
          />
        </div>
      </div>

      {/* game area: the right half of the footer, above the pink ground strip */}
      <div
        ref={areaRef}
        role="button"
        tabIndex={0}
        aria-label="Star jump game. Click or press space to jump, hold for a higher jump."
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          press();
        }}
        className="hidden lg:block absolute z-20 right-0 top-0 overflow-hidden select-none outline-none"
        style={{ left: GAME_LEFT, bottom: GROUND_STRIP, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
      >
        {Array.from({ length: MAX_CLOUDS }, (_, i) => (
          <div
            key={`c${i}`}
            ref={(el) => {
              cloudEls.current[i] = el;
            }}
            className="absolute left-0 top-0 bg-no-repeat"
            style={{
              width: CLOUDS[0].w * S,
              height: CLOUDS[0].h * S,
              backgroundSize: "100% 100%",
              visibility: "hidden",
              willChange: "transform",
            }}
          />
        ))}

        {Array.from({ length: MAX_ROCKS }, (_, i) => (
          <div
            key={`r${i}`}
            ref={(el) => {
              rockEls.current[i] = el;
            }}
            className="absolute left-0 bottom-0 bg-no-repeat"
            style={{ backgroundSize: "100% 100%", visibility: "hidden", willChange: "transform" }}
          />
        ))}

        <div
          ref={starRef}
          className="absolute left-0 bottom-0"
          style={{ width: STAR_W * S, height: STAR_H * S, transformOrigin: "50% 100%", willChange: "transform" }}
        >
          <Image
            src="/assets/game/star-guy.svg"
            alt=""
            width={188}
            height={192.2}
            priority
            draggable={false}
            style={{ width: STAR_W * S, height: STAR_H * S }}
          />
        </div>

        <p
          aria-live="polite"
          className="absolute font-mono text-[12px] tracking-[0.08em] text-[#868686] transition-opacity duration-300"
          style={{ right: 24, top: 18, opacity: phase === "idle" ? 0 : 1 }}
        >
          <span ref={hiRef} className="mr-3" />
          <span ref={scoreRef}>00000</span>
        </p>

        {phase === "over" && (
          <button
            type="button"
            aria-label="Restart game"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => start(false)}
            className="absolute rounded-full bg-[#eb369b] flex items-center justify-center transition-transform duration-150 hover:scale-105 active:scale-95"
            style={{ left: `calc(50% - ${50 * S}px)`, top: 126 * S, width: 100 * S, height: 100 * S }}
          >
            {/* clean circular arrow */}
            <svg
              width={44 * S}
              height={44 * S}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 12a8 8 0 1 1-2.34-5.66L20 8.5" />
              <path d="M20 4v4.5h-4.5" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
