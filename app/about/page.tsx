import Image from "next/image";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PlaygroundRow from "../components/PlaygroundRow";
import AboutHeroStars from "../components/AboutHeroStars";
import ScatterStar from "../components/ScatterStar";

// percentage positions matching the star scatter behind Figma node 151:3395
const WHY_PRODUCT_STARS: { x: number; y: number }[] = [
  { x: 22, y: 4 },
  { x: 51, y: 6 },
  { x: 78, y: 10 },
  { x: 99, y: 2 },
  { x: 2, y: 17 },
  { x: 42, y: 19 },
  { x: 1, y: 60 },
  { x: 92, y: 47 },
  { x: 97, y: 87 },
  { x: 66, y: 89 },
  { x: 31, y: 98 },
];

export default function About() {
  return (
    <div className="flex flex-col min-h-full">
      <Nav />

      {/* HERO */}
      <section className="relative px-24 pt-20 pb-24">
        <div className="flex gap-16 items-start">
          <div className="max-w-2xl pt-2">
            <h1 className="font-display text-white text-[64px] leading-none mb-8">MEET NITYA!</h1>

            <div className="font-mono text-white text-[22px] leading-[1.4] flex flex-col gap-6">
              <p>
                I&rsquo;m a second-year{" "}
                <span className="px-1" style={{ backgroundColor: "#eb369b" }}>
                  Informatics
                </span>{" "}
                student at the University of Washington with a focus in Human-Computer Interaction
                and biomedical informatics.
              </p>
              <p>
                Driven by{" "}
                <span className="px-1" style={{ backgroundColor: "#0098d4" }}>
                  intuitive
                </span>{" "}
                and{" "}
                <span className="px-1" style={{ backgroundColor: "#d69500" }}>
                  user-centered design
                </span>
                , I aim to create digital spaces that welcome and serve all users, especially
                communities that tend to be overlooked in the design process.
              </p>
              <p>Detail-oriented, a fast learner, and a systems thinker.</p>
              <p>
                In my free time, find me learning new crafts, experimenting in the kitchen, and
                rewatching Modern Family or Brooklyn Nine-Nine.
              </p>
            </div>
          </div>

          <div className="relative shrink-0 mt-4">
            <Image
              src="/assets/about-photo-v2.png"
              alt="Nitya sitting in a garden"
              width={420}
              height={559}
              className="rounded-[8px] object-cover"
            />
            <AboutHeroStars />
          </div>
        </div>
      </section>

      {/* PLAYGROUND */}
      <section className="bg-white text-black py-10">
        <h2 className="font-display text-center text-[56px] mb-2">PLAYGROUND</h2>
        <p className="font-mono text-center text-2xl mb-8">FRAGMENTS OF MY CREATIVE JOURNEY</p>

        <PlaygroundRow>
          <Image src="/assets/playground-jellyfish.png" alt="Painted jellyfish" width={169} height={240} className="shrink-0 object-contain" />
          <Image src="/assets/playground-bird.png" alt="Colored pencil pigeon sketch" width={199} height={240} className="shrink-0 object-contain" />
          <Image src="/assets/playground-moon.png" alt={`"Nitya's favs" moon and stars collage`} width={240} height={240} className="shrink-0 object-contain" />
          <Image src="/assets/playground-crab.png" alt="Crab and stars drawing" width={328} height={240} className="shrink-0 object-contain" />
          <Image src="/assets/playground-houses.png" alt="Painted fruit-house tower" width={164} height={240} className="shrink-0 object-contain" />
          <Image src="/assets/playground-issaquah.png" alt="Issaquah DECA poster design" width={241} height={240} className="shrink-0 object-contain" />
          <div className="shrink-0 flex flex-col items-center justify-center gap-4">
            <Image src="/assets/playground-puzzle-bird.png" alt="Painted puzzle piece with bird" width={138} height={120} className="object-contain" />
            <Image src="/assets/playground-puzzle-bear.png" alt="Painted puzzle piece with bear" width={110} height={120} className="object-contain" />
          </div>
          <Image src="/assets/playground-ripple.png" alt="Ripple app onboarding mockups" width={412} height={240} className="shrink-0 object-contain" />
          <Image src="/assets/playground-fish.png" alt="Two painted fish" width={266} height={240} className="shrink-0 object-contain" />
        </PlaygroundRow>
      </section>

      {/* WHY PRODUCT */}
      <section className="relative px-24 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {WHY_PRODUCT_STARS.map((s, i) => (
            <ScatterStar
              key={i}
              color="white"
              size={20}
              style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%, -50%)" }}
            />
          ))}
        </div>

        <h2 className="relative font-display text-white text-[64px] leading-none mb-10">WHY PRODUCT?</h2>

        {/* two independent columns (not a shared grid) so a taller paragraph on one side
            doesn't push the other column's spacing down - matches Figma, where each
            column's paragraphs are positioned independently of the other's */}
        <div className="relative flex gap-20 max-w-6xl">
          <div className="flex flex-col gap-12 flex-1">
            <p className="font-mono text-white text-lg leading-relaxed">
              I am a strong believer that{" "}
              <span className="px-1" style={{ backgroundColor: "#eb369b" }}>
                good technology should adapt to people
              </span>
              , not the other way around — especially the people most products overlook.
            </p>
            <p className="font-mono text-white text-lg leading-relaxed">
              I learned the importance of user-centered design through watching my grandmother
              struggle with medical information systems and from doing HCI research with children,
              noticing the{" "}
              <span className="px-1" style={{ backgroundColor: "#d69500" }}>
                unique needs
              </span>{" "}
              of different generations.
            </p>
          </div>

          <div className="flex flex-col gap-12 flex-1">
            <p className="font-mono text-white text-lg leading-relaxed">
              Through these experiences, I became drawn to the idea of building things that
              effectively serve those who they are made for, through asking the right{" "}
              <span className="px-1" style={{ backgroundColor: "#0098d4" }}>
                questions
              </span>{" "}
              and making{" "}
              <span className="px-1" style={{ backgroundColor: "#eb369b" }}>
                intentional design choices.
              </span>
            </p>
            <p className="font-mono font-medium text-white text-lg leading-relaxed">
              That idea is what pulled me toward product: the part of the process that decides{" "}
              <span className="px-1" style={{ backgroundColor: "#ff1e00" }}>
                who a solution serves and how.
              </span>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
