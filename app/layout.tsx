import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";
import "./sidebar.css";

const barlow = Barlow({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
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
      className={barlow.variable}
    >
      <body>{children}</body>
    </html>
  );
}
