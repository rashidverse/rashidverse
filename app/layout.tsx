import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./sidebar.css";

// GA measurement IDs are public by design. Keep a checked-in fallback so the
// tracking tag remains available even if a process manager does not expose
// `.env.local` at runtime.
const googleAnalyticsId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-VN820786WV";

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
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/rashidverse-site/css/contact-drawer.css" />
      </head>
      <body>
        {children}
        <Script src="/rashidverse-site/js/contact-drawer.js" strategy="afterInteractive" />
        {googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', ${JSON.stringify(googleAnalyticsId)});
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
