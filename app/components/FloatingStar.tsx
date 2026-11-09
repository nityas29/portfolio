"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
  animate,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { BASE_PATH } from "../lib/basePath";

type FloatingStarProps = {
  src: string;
  size?: number;
  rotate?: number;
  className?: string;
  /** how far the star pushes away from the cursor, in px */
  pushDistance?: number;
  /** how far the star bobs up/down while idle, in px */
  bobDistance?: number;
  /** animated eyes that follow the cursor and blink (blue star art only) */
  eyes?: boolean;
  /** spin a full turn on click/Enter (off where a parent already handles clicks) */
  spinOnClick?: boolean;
  /** opens one eye while hovered (orange star art only) */
  wink?: boolean;
};

// Motion model (deliberately no springs: a spring re-targeted by rapid
// mousemove events is what once flung these stars off screen).
// - push: eased toward the cursor-repel target once per frame with
//   exponential smoothing, so it can never overshoot, and any change of
//   target (enter, move, leave) just bends the path instead of restarting it
// - bob: its own endless loop, added on top of push, so leaving the star
//   never restarts the bob from 0 (that restart was the old "snap back")
// - the rendered offset is still hard-clamped to the star's own size
const PUSH_TAU_HOVER = 90; // ms, how quickly the star dodges the cursor
const PUSH_TAU_RETURN = 650; // ms, slow glide back to rest
const GAZE_TAU = 45; // ms, how quickly the pupils track the cursor

/** exponential smoothing step that behaves the same at any frame rate */
function ease(mv: MotionValue<number>, target: number, tau: number, dt: number) {
  const v = mv.get();
  const next = v + (target - v) * (1 - Math.exp(-dt / tau));
  mv.set(Math.abs(target - next) < 0.01 ? target : next);
}

export default function FloatingStar({
  src,
  size = 160,
  rotate = -4.69,
  className = "",
  pushDistance = 18,
  bobDistance = 8,
  eyes = false,
  spinOnClick = true,
  wink = false,
}: FloatingStarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // 0 = eye closed, 1 = eye open (wink star only)
  const eyeOpen = useMotionValue(0);
  function setWink(open: boolean) {
    if (!wink) return;
    eyeOpen.set(open ? 1 : 0); // instant swap, no animation
  }

  const pushX = useMotionValue(0);
  const pushY = useMotionValue(0);
  const bobY = useMotionValue(0);
  const spin = useMotionValue(0);
  const pushTarget = useRef<{ x: number; y: number } | null>(null);
  const spinTarget = useRef(0);

  const clampToSize = (v: number) => Math.max(-size, Math.min(size, v));
  const x = useTransform(pushX, clampToSize);
  const y = useTransform([pushY, bobY], ([p, b]: number[]) => clampToSize(p + b));
  const rotation = useTransform(spin, (s) => rotate + s);

  // eyes: pupil offset in the art's own pixel space, plus eyelid closure 0..1
  const gazeX = useMotionValue(0);
  const gazeY = useMotionValue(0);
  const lid = useMotionValue(0);
  const gazeTarget = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(bobY, [0, -bobDistance, 0], {
      duration: 3.2,
      repeat: Infinity,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [bobY, bobDistance, reduceMotion]);

  useAnimationFrame((_, delta) => {
    const dt = Math.min(delta, 64);
    const t = pushTarget.current;
    ease(pushX, t ? t.x : 0, t ? PUSH_TAU_HOVER : PUSH_TAU_RETURN, dt);
    ease(pushY, t ? t.y : 0, t ? PUSH_TAU_HOVER : PUSH_TAU_RETURN, dt);
    if (eyes) {
      ease(gazeX, gazeTarget.current.x, GAZE_TAU, dt);
      ease(gazeY, gazeTarget.current.y, GAZE_TAU, dt);
    }
  });

  // pupils follow the cursor anywhere on the page
  useEffect(() => {
    if (!eyes || reduceMotion) return;
    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      // turn the screen direction into the star's own (tilted, spinning) frame
      const a = (-(rotate + spin.get()) * Math.PI) / 180;
      const lx = dx * Math.cos(a) - dy * Math.sin(a);
      const ly = dx * Math.sin(a) + dy * Math.cos(a);
      const dist = Math.hypot(lx, ly) || 1;
      const strength = Math.min(dist / 140, 1);
      // gaze offset from the eye's center, inside an ellipse that keeps
      // the pupils within the whites; the art's resting look sits at REST
      const gx = (lx / dist) * strength * GAZE_RANGE.x;
      const gy = (ly / dist) * strength * GAZE_RANGE.y;
      gazeTarget.current = { x: gx - REST.x, y: gy - REST.y };
    }
    function onLeave() {
      gazeTarget.current = { x: 0, y: 0 };
    }
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [eyes, reduceMotion, rotate, spin]);

  // occasional blink, sometimes a double blink
  useEffect(() => {
    if (!eyes || reduceMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    const blink = () => animate(lid, [0, 1, 0], { duration: 0.18, ease: "easeInOut" });
    const schedule = () => {
      timer = setTimeout(() => {
        blink();
        if (Math.random() < 0.25) setTimeout(blink, 260);
        schedule();
      }, 2500 + Math.random() * 3500);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [eyes, reduceMotion, lid]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = rect.left + rect.width / 2 - e.clientX;
    const dy = rect.top + rect.height / 2 - e.clientY;
    const dist = Math.max(Math.hypot(dx, dy), 1);
    const clamp = (n: number) => Math.max(-pushDistance, Math.min(pushDistance, n));
    pushTarget.current = {
      x: clamp((dx / dist) * pushDistance),
      y: clamp((dy / dist) * pushDistance),
    };
  }

  function handleSpin() {
    if (reduceMotion) return;
    // each click adds a full turn from wherever the star currently is
    spinTarget.current += 360;
    animate(spin, spinTarget.current, { duration: 0.8, ease: "easeInOut" });
  }

  return (
    <div
      ref={ref}
      {...(spinOnClick && {
        role: "button",
        tabIndex: 0,
        "aria-label": "Spin the star",
        onClick: handleSpin,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSpin();
          }
        },
      })}
      className={`relative outline-none ${className}`}
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setWink(true)}
      onMouseLeave={() => {
        pushTarget.current = null;
        setWink(false);
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{ x, y, rotate: rotation, position: "relative" }}
      >
        <Image
          src={eyes ? EYES_SRC : wink ? WINK.base : src}
          alt=""
          fill
          sizes={`${size}px`}
          style={{ objectFit: "contain" }}
          draggable={false}
        />
        {eyes && <StarEyes gazeX={gazeX} gazeY={gazeY} lid={lid} />}
        {wink && <WinkEye open={eyeOpen} />}
      </motion.div>
    </div>
  );
}

/* ---------- blue star eyes ----------
   Measured from star-guy-blue-v3.png (899 x 921). EYES_SRC is that art with
   the irises painted out; EYE_MASK is an alpha mask of just the eye whites,
   so the pupils and eyelids are always clipped to the drawn eye shape. */
const EYES_SRC = "/assets/star-guy-blue-v3-noiris.png";
const EYE_MASK = "/assets/star-guy-blue-v3-eyemask.png";
const ART_W = 899;
const ART_H = 921;
const STAR_BLUE = "#0098d4";
const IRIS_NAVY = "#090066";
// pupils drawn larger than the original art, scaled around each iris center
const IRIS_SCALE = 1.2;
// where the original art's irises sit relative to the eye centers (it looks right)
const REST = { x: 43, y: -3 };
// how far the pupils can travel from the eye center
const GAZE_RANGE = { x: 46, y: 14 };

const IRISES = [
  { cx: 337.5, cy: 411.5, stars: [{ cx: 322.9, cy: 384.6, r: 19 }, { cx: 327.9, cy: 422.2, r: 15.3 }] },
  { cx: 648.5, cy: 434.5, stars: [{ cx: 633.5, cy: 408.5, r: 19.5 }, { cx: 638.5, cy: 446.2, r: 15.3 }] },
];
const EYE_WHITES = [
  { x0: 195, y0: 353, x1: 393, y1: 477 },
  { x0: 507, y0: 375, x1: 705, y1: 498 },
];

function starPoints(cx: number, cy: number, r: number) {
  const inner = r * 0.46;
  return Array.from({ length: 10 }, (_, i) => {
    const rad = i % 2 === 0 ? r : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

function StarEyes({
  gazeX,
  gazeY,
  lid,
}: {
  gazeX: MotionValue<number>;
  gazeY: MotionValue<number>;
  lid: MotionValue<number>;
}) {
  return (
    <svg
      viewBox={`0 0 ${ART_W} ${ART_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <mask id="star-eye-mask" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
          <image href={`${BASE_PATH}${EYE_MASK}`} x="0" y="0" width={ART_W} height={ART_H} />
        </mask>
      </defs>
      <g mask="url(#star-eye-mask)">
        <motion.g style={{ x: gazeX, y: gazeY }}>
          {IRISES.map((iris, i) => (
            <g key={i} transform={`translate(${iris.cx} ${iris.cy}) scale(${IRIS_SCALE}) translate(${-iris.cx} ${-iris.cy})`}>
              <ellipse
                cx={iris.cx}
                cy={iris.cy}
                rx={47}
                ry={54}
                fill={IRIS_NAVY}
                transform={`rotate(-8 ${iris.cx} ${iris.cy})`}
              />
              {iris.stars.map((s, j) => (
                <polygon key={j} points={starPoints(s.cx, s.cy, s.r)} fill="#fff" />
              ))}
            </g>
          ))}
        </motion.g>
        {EYE_WHITES.map((e, i) => (
          <motion.rect
            key={i}
            x={e.x0 - 6}
            y={e.y0 - 6}
            width={e.x1 - e.x0 + 12}
            height={e.y1 - e.y0 + 12}
            fill={STAR_BLUE}
            style={{ scaleY: lid, originY: 0 }}
          />
        ))}
      </g>
    </svg>
  );
}

/* ---------- orange star wink ----------
   Built from star-guy-orange-v2.png (1110 x 1137): `base` is that art with the
   right closed eye painted out, `closed` is that eye on its own, and `open` is
   the same lashes flipped upward over a white eye and navy iris (like the pink
   star's open eye), clipped to the orange silhouette.
   Boxes are in the art's own pixels. */
const WINK = {
  base: "/assets/star-guy-orange-v2-noeye.png",
  w: 1110,
  h: 1137,
  closed: { src: "/assets/star-guy-orange-v2-eye-closed.png", x: 592, y: 433, w: 305, h: 148 },
  open: { src: "/assets/star-guy-orange-v2-eye-open-v2.png", x: 557, y: 421, w: 320, h: 225 },
};

function WinkEye({ open }: { open: MotionValue<number> }) {
  const closedOpacity = useTransform(open, (v) => 1 - v);
  return (
    <svg
      viewBox={`0 0 ${WINK.w} ${WINK.h}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <motion.image
        href={`${BASE_PATH}${WINK.closed.src}`}
        x={WINK.closed.x}
        y={WINK.closed.y}
        width={WINK.closed.w}
        height={WINK.closed.h}
        style={{ opacity: closedOpacity }}
      />
      <motion.image
        href={`${BASE_PATH}${WINK.open.src}`}
        x={WINK.open.x}
        y={WINK.open.y}
        width={WINK.open.w}
        height={WINK.open.h}
        style={{ opacity: open }}
      />
    </svg>
  );
}
