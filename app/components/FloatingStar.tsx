"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

  // raw values driven by the hover/idle animations below
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // hard visual clamp applied on every single frame: no matter what drives
  // rawX/rawY (hover push, idle bob, or any future animation added here),
  // the star's rendered center can never move further than its own size
  // away from its resting spot - this is what actually stops it from
  // flying off screen, independent of whatever animation produced the value
  const boundedX = useTransform(rawX, (v) => Math.max(-size, Math.min(size, v)));
  const boundedY = useTransform(rawY, (v) => Math.max(-size, Math.min(size, v)));

  useEffect(() => {
    const controls = animate(rawX, hover ? hover.x : 0, {
      duration: hover ? 0.25 : 0.9,
      ease: "easeOut",
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover]);

  useEffect(() => {
    const controls = hover
      ? animate(rawY, hover.y, { duration: 0.25, ease: "easeOut" })
      : animate(rawY, [0, -bobDistance, 0], { duration: 3.2, repeat: Infinity, ease: "easeInOut" });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover, bobDistance]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = cx - e.clientX;
    const dy = cy - e.clientY;
    const dist = Math.max(Math.hypot(dx, dy), 1);
    // clamp on top of the unit-vector math, so the *target* is also always
    // within pushDistance (belt and suspenders with the render-time clamp above)
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
        style={{ x: boundedX, y: boundedY, rotate, position: "relative" }}
      >
        <Image src={src} alt="" fill sizes={`${size}px`} style={{ objectFit: "contain" }} />
      </motion.div>
    </div>
  );
}
