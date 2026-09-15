import { CSSProperties } from "react";

export default function ScatterStar({
  color,
  size,
  className = "",
  style,
}: {
  color: string;
  size: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={`absolute pointer-events-none ${className}`}
      style={style}
    >
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L1 9.2l7.1-.6L12 2z" />
    </svg>
  );
}
