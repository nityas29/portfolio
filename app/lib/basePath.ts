// GitHub Pages serves this site from /portfolio (a project page, not a user
// page), so every raw (non next/image, non next/link) asset reference needs
// this prefix. next/image and next/link already read next.config's basePath
// automatically, so they don't need this - only plain <video src>/<a href>
// tags pointing at /public files do.
//
// Set via NEXT_PUBLIC_BASE_PATH in the GitHub Actions build step. Left unset
// (empty string) for the Vercel build, which serves from the root.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
