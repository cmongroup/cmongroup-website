import "./globals.css";
import React from "react";
import { siteConfig as _siteConfigAlias } from "@/lib/siteConfig";
import Link from "next/link";
import Header from "./components/Header";
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
    <html lang="en" className="bg-background text-text" suppressHydrationWarning>
      <body className="min-h-screen font-body antialiased flex flex-col">
        <AuthProvider>
          <ContentProvider>
            <Header header={header} />
            <main className="flex-1 px-6 py-10 mx-auto w-full max-w-container">
              {children}
            </main>
            <footer className="mt-16 border-t border-black/5 text-sm text-muted/90">
          <div className="mx-auto max-w-container px-6 py-12 grid gap-10 md:grid-cols-3">
            {_siteConfigAlias.website.footer.columns?.map((col: any) => (
              <div key={col.title} className="space-y-4">
                <h3 className="font-heading text-base text-text">
                  {col.title}
                </h3>
                <ul className="space-y-2 text-xs">
                  {col.items.map((it: any, i: number) => (
                    <li key={i}>
                      {it.type === "link" ? (
                        <Link
                          href={it.route}
                          className="hover:text-accent transition-colors"
                        >
                          {it.label}
                        </Link>
                      ) : (
                        <span className="opacity-80">{it.value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-black/5">
            <div className="mx-auto max-w-container px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-xs">{footer.bottom.legal}</p>
              <div className="flex gap-6 text-xs flex-wrap items-center">
                {footer.bottom.links.map(
                  (l: { label: string; route: string }) => (
                    <Link
                      key={l.route}
                      href={l.route}
                      className="hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  )
                )}
                <span className="opacity-60">{meta.author}</span>
              </div>
            </div>
          </div>
        </footer>
          </ContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
