import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat-widget";
import { ExpoStrip } from "@/components/expo-banner";
import { getExpo } from "@/lib/cms";
import { CHAT_GREETING } from "@/lib/chat-greeting";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Aerial Work Platforms, Boom & Scissor Lifts`,
    template: `%s | ${site.name}`,
  },
  description:
    "Dingli aerial work platforms for India and SAARC - boom lifts, scissor lifts, vertical masts and spider lifts, with nationwide service and genuine parts.",
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const expo = await getExpo();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {expo && <ExpoStrip expo={expo} />}
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {process.env.ANTHROPIC_API_KEY && <ChatWidget greeting={CHAT_GREETING} />}
      </body>
    </html>
  );
}
