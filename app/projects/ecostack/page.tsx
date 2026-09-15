"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

// EcoStack's own brand palette (from the project's style guide + visual design
// decisions), used only within this case study - distinct from the portfolio's own
// color tokens.
const ES = {
  green: "#22c55e",
  dark: "#0a0e14",
  mint: "#bcedce",
  lightGray: "#d1d1d1",
  charcoal: "#181e24",
  gray: "#7f7f7f",
  red: "#c72a2f",
  blue: "#3776f5",
  orange: "#ce7015",
  indigo: "#5c5aee",
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Label({ children, color = "#000" }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="font-mono text-[22px] tracking-[0.05em]" style={{ color }}>
      {children}
    </p>
  );
}

// highlights a run of text the way a marker would - background color behind the
// existing text color, bold, matching EcoStack's own "centralization" / "standardized
// views" callouts
function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-bold px-1" style={{ backgroundColor: ES.green }}>
      {children}
    </span>
  );
}

// Click-to-expand image used throughout the case study. Clicking an image grows it,
// in place, from its own on-screen position out to a larger centered size (rather than
// jumping straight to a fixed spot), with a backdrop fade-in. Once expanded, scrolling
// the mouse wheel or pinching while hovering zooms the image in and out (via a native,
// non-passive wheel listener - React's synthetic onWheel is passive by default and
// can't preventDefault). Any page scroll or click elsewhere drops it back into place.
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

export default function EcoStackCaseStudy() {
  return (
    <div className="flex flex-col min-h-full">
      <Nav />

      <div id="es-top" className="bg-white text-black">
        {/* HERO */}
        <section className="relative">
          <div className="relative w-full" style={{ aspectRatio: "7664 / 1868" }}>
            <Image
              src="/assets/es-hero-banner.png"
              alt="EcoStack, a data center sustainability management system, for Meridian Retail Group"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="px-16 py-9">
            <p className="font-es-sans font-medium text-[22px] md:text-[27px] tracking-wide max-w-6xl">
              Turning three months of fragmented sustainability data into a system Meridian
              Retail Group (MRG) can trust and act on.
            </p>

            <div className="grid grid-cols-4 gap-5 mt-9 max-w-6xl font-es-sans tracking-wide">
              <div>
                <p className="text-[16px] text-black/60">ROLE</p>
                <p className="text-[16px] font-medium mt-2">
                  Research, Workflow Modeling &amp; Data Flow Design
                </p>
              </div>
              <div>
                <p className="text-[16px] text-black/60">TEAM</p>
                <p className="text-[16px] font-medium mt-2">
                  Nitya Shankar
                  <br />
                  Hriesha Popat
                  <br />
                  Ana Moreno
                  <br />
                  Tariq Ebo
                </p>
              </div>
              <div>
                <p className="text-[16px] text-black/60">TIMELINE</p>
                <p className="text-[16px] font-medium mt-2">
                  9 weeks
                  <br />
                  INFO 380 SP26
                  <br />
                  <span className="italic font-light">MRG CASE STUDY</span>
                </p>
              </div>
              <div>
                <p className="text-[16px] text-black/60">TOOLS</p>
                <p className="text-[16px] font-medium mt-2">
                  Figma
                  <br />
                  Figma Make
                  <br />
                  Jira
                </p>
              </div>
            </div>
          </div>

          {/* OVERVIEW */}
          <div className="py-10 px-16" style={{ backgroundColor: ES.dark }}>
            <div className="max-w-6xl mx-auto">
              <Label color={ES.green}>OVERVIEW</Label>
              <p className="font-es-sans text-white text-[19px] md:text-[26px] tracking-wide leading-snug mt-4">
                EcoStack is a role-based enterprise dashboard that centralizes sustainability
                data collection, validation, and reporting across MRG&rsquo;s 12-facility data
                center portfolio.
              </p>
              <button
                type="button"
                onClick={() => scrollToId("es-solution")}
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
            <Label>PROBLEM</Label>
            <p className="font-es-sans font-semibold text-[22px] tracking-wide">
              MRG&rsquo;s sustainability data is fragmented across BMS systems, utility bills,
              and spreadsheets.
            </p>
            <p className="font-es-sans text-[16px] tracking-wide text-black/80">
              Data quality varies by facility, depending on whether they have real sensors or
              rely on manual estimates. Compiling one annual report currently takes the
              sustainability team about three months of manual work.
            </p>
            <div className="p-7" style={{ backgroundColor: ES.green }}>
              <p className="font-es-sans font-medium text-black text-[19px] md:text-[22px] tracking-wide leading-relaxed">
                How might we give MRG&rsquo;s stakeholders one reliable, standardized system to
                track, report on, and act on sustainability data across every facility?
              </p>
            </div>
          </div>
        </section>

        {/* RESEARCH */}
        <section className="px-16 pt-2 pb-16">
          <div className="max-w-6xl mx-auto flex flex-col gap-7">
            <Label>RESEARCH</Label>
            <p className="font-es-sans text-[19px] md:text-[22px] tracking-wide">
              We interviewed stakeholders across the organization and logged findings on a
              Knowledge Board, separating known facts from assumptions and open questions.
            </p>

            <p className="font-mono text-[22px] tracking-wide mt-3">FINDINGS</p>

            <div className="flex flex-col gap-3">
              <div className="p-6 border-l-8" style={{ backgroundColor: ES.mint, borderColor: ES.green }}>
                <p className="font-es-sans text-[16px] tracking-wide">
                  The VP of IT Infrastructure&rsquo;s team spent{" "}
                  <span className="font-bold">3-4 weeks every quarter</span> compiling
                  sustainability data that was already stale by the time they finished
                </p>
              </div>
              <div className="p-6 border-l-8" style={{ backgroundColor: ES.lightGray, borderColor: ES.charcoal }}>
                <p className="font-es-sans text-[16px] tracking-wide">
                  Sustainability Analysts described the process as{" "}
                  <span className="font-bold">&ldquo;fragile&rdquo;</span>: one late correction
                  from a single facility could cascade through an entire report
                </p>
              </div>
              <div className="p-6 border-l-8" style={{ backgroundColor: ES.mint, borderColor: ES.green }}>
                <p className="font-es-sans text-[16px] tracking-wide">
                  Compliance teams had no reliable way to <span className="font-bold">trace</span>{" "}
                  a reported number back to its source
                </p>
              </div>
            </div>

            <p className="font-es-sans text-[19px] md:text-[22px] tracking-wide leading-snug">
              Every stakeholder pointed to the same root problem:{" "}
              <span className="font-bold">No single source of truth.</span>
            </p>
            <p className="font-es-sans text-[18px] tracking-wide">
              Based on these findings, <Mark>centralization</Mark> and{" "}
              <Mark>standardization</Mark> became the clearest opportunity for our design.
            </p>
          </div>
        </section>

        {/* MODELING THE SYSTEM */}
        <section className="px-16 py-14">
          <div className="max-w-6xl mx-auto flex flex-col gap-7">
            <Label>MODELING THE SYSTEM</Label>
            <p className="font-es-sans text-[19px] md:text-[22px] tracking-wide">
              We translated research into structure: <span className="font-bold">OKRs</span>{" "}
              with measurable targets, a <span className="font-bold">workflow diagram</span>{" "}
              across three roles, and a <span className="font-bold">data flow diagram</span>{" "}
              formalizing how raw facility data becomes a reliable company-wide record.
            </p>

            <div className="grid md:grid-cols-2 gap-7 items-start">
              <div className="flex flex-col items-center text-center">
                <ExpandableImage
                  src="/assets/es-workflow-diagram.png"
                  alt="Workflow (BPMN) diagram modeling the sustainability data collection and reporting process"
                  width={761}
                  height={474}
                  className="w-full h-auto object-contain border border-black/10"
                />
                <p className="font-es-sans text-[11px] tracking-wide mt-2">
                  Workflow diagram modeling sustainability data collection and reporting
                  process for CSuO, Sustainability Analysts, and Facility Managers
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <ExpandableImage
                  src="/assets/es-dataflow-diagram.png"
                  alt="Data flow diagram (DFD) modeling the flow of sustainability data from initial report to archive"
                  width={728}
                  height={661}
                  className="w-full h-auto object-contain border border-black/10"
                />
                <p className="font-es-sans text-[11px] tracking-wide mt-2">
                  Data flow diagram (DFD) modeling flow of sustainability data from initial
                  report to archive
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section id="es-solution" className="py-9 px-16" style={{ backgroundColor: ES.dark }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-5 flex-wrap">
            <div>
              <Label color={ES.green}>SOLUTION</Label>
              <p className="font-es-sans font-semibold text-white text-[22px] md:text-[32px] tracking-wide mt-2">
                Meet EcoStack
              </p>
            </div>
            <a
              href="https://www.figma.com/design/6Mr4yl4ipVjjQ0BsEf3SzU/wireframe?node-id=172-4029&t=3K5rVCPMBNqFP30h-1"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-white text-[16px] tracking-wide border border-white rounded-[5px] px-4 py-2 hover:opacity-80"
            >
              VIEW PROTOTYPE
            </a>
          </div>
        </section>

        {/* FEATURE WALKTHROUGH */}
        <section className="px-16 py-16" style={{ backgroundColor: ES.mint }}>
          <div className="max-w-6xl mx-auto flex flex-col gap-20">
            {/* ROLE-BASED ACCESS - text left, video right */}
            <div className="flex flex-col md:flex-row items-center gap-7">
              <div className="flex-1 text-left md:text-right">
                <p className="font-es-sans font-semibold text-[22px] tracking-wide">
                  ROLE-BASED ACCESS
                </p>
                <p className="font-es-sans text-[16px] tracking-wide mt-3">
                  Each stakeholder gets a view built around their primary objectives instead
                  of one dashboard everyone has to filter.
                </p>
              </div>
              <video
                src="/assets/es-role-based-access-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="flex-1 rounded-[10px] w-full max-w-[520px] h-auto shadow-lg"
              />
            </div>

            {/* DATA ENTRY - video left, text right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-7">
              <div className="flex-1 text-left">
                <p className="font-es-sans font-semibold text-[22px] tracking-wide">DATA ENTRY</p>
                <p className="font-es-sans text-[16px] tracking-wide mt-3">
                  Facilities Managers submit and track sustainability data, flagging
                  missing-data alerts, anomalies, and deadlines.
                </p>
              </div>
              <video
                src="/assets/es-data-entry-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="flex-1 rounded-[10px] w-full max-w-[520px] h-auto shadow-lg"
              />
            </div>

            {/* REPORTS - text left, video right */}
            <div className="flex flex-col md:flex-row items-center gap-7">
              <div className="flex-1 text-left md:text-right">
                <p className="font-es-sans font-semibold text-[22px] tracking-wide">REPORTS</p>
                <p className="font-es-sans text-[16px] tracking-wide mt-3">
                  Sustainability Analysts generate and export reports for stakeholder review.
                  Reports are archived for later reference.
                </p>
              </div>
              <video
                src="/assets/es-reports-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="flex-1 rounded-[10px] w-full max-w-[520px] h-auto shadow-lg"
              />
            </div>

            {/* COMPLIANCE HUB - video left, text right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-7">
              <div className="flex-1 text-left">
                <p className="font-es-sans font-semibold text-[22px] tracking-wide">
                  COMPLIANCE HUB
                </p>
                <p className="font-es-sans text-[16px] tracking-wide mt-3">
                  Compliance and Legal tracks deadlines by regulatory framework &mdash; CSRD, EU
                  Taxonomy, SECR, GHG Protocol.
                </p>
              </div>
              <video
                src="/assets/es-compliance-hub-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="flex-1 rounded-[10px] w-full max-w-[520px] h-auto shadow-lg"
              />
            </div>

            {/* ADD FACILITY - text left, video right */}
            <div className="flex flex-col md:flex-row items-center gap-7">
              <div className="flex-1 text-left md:text-right">
                <p className="font-es-sans font-semibold text-[22px] tracking-wide">
                  ADD FACILITY
                </p>
                <p className="font-es-sans text-[16px] tracking-wide mt-3">
                  The CIO onboards new data centers with key information before any
                  sustainability data can be submitted for them.
                </p>
              </div>
              <video
                src="/assets/es-add-facility-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="flex-1 rounded-[10px] w-full max-w-[520px] h-auto shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* OKRs + VISUAL DESIGN DECISIONS */}
        <div className="grid md:grid-cols-2">
          <div className="p-10" style={{ backgroundColor: "#000" }}>
            <span
              className="inline-block font-mono text-[16px] tracking-wide px-2 py-1 mb-5"
              style={{ backgroundColor: ES.green, color: "#000" }}
            >
              OBJECTIVES &amp; KEY RESULTS (OKRs)
            </span>
            <ul className="font-mono text-white text-[15px] tracking-wide uppercase list-disc pl-5 space-y-4">
              <li>
                Cut report generation time from <span style={{ color: ES.green }}>3 months</span>{" "}
                to <span style={{ color: ES.green }}>7 days</span>
              </li>
              <li>
                Reach <span style={{ color: ES.green }}>95%</span> data completeness across all
                facilities
              </li>
              <li>
                Have <span style={{ color: ES.green }}>80%</span> of facilities managers using
                dashboards monthly
              </li>
            </ul>
          </div>
          <div className="p-10 bg-white text-black">
            <span
              className="inline-block font-mono text-[16px] tracking-wide px-2 py-1 mb-5"
              style={{ backgroundColor: ES.green, color: "#000" }}
            >
              VISUAL DESIGN DECISIONS
            </span>
            <div className="flex items-start gap-6 flex-wrap">
              {/* proportions match the source palette exactly (scaled to 70% size): two
                  square-ish rows (green/black, mint/gray) each 75.5% of the block's
                  height, then one shorter row of four swatches for the rest */}
              <div className="flex flex-col shrink-0" style={{ width: 154, height: 260 }} aria-hidden>
                <div className="grid grid-cols-2" style={{ height: 98 }}>
                  <div style={{ backgroundColor: ES.green }} />
                  <div style={{ backgroundColor: "#000" }} />
                </div>
                <div className="grid grid-cols-2" style={{ height: 98 }}>
                  <div style={{ backgroundColor: ES.mint }} />
                  <div style={{ backgroundColor: ES.gray }} />
                </div>
                <div className="grid grid-cols-4" style={{ height: 64 }}>
                  <div style={{ backgroundColor: ES.red }} />
                  <div style={{ backgroundColor: ES.blue }} />
                  <div style={{ backgroundColor: ES.orange }} />
                  <div style={{ backgroundColor: ES.indigo }} />
                </div>
              </div>
              <div className="flex-1 min-w-[200px] flex flex-col gap-4">
                <p className="font-es-sans text-[14px] tracking-wide">
                  Clean, high-contrast palette to maximize usability, practicality, and
                  effectiveness of the EcoStack interface.
                </p>
                <p className="font-es-sans text-[13px] tracking-wide text-right">
                  Legible and simple font to ensure all information is easily interpreted as
                  written
                </p>
                <div className="text-right">
                  <p className="font-es-sans text-[20px]">Inter</p>
                  <p className="font-es-sans font-light text-[20px]">Inter Light</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DECISIONS AND TRADE-OFFS */}
        <section className="py-9 px-16 bg-black">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-white text-[22px] tracking-wide text-center">
              DECISIONS AND TRADE-OFFS
            </p>
          </div>
        </section>

        <section className="px-16 py-14">
          <div className="max-w-6xl mx-auto flex flex-col gap-7">
            <p className="font-es-sans text-[19px] md:text-[22px] tracking-wide">
              Our team made two decisions that reflect how we prioritized our limited time and
              scope.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-7 bg-black">
                <p className="font-mono text-[19px] tracking-wide mb-3" style={{ color: ES.green }}>
                  SEPARATE INTERFACES
                </p>
                <p className="font-es-sans text-white text-[16px] tracking-wide">
                  We gave every stakeholder their own interface instead of one dashboard with
                  filters. Each role&rsquo;s data needs were different enough that a single view
                  would force compromises for everyone.
                </p>
              </div>
              <div className="p-7 bg-black">
                <p className="font-mono text-[19px] tracking-wide mb-3" style={{ color: ES.green }}>
                  DEPRIORITIZING SUPPORT
                </p>
                <p className="font-es-sans text-white text-[16px] tracking-wide">
                  We deliberately scoped out training and maintenance workflows. They had
                  little bearing on whether the core prototype worked, so our time went
                  elsewhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REFINING THE MODEL */}
        <section className="px-16 pb-14">
          <div className="max-w-6xl mx-auto flex flex-col gap-7">
            <Label>REFINING THE MODEL</Label>
            <p className="font-es-sans text-[19px] md:text-[22px] tracking-wide leading-snug">
              Our dashboard originally showed only current data.
              <br />
              <br />
              We realized MRG needed historical performance too, so we updated our data flow
              diagram and prototype to <Mark>support archived views alongside real-time ones.</Mark>
            </p>

            <div className="grid md:grid-cols-2 gap-7 items-start mt-2">
              <ExpandableImage
                src="/assets/es-dataflow-diagram-zoom.png"
                alt="Zoomed data flow diagram showing the report generation, archiving, and stakeholder review loop"
                width={675}
                height={515}
                className="w-full h-auto object-contain border border-black/10"
              />
              <ExpandableImage
                src="/assets/es-reports-still-v2.png"
                alt="Sustainability Reports screen listing quarterly and annual reports available for export"
                width={625}
                height={389}
                className="w-full h-auto object-contain border border-black/10"
              />
            </div>
          </div>
        </section>

        {/* REFLECTION */}
        <section className="py-10 px-16 bg-black">
          <div className="max-w-6xl mx-auto">
            <Label color={ES.green}>REFLECTION</Label>

            <div className="grid md:grid-cols-2 gap-7 mt-7">
              <div>
                <p className="font-es-sans font-semibold text-white text-[16px] tracking-wide mb-3">
                  LOOKING BACK
                </p>
                <p className="font-es-sans text-white text-[16px] md:text-[19px] tracking-wide leading-relaxed">
                  One connection we could have strengthened is between each stakeholder and
                  their permissions. Our prototype has individual profiles for each role, but
                  our data model never formally defined who has access to what.
                </p>
              </div>
              <div>
                <p className="font-es-sans font-semibold text-white text-[16px] tracking-wide mb-3">
                  LOOKING FORWARD
                </p>
                <p className="font-es-sans text-white text-[16px] md:text-[19px] tracking-wide leading-relaxed">
                  We&rsquo;d close the user permissions gap with a proper access-control model.
                  Additionally, we would build the functions we had deprioritized due to time,
                  like how the system handles errors once a report reaches the CSuO.
                </p>
              </div>
            </div>

            <div className="text-center mt-9">
              <button
                type="button"
                onClick={() => scrollToId("es-top")}
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
