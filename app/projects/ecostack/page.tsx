"use client";

import Image from "next/image";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import ExpandableImage from "../../components/case-study/ExpandableImage";
import FeatureRow from "../../components/case-study/FeatureRow";
import Section from "../../components/case-study/Section";
import { Body, Caption, Eyebrow, Heading, Statement } from "../../components/case-study/Type";
import { BASE_PATH } from "../../lib/basePath";

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

// This case study's single emphasis style: a green marker highlight behind the text,
// matching EcoStack's own "centralization" / "standardized views" callouts.
function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-1" style={{ backgroundColor: ES.green }}>
      {children}
    </span>
  );
}

function DemoVideo({ src }: { src: string }) {
  return (
    <video
      src={`${BASE_PATH}${src}`}
      autoPlay
      muted
      loop
      playsInline
      className="min-w-0 md:flex-[3] rounded-[10px] w-full max-w-[680px] h-auto shadow-lg"
    />
  );
}

const OKRS = [
  { figure: "7 days", text: "Cut report generation time from 3 months to 7 days" },
  { figure: "95%", text: "Reach 95% data completeness across all facilities" },
  { figure: "80%", text: "Have 80% of facilities managers using dashboards monthly" },
];

export default function EcoStackCaseStudy() {
  return (
    <div className="flex flex-col min-h-full">
      <Nav />

      <div id="es-top" className="bg-white text-black font-es-sans">
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

          <div className="px-5 md:px-16 py-16 md:py-24">
            <div className="max-w-6xl mx-auto">
              <Statement>
                Turning three months of fragmented sustainability data into a system Meridian
                Retail Group (MRG) can trust and act on.
              </Statement>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mt-14 md:mt-20">
                <div className="flex flex-col gap-2">
                  <Caption>ROLE</Caption>
                  <Body>Research, Workflow Modeling &amp; Data Flow Design</Body>
                </div>
                <div className="flex flex-col gap-2">
                  <Caption>TEAM</Caption>
                  <Body>
                    Nitya Shankar
                    <br />
                    Hriesha Popat
                    <br />
                    Ana Moreno
                    <br />
                    Tariq Ebo
                  </Body>
                </div>
                <div className="flex flex-col gap-2">
                  <Caption>TIMELINE</Caption>
                  <Body>
                    9 weeks
                    <br />
                    INFO 380 SP26
                    <br />
                    MRG CASE STUDY
                  </Body>
                </div>
                <div className="flex flex-col gap-2">
                  <Caption>TOOLS</Caption>
                  <Body>
                    Figma
                    <br />
                    Figma Make
                    <br />
                    Jira
                  </Body>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OVERVIEW */}
        <Section bg={ES.dark} className="text-white" innerClassName="flex flex-col">
          <Eyebrow style={{ color: ES.green }}>OVERVIEW</Eyebrow>
          <Statement className="mt-4">
            EcoStack is a role-based enterprise dashboard that centralizes sustainability data
            collection, validation, and reporting across MRG&rsquo;s 12-facility data center
            portfolio.
          </Statement>
          <button
            type="button"
            onClick={() => scrollToId("es-solution")}
            className="self-start font-mono text-[16px] tracking-wide inline-flex items-center gap-2 mt-12 hover:opacity-80"
          >
            JUMP TO FINAL DESIGN <span aria-hidden>↓</span>
          </button>
        </Section>

        {/* PROBLEM - the HMW callout is this screen's focal point */}
        <Section innerClassName="flex flex-col">
          <Eyebrow>PROBLEM</Eyebrow>
          <Heading className="mt-4">
            MRG&rsquo;s sustainability data is fragmented across BMS systems, utility bills, and
            spreadsheets.
          </Heading>
          <Body className="mt-3 text-black/80">
            Data quality varies by facility, depending on whether they have real sensors or rely on
            manual estimates. Compiling one annual report currently takes the sustainability team
            about three months of manual work.
          </Body>
          <div className="p-8 md:p-14 mt-12" style={{ backgroundColor: ES.green }}>
            <Statement wide>
              How might we give MRG&rsquo;s stakeholders one reliable, standardized system to
              track, report on, and act on sustainability data across every facility?
            </Statement>
          </div>
        </Section>

        {/* RESEARCH - findings build up to the root-problem statement */}
        <Section innerClassName="flex flex-col">
          <Eyebrow>RESEARCH</Eyebrow>
          <Body className="mt-4">
            We interviewed stakeholders across the organization and logged findings on a Knowledge
            Board, separating known facts from assumptions and open questions.
          </Body>

          <Eyebrow className="mt-12 text-black/60">FINDINGS</Eyebrow>
          <div className="flex flex-col gap-3 mt-4">
            <div className="p-6 md:p-8 border-l-8" style={{ backgroundColor: ES.mint, borderColor: ES.green }}>
              <Body>
                The VP of IT Infrastructure&rsquo;s team spent 3-4 weeks every quarter compiling
                sustainability data that was already stale by the time they finished
              </Body>
            </div>
            <div className="p-6 md:p-8 border-l-8" style={{ backgroundColor: ES.lightGray, borderColor: ES.charcoal }}>
              <Body>
                Sustainability Analysts described the process as &ldquo;fragile&rdquo;: one late
                correction from a single facility could cascade through an entire report
              </Body>
            </div>
            <div className="p-6 md:p-8 border-l-8" style={{ backgroundColor: ES.mint, borderColor: ES.green }}>
              <Body>
                Compliance teams had no reliable way to trace a reported number back to its source
              </Body>
            </div>
          </div>

          <Statement className="mt-16 md:mt-24">
            Every stakeholder pointed to the same root problem: No single source of truth.
          </Statement>
          <Body className="mt-6">
            Based on these findings, <Mark>centralization</Mark> and <Mark>standardization</Mark>{" "}
            became the clearest opportunity for our design.
          </Body>
        </Section>

        {/* MODELING THE SYSTEM */}
        <Section innerClassName="flex flex-col">
          <Eyebrow>MODELING THE SYSTEM</Eyebrow>
          <Statement className="mt-4">We translated research into structure:</Statement>
          <Body className="mt-6">
            OKRs with measurable targets, a workflow diagram across three roles, and a data flow
            diagram formalizing how raw facility data becomes a reliable company-wide record.
          </Body>

          <div className="grid md:grid-cols-2 gap-10 items-start mt-12">
            <div className="flex flex-col items-center text-center gap-3">
              <ExpandableImage
                src="/assets/es-workflow-diagram.png"
                alt="Workflow (BPMN) diagram modeling the sustainability data collection and reporting process"
                width={761}
                height={474}
                className="w-full h-auto object-contain border border-black/10"
              />
              <Caption>
                Workflow diagram modeling sustainability data collection and reporting process for
                CSuO, Sustainability Analysts, and Facility Managers
              </Caption>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <ExpandableImage
                src="/assets/es-dataflow-diagram.png"
                alt="Data flow diagram (DFD) modeling the flow of sustainability data from initial report to archive"
                width={728}
                height={661}
                className="w-full h-auto object-contain border border-black/10"
              />
              <Caption>
                Data flow diagram (DFD) modeling flow of sustainability data from initial report to
                archive
              </Caption>
            </div>
          </div>
        </Section>

        {/* SOLUTION */}
        <Section
          id="es-solution"
          bg={ES.dark}
          size="band"
          className="text-white"
          innerClassName="flex items-end justify-between gap-6 flex-wrap"
        >
          <div className="flex flex-col gap-3">
            <Eyebrow style={{ color: ES.green }}>SOLUTION</Eyebrow>
            <Statement>Meet EcoStack</Statement>
          </div>
          <a
            href="https://www.figma.com/make/1ouvrGK5Fkis8p18DuGRsC/High-Fidelity-EcoStack-Prototype--Copy-?code-node-id=0-9&p=f&t=ZebNhCw3JyW4F9CB-0&fullscreen=1"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[16px] tracking-wide border border-white rounded-[5px] px-4 py-2 hover:opacity-80"
          >
            VIEW PROTOTYPE
          </a>
        </Section>

        {/* FEATURE WALKTHROUGH - roughly one feature per screen */}
        <Section bg={ES.mint} innerClassName="flex flex-col gap-24 md:gap-36">
          <FeatureRow
            title="ROLE-BASED ACCESS"
            media={<DemoVideo src="/assets/es-role-based-access-demo.mp4" />}
          >
            Each stakeholder gets a view built around their primary objectives instead of one
            dashboard everyone has to filter.
          </FeatureRow>

          <FeatureRow reverse title="DATA ENTRY" media={<DemoVideo src="/assets/es-data-entry-demo.mp4" />}>
            Facilities Managers submit and track sustainability data, flagging missing-data alerts,
            anomalies, and deadlines.
          </FeatureRow>

          <FeatureRow title="REPORTS" media={<DemoVideo src="/assets/es-reports-demo.mp4" />}>
            Sustainability Analysts generate and export reports for stakeholder review. Reports are
            archived for later reference.
          </FeatureRow>

          <FeatureRow
            reverse
            title="COMPLIANCE HUB"
            media={<DemoVideo src="/assets/es-compliance-hub-demo.mp4" />}
          >
            Compliance and Legal tracks deadlines by regulatory framework: CSRD, EU Taxonomy, SECR,
            GHG Protocol.
          </FeatureRow>

          <FeatureRow title="ADD FACILITY" media={<DemoVideo src="/assets/es-add-facility-demo.mp4" />}>
            The CIO onboards new data centers with key information before any sustainability data
            can be submitted for them.
          </FeatureRow>
        </Section>

        {/* OKRs - the target figures are the focal point */}
        <Section bg="#000" className="text-white">
          <Eyebrow style={{ color: ES.green }}>OBJECTIVES &amp; KEY RESULTS (OKRs)</Eyebrow>
          <div className="grid md:grid-cols-3 gap-12 md:gap-10 mt-12">
            {OKRS.map((okr) => (
              <div key={okr.figure} className="flex flex-col gap-3 border-t border-white/20 pt-6">
                <Statement style={{ color: ES.green }}>{okr.figure}</Statement>
                <Body className="text-white/80">{okr.text}</Body>
              </div>
            ))}
          </div>
        </Section>

        {/* VISUAL DESIGN DECISIONS */}
        <Section>
          <Eyebrow>VISUAL DESIGN DECISIONS</Eyebrow>
          <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16 mt-10">
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
            <div className="flex-1 min-w-0 flex flex-col gap-10">
              <Body>
                Clean, high-contrast palette to maximize usability, practicality, and effectiveness
                of the EcoStack interface.
              </Body>
              <div className="flex flex-col gap-3">
                <Body>
                  Legible and simple font to ensure all information is easily interpreted as
                  written
                </Body>
                {/* type specimens - intentionally show the product's weights */}
                <div>
                  <p className="text-[24px]">Inter</p>
                  <p className="font-light text-[24px]">Inter Light</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* DECISIONS AND TRADE-OFFS */}
        <Section bg={ES.mint} innerClassName="flex flex-col">
          <Eyebrow>DECISIONS AND TRADE-OFFS</Eyebrow>
          <Statement className="mt-4">
            Our team made two decisions that reflect how we prioritized our limited time and scope.
          </Statement>

          <div className="grid md:grid-cols-2 gap-4 mt-12">
            <div className="p-6 md:p-8 bg-black flex flex-col gap-3">
              <Heading style={{ color: ES.green }}>SEPARATE INTERFACES</Heading>
              <Body className="text-white">
                We gave every stakeholder their own interface instead of one dashboard with filters.
                Each role&rsquo;s data needs were different enough that a single view would force
                compromises for everyone.
              </Body>
            </div>
            <div className="p-6 md:p-8 bg-black flex flex-col gap-3">
              <Heading style={{ color: ES.green }}>DEPRIORITIZING SUPPORT</Heading>
              <Body className="text-white">
                We deliberately scoped out training and maintenance workflows. They had little
                bearing on whether the core prototype worked, so our time went elsewhere.
              </Body>
            </div>
          </div>
        </Section>

        {/* REFINING THE MODEL */}
        <Section innerClassName="flex flex-col">
          <Eyebrow>REFINING THE MODEL</Eyebrow>
          <Statement className="mt-4">Our dashboard originally showed only current data.</Statement>
          <Body className="mt-6">
            We realized MRG needed historical performance too, so we updated our data flow diagram
            and prototype to <Mark>support archived views alongside real-time ones.</Mark>
          </Body>

          <div className="grid md:grid-cols-2 gap-10 items-start mt-12">
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
        </Section>

        {/* REFLECTION */}
        <Section bg="#000" className="text-white">
          <Eyebrow style={{ color: ES.green }}>REFLECTION</Eyebrow>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mt-10">
            <div className="flex flex-col gap-3">
              <Heading>LOOKING BACK</Heading>
              <Body>
                One connection we could have strengthened is between each stakeholder and their
                permissions. Our prototype has individual profiles for each role, but our data model
                never formally defined who has access to what.
              </Body>
            </div>
            <div className="flex flex-col gap-3">
              <Heading>LOOKING FORWARD</Heading>
              <Body>
                We&rsquo;d close the user permissions gap with a proper access-control model.
                Additionally, we would build the functions we had deprioritized due to time, like
                how the system handles errors once a report reaches the CSuO.
              </Body>
            </div>
          </div>

          <div className="text-center mt-16">
            <button
              type="button"
              onClick={() => scrollToId("es-top")}
              className="font-mono text-[16px] tracking-wide inline-flex items-center gap-2 hover:opacity-80"
            >
              JUMP TO TOP <span aria-hidden>↑</span>
            </button>
          </div>
        </Section>
      </div>

      <Footer />
    </div>
  );
}
