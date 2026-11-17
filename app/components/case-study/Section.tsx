// Standard case-study section. Owns the page's vertical rhythm: every section gets the
// same generous top/bottom padding, so the space *between* ideas is always clearly
// larger than the space *within* one (proximity does the grouping, not borders).
export default function Section({
  children,
  id,
  bg,
  className = "",
  innerClassName = "",
  size = "default",
}: {
  children: React.ReactNode;
  id?: string;
  bg?: string;
  className?: string;
  innerClassName?: string;
  // "band" = shorter colored divider bands (e.g. SOLUTION headers)
  size?: "default" | "band";
}) {
  const pad = size === "band" ? "py-14 md:py-20" : "py-20 md:py-28";
  return (
    <section
      id={id}
      className={`px-5 md:px-16 ${pad} ${className}`}
      style={bg ? { backgroundColor: bg } : undefined}
    >
      <div className={`max-w-6xl mx-auto ${innerClassName}`}>{children}</div>
    </section>
  );
}
