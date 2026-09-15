import Image from "next/image";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import FloatingStar from "./components/FloatingStar";
import ProjectCard from "./components/ProjectCard";
import ExperienceAccordion, { ExperienceItem } from "./components/ExperienceAccordion";
import ScatterStar from "./components/ScatterStar";

const experienceItems: ExperienceItem[] = [
  {
    id: "qcenter",
    title: "WEB & OPERATIONS SPECIALIST | UW Q CENTER | SEP 2026 - PRESENT",
    color: "#0098d4",
    bullets: [
      "Conduct a comprehensive accessibility audit of the Q Center website, identifying key areas of improvement and developing a project timeline toward WCAG 2.1 AA and Title II compliance by 2027.",
      "Redesign information architecture for digital service distribution, improving user pathways to key essential resources.",
    ],
    currently: "Re-iterating website design to increase visibility of Q Center events and resource distribution systems.",
  },
  {
    id: "kidsteam",
    title: "RESEARCH ASSISTANT | KIDSTEAM @ UW | JUN 2026 - PRESENT",
    color: "#eb369b",
    bullets: [
      "Drive user-centered product design across research operations by executing intergenerational co-design sessions and translating insights from children into actionable ideas and prototypes.",
      "Conduct qualitative analysis of 3+ hours of session footage using thematic coding to examine children's relationships with autonomy and technology.",
      "Formulate participatory design strategies by synthesizing findings from 18 academic publications and Directed Reading Group (DRG) sessions.",
      "Streamline workshop execution and team operations by managing logistics and facilitating co-design sessions for groups of 20+ diverse, intergenerational stakeholders.",
    ],
    currently: "Examining children's relationships with autonomy and technology, contributing to a publication expected January 2027.",
  },
  {
    id: "iuga",
    title: "DIR. OF DIVERSITY | INFORMATICS UNDERGRADUATE ASSOCIATION | OCT 2025 - PRESENT",
    color: "#d69500",
    bullets: [
      "Drive cross-functional collaboration between students, faculty, and external sponsors to plan professional development programming for 200+ iSchool students.",
      "Conduct sponsor outreach and manage external partnerships, synthesizing stakeholder needs to inform event strategy and community engagement initiatives.",
      "Spearhead diversity initiatives within the iSchool, working to embed equity and inclusion practices into the organizational structure.",
    ],
    currently: "Building structured protocols to scaffold future event, promotion, and outreach initiatives.",
  },
];

// percentage positions (of the hero section's own box) so the field always stays in
// frame regardless of viewport width. Loosely scattered in the open gaps around the
// star-guy cluster and the text column (between lines, beside the characters, and
// through the wide open area below) rather than confined to a strict margin, matching
// the reference layout - fewer, more organic points instead of dense edge strips.
const HERO_SCATTER_STARS: { x: number; y: number }[] = [
  { x: 18, y: 9 },
  { x: 60, y: 8 },
  { x: 82, y: 10 },
  { x: 8, y: 22 },
  { x: 30, y: 24 },
  { x: 70, y: 23 },
  { x: 92, y: 20 },
  { x: 15, y: 38 },
  { x: 85, y: 40 },
  { x: 6, y: 58 },
  { x: 94, y: 56 },
  { x: 25, y: 72 },
  { x: 75, y: 74 },
  { x: 50, y: 90 },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <Nav />

      {/* HERO */}
      <section className="relative px-24 pt-20 pb-32">
        <div className="absolute inset-0 pointer-events-none">
          {HERO_SCATTER_STARS.map((s, i) => (
            <ScatterStar
              key={i}
              color="white"
              size={19}
              style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%, -50%)" }}
            />
          ))}
        </div>

        <div className="relative flex gap-8 items-start w-fit mx-auto">
          <div className="relative shrink-0 w-[360px] h-[384px] mt-2">
            <div className="absolute left-[52px] top-0">
              <FloatingStar src="/assets/star-guy-orange-v2.png" size={218} rotate={-4.17} />
            </div>
            <div className="absolute left-0 top-[202px]">
              <FloatingStar src="/assets/star-guy-blue-v3.png" size={176} rotate={3.68} />
            </div>
            <div className="absolute left-[182px] top-[168px]">
              <FloatingStar src="/assets/star-guy-red-v2.png" size={180} rotate={-4.69} />
            </div>
          </div>

          <div className="max-w-3xl pt-6">
            <p className="font-display text-white text-[48px] leading-none">HI! I&rsquo;M</p>
            <h1 className="font-display text-white text-[110px] leading-none -mt-2">NITYA SHANKAR</h1>

            <p className="font-mono text-white text-[24px] leading-snug mt-8 max-w-2xl">
              Aspiring product designer with a passion for building digital experiences
              that feel{" "}
              <span className="px-1" style={{ backgroundColor: "#eb369b" }}>
                personal
              </span>
              ,{" "}
              <span className="px-1" style={{ backgroundColor: "#0098d4" }}>
                accessible
              </span>
              , and{" "}
              <span className="px-1" style={{ backgroundColor: "#d69500" }}>
                joyful
              </span>
              .
            </p>

            <p className="font-mono font-light text-white/70 text-sm mt-6 tracking-wide">
              INFORMATICS &lsquo;28 @ THE UNIVERSITY OF WASHINGTON
              <br />
              BASED IN SEATTLE, WA
            </p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative px-24 pt-20 pb-16 scroll-mt-[119px]">
        <h2 className="font-display text-white text-[45px] text-center mb-16">PROJECTS</h2>

        <div className="relative max-w-6xl mx-auto">
          {/* fine scattered stars, behind everything */}
          <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
            <ScatterStar color="#ffb200" size={16} className="top-[2%] left-[38%]" />
            <ScatterStar color="#0098d4" size={14} className="top-[6%] left-[62%]" />
            <ScatterStar color="#ff1e00" size={18} className="top-[10%] left-[8%]" />
            <ScatterStar color="#eb369b" size={14} className="top-[16%] left-[85%]" />
            <ScatterStar color="#ffb200" size={12} className="top-[22%] left-[50%]" />
            <ScatterStar color="#0098d4" size={16} className="top-[27%] left-[20%]" />
            <ScatterStar color="#ff1e00" size={14} className="top-[35%] left-[70%]" />
            <ScatterStar color="#eb369b" size={18} className="top-[40%] left-[4%]" />
            <ScatterStar color="#ffb200" size={14} className="top-[48%] left-[90%]" />
            <ScatterStar color="#0098d4" size={12} className="top-[55%] left-[35%]" />
            <ScatterStar color="#ff1e00" size={16} className="top-[62%] left-[60%]" />
            <ScatterStar color="#eb369b" size={14} className="top-[70%] left-[12%]" />
            <ScatterStar color="#ffb200" size={18} className="top-[78%] left-[45%]" />
            <ScatterStar color="#0098d4" size={14} className="top-[85%] left-[75%]" />
            <ScatterStar color="#ff1e00" size={12} className="top-[92%] left-[25%]" />
            <ScatterStar color="#eb369b" size={16} className="top-[96%] left-[88%]" />
          </div>

          <div className="relative z-10 flex flex-col gap-20">
            <ProjectCard
              title="PAGE FRIENDS"
              date="MAY 2026"
              description="Increasing children's motivation to read and quality of engagement with literature."
              tags={[
                { label: "HI-FI PROTOTYPING", color: "#eb369b" },
                { label: "USABILITY TESTING", color: "#0098d4" },
                { label: "USER RESEARCH", color: "#0098d4" },
                { label: "SCOPING+PRIORITIZATION", color: "#ff1e00" },
              ]}
              href="/projects/page-friends"
              mediaPosition="right"
              media={{
                src: "/assets/page-friends-preview-v2.png",
                alt: "Page Friends app screens: Welcome, Library, and Visit Town",
                width: 375,
                height: 250,
              }}
              video="/assets/page-friends-demo.mp4"
              badges={[
                { src: "/assets/star-orange.png", size: 154, className: "-left-[71px] -top-[43px]" },
                { src: "/assets/star-red.png", size: 185, className: "left-[358px] top-[187px]" },
              ]}
            />

            <ProjectCard
              title="ECOSTACK"
              date="MAY 2026"
              description="Turning inconsistent, manual sustainability reporting into an auditable, scalable system."
              tags={[
                { label: "USER RESEARCH", color: "#0098d4" },
                { label: "SCOPING+PRIORITIZATION", color: "#ff1e00" },
                { label: "WORKFLOW MAPPING", color: "#eb369b" },
                { label: "DATA MODELING(DFD)", color: "#d69500" },
              ]}
              href="/projects/ecostack"
              mediaPosition="left"
              media={{
                src: "/assets/ecostack-preview-v2.png",
                alt: "EcoStack sustainability reports dashboard",
                width: 517,
                height: 331,
              }}
              video="/assets/ecostack-demo.mp4"
              badges={[
                { src: "/assets/star-blue-v2.png", size: 156, className: "left-[354px] -top-[114px]" },
                { src: "/assets/star-pink.png", size: 142, className: "-left-[79px] top-[192px]" },
              ]}
            />

            <ProjectCard
              title="ASSIMILATION ON THE MENU"
              date="SEP 2026"
              description="Mapping the lag between when immigrant communities arrive and when their cuisines reach mainstream American menus."
              tags={[
                { label: "DATA ANALYSIS", color: "#d69500" },
                { label: "TEXT CLASSIFICATION", color: "#ff1e00" },
                { label: "NARRATIVE DESIGN", color: "#eb369b" },
              ]}
              href="/projects/assimilation-on-the-menu"
              comingSoon
              mediaPosition="right"
              mediaSlot={
                <div className="relative overflow-hidden" style={{ width: 415, height: 271 }}>
                  <Image
                    src="/assets/under-construction-star-v2.png"
                    alt="Under construction: star mascot with hard hat, cone, and toolbox"
                    fill
                    sizes="415px"
                    className="object-contain"
                  />
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="px-24 pt-16 pb-20 scroll-mt-[119px]">
        <h2 className="font-display text-white text-[38px] text-center mb-16">EXPERIENCE</h2>
        <div className="max-w-6xl mx-auto">
          <ExperienceAccordion items={experienceItems} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
