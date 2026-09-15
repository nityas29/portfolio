"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

// Page Friends' own brand palette (from the project's style guide), used only within
// this case study - distinct from the portfolio's own color tokens.
const PF = {
  skyBlue: "#5568af",
  aqua: "#ceeaee",
  lime: "#cdd629",
  electricRose: "#eb369b",
  blush: "#f9cade",
  sunset: "#f47a27",
  researchAqua: "#cfebef",
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`font-mono text-[22px] tracking-[0.05em] ${dark ? "text-black" : "text-white"}`}
    >
      {children}
    </p>
  );
}

// Horizontal connector arrow used in the Heuristic Evaluation rows - the line stretches
// to fill the available space, while the arrowhead stays a fixed size.
function Arrow() {
  return (
    <span className="flex flex-1 min-w-10 items-center" aria-hidden>
      <span className="h-[2px] flex-1" style={{ backgroundColor: PF.skyBlue }} />
      <svg width="8" height="8" viewBox="0 0 8 8" className="shrink-0">
        <polygon points="0,0 8,4 0,8" fill={PF.skyBlue} />
      </svg>
    </span>
  );
}

// Click-to-expand image used throughout the case study. Clicking an image grows it,
// in place, from its own on-screen position out to a larger centered size (rather than
// jumping straight to a fixed spot), with a backdrop fade-in. Once expanded, scrolling
// the mouse wheel or pinching while hovering zooms the image in and out. Any page
// scroll or click elsewhere drops it back into place.
type Rect = { top: number; left: number; width: number; height: number };

function ExpandableImage({
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
    const targetWidth = Math.min(window.innerWidth * 0.42, 600);
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

export default function PageFriendsCaseStudy() {
  return (
    <div className="flex flex-col min-h-full">
      <Nav />

      <div id="pf-top" className="bg-white text-black">
        {/* HERO */}
        <section className="relative">
          <div className="relative w-full" style={{ aspectRatio: "4000 / 1225" }}>
            <Image
              src="/assets/pf-hero-banner-v2.png"
              alt="Page Friends, your reading companion, with a happy orange character waving"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="px-16 py-9">
            <p className="font-pf-sans font-medium text-[22px] md:text-[27px] tracking-wide max-w-6xl">
              A reading app that turns literacy practice into a collectible adventure for
              elementary school children.
            </p>

            <div className="grid grid-cols-4 gap-5 mt-9 max-w-6xl font-pf-sans tracking-wide">
              <div>
                <p className="text-[16px] text-black/60">ROLE</p>
                <p className="text-[16px] font-medium mt-2">UX Researcher &amp; Designer</p>
              </div>
              <div>
                <p className="text-[16px] text-black/60">TEAM</p>
                <p className="text-[16px] font-medium mt-2">
                  Nitya Shankar
                  <br />
                  Mia Sohn
                  <br />
                  Dymond Mon
                </p>
              </div>
              <div>
                <p className="text-[16px] text-black/60">TIMELINE</p>
                <p className="text-[16px] font-medium mt-2">
                  9 weeks
                  <br />
                  INFO 360 SP26
                  <br />
                  <span className="italic font-light">THEME: AI + INFORMATICS</span>
                </p>
              </div>
              <div>
                <p className="text-[16px] text-black/60">TOOLS</p>
                <p className="text-[16px] font-medium mt-2">Figma</p>
              </div>
            </div>
          </div>

          {/* OVERVIEW */}
          <div className="py-10 px-16" style={{ backgroundColor: PF.sunset }}>
            <div className="max-w-6xl mx-auto">
              <SectionLabel>OVERVIEW</SectionLabel>
              <p className="font-pf-sans text-white text-[19px] md:text-[26px] tracking-wide leading-snug mt-4">
                Page Friends is a friendly, interactive, and engaging application that focuses on
                creating a personalized digital environment where kids can feel excitement to
                read, expand their vocabulary, and improve their speaking skills.
              </p>
              <button
                type="button"
                onClick={() => scrollToId("pf-solution")}
                className="font-mono text-white text-[16px] tracking-wide inline-flex items-center gap-2 mt-7 hover:opacity-80"
              >
                JUMP TO FINAL DESIGN <span aria-hidden>↓</span>
              </button>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="px-16 py-14">
          <div className="max-w-6xl mx-auto flex flex-col gap-5">
            <SectionLabel dark>PROBLEM</SectionLabel>
            <p className="font-pf-sans font-semibold text-[22px] tracking-wide">
              Children&rsquo;s literacy rates have declined significantly since the pandemic.
            </p>
            <p className="font-pf-sans text-[16px] tracking-wide text-black/80">
              This can lead to long-term struggles in adulthood, including reduced access to
              opportunities and difficulty understanding critical information.
            </p>
            <div className="p-7" style={{ backgroundColor: PF.sunset }}>
              <p className="font-pf-sans font-medium text-white text-[19px] md:text-[22px] tracking-wide leading-relaxed">
                How might elementary students actively increase interest in literature outside of
                school so that they can improve their reading ability, have a strong foundation in
                literacy, and be better prepared for the rest of their academic career?
              </p>
            </div>
          </div>
        </section>

        {/* RESEARCH */}
        <section className="px-16 pt-10 pb-16">
          <div className="max-w-6xl mx-auto flex flex-col gap-7">
            <SectionLabel dark>RESEARCH</SectionLabel>
            <p className="font-pf-sans text-[19px] md:text-[22px] tracking-wide">
              We conducted{" "}
              <span className="px-1 text-white" style={{ backgroundColor: PF.electricRose }}>
                interviews
              </span>{" "}
              with an elementary student and teacher, and performed a{" "}
              <span className="px-1 text-white" style={{ backgroundColor: PF.skyBlue }}>
                literature review.
              </span>
            </p>

            <p className="font-mono text-[22px] tracking-wide mt-3">FINDINGS</p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 flex flex-col gap-3" style={{ backgroundColor: PF.blush }}>
                <ul className="list-disc pl-6 font-pf-sans text-[16px] tracking-wide space-y-4">
                  <li>
                    Kids liked the novelty of tech, but still preferred the feel of a real book and
                    got screen fatigue fast
                  </li>
                  <li>Teachers were open to personalized tools but cautious about attention spans and screen time</li>
                </ul>
              </div>
              <div className="p-5 flex flex-col gap-3" style={{ backgroundColor: PF.researchAqua }}>
                <ul className="list-disc pl-6 font-pf-sans text-[16px] tracking-wide space-y-4">
                  <li>
                    Kids read more when they get real choice, curiosity, and challenge{" "}
                    <span className="text-black/40">(Ciampa, 2016)</span>
                  </li>
                  <li>
                    Kids build confidence faster when they have someone to talk to about what
                    they&rsquo;re reading <span className="text-black/40">(Nolen, 2009)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mx-auto">
              <ExpandableImage
                src="/assets/pf-competitive-analysis.png"
                alt="Competitive analysis of Reading Eggs, Duolingo ABC, and Teach Your Monster to Read"
                width={837}
                height={627}
                className="object-contain"
              />
            </div>

            <p className="font-pf-sans text-[19px] md:text-[22px] tracking-wide leading-snug">
              Our market research found that existing reading apps such as Reading Eggs, Duolingo
              ABC, and Teach Your Monster to Read, organize their content by{" "}
              <span className="font-semibold">age range</span> and rely on{" "}
              <span className="font-semibold">repetitive phonics games</span>.
            </p>
            <p className="font-pf-sans text-[18px] tracking-wide">
              Based on these findings, we identified{" "}
              <span className="underline">personalization</span> as the clearest opportunity for
              our design.
            </p>
          </div>
        </section>

        {/* IDEATION */}
        <section className="px-16 py-14">
          <div className="max-w-6xl mx-auto flex flex-col gap-7">
            <SectionLabel dark>IDEATION</SectionLabel>
            <p className="font-pf-sans text-[19px] md:text-[22px] tracking-wide">
              We created a feature matrix and paper prototype to better understand how Page
              Friends can stay both <span className="font-bold">engaging</span> and{" "}
              <span className="font-bold">educational</span>.
            </p>

            <div className="grid md:grid-cols-2 gap-7 items-start">
              <div className="flex flex-col items-center text-center">
                <ExpandableImage
                  src="/assets/pf-feature-matrix.png"
                  alt="Feature ideas and prioritization matrix"
                  width={624}
                  height={504}
                  className="h-[360px] w-auto object-contain"
                />
                <p className="font-pf-sans text-[11px] tracking-wide mt-2">Feature matrix</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ExpandableImage
                  src="/assets/pf-paper-prototype.jpg"
                  alt="Low-fidelity paper prototype pages laid out on a table"
                  width={624}
                  height={802}
                  className="h-[360px] w-auto object-contain"
                />
                <p className="font-pf-sans text-[11px] tracking-wide mt-2">Low-fidelity paper prototype</p>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section id="pf-solution" className="py-9 px-16" style={{ backgroundColor: PF.sunset }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-5 flex-wrap">
            <div>
              <SectionLabel>SOLUTION</SectionLabel>
              <p className="font-pf-sans font-semibold text-white text-[22px] md:text-[32px] tracking-wide mt-2">
                Meet Page Friends
              </p>
            </div>
            <a
              href="https://www.figma.com/proto/ZYZfvO1RgOb7DVtGhY7PLr/Page-Friends-Hi-Fi--Copy-?node-id=45-14&p=f&t=9tRwfDsVbn39MyUW-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=45%3A14&show-proto-sidebar=1"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-white text-[16px] tracking-wide border border-white rounded-[5px] px-4 py-2 hover:opacity-80"
            >
              VIEW PROTOTYPE
            </a>
          </div>
        </section>

        <section className="px-16 py-14">
          <div className="max-w-6xl mx-auto flex flex-col gap-16">
            {/* INDIVIDUALIZATION - text left, image right */}
            <div className="flex flex-col md:flex-row items-center gap-7">
              <div className="flex-1 text-left md:text-right">
                <p className="font-pf-sans font-semibold text-[22px] tracking-wide">INDIVIDUALIZATION</p>
                <p className="font-pf-sans text-[16px] tracking-wide mt-3">
                  The user onboards with a reading diagnostic test to personalize their support to
                  their reading level rather than age.
                </p>
              </div>
              <video
                src="/assets/pf-individualization-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="flex-1 rounded-[27px] w-full max-w-[440px] h-auto"
              />
            </div>

            {/* GAMIFICATION - image left, text right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-7">
              <div className="flex-1 text-left">
                <p className="font-pf-sans font-semibold text-[22px] tracking-wide">GAMIFICATION</p>
                <p className="font-pf-sans text-[16px] tracking-wide mt-3">
                  The user unlocks a character from each book they complete for their own personal
                  town. This transforms reading from a stationary task into what we describe as a
                  collectible adventure.
                </p>
              </div>
              <video
                src="/assets/pf-gamification-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="flex-1 rounded-[27px] w-full max-w-[440px] h-auto"
              />
            </div>

            <p className="font-pf-sans font-bold text-[19px] md:text-[25px] tracking-wide text-center">
              The main dashboard consists of four widgets:
            </p>

            {/* LIBRARY - text left, image right */}
            <div className="flex flex-col md:flex-row items-center gap-7">
              <div className="flex-1 text-left md:text-right">
                <p className="font-pf-sans font-semibold text-[22px] tracking-wide">LIBRARY</p>
                <p className="font-pf-sans text-[16px] tracking-wide mt-3">
                  Where the user can browse personalized recommendations, track books, and filter
                  based on genre and theme.
                </p>
              </div>
              <video
                src="/assets/pf-library-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="flex-1 rounded-[27px] w-full max-w-[440px] h-auto"
              />
            </div>

            {/* VISIT TOWN - image left, text right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-7">
              <div className="flex-1 text-left">
                <p className="font-pf-sans font-semibold text-[22px] tracking-wide">VISIT TOWN</p>
                <p className="font-pf-sans text-[16px] tracking-wide mt-3">
                  Where the user interacts with unlocked characters and play literacy games tied to
                  their reading level.
                </p>
              </div>
              <video
                src="/assets/pf-visit-town-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="flex-1 rounded-[27px] w-full max-w-[440px] h-auto"
              />
            </div>

            {/* ACHIEVEMENTS - text left, image right */}
            <div className="flex flex-col md:flex-row items-center gap-7">
              <div className="flex-1 text-left md:text-right">
                <p className="font-pf-sans font-semibold text-[22px] tracking-wide">ACHIEVEMENTS</p>
                <p className="font-pf-sans text-[16px] tracking-wide mt-3">
                  Where the user collects trophies and printable certificates.
                </p>
              </div>
              <video
                src="/assets/pf-achievements-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="flex-1 rounded-[27px] w-full max-w-[440px] h-auto"
              />
            </div>

            {/* PAGE FRIEND - image left, text right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-7">
              <div className="flex-1 text-left">
                <p className="font-pf-sans font-semibold text-[22px] tracking-wide">PAGE FRIEND</p>
                <p className="font-pf-sans text-[16px] tracking-wide mt-3">
                  A customizable AI companion that provides real-time reading feedback, read-aloud
                  support, and personalized book recommendations.
                </p>
              </div>
              <div className="relative flex-1 w-full max-w-[440px]">
                <ExpandableImage
                  src="/assets/pf-page-friend-screen-v2.png"
                  alt="Dashboard highlighting the Page Friend AI companion character, circled to highlight the customizable companion"
                  width={609}
                  height={439}
                  className="w-full h-auto rounded-[27px]"
                />
                <svg
                  viewBox="0 0 1780 1284"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ overflow: "visible" }}
                  aria-hidden="true"
                >
                  <circle cx="260" cy="970" r="340" fill="none" stroke="#f47a27" strokeWidth="22" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* VISUAL DESIGN */}
        <section className="px-16 py-14">
          <div className="max-w-6xl mx-auto flex flex-col gap-7">
            <p className="font-pf-sans font-medium text-[19px] md:text-[22px] tracking-wide">
              Our visual design decisions were also informed by our target audience.
            </p>

            <div className="grid gap-8 md:grid-cols-[280px_1fr]">
              <ExpandableImage
                src="/assets/pf-color-palette.png"
                alt="Page Friends color palette: Sky Blue, Aqua, Lime, Electric Rose, Blush, and Sunset"
                width={358}
                height={537}
                className="h-auto w-full shadow-md"
              />
              <div className="flex flex-col justify-between gap-8 md:h-full">
                <p className="font-pf-sans font-light text-[16px] md:text-[19px] tracking-wide leading-relaxed text-black/70">
                  Because children respond more to bright colors and cartoonish characters, we used
                  a bright and colorful palette throughout the application.
                </p>
                <div className="flex flex-col items-start md:items-end text-left md:text-right gap-3">
                  <p className="font-pf-sans font-light text-[16px] md:text-[19px] tracking-wide leading-relaxed text-black/70">
                    We chose &ldquo;Balsamiq Sans&rdquo; as our typeface for its playful,
                    child-friendly appearance
                  </p>
                  <p className="font-pf-display text-[32px]">Balsamiq Sans</p>
                </div>
              </div>
            </div>

            <p className="font-pf-sans font-light text-[16px] md:text-[19px] tracking-wide leading-relaxed max-w-4xl">
              We maintained a consistent illustrated landscape background with clouds across the
              interface to reinforce a cohesive, child-friendly world.
            </p>
          </div>
        </section>

        {/* DECISIONS AND TRADE-OFFS */}
        <section className="py-9 px-16" style={{ backgroundColor: PF.sunset }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>DECISIONS AND TRADE-OFFS</SectionLabel>
          </div>
        </section>

        <section className="px-16 py-14">
          <div className="max-w-6xl mx-auto flex flex-col gap-7">
            <p className="font-pf-sans text-[19px] md:text-[22px] tracking-wide">
              Our team made two decisions that reflect how we prioritized our limited time and
              scope.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5" style={{ backgroundColor: PF.lime }}>
                <p className="font-pf-sans text-[19px] tracking-wide mb-3">PRIORITIZING PRIMARY FLOW</p>
                <p className="font-pf-sans text-[16px] tracking-wide">
                  Although we designed a teacher and classroom view, we decided to focus our
                  high-fidelity prototyping efforts on the primary student experience, since
                  elementary students are our primary user group.
                </p>
              </div>
              <div className="p-5" style={{ backgroundColor: PF.blush }}>
                <p className="font-pf-sans text-[19px] tracking-wide mb-3">STAYING IN SCOPE</p>
                <p className="font-pf-sans text-[16px] tracking-wide">
                  We scrapped the standalone &ldquo;Games&rdquo; widget entirely that existed in
                  our low-fi wireframes. Untethered games didn&rsquo;t serve the actual problem we
                  were solving, so we folded game mechanics into Visit Town instead.
                </p>
              </div>
            </div>

            <p className="font-mono text-[22px] tracking-wide mt-4">ITERATION</p>
            <p className="font-pf-sans text-[19px] md:text-[22px] tracking-wide">
              We evaluated our design using both a{" "}
              <span className="px-1 text-white" style={{ backgroundColor: PF.skyBlue }}>
                heuristic evaluation
              </span>{" "}
              and two rounds of{" "}
              <span className="px-1 text-white" style={{ backgroundColor: PF.electricRose }}>
                usability testing
              </span>{" "}
              on our low-fidelity paper prototype.
            </p>
          </div>
        </section>

        {/* HEURISTIC EVALUATION */}
        <section className="pt-6 pb-10 px-16" style={{ backgroundColor: PF.researchAqua }}>
          <div className="max-w-6xl mx-auto flex flex-col gap-5">
            <p className="font-pf-sans font-semibold text-[22px] tracking-wide" style={{ color: PF.skyBlue }}>
              HEURISTIC EVALUATION
            </p>
            <div className="flex items-center justify-center gap-5">
              <span className="font-pf-sans font-light text-[14px] tracking-wide text-black uppercase shrink-0">
                Violations
              </span>
              <div className="flex flex-1 flex-col gap-5 max-w-3xl">
                <div className="flex items-center gap-3 font-pf-sans text-[16px] tracking-wide">
                  <span>Help with errors</span>
                  <Arrow />
                  <span className="text-right">Add clear error messaging</span>
                </div>
                <div className="flex items-center gap-3 font-pf-sans text-[16px] tracking-wide">
                  <span>User control and freedom</span>
                  <Arrow />
                  <span className="text-right flex items-center gap-2 justify-end">
                    Add{" "}
                    <span
                      className="font-pf-display text-white text-[16px] px-3 py-2 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] shrink-0"
                      style={{ backgroundColor: PF.skyBlue }}
                    >
                      Back
                    </span>{" "}
                    navigation to every screen
                  </span>
                </div>
                <div className="flex items-center gap-3 font-pf-sans text-[16px] tracking-wide">
                  <span>Needs a tutorial</span>
                  <Arrow />
                  <span className="text-right">Add tutorial in final development</span>
                </div>
              </div>
              <span className="font-pf-sans font-light text-[14px] tracking-wide text-black uppercase shrink-0">
                Solutions
              </span>
            </div>
          </div>
        </section>

        {/* USABILITY TESTING */}
        <section className="py-10 px-16" style={{ backgroundColor: PF.blush }}>
          <div className="max-w-6xl mx-auto flex flex-col gap-5">
            <p className="font-pf-sans font-semibold text-[25px] tracking-wide" style={{ color: PF.electricRose }}>
              USABILITY TESTING: <span className="italic">WIZARD OF OZ</span>
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-pf-sans tracking-wide" style={{ color: PF.electricRose }}>
                  TASKS
                </p>
                <div className="bg-white p-3 font-pf-sans text-[14px] tracking-wide">
                  <span className="font-bold">FIND</span> A BOOK TO READ
                </div>
                <div className="bg-white p-3 font-pf-sans text-[14px] tracking-wide">
                  <span className="font-bold">ADD</span> A BOOK TO READING LIST
                </div>
                <div className="bg-white p-3 font-pf-sans text-[14px] tracking-wide">
                  <span className="font-bold">COLLECT</span> AND{" "}
                  <span className="font-bold">MEET</span> A CHARACTER IN TOWN
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-pf-sans tracking-wide" style={{ color: PF.electricRose }}>
                  SESSION 1 FINDINGS
                </p>
                <ul className="bg-white p-4 list-disc pl-6 font-pf-sans text-[14px] tracking-wide space-y-3 flex-1">
                  <li>Flow is largely intuitive</li>
                  <li>
                    Participants wanted features we had not yet considered, such as filtering and
                    a user profile
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-pf-sans tracking-wide" style={{ color: PF.electricRose }}>
                  SESSION 2 FINDINGS
                </p>
                <ul className="bg-white p-4 list-disc pl-6 font-pf-sans text-[14px] tracking-wide space-y-3 flex-1">
                  <li>Original six-widget dashboard feels overwhelming</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-16 py-14">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-7 justify-center">
            <div className="text-center">
              <ExpandableImage
                src="/assets/pf-lofi-dashboard.png"
                alt="Low-fidelity prototype of the six-widget dashboard"
                width={416}
                height={293}
                className="w-full max-w-[380px] h-auto object-contain"
              />
              <p className="font-pf-sans text-[11px] tracking-wide mt-2">
                Low-fi prototype of 6 widget dashboard
              </p>
            </div>
            <span className="text-[20px] hidden md:block" aria-hidden>
              &rarr;
            </span>
            <div className="text-center">
              <ExpandableImage
                src="/assets/pf-hifi-dashboard.png"
                alt="High-fidelity simplified four-widget dashboard"
                width={441}
                height={294}
                className="w-full max-w-[380px] h-auto object-contain"
              />
              <p className="font-pf-sans text-[11px] tracking-wide mt-2">
                Hi-fi simplified 4-widget dashboard
              </p>
            </div>
          </div>
        </section>

        {/* REFLECTION */}
        <section className="py-10 px-16" style={{ backgroundColor: PF.sunset }}>
          <div className="max-w-6xl mx-auto">
            <SectionLabel>REFLECTION</SectionLabel>

            <div className="grid md:grid-cols-2 gap-7 mt-7">
              <div>
                <p className="font-pf-sans font-semibold text-white text-[16px] tracking-wide mb-3">
                  LOOKING BACK
                </p>
                <p className="font-pf-sans text-white text-[16px] md:text-[19px] tracking-wide leading-relaxed">
                  Because we did not have access to our primary user group during this project, we
                  relied on empathy mapping, literature research, and testing with peers rather
                  than with actual elementary school students, which limits how confidently we can
                  speak to the real child experience.
                </p>
              </div>
              <div>
                <p className="font-pf-sans font-semibold text-white text-[16px] tracking-wide mb-3">
                  LOOKING FORWARD
                </p>
                <p className="font-pf-sans text-white text-[16px] md:text-[19px] tracking-wide leading-relaxed">
                  To further develop Page Friends, we would plan to complete the teacher
                  dashboard, add a wider variety of literacy games to reduce repetition, and
                  implement a navigation bar to help users orient themselves within the app.
                </p>
              </div>
            </div>

            <div className="text-center mt-9">
              <button
                type="button"
                onClick={() => scrollToId("pf-top")}
                className="font-mono text-white text-[16px] tracking-wide inline-flex items-center gap-2 hover:opacity-80"
              >
                JUMP TO TOP <span aria-hidden>↑</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
