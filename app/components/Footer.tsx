"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import FloatingStar from "./FloatingStar";
import ScatterStar from "./ScatterStar";

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
      <FloatingStar src={src} size={size} pushDistance={10} bobDistance={0} />
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
    <footer className="relative bg-white text-black py-[51px] px-10 overflow-hidden min-h-[337px]">
      {/* scattered confetti stars — exact positions from Figma node 75:967, as % of the
          1920x421 bottom-bar frame so they hold up at any viewport width */}
      <ScatterStar color="#ffb200" size={16} style={{ left: "46.15%", top: "4.58%" }} />
      <ScatterStar color="#0098d4" size={16} style={{ left: "70.42%", top: "11.71%" }} />
      <ScatterStar color="#ff1e00" size={16} style={{ left: "84.90%", top: "17.89%" }} />
      <ScatterStar color="#eb369b" size={16} style={{ left: "97.71%", top: "14.80%" }} />
      <ScatterStar color="#ffb200" size={16} style={{ left: "34.06%", top: "29.05%" }} />
      <ScatterStar color="#0098d4" size={16} style={{ left: "56.88%", top: "43.30%" }} />
      <ScatterStar color="#ff1e00" size={16} style={{ left: "29.32%", top: "67.05%" }} />
      <ScatterStar color="#eb369b" size={16} style={{ left: "42.81%", top: "83.92%" }} />
      <ScatterStar color="#ffb200" size={16} style={{ left: "66.98%", top: "83.21%" }} />
      <ScatterStar color="#0098d4" size={16} style={{ left: "96.15%", top: "86.53%" }} />

      {/* two character stars, exact position/size from Figma (1920x421 frame):
          blue "looking" star at x:1417,y:141,211x217; pink winking star at x:1619,y:125,227x233 */}
      <div className="absolute z-10" style={{ left: "73.80%", top: "33.49%" }}>
        <BouncyStar src="/assets/star-guy-blue-footer-v2.png" size={177} />
      </div>
      <div className="absolute z-10" style={{ left: "84.32%", top: "29.69%" }}>
        <BouncyStar src="/assets/star-guy-pink-legs-v2.png" size={190} />
      </div>

      <h2 className="relative z-10 font-mono font-medium text-[19px] mb-[32px]">THANKS FOR STOPPING BY!</h2>

      <div className="relative z-10 flex gap-24">
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
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
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

      <p className="relative z-10 font-mono font-light text-[11px] mt-[51px]">© NITYA SHANKAR 2026</p>
    </footer>
  );
}
