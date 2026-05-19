import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SchemaOrg } from "@/components/seo/SchemaOrg";
import { getSeoSettings } from "@/lib/data/seo";
import { createLocalPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  return {
    ...createLocalPageMetadata({
      title: seo.seo_title,
      description: seo.seo_description,
    }),
    title: {
      default: seo.seo_title,
      template: `%s | ${siteConfig.shortName}`,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SchemaOrg />
        {children}
      </body>
    </html>
  );
}
