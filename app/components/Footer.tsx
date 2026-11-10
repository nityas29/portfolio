"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import FloatingStar from "./FloatingStar";
import ScatterStar from "./ScatterStar";
import { BASE_PATH } from "../lib/basePath";
import FooterGame, { GROUND_STRIP } from "./FooterGame";

const FOOTER_STARS_MOBILE: { x: number; y: number; color: string }[] = [
  { x: 90, y: 8, color: "#ffb200" },
  { x: 82, y: 30, color: "#0098d4" },
  { x: 94, y: 44, color: "#eb369b" },
  { x: 84, y: 62, color: "#ff1e00" },
  { x: 93, y: 78, color: "#ffb200" },
  { x: 80, y: 92, color: "#0098d4" },
];

function BouncyStar({ src, size, className }: { src: string; size: number; className?: string }) {
  const controls = useAnimation();

  function bounce() {
    // mac-dock-style hop: quick rise (easeOut), gravity-like fall (easeIn)
    controls.start({
      y: [0, -34, 0],
      transition: { duration: 0.55, times: [0, 0.4, 1], ease: ["easeOut", "easeIn"] },
    });
  }

  return (
    <motion.button
      type="button"
      onClick={bounce}
      animate={controls}
      aria-label="Bounce"
      className={`opacity-90 ${className ?? ""}`}
    >
      <FloatingStar src={src} size={size} pushDistance={10} bobDistance={0} spinOnClick={false} />
    </motion.button>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  function goToSection(id: string) {
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
    <footer
      className="relative bg-white text-black pt-10 md:pt-[46px] px-6 md:px-10 overflow-hidden md:min-h-[337px] lg:h-[337px]"
      style={{ paddingBottom: GROUND_STRIP + 40 }}
    >
      {/* scattered confetti stars — exact positions from Figma node 75:967, as % of the
          1920x421 bottom-bar frame so they hold up at any viewport width */}
      <ScatterStar color="#ffb200" size={16} className="hidden md:block lg:hidden" style={{ left: "46.15%", top: "4.58%" }} />
      <ScatterStar color="#0098d4" size={16} className="hidden md:block lg:hidden" style={{ left: "70.42%", top: "11.71%" }} />
      <ScatterStar color="#ff1e00" size={16} className="hidden md:block lg:hidden" style={{ left: "84.90%", top: "17.89%" }} />
      <ScatterStar color="#eb369b" size={16} className="hidden md:block lg:hidden" style={{ left: "97.71%", top: "14.80%" }} />
      <ScatterStar color="#0098d4" size={16} className="hidden md:block lg:hidden" style={{ left: "56.88%", top: "43.30%" }} />
      <ScatterStar color="#ff1e00" size={16} className="hidden md:block lg:hidden" style={{ left: "29.32%", top: "67.05%" }} />
      <ScatterStar color="#eb369b" size={16} className="hidden md:block lg:hidden" style={{ left: "42.81%", top: "83.92%" }} />
      <ScatterStar color="#ffb200" size={16} className="hidden md:block lg:hidden" style={{ left: "66.98%", top: "83.21%" }} />
      <ScatterStar color="#0098d4" size={16} className="hidden md:block lg:hidden" style={{ left: "96.15%", top: "86.53%" }} />
      {/* on phones the Figma positions land on the heading and links, so a smaller set
          sits in the empty right-hand column instead */}
      {FOOTER_STARS_MOBILE.map((s, i) => (
        <ScatterStar
          key={`m${i}`}
          color={s.color}
          size={14}
          className="md:hidden"
          style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%, -50%)" }}
        />
      ))}

      {/* tablets keep the two bouncy character stars; from lg up the right half
          of the footer is the star jump game instead (FooterGame) */}
      <div className="hidden md:block lg:hidden absolute z-10 top-[33.49%] right-[calc(3.85%+150px)]">
        <BouncyStar src="/assets/star-guy-blue-footer-v2.png" size={177} />
      </div>
      <div className="hidden md:block lg:hidden absolute z-10 top-[29.69%] right-[3.85%]">
        <BouncyStar src="/assets/star-guy-pink-legs-v2.png" size={190} />
      </div>

      <FooterGame />

      <h2 className="relative z-10 font-mono font-medium text-[19px] mb-[32px]">THANKS FOR STOPPING BY!</h2>

      <div className="relative z-10 flex gap-14 md:gap-24">
        <div>
          <h3 className="font-mono font-medium text-[13px] mb-[13px]">SAY HELLO</h3>
          <ul className="font-mono text-base space-y-[13px]">
            <li>
              <a href="https://www.linkedin.com/in/nitya-shankar" target="_blank" rel="noopener noreferrer">
                LINKEDIN
              </a>
            </li>
            <li>
              <a href="mailto:nityashankar2009@gmail.com">EMAIL</a>
            </li>
            <li>
              <a href={`${BASE_PATH}/resume.pdf`} target="_blank" rel="noopener noreferrer">
                RESUME
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono font-medium text-[13px] mb-[13px]">NAVIGATE</h3>
          <ul className="font-mono text-base space-y-[13px]">
            <li>
              <button onClick={goToHero}>HOME</button>
            </li>
            <li>
              <button onClick={() => goToSection("experience")}>EXPERIENCE</button>
            </li>
            <li>
              <Link href="/about">ABOUT</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* pink ground strip: the game's floor, with the copyright in it */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-[#eb369b] flex items-center justify-between gap-4 px-6 md:px-10"
        style={{ height: GROUND_STRIP }}
      >
        <p className="font-mono font-light text-[12px] text-white shrink-0">© NITYA SHANKAR 2026</p>
        {/* short month on phones so it stays on one line */}
        <p className="font-mono font-light text-[12px] text-white text-right whitespace-nowrap">
          LAST UPDATED: <span className="hidden sm:inline">{process.env.NEXT_PUBLIC_LAST_UPDATED}</span>
          <span className="sm:hidden">{process.env.NEXT_PUBLIC_LAST_UPDATED_SHORT}</span>
        </p>
      </div>
    </footer>
  );
}
