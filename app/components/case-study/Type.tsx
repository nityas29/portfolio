// The case-study type scale: five roles, two weights (medium for Statement, semibold
// for Heading, regular everywhere else). None of these set a font family - each case
// study sets its product's sans font once on its root, and these inherit it. Eyebrow
// is the one exception: it's the portfolio's own DM Mono, used as a consistent
// section marker across every case study.
//
//   Eyebrow   14 -> 16   mono, uppercase  section labels
//   Statement 24 -> 32   medium           the one main point of a screen
//   Heading   20 -> 22   semibold         feature names, card titles
//   Body      16 -> 18   regular          paragraphs, list items
//   Caption   14         regular, muted   image captions, metadata labels

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function Eyebrow({ children, className = "", style }: Props) {
  return (
    <p
      className={`font-mono text-[14px] md:text-[16px] uppercase tracking-[0.12em] ${className}`}
      style={style}
    >
      {children}
    </p>
  );
}

// `wide` drops the line-length cap, for statements inside a contained callout box
export function Statement({ children, className = "", style, wide = false }: Props & { wide?: boolean }) {
  return (
    <p
      className={`font-medium text-[24px] md:text-[32px] leading-[1.25] tracking-[0.01em] text-balance ${
        wide ? "" : "max-w-[34ch] md:max-w-[38ch]"
      } ${className}`}
      style={style}
    >
      {children}
    </p>
  );
}

export function Heading({ children, className = "", style }: Props) {
  return (
    <p
      className={`font-semibold text-[20px] md:text-[22px] leading-snug tracking-wide ${className}`}
      style={style}
    >
      {children}
    </p>
  );
}

export function Body({ children, className = "", style }: Props) {
  return (
    <p
      className={`text-[16px] md:text-[18px] leading-relaxed tracking-wide max-w-[65ch] ${className}`}
      style={style}
    >
      {children}
    </p>
  );
}

// `muted={false}` for captions that carry their own accent color
export function Caption({ children, className = "", style, muted = true }: Props & { muted?: boolean }) {
  return (
    <p
      className={`text-[14px] leading-snug tracking-wide ${muted ? "opacity-60" : ""} ${className}`}
      style={style}
    >
      {children}
    </p>
  );
}
