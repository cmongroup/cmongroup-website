"use client";

import { siteConfig as _siteConfig } from "@/lib/siteConfig";
import Link from "next/link";
import EditableWebsiteText from "@/app/components/EditableWebsiteText";
import { useContent } from "@/app/contexts/ContentContext";

export default function ServicesPage() {
  const { websiteContent } = useContent();

  // Find the services section (type: tabs) in the unified sections array
  const servicesSection: any = _siteConfig.website.sections.find(
    (s: any) => s.id === "services" && s.type === "tabs"
  );
  const tabs = servicesSection?.tabs || [];
  const heading = servicesSection?.title || "What we deliver";

  return (
    <section className="space-y-12">
      <header className="space-y-4 max-w-3xl">
        <h1 className="font-heading text-4xl tracking-tight text-text">
          <EditableWebsiteText path="services.hero.title">
            {heading}
          </EditableWebsiteText>
        </h1>
        <p className="text-muted leading-relaxed text-sm md:text-base">
          <EditableWebsiteText path="services.hero.subtitle">
            End-to-end capability across interior design, F&B brand systems, and
            MEP/build execution. Explore focus areas below.
          </EditableWebsiteText>
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-3">
        {tabs.map((tab: any) => (
          <div
            key={tab.label}
            className="rounded-2xl bg-surface shadow-xs ring-1 ring-black/5 p-6 flex flex-col"
          >
            <h2 className="font-heading text-xl mb-4 text-text">{tab.label}</h2>
            <ul className="space-y-2 text-sm flex-1">
              {tab.content?.bullets?.map((b: string) => (
                <li key={b} className="pl-4 relative">
                  <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
            {tab.content?.cta && (
              <div className="mt-6">
                <Link
                  href={tab.content.cta.route}
                  className="inline-block bg-black text-white text-xs font-medium tracking-wide px-5 py-2 hover:bg-accent hover:text-text transition-colors"
                >
                  {tab.content.cta.title}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
