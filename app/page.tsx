"use client";
import { mergeContent, toArray } from "@/lib/contentUtils";
import { siteConfig } from "@/lib/siteConfig";
import Link from "next/link";
import { useMemo } from "react";
import EditableWebsiteText from "@/app/components/EditableWebsiteText";
import EditableWebsiteImage from "@/app/components/EditableWebsiteImage";
import CompaniesCarousel from "@/app/components/CompaniesCarousel";
import { useContent } from "@/app/contexts/ContentContext";

// Button + action typing
export type ButtonVariant = "primary" | "ghost" | "accent" | "black";
export interface Action {
  title: string;
  route: string;
  variant: ButtonVariant;
}

const buttonBase =
  "inline-flex items-center justify-center text-xs font-medium tracking-wide transition-colors rounded-full px-6 py-2.5 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-accent";
const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-black text-white hover:bg-accent hover:text-text",
  ghost: "border border-text/60 text-text hover:bg-text hover:text-white",
  accent: "bg-accent text-text hover:bg-black hover:text-white",
  black: "bg-black text-white hover:bg-accent hover:text-text",
};
function Button({ action }: { action: Action }) {
  return (
    <Link
      href={action.route}
      className={`${buttonBase} ${buttonVariants[action.variant]}`}
    >
      {action.title}
    </Link>
  );
}

interface ServicesTabsSectionTab {
  label: string;
  content: { bullets: readonly string[]; cta: Action };
}
interface ServicesTabsSection {
  id: string;
  type: "tabs";
  title: string;
  tabs: readonly ServicesTabsSectionTab[];
}
interface CtaBandSection {
  id: string;
  type: "cta";
  theme: string;
  heading: string;
  text: string;
  actions: readonly Action[];
}

type AnySection =
  | ServicesTabsSection
  | CtaBandSection
  | { type: string; id: string };

interface MetricsCard {
  id: string;
  value: string;
  label: string;
  description: string;
}

interface MetricsSection {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cards: readonly MetricsCard[];
}

export default function HomePage() {
  const { hero, sections, metrics } = siteConfig.website;
  const { websiteContent, isLoading } = useContent();

  // Use dynamic content from Firebase if available, fallback to static config
  const dynamicHero = useMemo(
    () => mergeContent(hero, websiteContent?.home?.hero),
    [hero, websiteContent?.home?.hero]
  );

  const dynamicMetrics = useMemo(
    () => mergeContent(metrics, websiteContent?.home?.metrics),
    [metrics, websiteContent?.home?.metrics]
  ) as MetricsSection;

  const dynamicSections = useMemo(
    () => mergeContent(sections, websiteContent?.home?.sections),
    [sections, websiteContent?.home?.sections]
  );

  const normalizedMetrics = useMemo<MetricsSection>(() => {
    const cards = toArray<MetricsCard>(dynamicMetrics?.cards);
    return {
      ...dynamicMetrics,
      cards,
    };
  }, [dynamicMetrics]);

  // Index sections once (performance + clarity)
  const { servicesTabs, ctaBand } = useMemo(() => {
    const out: {
      servicesTabs?: ServicesTabsSection;
      ctaBand?: CtaBandSection;
    } = {};

    const sectionsArray = toArray<AnySection>(dynamicSections);

    for (const section of sectionsArray) {
      if (section.type === "tabs") {
        const typedSection = section as ServicesTabsSection & {
          tabs?: unknown;
        };
        const normalizedTabs = toArray<ServicesTabsSectionTab>(
          typedSection.tabs
        ).map((tab) => {
          if (!tab?.content) {
            return undefined;
          }
          const contentBullets = toArray<string>(tab.content.bullets);
          return {
            ...tab,
            content: {
              ...tab.content,
              bullets: contentBullets,
            },
          };
        });
        out.servicesTabs = {
          ...typedSection,
          tabs: normalizedTabs.filter(Boolean) as ServicesTabsSectionTab[],
        } as ServicesTabsSection;
      } else if (section.type === "cta" && section.id === "cta-band") {
        const typedSection = section as CtaBandSection & { actions?: unknown };
        out.ctaBand = {
          ...typedSection,
          actions: toArray<Action>(typedSection.actions),
        } as CtaBandSection;
      }
    }
    return out;
  }, [dynamicSections]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-16" role="main">
      {/* Hero */}
      <section
        id={dynamicHero.id}
        className="grid gap-6 md:gap-10 md:grid-cols-2 items-start text-center md:text-left max-w-7xl mx-auto px-8"
      >
        <div className="space-y-6">
          {dynamicHero.left?.eyebrow && (
            <div
              className="text-[24px] uppercase tracking-[0.25em] font-semibold text-accent"
              aria-label="Brand eyebrow"
            >
              <EditableWebsiteText path="home.hero.left.eyebrow.text">
                {dynamicHero.left.eyebrow.text}
              </EditableWebsiteText>
            </div>
          )}
          <h1 className="font-heading text-4xl md:text-6xl leading-tight tracking-tight">
            <EditableWebsiteText path="home.hero.left.heading">
              {dynamicHero.left?.heading}
            </EditableWebsiteText>
          </h1>
          <p className="text-sm md:text-base text-muted max-w-prose leading-relaxed text-center md:text-left mx-auto md:mx-0">
            <EditableWebsiteText path="home.hero.left.subtext">
              {dynamicHero.left?.subtext}
            </EditableWebsiteText>
          </p>
          <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
            {toArray<Action>(dynamicHero.left?.actions).map((a) => (
              <Button key={a.title} action={a as Action} />
            ))}
          </div>
        </div>
        <div className="relative flex justify-center md:justify-end">
          <div className="relative shadow-soft ring-1 ring-black/5 bg-surface rounded-full overflow-hidden mx-auto w-64 h-[400px] md:w-[400px] md:h-[600px]">
            <EditableWebsiteImage
              path="home.hero.right.image.src"
              src={
                dynamicHero.right?.image?.src || "/images/hero/hero-main.jpeg"
              }
              alt={dynamicHero.right?.image?.alt || "Hero image"}
              width={400}
              height={600}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Metrics */}
      {normalizedMetrics.cards.length > 0 && (
        <section
          id={normalizedMetrics.id}
          className="relative max-w-7xl mx-auto px-8"
          aria-labelledby="metrics-heading"
        >
          <div className="rounded-3xl bg-surface shadow-soft ring-1 ring-black/5 px-8 py-12 md:py-16">
            <header className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto mb-10 md:mb-14">
              {normalizedMetrics.eyebrow && (
                <EditableWebsiteText
                  path="home.metrics.eyebrow"
                  className="block text-xs font-semibold tracking-[0.35em] uppercase text-accent"
                  tag="span"
                >
                  {normalizedMetrics.eyebrow}
                </EditableWebsiteText>
              )}
              <h2
                id="metrics-heading"
                className="font-heading text-3xl md:text-5xl tracking-tight"
              >
                <EditableWebsiteText path="home.metrics.title">
                  {normalizedMetrics.title}
                </EditableWebsiteText>
              </h2>
              {normalizedMetrics.subtitle && (
                <EditableWebsiteText
                  path="home.metrics.subtitle"
                  className="text-sm md:text-base text-muted leading-relaxed"
                  tag="p"
                >
                  {normalizedMetrics.subtitle}
                </EditableWebsiteText>
              )}
            </header>
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-4">
              {normalizedMetrics.cards.map((card, index) => (
                <article
                  key={card.id || index}
                  className="relative overflow-hidden rounded-3xl bg-background/60 px-6 py-8 md:px-7 md:py-9 border border-black/5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-3">
                    <EditableWebsiteText
                      path={`home.metrics.cards.${index}.value`}
                      className="block text-4xl md:text-5xl font-heading text-text"
                      tag="span"
                    >
                      {card.value}
                    </EditableWebsiteText>
                    <EditableWebsiteText
                      path={`home.metrics.cards.${index}.label`}
                      className="text-sm uppercase tracking-[0.2em] text-accent font-medium"
                      tag="h3"
                    >
                      {card.label}
                    </EditableWebsiteText>
                    <EditableWebsiteText
                      path={`home.metrics.cards.${index}.description`}
                      className="text-sm text-muted leading-relaxed"
                      tag="p"
                    >
                      {card.description}
                    </EditableWebsiteText>
                  </div>
                  <div className="absolute inset-0 pointer-events-none border border-transparent rounded-3xl transition-colors duration-300 hover:border-accent/30" />
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <CompaniesCarousel />
      {/* Services Tabs (rendered as cards) */}
      {servicesTabs && (
        <section
          id={servicesTabs.id}
          className="space-y-6 md:space-y-10"
          aria-labelledby="services-heading"
        >
          <header className="space-y-4 max-w-3xl text-center mx-auto">
            <h2
              id="services-heading"
              className="font-heading text-3xl md:text-5xl tracking-tight bg-linear-to-r from-text to-text/70 bg-clip-text text-transparent"
            >
              <EditableWebsiteText path="home.services.title">
                {websiteContent?.home?.services?.title || servicesTabs.title}
              </EditableWebsiteText>
            </h2>
            <p className="text-muted text-base md:text-lg leading-relaxed">
              <EditableWebsiteText path="home.services.subtitle">
                {websiteContent?.home?.services?.subtitle ||
                  "Comprehensive solutions tailored to your business needs"}
              </EditableWebsiteText>
            </p>
          </header>
          <div className="grid gap-6 md:gap-8 lg:grid-cols-3 max-w-7xl mx-auto px-8">
            {servicesTabs.tabs.map((t) => (
              <div
                key={t.label}
                className="group p-8 rounded-3xl bg-surface shadow-soft ring-1 ring-black/5 flex flex-col transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-accent/20 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
              >
                {/* Service Icon/Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                    <span className="text-accent text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                      {t.label.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl text-text group-hover:text-accent transition-colors duration-300">
                    {t.label}
                  </h3>
                </div>

                {/* Service Content */}
                <ul className="space-y-3 text-sm flex-1 group-hover:text-text/90 transition-colors duration-300">
                  {t.content.bullets.map((b) => (
                    <li
                      key={b}
                      className="pl-5 relative flex items-start gap-3"
                    >
                      <span className="absolute left-0 top-2.5 h-2 w-2 rounded-full bg-accent group-hover:bg-accent/80 transition-colors duration-300 shrink-0" />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="pt-6 mt-auto">
                  <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                    <Button action={t.content.cta} />
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-accent/10 transition-colors duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trusted Brands Section */}
      <section className="relative max-w-7xl mx-auto px-8">
        <div className="rounded-3xl bg-surface shadow-soft ring-1 ring-black/5 px-8 py-12 md:py-16">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl tracking-tight text-text mb-2">
              <EditableWebsiteText path="home.trustedBrands.title">
                Trusted by Leading Brands
              </EditableWebsiteText>
            </h2>
            <p className="text-sm text-muted max-w-2xl mx-auto">
              <EditableWebsiteText path="home.trustedBrands.subtitle">
                We&apos;ve partnered with industry leaders across various sectors
              </EditableWebsiteText>
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of brands */}
              <div className="flex items-center gap-8 md:gap-12 flex-shrink-0">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
                  <div
                    key={`brand-${num}`}
                    className="flex-shrink-0 w-20 h-12 md:w-24 md:h-14 bg-white rounded-lg shadow-sm ring-1 ring-black/5 flex items-center justify-center p-2 hover:shadow-md transition-shadow duration-300"
                  >
                    <EditableWebsiteImage
                      path={`home.trustedBrands.brands.${num - 1}.logo`}
                      src={`/images/companies/${num}.png`}
                      alt={`Brand ${num} logo`}
                      width={80}
                      height={40}
                      className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center gap-8 md:gap-12 flex-shrink-0">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((num) => (
                  <div
                    key={`brand-duplicate-${num}`}
                    className="flex-shrink-0 w-20 h-12 md:w-24 md:h-14 bg-white rounded-lg shadow-sm ring-1 ring-black/5 flex items-center justify-center p-2 hover:shadow-md transition-shadow duration-300"
                  >
                    <EditableWebsiteImage
                      path={`home.trustedBrands.brands.${num - 1}.logo`}
                      src={`/images/companies/${num}.png`}
                      alt={`Brand ${num} logo`}
                      width={80}
                      height={40}
                      className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second row for remaining brands */}
          <div className="relative overflow-hidden mt-6">
            <div className="flex animate-scroll-reverse">
              {/* Second set of brands */}
              <div className="flex items-center gap-8 md:gap-12 flex-shrink-0">
                {[15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27].map((num) => (
                  <div
                    key={`brand-2-${num}`}
                    className="flex-shrink-0 w-20 h-12 md:w-24 md:h-14 bg-white rounded-lg shadow-sm ring-1 ring-black/5 flex items-center justify-center p-2 hover:shadow-md transition-shadow duration-300"
                  >
                    <EditableWebsiteImage
                      path={`home.trustedBrands.brands.${num - 1}.logo`}
                      src={`/images/companies/${num}.png`}
                      alt={`Brand ${num} logo`}
                      width={80}
                      height={40}
                      className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center gap-8 md:gap-12 flex-shrink-0">
                {[15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27].map((num) => (
                  <div
                    key={`brand-2-duplicate-${num}`}
                    className="flex-shrink-0 w-20 h-12 md:w-24 md:h-14 bg-white rounded-lg shadow-sm ring-1 ring-black/5 flex items-center justify-center p-2 hover:shadow-md transition-shadow duration-300"
                  >
                    <EditableWebsiteImage
                      path={`home.trustedBrands.brands.${num - 1}.logo`}
                      src={`/images/companies/${num}.png`}
                      alt={`Brand ${num} logo`}
                      width={80}
                      height={40}
                      className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      {ctaBand && (
        <section
          id={ctaBand.id}
          className="rounded-3xl bg-accent text-text p-6 md:p-10 lg:p-16 flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center shadow-soft max-w-7xl mx-auto px-8"
          aria-labelledby="cta-heading"
        >
          <div className="space-y-4 flex-1">
            <h2
              id="cta-heading"
              className="font-heading text-3xl md:text-5xl leading-tight"
            >
              <EditableWebsiteText path="home.cta.heading">
                {websiteContent?.home?.cta?.heading || ctaBand.heading}
              </EditableWebsiteText>
            </h2>
            <p className="text-sm md:text-base max-w-prose leading-relaxed">
              <EditableWebsiteText path="home.cta.text">
                {websiteContent?.home?.cta?.text || ctaBand.text}
              </EditableWebsiteText>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {ctaBand.actions.map((a) => (
              <Button key={a.title} action={a} />
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
