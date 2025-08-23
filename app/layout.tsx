import "./globals.css";
import React from "react";
import { siteConfig as _siteConfigAlias } from "@/lib/siteConfig";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { ContentProvider } from "./contexts/ContentContext";
// Add types for stronger typing of metadata & viewport
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: _siteConfigAlias.website.meta.title,
  description: _siteConfigAlias.website.meta.description,
  keywords: [..._siteConfigAlias.website.meta.keywords],
  icons: { icon: _siteConfigAlias.website.meta.favicon },
  openGraph: {
    type: _siteConfigAlias.website.meta.openGraph.type,
    title: _siteConfigAlias.website.meta.openGraph.title,
    description: _siteConfigAlias.website.meta.openGraph.description,
    images: [_siteConfigAlias.website.meta.openGraph.image],
    url: _siteConfigAlias.website.meta.openGraph.url,
  },
  // Provide metadataBase so OG/Twitter images resolve to absolute URLs
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      _siteConfigAlias.website.meta.openGraph.url
  ),
  // Removed themeColor (moved to viewport export below)
};

export const viewport: Viewport = {
  themeColor: _siteConfigAlias.website.meta.themeColor,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { header, footer, meta } = _siteConfigAlias.website;

  return (
    <html
      lang="en"
      className="bg-background text-text"
      suppressHydrationWarning
    >
      <body className="min-h-screen font-body antialiased flex flex-col">
        <AuthProvider>
          <ContentProvider>
            <Header header={header} />
            <main className="flex-1 px-6 py-10 mx-auto w-full max-w-container">
              {children}
            </main>
            <Footer />
          </ContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
