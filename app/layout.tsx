import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ChromeWrapper } from "@/components/layout/chrome-wrapper";
import { SmoothScroll } from "@/components/smooth-scroll";
import { DemoBar } from "@/components/demo-bar";
import { Toaster } from "@/components/toaster";
import { getSession } from "@/lib/session";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Волга — соцсеть мастеров и магазинов ручной работы",
  description:
    "Маркетплейс изделий ручной работы и товаров российских мастеров. Находите мастеров, общайтесь с авторами и поддерживайте локальных производителей покупками.",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  const session = await getSession();
  return (
    <html lang="ru" className={`${manrope.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas text-graphite">
        <SmoothScroll />
        <DemoBar />
        <ChromeWrapper
          sidebar={<AppSidebar session={session} />}
          header={<SiteHeader session={session} />}
        >
          {children}
        </ChromeWrapper>
        {modal}
        <Toaster />
      </body>
    </html>
  );
}
