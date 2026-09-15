"use client";

import { motion } from "framer-motion";
import FloatingStar from "./FloatingStar";

type Star = {
  src: string;
  size: number;
  rotate?: number;
  /** final resting position, relative to the photo container */
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  delay: number;
};

const stars: Star[] = [
  { src: "/assets/star-red.png", size: 90, rotate: -5, top: -40, right: -30, delay: 0.1 },
  { src: "/assets/star-orange.png", size: 70, rotate: 14, bottom: -20, left: -50, delay: 0.25 },
  { src: "/assets/star-blue-v2.png", size: 46, rotate: 0, bottom: -60, left: 20, delay: 0.4 },
];

/**
 * On load, each star starts centered/scaled-down behind the photo, then
 * flies outward to its resting spot (per INTERACTIONS.md: "Stars around the
 * profile photo animate in on load — start centered/behind the photo, then
 * fly outward to their final positions"). Once settled, FloatingStar takes
 * over for the usual idle bob + cursor-repel behavior.
 */
export default function AboutHeroStars() {
  return (
    <>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute z-10"
          style={{ top: star.top, bottom: star.bottom, left: star.left, right: star.right }}
          initial={{ opacity: 0, scale: 0.2, x: "-50%", y: "40%" }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 12, delay: star.delay }}
        >
          <FloatingStar src={star.src} size={star.size} rotate={star.rotate} pushDistance={10} bobDistance={5} />
        </motion.div>
      ))}
    </>
  );
}
