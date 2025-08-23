import "./globals.css";
import React from "react";
import { siteConfig as _siteConfigAlias } from "@/lib/siteConfig";
import Link from "next/link";
import MobileNav from "./components/MobileNav";
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
        <header
          className={`top-0 z-40 w-full ${header.style.sticky ? "sticky bg-background/70 backdrop-blur-sm" : ""} border-b border-black/5`}
        >
          <div className="mx-auto flex items-center justify-between px-6 py-4 max-w-container">
            <Link
              href={header.brand.route}
              className="font-heading text-lg tracking-wide text-text"
            >
              {header.brand.text}
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm">
              {header.nav.map((item: any) => {
                if (item.children?.length) {
                  return (
                    <div key={item.title} className="relative group">
                      <Link
                        href={item.route}
                        className="hover:text-accent transition-colors inline-flex items-center gap-1"
                      >
                        {item.title}
                        <span className="mt-px text-[10px]">▾</span>
                      </Link>
                      <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute left-0 top-full pt-3">
                        <div className="rounded-lg shadow-soft ring-1 ring-black/5 bg-surface min-w-[220px] p-2 flex flex-col">
                          {item.children.map((c: any) => (
                            <Link
                              key={c.route}
                              href={c.route}
                              className="px-3 py-2 rounded-md hover:bg-background/60 hover:text-accent text-[13px]"
                            >
                              {c.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.title}
                    href={item.route}
                    className="hover:text-accent transition-colors"
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href={header.cta.route}
                className="rounded-full bg-black text-white px-6 py-2 text-sm font-medium hover:bg-accent hover:text-text transition-colors"
              >
                {header.cta.title}
              </Link>
            </div>

            {/* Mobile Navigation */}
            <MobileNav header={header} />
          </div>
        </header>
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
      </body>
    </html>
  );
}
