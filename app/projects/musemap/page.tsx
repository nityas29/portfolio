"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import ExpandableImage from "../../components/case-study/ExpandableImage";
import Section from "../../components/case-study/Section";
import { Body, Caption, Eyebrow, Heading, Statement } from "../../components/case-study/Type";
import { BASE_PATH } from "../../lib/basePath";

// DRAFT. Anything in [BRACKETS] is a placeholder that still needs real content.

// Musemap's own brand palette (from the project's style guide in the portfolio Figma file),
// used only within this case study - distinct from the portfolio's own color tokens.
const MM = {
  olive: "#51582f",
  brown: "#744a32",
  charcoal: "#413d3b",
  cream: "#f9f7f3",
  tan: "#e7e1d9",
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// This case study's single emphasis style: a colored highlight chip.
// (extra padding + box-decoration-clone + loose line height so wrapped chips never touch)
function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="px-2 py-[3px] text-white [box-decoration-break:clone]"
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}

// One survey result: big number on the left, what it means on the right.
function StatRow({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="grid grid-cols-[96px_1fr] md:grid-cols-[160px_1fr] items-center gap-4 md:gap-8 py-5 border-b"
      style={{ borderColor: `${MM.olive}55` }}
    >
      <p className="font-semibold text-[40px] md:text-[56px] leading-none" style={{ color: MM.olive }}>
        {value}
      </p>
      <Body>{label}</Body>
    </div>
  );
}

// Phone-sized recording or still for a feature row (580x1260 source).
function MobileMedia({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative shrink-0 flex justify-center">
      {/* 3px frame, center-aligned on the screen edge (half inside, half outside) */}
      <div
        className="absolute inset-[-1.5px] rounded-[28.5px] border-[3px] pointer-events-none z-10"
        style={{ borderColor: MM.charcoal }}
        aria-hidden
      />
      {src.endsWith(".mp4") ? (
        <video
          src={`${BASE_PATH}${src}`}
          aria-label={alt}
          autoPlay
          muted
          loop
          playsInline
          className="w-[240px] md:w-[290px] h-auto rounded-[27px]"
        />
      ) : (
        <ExpandableImage
          src={src}
          alt={alt}
          width={580}
          height={1260}
          className="w-[240px] md:w-[290px] h-auto rounded-[27px]"
        />
      )}
    </div>
  );
}

// Text + phone mockup, centered as one unit so the left and right margins stay even.
function MobileFeature({
  title,
  children,
  media,
  reverse = false,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  media: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center justify-center gap-8 md:gap-32`}
    >
      <div
        className={`w-full md:w-[360px] md:shrink-0 flex flex-col gap-3 text-left ${
          reverse ? "" : "md:text-right md:items-end"
        }`}
      >
        <Heading>{title}</Heading>
        <Body>{children}</Body>
      </div>
      {media}
    </div>
  );
}

function Competitor({
  name,
  type,
  points,
  logo,
}: {
  name: string;
  type: string;
  points: string[];
  logo: { src: string; width: number; height: number };
}) {
  return (
    <div className="flex flex-col gap-3 md:px-8 md:first:pl-0 md:last:pr-0">
      <Image
        src={logo.src}
        alt={`${name} logo`}
        width={logo.width}
        height={logo.height}
        className="h-14 w-auto rounded-xl object-contain self-start"
      />
      <Heading>
        {name} <span className="font-normal opacity-60">({type})</span>
      </Heading>
      <ul className="list-disc pl-6 text-[16px] md:text-[18px] leading-relaxed tracking-wide space-y-1">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

// Style guide pieces (visual design section)
function GuideTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mm-serif font-light text-[22px] md:text-[26px] self-start border-b pb-1"
      style={{ color: MM.charcoal, borderColor: MM.brown }}
    >
      {children}
    </p>
  );
}

// the style guide's callout: olive bar + light olive tint
function GuideNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex" style={{ backgroundColor: `${MM.olive}33` }}>
      <div className="w-[10px] shrink-0" style={{ backgroundColor: MM.olive }} />
      <Body className="p-4">{children}</Body>
    </div>
  );
}

function GuideButton({
  children,
  className = "",
  bg,
  fg = MM.tan,
}: {
  children: React.ReactNode;
  className?: string;
  bg: string;
  fg?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center font-mono font-medium uppercase text-[14px] md:text-[15px] ${className}`}
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </span>
  );
}

// User flow gallery: one flow at a time, arrows + swipe/scroll to move between them.
// Swap the src files for transparent exports of the Figma flows (same names) when ready.
const FLOWS = [
  {
    src: "/assets/mm-flow-onboarding-web.png",
    w: 2400,
    h: 1127,
    alt: "Onboarding user flow: log in or create an account, then choose accessibility options and general interests",
    caption: "Onboarding",
  },
  {
    src: "/assets/mm-flow-events-web.png",
    w: 2400,
    h: 1451,
    alt: "Event page navigation user flow: toggle recommended events or museums, filter by event type, read about events, buy tickets",
    caption: "Event page navigation",
  },
  {
    src: "/assets/mm-flow-pathfinding-web.png",
    w: 2400,
    h: 1190,
    alt: "Pathfinding user flow: choose a museum, optionally personalize the path and invite friends, create a map, rate the visit, post to feed",
    caption: "Pathfinding",
  },
  {
    src: "/assets/mm-flow-profile-web.png",
    w: 2400,
    h: 923,
    alt: "Profile and accessibility options user flow: view and edit profile, customize personal information, choose accessibility settings",
    caption: "Profile and accessibility options",
  },
];

function FlowGallery() {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  function go(to: number) {
    const el = scroller.current;
    if (!el) return;
    const next = Math.max(0, Math.min(FLOWS.length - 1, to));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setIndex(next);
  }

  const arrow =
    "shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center text-[20px] disabled:opacity-30 hover:opacity-80";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 md:gap-5">
        <button
          type="button"
          aria-label="Previous flow"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className={arrow}
          style={{ borderColor: MM.olive, color: MM.olive }}
        >
          &larr;
        </button>
        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex flex-1 min-w-0 items-center overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FLOWS.map((f) => (
            <div key={f.src} className="snap-center shrink-0 w-full flex justify-center">
              <ExpandableImage src={f.src} alt={f.alt} width={f.w} height={f.h} className="w-full h-auto" />
            </div>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next flow"
          onClick={() => go(index + 1)}
          disabled={index === FLOWS.length - 1}
          className={arrow}
          style={{ borderColor: MM.olive, color: MM.olive }}
        >
          &rarr;
        </button>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Caption>
          {FLOWS[index].caption} ({index + 1} of {FLOWS.length})
        </Caption>
        <div className="flex gap-2">
          {FLOWS.map((f, i) => (
            <button
              key={f.caption}
              type="button"
              aria-label={`Show ${f.caption}`}
              onClick={() => go(i)}
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: i === index ? MM.olive : `${MM.olive}44` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MusemapCaseStudy() {
  return (
    <div className="flex flex-col min-h-full">
      <Nav />

      <div id="mm-top" className="bg-white text-black font-pf-sans">
        {/* HERO */}
        <section className="relative">
          <div className="relative w-full flex items-center justify-center py-14 md:py-20" style={{ backgroundColor: MM.olive }}>
            <Image
              src="/assets/mm-logo-white.png"
              alt="Musemap: a museum building logo with the tagline, a personalized museum experience for you"
              width={773}
              height={603}
              className="w-[260px] md:w-[380px] h-auto"
              priority
            />
          </div>

          <div className="px-5 md:px-16 py-16 md:py-24">
            <div className="max-w-6xl mx-auto">
              <Statement>
                A mobile app that helps Seattle students discover museums and plan personalized
                visits, so museum-going becomes an engaging, recurring habit.
              </Statement>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 mt-14 md:mt-20">
                <div className="flex flex-col gap-2">
                  <Caption>ROLE</Caption>
                  <Body>UX Researcher &amp; Designer</Body>
                </div>
                <div className="flex flex-col gap-2">
                  <Caption>TIMELINE</Caption>
                  <Body>
                    3 weeks
                    <br />
                    Alpha Theta Delta Fraternity
                  </Body>
                </div>
                <div className="flex flex-col gap-2">
                  <Caption>TOOLS</Caption>
                  <Body>Figma</Body>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OVERVIEW */}
        <Section bg={MM.olive} className="text-white" innerClassName="flex flex-col">
          <Eyebrow>OVERVIEW</Eyebrow>
          <Statement className="mt-4">
            A coalition of Seattle museums wanted one cohesive way for people to discover, plan, and
            engage with museums, without losing what makes each one unique.
          </Statement>
          <Body className="mt-8">
            Over three weeks, our team researched why students skip museums, defined the barriers in
            their way, and designed a prototype around event discovery, interest-based pathfinding,
            accessibility options, and a light social layer. I led the research and shaped how its
            findings became features, and I designed the app&rsquo;s user flows.
          </Body>
          <button
            type="button"
            onClick={() => scrollToId("mm-solution")}
            className="self-center font-mono text-[16px] tracking-wide inline-flex items-center gap-2 mt-12 hover:opacity-80"
          >
            JUMP TO FINAL DESIGN <span aria-hidden>↓</span>
          </button>
        </Section>

        {/* PROBLEM - the HMW callout is this screen's focal point */}
        <Section innerClassName="flex flex-col">
          <Eyebrow>PROBLEM</Eyebrow>
          <Heading className="mt-4">
            Seattle museums are seeing a decline in visitor engagement and ticket sales.
          </Heading>
          <Body className="mt-3 text-black/80">
            Each museum has its own exhibits and audience, but visitors have no single, easy way to
            find what is on, decide where to go, or get the most out of a visit.
          </Body>
          <div className="p-8 md:p-14 mt-12" style={{ backgroundColor: MM.brown }}>
            <Statement wide className="text-white">
              How might we design and promote a personalized Seattle museum experience for students
              so that visits become an engaging and recurring pastime?
            </Statement>
          </div>
        </Section>

        {/* RESEARCH - (a) methods + survey stats, (b) interview themes + quote, (c) competitors + takeaway */}
        <Section innerClassName="flex flex-col gap-24 md:gap-28">
          <div className="flex flex-col">
            <Eyebrow>RESEARCH</Eyebrow>
            <Statement className="mt-4 !leading-[1.75]">
              We combined <Chip color={MM.brown}>field research</Chip> at the Burke Museum and Henry
              Art Gallery, a <Chip color={MM.olive}>survey</Chip> with 98 responses, and{" "}
              <Chip color={MM.charcoal}>7 interviews</Chip>.
            </Statement>

            <Eyebrow className="mt-12 text-black/60">SURVEY FINDINGS</Eyebrow>
            <div className="flex flex-col mt-2 border-t" style={{ borderColor: `${MM.olive}55` }}>
              <StatRow value="87%" label="visit museums once to a few times per year" />
              <StatRow value="67%" label="are more likely to visit if they see others visiting" />
              <StatRow value="39%" label="say museums are costly" />
              <StatRow value="34%" label="don't have the time to visit" />
            </div>
          </div>

          <div className="flex flex-col">
            <Eyebrow className="text-black/60">INTERVIEW THEMES</Eyebrow>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="p-6 md:p-8 flex flex-col gap-3 text-white" style={{ backgroundColor: MM.charcoal }}>
                <Heading>MUSEUM FATIGUE</Heading>
                <Body>
                  Hard to navigate, too much reading, and boredom. 5 of 7 interviewees felt
                  overwhelmed by museum size.
                </Body>
              </div>
              <div className="p-6 md:p-8 flex flex-col gap-3 text-white" style={{ backgroundColor: MM.charcoal }}>
                <Heading>NOT ENGAGING</Heading>
                <Body>A lack of variety, and little that matched what visitors actually care about.</Body>
              </div>
              <div className="p-6 md:p-8 flex flex-col gap-3 text-white" style={{ backgroundColor: MM.charcoal }}>
                <Heading>TOO EXPENSIVE</Heading>
                <Body>High ticket prices, and many students never hear about free days or new exhibits.</Body>
              </div>
            </div>

            <div className="mt-12 border-l-4 pl-6 md:pl-8 flex flex-col gap-2" style={{ borderColor: MM.brown }}>
              <Statement wide className="!text-[20px] md:!text-[24px] font-normal">
                &ldquo;The bigger museums sometimes have translations, but I wish more museums have
                options in language audio description.&rdquo;
              </Statement>
              <Caption>UW student interviewee</Caption>
            </div>
          </div>

          <div className="flex flex-col">
            <Eyebrow className="text-black/60">COMPETITOR ANALYSIS</Eyebrow>
            <div className="grid md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-black/15 mt-6">
              <Competitor
                name="Bloomberg Connects"
                type="App"
                points={["Curated museum tours", "Static floor maps", "Free"]}
                logo={{ src: "/assets/bloomberg_connects_logo.jpeg", width: 447, height: 447 }}
              />
              <Competitor
                name="Locatify"
                type="Service"
                points={["Gamifies the museum experience", "Custom floor maps", "Paid"]}
                logo={{ src: "/assets/locatify_logo.png", width: 447, height: 447 }}
              />
              <Competitor
                name="Smartify"
                type="App"
                points={["ID artwork", "Audio guides", "Freemium"]}
                logo={{ src: "/assets/smartify-logo-square.png", width: 447, height: 447 }}
              />
            </div>
            <Body className="mt-12">
              We focused on students, who made up most of our participants and are a small share of
              museum visitors, which leaves room to grow.{" "}
              <strong className="font-semibold">
                None of these tools build a route around the visitor&rsquo;s own interests.
              </strong>
            </Body>
            <Statement className="mt-12 !leading-[1.75]">
              Three barriers kept coming up: <Chip color={MM.brown}>accessibility</Chip>,{" "}
              <Chip color={MM.olive}>cost</Chip>, and <Chip color={MM.charcoal}>time</Chip>.
            </Statement>
          </div>
        </Section>

        {/* RESEARCH TO FEATURES - the centerpiece of my contribution */}
        <Section bg={MM.tan} innerClassName="flex flex-col">
          <Eyebrow>FROM RESEARCH TO FEATURES</Eyebrow>
          <Statement className="mt-4">
            Every core feature traces back to something we heard or measured.
          </Statement>

          <div className="mt-12 flex flex-col">
            <div
              className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-6 pb-3 border-b"
              style={{ borderColor: MM.charcoal }}
            >
              <Caption className="uppercase">What we found</Caption>
              <span />
              <Caption className="uppercase">What we built</Caption>
            </div>
            {[
              {
                finding: "Museum fatigue: 5 of 7 interviewees felt overwhelmed, and too much reading lost them.",
                feature: "Pathfinding Flow",
                detail: "Pick topics, get a personalized map with floorplans and a visit summary.",
              },
              {
                finding: "Boredom and a lack of variety; nothing matched their interests.",
                feature: "Museum Topics",
                detail: "Interests drive the route, so visitors see what they care about first.",
              },
              {
                finding: "39% say museums are costly, and many never hear about free days or new exhibits.",
                feature: "Event Discovery",
                detail: "Discounts, pop-ups, and exhibits in a two-tab events and museums view.",
              },
              {
                finding: "Language, mobility, and vision barriers; “I wish more museums have language options.”",
                feature: "Accessibility Focus",
                detail: "Language selection and accessibility options set up during onboarding.",
              },
              {
                finding: "67% are more likely to visit if they see others visiting.",
                feature: "Social Layer",
                detail: "Invite friends, blend interests into one path, and keep a visit history.",
              },
            ].map((row) => (
              <div
                key={row.feature}
                className="grid md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-6 items-start py-6 border-b"
                style={{ borderColor: `${MM.charcoal}33` }}
              >
                <Body>{row.finding}</Body>
                <span className="hidden md:block text-[24px]" aria-hidden style={{ color: MM.brown }}>
                  &rarr;
                </span>
                <div className="flex flex-col gap-1">
                  <Heading style={{ color: MM.brown }}>{row.feature.toUpperCase()}</Heading>
                  <Body>{row.detail}</Body>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* IDEATION */}
        <Section innerClassName="flex flex-col">
          <Eyebrow>IDEATION</Eyebrow>
          <Statement className="mt-4">
            We explored three ideations and carried the strongest ideas from each into one mid-fi
            prototype.
          </Statement>

          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div className="p-6 md:p-8 flex flex-col gap-3 text-white" style={{ backgroundColor: MM.brown }}>
              <Heading>PATHFINDER</Heading>
              <Body>Personalized, accessible museum paths, plus promotion of social events and deals.</Body>
            </div>
            <div className="p-6 md:p-8 flex flex-col gap-3 text-white" style={{ backgroundColor: MM.brown }}>
              <Heading>PHOTOBOOTH &amp; SPONSORS</Heading>
              <Body>A social media feature with a photo booth and brand partnerships.</Body>
            </div>
            <div className="p-6 md:p-8 flex flex-col gap-3 text-white" style={{ backgroundColor: MM.brown }}>
              <Heading>DISCOUNTS</Heading>
              <Body>Notifications about discount days and new exhibits, with an engaging route.</Body>
            </div>
          </div>
          <Body className="mt-10">
            We chose an app because museums are moving toward digital displays, it works across every
            Seattle museum, physical solutions are not cost effective, and 95% of Americans aged 18
            to 24 rely on smartphones.
          </Body>
        </Section>

        {/* USER FLOWS - my second main contribution */}
        <Section bg={MM.olive} size="band" className="text-white" innerClassName="flex flex-col gap-3">
          <Eyebrow>USER FLOWS</Eyebrow>
          <Statement>How people move through Musemap</Statement>
        </Section>

        <Section innerClassName="flex flex-col gap-12">
          <Body>
            I mapped four flows to decide what each screen needed to do before we designed it. I
            prioritized user control and freedom to reduce onboarding fatigue and let each user
            choose how personalized they want their experience to be.
          </Body>
          <FlowGallery />
        </Section>

        {/* DECISIONS AND TRADE-OFFS: mid-fi refinements */}
        <Section bg={MM.tan} innerClassName="flex flex-col">
          <Eyebrow>DECISIONS AND TRADE-OFFS</Eyebrow>
          <Statement className="mt-4">
            After our mid-fidelity prototype, we made three calls to keep the design focused and
            feasible.
          </Statement>

          <div className="grid md:grid-cols-3 gap-4 mt-12">
            {[
              {
                title: "FOCUS ON RETENTION",
                color: MM.olive,
                body: "We added museum recommendations based on past visits, and made pathfinding reflect each user\u2019s interests more accurately.",
              },
              {
                title: "CUTTING SPONSORS",
                color: MM.brown,
                body: "Sponsors were hard to attract and we had little to offer them, so we set the idea aside for the future.",
              },
              {
                title: "NO SOCIAL MEDIA FEED",
                color: MM.charcoal,
                body: "A feed only works with mass retention, so we put our effort into onboarding and app discovery. Lighter social features, like inviting friends, stayed.",
              },
            ].map((d, i) => (
              <div
                key={d.title}
                className="p-6 md:p-8 flex flex-col gap-3 text-white"
                style={{ backgroundColor: d.color }}
              >
                <p className="font-mono text-[14px] md:text-[16px] tracking-[0.12em] opacity-80">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <Heading>{d.title}</Heading>
                <Body>{d.body}</Body>
              </div>
            ))}
          </div>
        </Section>

        {/* SOLUTION */}
        <Section
          id="mm-solution"
          bg={MM.olive}
          size="band"
          className="text-white"
          innerClassName="flex items-end justify-between gap-6 flex-wrap"
        >
          <div className="flex flex-col gap-3">
            <Eyebrow>SOLUTION</Eyebrow>
            <Statement>Meet Musemap</Statement>
          </div>
          <a
            href="https://www.figma.com/proto/Fv5FK614GKvAUXkTFm0khj/Design-Team-File?node-id=1065-1281&t=gpteOjcARAdq6980-1"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[16px] tracking-wide border border-white rounded-[5px] px-4 py-2 hover:opacity-80"
          >
            VIEW PROTOTYPE
          </a>
        </Section>

        <Section innerClassName="flex flex-col gap-24 md:gap-36">
          <MobileFeature
            title="EVENT DISCOVERY"
            media={<MobileMedia src="/assets/mm-event-demo.mp4" alt="Event discovery screen recording" />}
          >
            Find discounts, pop-ups, and exhibits. A two-tab system separates events from museums,
            with keyword search and curated picks.
          </MobileFeature>

          <MobileFeature
            reverse
            title="PATHFINDING FLOW"
            media={<MobileMedia src="/assets/mm-pathfinding-demo.mp4" alt="Pathfinding screen recording" />}
          >
            Choose the topics you care about and get a personalized map across multi-floor
            floorplans, with a summary of your route.
          </MobileFeature>

          <MobileFeature
            title="ACCESSIBILITY FOCUS"
            media={<MobileMedia src="/assets/mm-onboarding-demo.mp4" alt="Musemap onboarding screen recording" />}
          >
            Language selection and accessibility options come up during onboarding, so the app
            adapts to the visitor from the start.
          </MobileFeature>

          <MobileFeature
            reverse
            title="SOCIAL LAYER"
            media={<MobileMedia src="/assets/mm-social-demo.mp4" alt="Social layer screen recording" />}
          >
            Invite friends to a joint visit, blend everyone&rsquo;s interests into one path, and look
            back on your visit history.
          </MobileFeature>
        </Section>

        {/* VISUAL DESIGN: native (crisp) rebuild of the style guide, sketched in Figma node 220:753 */}
        <Section innerClassName="flex flex-col">
          <Eyebrow>VISUAL DESIGN</Eyebrow>
          <Heading className="mt-4">
            Our visual design decisions were chosen to feel like a museum, with a digital polish.
          </Heading>

          <div className="grid md:grid-cols-2 gap-14 md:gap-16 mt-12">
            {/* COLOR PALETTE */}
            <div className="flex flex-col gap-10 min-w-0">
              <GuideTitle>Color Palette</GuideTitle>
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 max-w-[480px]">
                {[
                  { hex: "#51582F", bg: MM.olive },
                  { hex: "#744A32", bg: MM.brown },
                  { hex: "#413D3B", bg: MM.charcoal },
                  { hex: "#F9F7F3", bg: MM.cream },
                  { hex: "#E7E1D9", bg: MM.tan },
                ].map((c) => (
                  <div key={c.hex} className="flex flex-col gap-2">
                    <div
                      className="h-[88px] md:h-[110px] w-full"
                      style={{
                        backgroundColor: c.bg,
                        border: c.hex === "#F9F7F3" ? `2px solid ${MM.tan}` : undefined,
                      }}
                    />
                    <span className="font-mono text-[14px] md:text-[16px]" style={{ color: MM.charcoal }}>
                      {c.hex}
                    </span>
                  </div>
                ))}
              </div>
              <GuideNote>
                Influenced by our ancient Greek inspiration, we chose a muted, earthy color palette to
                provide a warm and rustic feel to soothe the user.
              </GuideNote>
            </div>

            {/* TYPOGRAPHY + BUTTONS */}
            <div className="flex flex-col gap-10 min-w-0">
              <GuideTitle>Typography</GuideTitle>
              <div className="flex flex-col gap-3" style={{ color: MM.charcoal }}>
                <p className="font-mm-serif font-bold text-[24px] md:text-[30px] leading-tight">
                  H1 - Averia Serif Libre - Bold - 24px
                </p>
                <p className="font-mm-serif font-bold text-[20px] md:text-[25px] leading-tight">
                  H2 - Averia Serif Libre - Bold - 20px
                </p>
                <p className="font-mm-serif font-light text-[18px] md:text-[20px] leading-tight">
                  H3 - Averia Serif Libre - Light - 16px
                </p>
                <p className="font-mono text-[13px] md:text-[15px]">
                  Subheading - Iosevka Charon Mono - Regular - 12px
                </p>
                <p className="font-mono font-medium text-[13px] md:text-[15px] uppercase">
                  Button - Iosevka Charon Mono - Bold - 12px
                </p>
              </div>
              <GuideNote>
                We chose Averia Serif Libre for headings because serifs add a level of sophistication
                associated with museums.
              </GuideNote>

              <GuideTitle>Buttons</GuideTitle>
              <div className="flex flex-wrap items-start gap-8">
                <div className="flex flex-col items-center gap-3">
                  <GuideButton className="w-[220px] py-4 rounded-[14px]" bg={MM.olive}>
                    Primary
                  </GuideButton>
                  <GuideButton className="w-[190px] py-2.5 rounded-[14px]" bg={MM.olive}>
                    Secondary
                  </GuideButton>
                  <GuideButton className="w-[110px] py-2.5 rounded-full" bg={MM.olive}>
                    Detail
                  </GuideButton>
                </div>
                <div className="flex flex-col gap-3">
                  <GuideButton className="px-6 py-3 rounded-[16px]" bg={MM.tan} fg={MM.charcoal}>
                    Button
                  </GuideButton>
                  <GuideButton className="px-6 py-3 rounded-[16px]" bg={MM.brown}>
                    Button
                  </GuideButton>
                </div>
              </div>
              <GuideNote>
                Iosevka Charon Mono for subheadings and buttons ties in digital polish and simplicity
                to balance the serif out.
              </GuideNote>
            </div>
          </div>
        </Section>

        {/* USER TESTING */}
        <Section bg={MM.tan} innerClassName="flex flex-col gap-10">
          <Eyebrow>USER TESTING</Eyebrow>
          <Statement>
            I tested the prototype with 3 users, measuring task success, time, and preference.
          </Statement>
          <div className="grid md:grid-cols-2 gap-4 text-[16px] md:text-[18px] leading-relaxed tracking-wide">
            <div className="p-6 md:p-8 flex flex-col gap-3" style={{ backgroundColor: MM.cream }}>
              <Heading>WHAT USERS ASKED FOR</Heading>
              <ul className="list-disc pl-6 space-y-2">
                <li>More settings options</li>
                <li>Reviews for specific exhibits and artwork, not only whole museums</li>
                <li>A clearer map</li>
              </ul>
            </div>
            <div className="p-6 md:p-8 flex flex-col gap-3" style={{ backgroundColor: MM.cream }}>
              <Heading>DESIGN FEEDBACK</Heading>
              <ul className="list-disc pl-6 space-y-2">
                <li>Some colors were not accessible enough</li>
                <li>Too much on the navigation bar</li>
                <li>Inconsistent spacing</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* REFLECTION */}
        <Section bg={MM.olive} className="text-white">
          <Eyebrow>REFLECTION</Eyebrow>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mt-10">
            <div className="flex flex-col gap-3">
              <Heading>LOOKING BACK</Heading>
              <Body>
                Three weeks meant combining ideas and cutting features, so feasibility drove our
                choices. We aimed to serve serious exhibits and lighter-themed museums alike, and we
                backed every design decision with research. I learned that even one less click in a user flow can
                make the difference between an effective flow and one that causes fatigue.
              </Body>
            </div>
            <div className="flex flex-col gap-3">
              <Heading>LOOKING FORWARD</Heading>
              <Body>
                Next we would add audio narration and more languages for smaller museums, revisit
                sponsor-hosted events, and let reviews of individual exhibits and artwork shape the
                recommendations on the discover tab.
              </Body>
            </div>
          </div>

          <div className="text-center mt-16">
            <button
              type="button"
              onClick={() => scrollToId("mm-top")}
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
