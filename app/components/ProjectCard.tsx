"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_PATH } from "../lib/basePath";

type Tag = { label: string; color: string };

type MediaProps = {
  src: string;
  alt: string;
};

type ProjectCardProps = {
  title: string;
  date: string;
  description: string;
  tags: Tag[];
  href: string;
  comingSoon?: boolean;
  /** static mockup shown in the card's top frame */
  media?: MediaProps;
  /** looping playthrough that replaces the static mockup on hover */
  video?: string;
  /** background color of the mockup frame (default: none) */
  mediaBg?: string;
  /** zoom the image in slightly and pin it to the bottom, so extra crop comes off the top */
  zoomAnchor?: "bottom";
  /** pin the image to the bottom of the frame (no zoom), so any crop comes off the top */
  mediaAlign?: "bottom";
};

// one card per project: mockup frame on top, details below. The frame keeps the
// Figma mockup proportions (719 x 442).
export default function ProjectCard({
  title,
  date,
  description,
  tags,
  href,
  comingSoon = false,
  media,
  video,
  mediaBg,
  zoomAnchor,
  mediaAlign,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [tip, setTip] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const mockup = media && (
    <div
      className="relative w-full aspect-[719/442] overflow-hidden"
      style={mediaBg ? { backgroundColor: mediaBg } : undefined}
    >
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes="(max-width: 767px) 100vw, 560px"
        className={
          zoomAnchor
            ? "object-cover object-bottom origin-bottom scale-[1.06]"
            : mediaAlign === "bottom"
              ? "object-cover object-bottom"
              : "object-cover"
        }
        style={
          video
            ? { opacity: hovered ? 0 : 1, transition: "opacity 0.2s ease" }
            : undefined
        }
      />
      {video && (
        <video
          src={`${BASE_PATH}${video}`}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 object-cover w-full h-full"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.2s ease" }}
        />
      )}
    </div>
  );

  const content = (
    <div
      className="relative h-full cursor-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            className="hidden md:block absolute z-20 text-black font-mono uppercase text-sm px-3 py-1 rounded whitespace-nowrap pointer-events-none"
            style={{
              backgroundColor: "#eb369b",
              left: tip.x,
              top: tip.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {comingSoon ? "COMING SOON" : "VIEW CASE STUDY"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* clipping lives on this inner box so the tooltip above can hang outside the card */}
      <div className="h-full bg-white overflow-hidden flex flex-col">
        <div className="p-5 md:p-6 pb-0 md:pb-0">{mockup}</div>

        <div className="p-5 md:p-6 flex flex-col gap-2 flex-1">
          <h3 className="font-mono font-medium text-black text-[22px] md:text-[26px] leading-tight">
            {title}
          </h3>
          <p className="font-mono font-light text-black/50 text-sm">{date}</p>
          <p className="font-mono text-black text-[15px] leading-snug">
            {description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
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
      </div>
    </div>
  );

  if (comingSoon) {
    return <div className="h-full">{content}</div>;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}
