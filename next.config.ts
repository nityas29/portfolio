import type { NextConfig } from "next";

// Empty on Vercel (serves from the root). Set to "/portfolio" by the GitHub
// Actions workflow, since GitHub Pages serves this as a project page at
// nityas29.github.io/portfolio rather than at a domain root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// "NOVEMBER 2026" (and "NOV 2026" for phones): stamped in at build time for the footer's "last updated",
// so every deploy updates it automatically
const stamp = (month: "long" | "short") =>
  new Date()
    .toLocaleDateString("en-US", { month, year: "numeric", timeZone: "America/Los_Angeles" })
    .toUpperCase();

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_LAST_UPDATED: stamp("long"), NEXT_PUBLIC_LAST_UPDATED_SHORT: stamp("short") },
  // Static export: this site has no API routes, middleware, or server
  // actions, so it can be fully pre-rendered to static files - which is
  // what GitHub Pages requires (it can only serve static files).
  output: "export",
  // Next's image optimization needs a server to run on; static export has
  // none, so images are served as-is instead.
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

export default nextConfig;
