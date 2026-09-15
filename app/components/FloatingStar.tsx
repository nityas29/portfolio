"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

type FloatingStarProps = {
  src: string;
  size?: number;
  rotate?: number;
  className?: string;
  /** how far the star pushes away from the cursor, in px */
  pushDistance?: number;
  /** how far the star bobs up/down while idle, in px */
  bobDistance?: number;
};

export default function FloatingStar({
  src,
  size = 160,
  rotate = -4.69,
  className = "",
  pushDistance = 18,
  bobDistance = 8,
}: FloatingStarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = cx - e.clientX;
    const dy = cy - e.clientY;
    const dist = Math.max(Math.hypot(dx, dy), 1);
    // hard clamp on top of the unit-vector math below, so the star can never
    // be pushed further than pushDistance no matter what triggers this handler
    const clamp = (n: number) => Math.max(-pushDistance, Math.min(pushDistance, n));
    setHover({
      x: clamp((dx / dist) * pushDistance),
      y: clamp((dy / dist) * pushDistance),
    });
  }

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover(null)}
    >
      <motion.div
        className="w-full h-full"
        animate={
          hover
            ? { x: hover.x, y: hover.y }
            : { x: 0, y: [0, -bobDistance, 0] }
        }
        transition={
          hover
            ? // tween, not spring: a spring being continuously re-targeted by fast
              // mousemove events can resonate and overshoot way past the target
              // (that's what was sending stars flying off screen) - a tween only
              // ever eases toward the target and can never exceed it
              { x: { duration: 0.25, ease: "easeOut" }, y: { duration: 0.25, ease: "easeOut" } }
            : {
                // deliberately slow, non-bouncy glide back to rest - no spring here,
                // so it never overshoots or snaps into place
                x: { duration: 0.9, ease: "easeOut" },
                y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              }
        }
        style={{ transform: `rotate(${rotate}deg)`, position: "relative" }}
      >
        <Image src={src} alt="" fill sizes={`${size}px`} style={{ objectFit: "contain" }} />
      </motion.div>
    </div>
  );
}
