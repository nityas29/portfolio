"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Tag = { label: string; color: string };

type MediaProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type BadgeProps = {
  src: string;
  size: number;
  /** offset from the corner it's anchored to */
  className: string;
};

type ProjectCardProps = {
  title: string;
  date: string;
  description: string;
  tags: Tag[];
  href: string;
  comingSoon?: boolean;
  /** photo/screenshot for shipped projects */
  media?: MediaProps;
  /** illustrated stand-in for projects without a media shot yet (e.g. "under construction") */
  mediaSlot?: React.ReactNode;
  /** "left" = media sits left of the text card, "right" = media sits right (default) */
  mediaPosition?: "left" | "right";
  badges?: BadgeProps[];
  /** looping preview video shown on hover, in place of the static media */
  video?: string;
};

const VIDEO_W = 408;
const VIDEO_H = 271;
const CARD_H = 271;

export default function ProjectCard({
  title,
  date,
  description,
  tags,
  href,
  comingSoon = false,
  media,
  mediaSlot,
  mediaPosition = "right",
  badges,
  video,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [tip, setTip] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const card = (
    <div
      className="relative z-10 bg-white p-6 flex flex-col justify-center gap-2 w-full max-w-[552px] min-w-0 overflow-hidden"
      style={{ height: CARD_H }}
    >
      <h3 className="font-mono font-medium text-black text-[29px] leading-tight">{title}</h3>
      <p className="font-mono font-light text-black/50 text-sm">{date}</p>
      <p className="font-mono text-black text-[15px] leading-snug line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-1.5 mt-1">
        {tags.map((tag) => (
          <span
            key={tag.label}
            className="font-mono uppercase text-xs text-white px-2.5 py-1"
            style={{ backgroundColor: tag.color }}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );

  const mediaBlock = (media || mediaSlot) && (
    <div className="relative shrink-0" style={video ? { width: VIDEO_W, height: VIDEO_H } : undefined}>
      {badges?.map((b, i) => (
        <Image
          key={i}
          src={b.src}
          alt=""
          width={b.size}
          height={b.size}
          className={`absolute z-0 pointer-events-none ${b.className}`}
        />
      ))}
      {media && video && (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={`${VIDEO_W}px`}
          className="relative z-10 object-cover"
          style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.2s ease" }}
        />
      )}
      {media && !video && (
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          className="relative z-10 object-cover"
        />
      )}
      {mediaSlot}
      {video && (
        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-10 object-cover w-full h-full"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.2s ease" }}
        />
      )}
    </div>
  );

  const content = (
    <div
      className="relative flex items-center justify-center gap-8 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ flexDirection: mediaPosition === "left" ? "row-reverse" : "row" }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            className="absolute z-20 text-black font-mono uppercase text-sm px-3 py-1 rounded whitespace-nowrap pointer-events-none"
            style={{ backgroundColor: "#eb369b", left: tip.x, top: tip.y, transform: "translate(-50%, -140%)" }}
          >
            {comingSoon ? "COMING SOON" : "VIEW CASE STUDY"}
          </motion.div>
        )}
      </AnimatePresence>

      {card}
      {mediaBlock}
    </div>
  );

  if (comingSoon) {
    return <div>{content}</div>;
  }

  return <Link href={href}>{content}</Link>;
}
