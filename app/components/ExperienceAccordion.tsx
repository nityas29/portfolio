"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type ExperienceItem = {
  id: string;
  title: string; // e.g. "WEB & OPERATIONS SPECIALIST | UW Q CENTER | SEP 2026 - PRESENT"
  color: string; // accent color, e.g. #0098d4
  bullets: string[];
  currently: string;
};

function ExperienceRow({ item }: { item: ExperienceItem }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div className="w-full rounded-[7px] overflow-hidden border border-white/0">
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-full h-[92px] flex items-center justify-between px-6 text-left"
        style={{
          border: `1px solid ${item.color}`,
          borderRadius: 7,
        }}
      >
        {/* fade-in colored fill on hover / open */}
        <motion.div
          className="absolute inset-0 rounded-[7px]"
          style={{ backgroundColor: item.color, zIndex: 0 }}
          initial={false}
          animate={{ opacity: hovered || open ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
        <span className="relative z-10 font-mono font-medium text-white text-[17px] md:text-[24px] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis block flex-1 min-w-0 text-left pr-4">
          {item.title}
        </span>
        <motion.span
          className="relative z-10 text-white"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden bg-white"
      >
        <div className="px-10 py-6">
          <ul className="list-disc font-mono text-black text-lg leading-relaxed space-y-2 pl-8">
            {item.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <p
            className="font-mono text-black text-lg mt-4 px-4 py-3 rounded-[4px] inline-block"
            style={{ backgroundColor: `${item.color}80` }}
          >
            <span className="font-medium">CURRENTLY</span>: {item.currently}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ExperienceAccordion({ items }: { items: ExperienceItem[] }) {
  return (
    <div className="flex flex-col gap-[35px] w-full">
      {items.map((item) => (
        <ExperienceRow key={item.id} item={item} />
      ))}
    </div>
  );
}
