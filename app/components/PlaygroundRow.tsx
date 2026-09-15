import { ReactNode } from "react";

/**
 * Independently horizontally-scrollable "creative miscellany" shelf.
 * Solid white padding on both edges (not a gradient fade) so the scroll
 * container always reads as a clean-edged strip against the white section bg.
 */
export default function PlaygroundRow({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white px-10">
      <div className="flex gap-6 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {children}
      </div>
    </div>
  );
}
