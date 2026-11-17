"use client";

import Image from "next/image";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import ExpandableImage from "../../components/case-study/ExpandableImage";
import FeatureRow from "../../components/case-study/FeatureRow";
import Section from "../../components/case-study/Section";
import { Body, Caption, Eyebrow, Heading, Statement } from "../../components/case-study/Type";
import { BASE_PATH } from "../../lib/basePath";

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

// This case study's single emphasis style: a colored highlight chip.
function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="px-1 text-white" style={{ backgroundColor: color }}>
      {children}
    </span>
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

function DemoVideo({ src }: { src: string }) {
  return (
    <video
      src={`${BASE_PATH}${src}`}
      autoPlay
      muted
      loop
      playsInline
      className="min-w-0 md:flex-[3] rounded-[27px] w-full max-w-[680px] h-auto"
    />
  );
}

export default function PageFriendsCaseStudy() {
  return (
    <div className="flex flex-col min-h-full">
      <Nav />

      <div id="pf-top" className="bg-white text-black font-pf-sans">
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

          <div className="px-5 md:px-16 py-16 md:py-24">
            <div className="max-w-6xl mx-auto">
              <Statement>
                A reading app that turns literacy practice into a collectible adventure for
                elementary school children.
              </Statement>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mt-14 md:mt-20">
                <div className="flex flex-col gap-2">
                  <Caption>ROLE</Caption>
                  <Body>UX Researcher &amp; Designer</Body>
                </div>
                <div className="flex flex-col gap-2">
                  <Caption>TEAM</Caption>
                  <Body>
                    Nitya Shankar
                    <br />
                    Mia Sohn
                    <br />
                    Dymond Mon
                  </Body>
                </div>
                <div className="flex flex-col gap-2">
                  <Caption>TIMELINE</Caption>
                  <Body>
                    9 weeks
                    <br />
                    INFO 360 SP26
                    <br />
                    THEME: AI + INFORMATICS
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
        <Section bg={PF.sunset} className="text-white" innerClassName="flex flex-col">
          <Eyebrow>OVERVIEW</Eyebrow>
          <Statement className="mt-4">
            For INFO 360 (theme: AI + Informatics), our team set out to help elementary
            students who have fallen behind in reading since the pandemic.
          </Statement>
          <Body className="mt-8">
            Page Friends is a friendly, interactive, and engaging application that focuses on
            creating a personalized digital environment where kids can feel excitement to read,
            expand their vocabulary, and improve their speaking skills.
          </Body>
          <button
            type="button"
            onClick={() => scrollToId("pf-solution")}
            className="self-start font-mono text-[16px] tracking-wide inline-flex items-center gap-2 mt-12 hover:opacity-80"
          >
            JUMP TO FINAL DESIGN <span aria-hidden>↓</span>
          </button>
        </Section>

        {/* PROBLEM - the HMW callout is this screen's focal point */}
        <Section innerClassName="flex flex-col">
          <Eyebrow>PROBLEM</Eyebrow>
          <Heading className="mt-4">
            Children&rsquo;s literacy rates have declined significantly since the pandemic.
          </Heading>
          <Body className="mt-3 text-black/80">
            This can lead to long-term struggles in adulthood, including reduced access to
            opportunities and difficulty understanding critical information.
          </Body>
          <div className="p-8 md:p-14 mt-12" style={{ backgroundColor: PF.sunset }}>
            <Statement wide className="text-white">
              How might elementary students actively increase interest in literature outside of
              school so that they can improve their reading ability, have a strong foundation in
              literacy, and be better prepared for the rest of their academic career?
            </Statement>
          </div>
        </Section>

        {/* RESEARCH - two screens: (a) methods + findings, (b) market research + takeaway */}
        <Section innerClassName="flex flex-col gap-24 md:gap-28">
          <div className="flex flex-col">
            <Eyebrow>RESEARCH</Eyebrow>
            <Statement className="mt-4">
              We conducted <Chip color={PF.electricRose}>interviews</Chip> with an elementary
              student and teacher, and performed a{" "}
              <Chip color={PF.skyBlue}>literature review.</Chip>
            </Statement>

            <Eyebrow className="mt-12 text-black/60">FINDINGS</Eyebrow>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-6 md:p-8" style={{ backgroundColor: PF.blush }}>
                <ul className="list-disc pl-6 text-[16px] md:text-[18px] leading-relaxed tracking-wide space-y-4">
                  <li>
                    Kids liked the novelty of tech, but still preferred the feel of a real book and
                    got screen fatigue fast
                  </li>
                  <li>
                    Teachers were open to personalized tools but cautious about attention spans and
                    screen time
                  </li>
                </ul>
              </div>
              <div className="p-6 md:p-8" style={{ backgroundColor: PF.researchAqua }}>
                <ul className="list-disc pl-6 text-[16px] md:text-[18px] leading-relaxed tracking-wide space-y-4">
                  <li>
                    Kids read more when they get real choice, curiosity, and challenge{" "}
                    <span className="text-black/50">(Ciampa, 2016)</span>
                  </li>
                  <li>
                    Kids build confidence faster when they have someone to talk to about what
                    they&rsquo;re reading <span className="text-black/50">(Nolen, 2009)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <Body>
              Our market research found that existing reading apps such as Reading Eggs, Duolingo
              ABC, and Teach Your Monster to Read, organize their content by age range and rely on
              repetitive phonics games.
            </Body>
            <div className="mx-auto mt-10">
              <ExpandableImage
                src="/assets/pf-competitive-analysis.png"
                alt="Competitive analysis of Reading Eggs, Duolingo ABC, and Teach Your Monster to Read"
                width={837}
                height={627}
                className="object-contain"
              />
            </div>
            <Statement className="mt-12">
              Based on these findings, we identified{" "}
              <Chip color={PF.sunset}>personalization</Chip> as the clearest opportunity for our
              design.
            </Statement>
          </div>
        </Section>

        {/* IDEATION */}
        <Section innerClassName="flex flex-col">
          <Eyebrow>IDEATION</Eyebrow>
          <Statement className="mt-4">
            We created a feature matrix and paper prototype to better understand how Page Friends
            can stay both engaging and educational.
          </Statement>

          <div className="grid md:grid-cols-2 gap-10 items-start mt-12">
            <div className="flex flex-col items-center text-center gap-3">
              <ExpandableImage
                src="/assets/pf-feature-matrix.png"
                alt="Feature ideas and prioritization matrix"
                width={624}
                height={504}
                className="h-[360px] w-auto object-contain"
              />
              <Caption>Feature matrix</Caption>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <ExpandableImage
                src="/assets/pf-paper-prototype.jpg"
                alt="Low-fidelity paper prototype pages laid out on a table"
                width={624}
                height={802}
                className="h-[360px] w-auto object-contain"
              />
              <Caption>Low-fidelity paper prototype</Caption>
            </div>
          </div>
        </Section>

        {/* SOLUTION */}
        <Section
          id="pf-solution"
          bg={PF.sunset}
          size="band"
          className="text-white"
          innerClassName="flex items-end justify-between gap-6 flex-wrap"
        >
          <div className="flex flex-col gap-3">
            <Eyebrow>SOLUTION</Eyebrow>
            <Statement>Meet Page Friends</Statement>
          </div>
          <a
            href="https://www.figma.com/proto/ZYZfvO1RgOb7DVtGhY7PLr/Page-Friends-Hi-Fi--Copy-?node-id=45-14&p=f&t=9tRwfDsVbn39MyUW-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=45%3A14&show-proto-sidebar=1"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[16px] tracking-wide border border-white rounded-[5px] px-4 py-2 hover:opacity-80"
          >
            VIEW PROTOTYPE
          </a>
        </Section>

        {/* FEATURE WALKTHROUGH - roughly one feature per screen */}
        <Section innerClassName="flex flex-col gap-24 md:gap-36">
          <FeatureRow
            title="INDIVIDUALIZATION"
            media={<DemoVideo src="/assets/pf-individualization-demo.mp4" />}
          >
            The user onboards with a reading diagnostic test to personalize their support to their
            reading level rather than age.
          </FeatureRow>

          <FeatureRow
            reverse
            title="GAMIFICATION"
            media={<DemoVideo src="/assets/pf-gamification-demo.mp4" />}
          >
            The user unlocks a character from each book they complete for their own personal town.
            This transforms reading from a stationary task into what we describe as a collectible
            adventure.
          </FeatureRow>

          <Eyebrow className="text-center text-black/60">
            The main dashboard consists of four widgets:
          </Eyebrow>

          <FeatureRow title="LIBRARY" media={<DemoVideo src="/assets/pf-library-demo.mp4" />}>
            Where the user can browse personalized recommendations, track books, and filter based
            on genre and theme.
          </FeatureRow>

          <FeatureRow
            reverse
            title="VISIT TOWN"
            media={<DemoVideo src="/assets/pf-visit-town-demo.mp4" />}
          >
            Where the user interacts with unlocked characters and play literacy games tied to their
            reading level.
          </FeatureRow>

          <FeatureRow
            title="ACHIEVEMENTS"
            media={<DemoVideo src="/assets/pf-achievements-demo.mp4" />}
          >
            Where the user collects trophies and printable certificates.
          </FeatureRow>

          <FeatureRow
            reverse
            title="PAGE FRIEND"
            media={
              <div className="relative min-w-0 md:flex-[3] w-full max-w-[680px]">
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
            }
          >
            A customizable AI companion that provides real-time reading feedback, read-aloud
            support, and personalized book recommendations.
          </FeatureRow>
        </Section>

        {/* VISUAL DESIGN */}
        <Section innerClassName="flex flex-col">
          <Statement>Our visual design decisions were also informed by our target audience.</Statement>

          <div className="grid gap-10 md:gap-14 md:grid-cols-[280px_1fr] mt-12">
            <ExpandableImage
              src="/assets/pf-color-palette.png"
              alt="Page Friends color palette: Sky Blue, Aqua, Lime, Electric Rose, Blush, and Sunset"
              width={358}
              height={537}
              className="h-auto w-full shadow-md"
            />
            <div className="flex flex-col justify-between gap-12">
              <Body>
                Because children respond more to bright colors and cartoonish characters, we used a
                bright and colorful palette throughout the application.
              </Body>
              <div className="flex flex-col gap-3">
                <Body>
                  We chose &ldquo;Balsamiq Sans&rdquo; as our typeface for its playful,
                  child-friendly appearance
                </Body>
                {/* type specimen - intentionally in the product's display font */}
                <p className="font-pf-display text-[32px]">Balsamiq Sans</p>
              </div>
              <Body>
                We maintained a consistent illustrated landscape background with clouds across the
                interface to reinforce a cohesive, child-friendly world.
              </Body>
            </div>
          </div>
        </Section>

        {/* DECISIONS AND TRADE-OFFS */}
        <Section bg={PF.aqua} innerClassName="flex flex-col">
          <Eyebrow>DECISIONS AND TRADE-OFFS</Eyebrow>
          <Statement className="mt-4">
            Our team made two decisions that reflect how we prioritized our limited time and scope.
          </Statement>

          <div className="grid md:grid-cols-2 gap-4 mt-12">
            <div className="p-6 md:p-8 flex flex-col gap-3" style={{ backgroundColor: PF.lime }}>
              <Heading>PRIORITIZING PRIMARY FLOW</Heading>
              <Body>
                Although we designed a teacher and classroom view, we decided to focus our
                high-fidelity prototyping efforts on the primary student experience, since
                elementary students are our primary user group.
              </Body>
            </div>
            <div className="p-6 md:p-8 flex flex-col gap-3" style={{ backgroundColor: PF.blush }}>
              <Heading>STAYING IN SCOPE</Heading>
              <Body>
                We scrapped the standalone &ldquo;Games&rdquo; widget entirely that existed in our
                low-fi wireframes. Untethered games didn&rsquo;t serve the actual problem we were
                solving, so we folded game mechanics into Visit Town instead.
              </Body>
            </div>
          </div>
        </Section>

        {/* ITERATION */}
        <Section innerClassName="flex flex-col">
          <Eyebrow>ITERATION</Eyebrow>
          <Statement className="mt-4">
            We evaluated our design using both a{" "}
            <Chip color={PF.skyBlue}>heuristic evaluation</Chip> and two rounds of{" "}
            <Chip color={PF.electricRose}>usability testing</Chip> on our low-fidelity paper
            prototype.
          </Statement>
        </Section>

        {/* HEURISTIC EVALUATION */}
        <Section bg={PF.researchAqua} innerClassName="flex flex-col gap-10">
          <Heading style={{ color: PF.skyBlue }}>HEURISTIC EVALUATION</Heading>
          <div className="flex items-center justify-center gap-6">
            <Caption className="hidden md:block uppercase shrink-0">Violations</Caption>
            <div className="flex flex-1 min-w-0 flex-col gap-6 max-w-3xl text-[16px] md:text-[18px] tracking-wide">
              {/* on phones the side labels don't fit beside the rows, so they head the list instead */}
              <div className="md:hidden flex justify-between">
                <Caption className="uppercase">Violations</Caption>
                <Caption className="uppercase">Solutions</Caption>
              </div>
              <div className="flex items-center gap-3">
                <span>Help with errors</span>
                <Arrow />
                <span className="text-right">Add clear error messaging</span>
              </div>
              <div className="flex items-center gap-3">
                <span>User control and freedom</span>
                <Arrow />
                <span className="text-right flex items-center gap-2 justify-end">
                  Add{" "}
                  {/* UI specimen - the product's own Back button */}
                  <span
                    className="font-pf-display text-white text-[16px] px-3 py-2 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] shrink-0"
                    style={{ backgroundColor: PF.skyBlue }}
                  >
                    Back
                  </span>{" "}
                  navigation to every screen
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>Needs a tutorial</span>
                <Arrow />
                <span className="text-right">Add tutorial in final development</span>
              </div>
            </div>
            <Caption className="hidden md:block uppercase shrink-0">Solutions</Caption>
          </div>
        </Section>

        {/* USABILITY TESTING */}
        <Section bg={PF.blush} innerClassName="flex flex-col gap-10">
          <Heading style={{ color: PF.electricRose }}>USABILITY TESTING: WIZARD OF OZ</Heading>

          <div className="grid md:grid-cols-3 gap-6 text-[16px] md:text-[18px] leading-relaxed tracking-wide">
            <div className="flex flex-col gap-3">
              <Caption style={{ color: PF.electricRose }} muted={false}>
                TASKS
              </Caption>
              <div className="bg-white p-4">FIND A BOOK TO READ</div>
              <div className="bg-white p-4">ADD A BOOK TO READING LIST</div>
              <div className="bg-white p-4">COLLECT AND MEET A CHARACTER IN TOWN</div>
            </div>
            <div className="flex flex-col gap-3">
              <Caption style={{ color: PF.electricRose }} muted={false}>
                SESSION 1 FINDINGS
              </Caption>
              <ul className="bg-white p-5 list-disc pl-9 space-y-3 flex-1">
                <li>Flow is largely intuitive</li>
                <li>
                  Participants wanted features we had not yet considered, such as filtering and a
                  user profile
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Caption style={{ color: PF.electricRose }} muted={false}>
                SESSION 2 FINDINGS
              </Caption>
              <ul className="bg-white p-5 list-disc pl-9 space-y-3 flex-1">
                <li>Original six-widget dashboard feels overwhelming</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* LO-FI -> HI-FI DASHBOARD */}
        <Section innerClassName="flex flex-col md:flex-row items-center gap-10 justify-center">
          <div className="flex flex-col items-center text-center gap-3">
            <ExpandableImage
              src="/assets/pf-lofi-dashboard.png"
              alt="Low-fidelity prototype of the six-widget dashboard"
              width={416}
              height={293}
              className="w-full max-w-[420px] h-auto object-contain"
            />
            <Caption>Low-fi prototype of 6 widget dashboard</Caption>
          </div>
          <span className="text-[24px] hidden md:block" aria-hidden>
            &rarr;
          </span>
          <div className="flex flex-col items-center text-center gap-3">
            <ExpandableImage
              src="/assets/pf-hifi-dashboard.png"
              alt="High-fidelity simplified four-widget dashboard"
              width={441}
              height={294}
              className="w-full max-w-[420px] h-auto object-contain"
            />
            <Caption>Hi-fi simplified 4-widget dashboard</Caption>
          </div>
        </Section>

        {/* REFLECTION */}
        <Section bg={PF.sunset} className="text-white">
          <Eyebrow>REFLECTION</Eyebrow>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mt-10">
            <div className="flex flex-col gap-3">
              <Heading>LOOKING BACK</Heading>
              <Body>
                Because we did not have access to our primary user group during this project, we
                relied on empathy mapping, literature research, and testing with peers rather than
                with actual elementary school students, which limits how confidently we can speak
                to the real child experience.
              </Body>
            </div>
            <div className="flex flex-col gap-3">
              <Heading>LOOKING FORWARD</Heading>
              <Body>
                To further develop Page Friends, we would plan to complete the teacher dashboard,
                add a wider variety of literacy games to reduce repetition, and implement a
                navigation bar to help users orient themselves within the app.
              </Body>
            </div>
          </div>

          <div className="text-center mt-16">
            <button
              type="button"
              onClick={() => scrollToId("pf-top")}
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
