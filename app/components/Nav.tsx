"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
    </svg>
  );
}

function UserCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" />
      <circle cx="12" cy="10" r="3.1" />
      <path d="M5.5 19c1.2-2.6 3.6-4 6.5-4s5.3 1.4 6.5 4" strokeLinecap="round" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const diff = y - lastY.current;
      if (y <= 72) {
        // always show near the very top
        setHidden(false);
      } else if (diff > 4) {
        setHidden(true);
      } else if (diff < -4) {
        setHidden(false);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goToSection(id: string) {
    if (onHome) {
      scrollToId(id);
    } else {
      router.push(`/#${id}`);
    }
  }

  function goToHero() {
    if (onHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  return (
    <div
      className="sticky top-0 z-50 h-[72px] bg-[#181e24] grid grid-cols-3 items-center px-8 transition-transform duration-300 ease-in-out"
      style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
    >
      <button onClick={goToHero} aria-label="Back to top" className="shrink-0 relative w-10 h-10 justify-self-start">
        <Image src="/assets/star-guy-logo.png" alt="" fill sizes="40px" style={{ objectFit: "contain" }} />
      </button>

      <nav className="flex items-center justify-center gap-10 font-mono text-[15px] font-light text-white justify-self-center">
        <button onClick={() => goToSection("projects")} className="underline underline-offset-4 hover:opacity-70">
          PROJECTS
        </button>
        <button onClick={() => goToSection("experience")} className="underline underline-offset-4 hover:opacity-70">
          EXPERIENCE
        </button>
        <Link href="/about" className="underline underline-offset-4 hover:opacity-70">
          ABOUT
        </Link>
      </nav>

      <div className="flex items-center gap-5 shrink-0 text-white justify-self-end">
        <a
          href="https://www.linkedin.com/in/nitya-shankar"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:opacity-70"
        >
          <LinkedInIcon />
          <span className="font-mono text-[13px] font-light">LINKEDIN</span>
        </a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:opacity-70">
          <UserCircleIcon />
          <span className="font-mono text-[13px] font-light">RESUME</span>
        </a>
      </div>
    </div>
  );
}
