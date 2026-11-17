"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Click-to-expand image used throughout the case studies. Clicking an image grows it,
// in place, from its own on-screen position out to a larger centered size (rather than
// jumping straight to a fixed spot), with a backdrop fade-in. Once expanded, scrolling
// the mouse wheel or pinching while hovering zooms the image in and out. Any page
// scroll or click elsewhere drops it back into place.
type Rect = { top: number; left: number; width: number; height: number };

export default function ExpandableImage({
  src,
  alt,
  width,
  height,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [entered, setEntered] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rects, setRects] = useState<{ origin: Rect; target: Rect } | null>(null);

  useEffect(() => {
    if (!expanded) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    const collapse = () => setExpanded(false);
    window.addEventListener("scroll", collapse, { passive: true });
    document.addEventListener("click", collapse);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", collapse);
      document.removeEventListener("click", collapse);
    };
  }, [expanded]);

  // React's synthetic onWheel is attached as a passive listener at the root, so
  // calling preventDefault() inside a JSX onWheel handler silently fails (and the
  // page/browser handles the wheel/pinch instead of our zoom ever taking effect).
  // Attaching a real, non-passive listener directly on the element is the fix.
  useEffect(() => {
    if (!expanded) return;
    const el = imgRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      e.stopPropagation();
      setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.01)));
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [expanded]);

  function handleOpen(e: React.MouseEvent) {
    e.stopPropagation();
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetWidth = Math.min(window.innerWidth * (window.innerWidth < 768 ? 0.92 : 0.42), 600);
    const targetHeight = targetWidth * (rect.height / rect.width);
    setRects({
      origin: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      target: {
        top: (window.innerHeight - targetHeight) / 2,
        left: (window.innerWidth - targetWidth) / 2,
        width: targetWidth,
        height: targetHeight,
      },
    });
    setZoom(1);
    setEntered(false);
    setExpanded(true);
  }

  const box = rects ? (entered ? rects.target : rects.origin) : null;

  return (
    <>
      {expanded && (
        <div
          className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
            entered ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
      )}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onClick={handleOpen}
        className={
          expanded && box
            ? "fixed z-[70] object-contain shadow-2xl cursor-pointer"
            : `${className} cursor-pointer transition-transform duration-300 ease-out`
        }
        style={
          expanded && box
            ? {
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
                transform: `scale(${entered ? zoom : 1})`,
                transformOrigin: "center center",
                transition:
                  "top 300ms ease-out, left 300ms ease-out, width 300ms ease-out, height 300ms ease-out, transform 150ms ease-out",
              }
            : undefined
        }
      />
    </>
  );
}
