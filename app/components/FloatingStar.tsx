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
    setHover({
      x: (dx / dist) * pushDistance,
      y: (dy / dist) * pushDistance,
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
            ? { type: "spring", stiffness: 180, damping: 12 }
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
