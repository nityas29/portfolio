type ImagePlaceholderProps = {
  label: string;
  width: number;
  height: number;
  className?: string;
};

/**
 * Stand-in for a personal/creative image we don't have the file for yet.
 * Sized to match the real Figma layout so swapping in the real asset later
 * (via next/image) won't shift anything around it.
 */
export default function ImagePlaceholder({ label, width, height, className = "" }: ImagePlaceholderProps) {
  return (
    <div
      className={`shrink-0 flex items-center justify-center border-2 border-dashed border-black/20 bg-black/5 ${className}`}
      style={{ width, height }}
    >
      <p className="font-mono text-black/40 text-xs text-center px-4 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}
