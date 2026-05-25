import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Oswald, Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./sidebar.css";

const barlow = Barlow({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rashidverse | Creative Portfolio",
  description:
    "Creative portfolio for WordPress design, video editing, motion graphics, and graphic design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} ${oswald.variable} ${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
