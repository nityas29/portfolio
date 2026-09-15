import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Londrina_Solid, Balsamiq_Sans, Inter } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const londrinaSolid = Londrina_Solid({
  variable: "--font-londrina",
  subsets: ["latin"],
  weight: ["400"],
});

// used only within the Page Friends case study, to reflect that product's own
// (distinct) visual identity rather than the portfolio's own branding fonts
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const balsamiqSans = Balsamiq_Sans({
  variable: "--font-balsamiq",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// used only within the EcoStack case study, per that product's own visual design
// decisions (Inter / Inter Light) - distinct from the portfolio's own branding fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nitya Shankar",
  description: "Product + design portfolio of Nitya Shankar",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmMono.variable} ${londrinaSolid.variable} ${dmSans.variable} ${balsamiqSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#181e24]">{children}</body>
    </html>
  );
}
