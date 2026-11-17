"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  /** from md up, mockup on the left and details on the right (for a card spanning both columns) */
  horizontal?: boolean;
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
  horizontal = false,
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
      onMouseEnter={(e) => {
        handleMouseMove(e);
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* the native cursor is hidden over the card; a copy of the arrow is drawn at the
          pointer and shrinks into its tip while the pink label blooms out of that same
          point, so the cursor reads as morphing into the label */}
      <div
        className="hidden md:block absolute z-20 pointer-events-none"
        style={{ left: tip.x, top: tip.y, opacity: hovered ? 1 : 0, transition: hovered ? "none" : "opacity 0.15s ease" }}
        aria-hidden={!hovered}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          className="absolute"
          style={{
            left: -3,
            top: -2,
            transformOrigin: "3px 2px",
            transform: hovered ? "scale(0.3)" : "scale(1)",
            opacity: hovered ? 0 : 1,
            transition: "transform 0.25s ease, opacity 0.2s ease",
          }}
        >
          <path
            d="M3 2.5 L3 19.5 L7.4 15.6 L10.4 22.6 L13.6 21.2 L10.6 14.4 L16.6 14.4 Z"
            fill="white"
            stroke="#0b1f4d"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        <div
          className="absolute text-black font-mono uppercase text-sm px-3 py-1 rounded whitespace-nowrap"
          style={{
            backgroundColor: "#eb369b",
            transform: "translate(-50%, -50%)",
            clipPath: hovered ? "inset(0% 0% 0% 0% round 4px)" : "inset(50% 50% 50% 50% round 14px)",
            transition: "clip-path 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <span style={{ opacity: hovered ? 1 : 0, transition: `opacity 0.2s ease ${hovered ? "0.12s" : "0s"}` }}>
            {comingSoon ? "COMING SOON" : "VIEW CASE STUDY"}
          </span>
        </div>
      </div>

      {/* clipping lives on this inner box so the tooltip above can hang outside the card */}
      <div
        className={`h-full bg-white rounded-[8px] overflow-hidden flex flex-col ${horizontal ? "md:flex-row md:items-center" : ""}`}
        style={{
          boxShadow: hovered ? "0 0 32px 6px rgba(255, 255, 255, 0.35)" : "0 0 0 0 rgba(255, 255, 255, 0)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <div
          className={`p-5 md:p-6 pb-0 md:pb-0 ${horizontal ? "md:w-1/2 md:shrink-0 md:pb-6 md:pr-0" : ""}`}
        >
          {mockup}
        </div>

        <div
          className={`p-5 md:p-6 flex flex-col gap-2 flex-1 ${horizontal ? "md:justify-center md:pl-8" : ""}`}
        >
          <h3 className="font-mono font-medium text-black text-[22px] md:text-[26px] leading-tight">
            {title}
          </h3>
          <p className="font-mono font-light text-black/50 text-sm">{date}</p>
          <p className="font-mono text-black text-[15px] leading-snug">
            {description}
          </p>

          <div className={`flex flex-wrap gap-1.5 pt-3 ${horizontal ? "md:mt-0" : ""} mt-auto`}>
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
