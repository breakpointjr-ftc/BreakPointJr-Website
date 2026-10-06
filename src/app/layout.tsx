import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import ConsoleGreeting from "@/components/ConsoleGreeting";
import IntroSplash from "@/components/IntroSplash";
import SmoothScroll from "@/components/SmoothScroll";
import GlassField from "@/components/GlassField";
import ClickFx from "@/components/ClickFx";
import LangInit from "@/components/LangInit";

const bigShoulders = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  adjustFontFallback: false,
  fallback: ["system-ui", "sans-serif"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "BreakPoint Jr. | FTC Robotik Takımı",
  description:
    "BreakPoint Jr. — FIRST Tech Challenge robotik takımı. Hakkımızda, sponsorluk fırsatları ve iletişim bilgileri.",
  openGraph: {
    title: "BreakPoint Jr. | FTC Robotik Takımı",
    description:
      "Türkiye merkezli, yeni kurulan FIRST Tech Challenge robotik takımı.",
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${bigShoulders.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        className="bg-grain min-h-full flex flex-col bg-[#07070a] text-[#f4f4f1]"
        suppressHydrationWarning
      >
        <LangInit />
        <IntroSplash />
        <ClickFx />
        <GlassField />
        <ScrollProgress />
        <ConsoleGreeting />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
