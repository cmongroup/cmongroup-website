"use client";
import { siteConfig } from "@/lib/siteConfig";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EditableWebsiteText from "@/app/components/EditableWebsiteText";
import EditableWebsiteImage from "@/app/components/EditableWebsiteImage";
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

// Section typing for used shapes
interface CompaniesSectionCard {
  slug: string;
  brand: { name: string; logo: any; accent: string };
  tagline: string;
  summary: string;
  services: string[];
  media: { cover: string; alt: string };
  actions: readonly Action[];
}
interface CompaniesSection {
  id: string;
  type: "cards-grid";
  title: string;
  cards: readonly CompaniesSectionCard[];
  presentation?: "slider";
  animation?: {
    intervalMs: number;
    axis: "x";
    visible: number;
    focusIndex: number;
    scale: { inactive: number; active: number };
    depth: { inactiveZ: number; activeZ: number };
    transition: { durationMs: number; easing: string | number[] };
  };
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

type AnySection = CompaniesSection | ServicesTabsSection | CtaBandSection;

// Utility hooks
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const listener = () => setMatches(m.matches);
    listener();
    m.addEventListener("change", listener);
    return () => m.removeEventListener("change", listener);
  }, [query]);
  return matches;
}
function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export default function HomePage() {
  const { hero, sections } = siteConfig.website;
  const { websiteContent, websiteImages, isLoading } = useContent();

  // All React hooks must be called before any conditional returns
  const prefersReducedMotion = usePrefersReducedMotion();
  const isSmall = useMediaQuery("(max-width: 1023px)");

  // Slider logic for companies section (if presentation === 'slider')
  const [companyIndex, setCompanyIndex] = useState(0);
  const sliderHoverRef = useRef(false);
  const manualNavigationRef = useRef(false);

  // Use dynamic content from Firebase if available, fallback to static config
  const dynamicHero = websiteContent?.home?.hero || hero;
  const dynamicSections = websiteContent?.home?.sections || sections;

  // Index sections once (performance + clarity)
  const { companies, servicesTabs, ctaBand } = useMemo(() => {
    const out: {
      companies?: CompaniesSection;
      servicesTabs?: ServicesTabsSection;
      ctaBand?: CtaBandSection;
    } = {};
    // Fix readonly conversion by using unknown intermediate type
    const sectionsArray = dynamicSections as unknown as readonly AnySection[];
    for (const s of sectionsArray) {
      if (s.type === "cards-grid") out.companies = s as CompaniesSection;
      else if (s.type === "tabs") out.servicesTabs = s;
      else if (s.type === "cta" && s.id === "cta-band")
        out.ctaBand = s as CtaBandSection;
    }
    return out;
  }, [dynamicSections]);

  // Slider logic for companies section (if presentation === 'slider')
  useEffect(() => {
    if (
      !companies?.presentation ||
      companies.presentation !== "slider" ||
      !companies.animation
    )
      return;
    if (prefersReducedMotion) return;

    const { intervalMs } = companies.animation;
    const id = setInterval(() => {
      if (sliderHoverRef.current || manualNavigationRef.current) return;
      setCompanyIndex((i) => (i + 1) % companies.cards.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [companies, prefersReducedMotion]);

  // Reset manual navigation flag after a delay
  useEffect(() => {
    if (manualNavigationRef.current) {
      const timer = setTimeout(() => {
        manualNavigationRef.current = false;
      }, 3000); // Wait 3 seconds before resuming autoplay
      return () => clearTimeout(timer);
    }
  }, [companyIndex]);

  // Show loading state while content is being fetched
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

  function handlePrev() {
    if (companies) {
      manualNavigationRef.current = true;
      setCompanyIndex((i) => {
        const newIndex = i - 1;
        return newIndex < 0 ? companies.cards.length - 1 : newIndex;
      });
    }
  }
  function handleNext() {
    if (companies) {
      manualNavigationRef.current = true;
      setCompanyIndex((i) => {
        const newIndex = i + 1;
        return newIndex >= companies.cards.length ? 0 : newIndex;
      });
    }
  }
  function handleKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
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
            {dynamicHero.left?.actions?.map((a: any) => (
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

      {/* Companies Section (Slider) */}
      {companies && (
        <section
          id={companies.id}
          className="space-y-6"
          aria-labelledby="companies-heading"
        >
          <header className="space-y-4 max-w-3xl text-center mx-auto mb-4">
            <h2
              id="companies-heading"
              className="font-heading text-3xl md:text-5xl tracking-tight bg-linear-to-r from-text to-text/70 bg-clip-text text-transparent"
            >
              <EditableWebsiteText path="home.companies.title">
                {websiteContent?.home?.companies?.title || companies.title}
              </EditableWebsiteText>
            </h2>
            <p className="text-muted text-base md:text-lg leading-relaxed">
              <EditableWebsiteText path="home.companies.subtitle">
                {websiteContent?.home?.companies?.subtitle ||
                  "Discover our portfolio of innovative businesses"}
              </EditableWebsiteText>
            </p>
          </header>

          {/* Navigation Controls - Positioned below header */}
          {companies.presentation === "slider" && (
            <div className="flex justify-center mb-4">
              <div
                className="hidden md:flex gap-3"
                aria-label="Slider controls"
              >
                <button
                  onClick={handlePrev}
                  aria-label="Previous company"
                  className="h-11 w-11 rounded-full border-2 border-black/10 flex items-center justify-center text-lg hover:bg-black hover:text-white hover:border-black transition-all duration-300 hover:scale-110"
                >
                  ‹
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next company"
                  className="h-11 w-11 rounded-full border-2 border-black/10 flex items-center justify-center text-lg hover:bg-black hover:text-white hover:border-black transition-all duration-300 hover:scale-110"
                >
                  ›
                </button>
              </div>
            </div>
          )}

          {/* Mobile Cards - Simple Grid Layout */}
          <div className="block lg:hidden">
            <div className="grid gap-6">
              {companies.cards.map((card) => (
                <article
                  key={card.slug}
                  className="flex flex-col rounded-2xl overflow-hidden bg-surface shadow-soft ring-1 ring-black/5 hover:shadow-xl hover:ring-2 hover:ring-accent/20 transition-all duration-300"
                  aria-labelledby={`${card.slug}-title-mobile`}
                >
                  <div className="aspect-4/3 overflow-hidden bg-background relative">
                    <Image
                      src={card.media.cover}
                      alt={card.media.alt}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <div className="space-y-2">
                      <h3
                        id={`${card.slug}-title-mobile`}
                        className="font-heading text-xl"
                      >
                        {card.brand.name}
                      </h3>
                      <p className="text-xs uppercase tracking-wide text-muted/90">
                        {card.tagline}
                      </p>
                    </div>
                    <p className="text-sm text-muted leading-relaxed flex-1">
                      {card.summary}
                    </p>
                    <ul className="text-[13px] space-y-1">
                      {card.services.map((s) => (
                        <li key={s} className="pl-4 relative">
                          <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4">
                      <div className="flex flex-col gap-2">
                        {card.actions.map((a) => (
                          <Button key={a.title} action={a} />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Desktop 3D Slider */}
          {companies.presentation === "slider" && companies.animation && (
            <div className="hidden lg:block max-w-7xl mx-auto px-8">
              <div
                className="relative py-6"
                onMouseEnter={() => (sliderHoverRef.current = true)}
                onMouseLeave={() => (sliderHoverRef.current = false)}
                role="region"
                aria-roledescription="carousel"
                aria-label="Companies carousel"
                tabIndex={0}
                onKeyDown={handleKey}
              >
                <div
                  className="relative flex items-center justify-center overflow-hidden perspective-[2000px] min-h-[800px]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {companies.cards.map((card, idx) => {
                    const { focusIndex, scale, depth, transition } =
                      companies.animation!;
                    const total = companies.cards.length;
                    const offset = (idx - companyIndex + total) % total;
                    const isActive = offset === 0;

                    // Calculate position based on offset from active card
                    let position;
                    if (offset === 0) {
                      position = 0; // Active card in center
                    } else if (offset === 1) {
                      position = 1; // Next card to the right
                    } else if (offset === total - 1) {
                      position = -1; // Previous card to the left
                    } else if (offset === 2) {
                      position = 2; // Second card to the right
                    } else if (offset === total - 2) {
                      position = -2; // Second card to the left
                    } else if (offset === 3) {
                      position = 3; // Third card to the right
                    } else if (offset === total - 3) {
                      position = -3; // Third card to the left
                    } else {
                      position = 0; // Hide other cards
                    }

                    const translateX = position * 65;
                    const cardScale = isActive ? scale.active : scale.inactive;
                    const z = isActive ? depth.activeZ : depth.inactiveZ;
                    const hidden = Math.abs(position) > 3;

                    return (
                      <motion.article
                        key={card.slug}
                        className="absolute top-6 w-[400px] will-change-transform"
                        initial={false}
                        animate={{
                          x: `${translateX}%`,
                          scale: cardScale,
                          z: z,
                          opacity: hidden ? 0 : 1,
                          zIndex: isActive ? 30 : 25 - Math.abs(position),
                        }}
                        transition={{
                          duration: transition.durationMs / 1000,
                          ease: transition.easing,
                        }}
                        aria-hidden={!isActive}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${idx + 1} of ${total}`}
                      >
                        <div
                          className="flex flex-col rounded-2xl overflow-hidden bg-surface shadow-soft ring-1 ring-black/5 hover:shadow-xl hover:ring-2 hover:ring-accent/20 transition-all duration-300"
                          aria-labelledby={`${card.slug}-title-desktop`}
                        >
                          <div className="aspect-4/3 overflow-hidden bg-background relative">
                            <Image
                              src={card.media.cover}
                              alt={card.media.alt}
                              fill
                              className="object-cover"
                              sizes="(min-width:768px) 400px, 100vw"
                            />
                          </div>
                          <div className="p-6 flex flex-col gap-4 flex-1">
                            <div className="space-y-2">
                              <h3
                                id={`${card.slug}-title-desktop`}
                                className="font-heading text-xl"
                              >
                                {card.brand.name}
                              </h3>
                              <p className="text-xs uppercase tracking-wide text-muted/90">
                                {card.tagline}
                              </p>
                            </div>
                            <p className="text-sm text-muted leading-relaxed flex-1">
                              {card.summary}
                            </p>
                            <ul className="text-[13px] space-y-1">
                              {card.services.map((s) => (
                                <li key={s} className="pl-4 relative">
                                  <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                            <div className="pt-4">
                              <div className="flex flex-col gap-2">
                                {card.actions.map((a) => (
                                  <Button key={a.title} action={a} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                  <div className="invisible w-[400px] h-[800px]"></div>
                </div>
              </div>

              <div
                className="sr-only"
                aria-live="polite"
              >{`Showing ${companies.cards[companyIndex].brand.name}`}</div>
            </div>
          )}

          {/* Fallback Grid for Non-Slider */}
          {(!companies.presentation || companies.presentation !== "slider") && (
            <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto px-8">
              {companies.cards.map((card) => (
                <article
                  key={card.slug}
                  className="flex flex-col rounded-2xl overflow-hidden bg-surface shadow-soft ring-1 ring-black/5 hover:shadow-xl hover:ring-2 hover:ring-accent/20 transition-all duration-300"
                  aria-labelledby={`${card.slug}-title`}
                >
                  <div className="aspect-4/3 overflow-hidden bg-background relative">
                    <Image
                      src={card.media.cover}
                      alt={card.media.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width:768px) 33vw, 100vw"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-4 flex-1">
                    <div className="space-y-2">
                      <h3
                        id={`${card.slug}-title`}
                        className="font-heading text-xl"
                      >
                        {card.brand.name}
                      </h3>
                      <p className="text-xs uppercase tracking-wide text-muted/90">
                        {card.tagline}
                      </p>
                    </div>
                    <p className="text-sm text-muted leading-relaxed flex-1">
                      {card.summary}
                    </p>
                    <ul className="text-[13px] space-y-1">
                      {card.services.map((s) => (
                        <li key={s} className="pl-4 relative">
                          <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4">
                      <div className="flex flex-col gap-2">
                        {card.actions.map((a) => (
                          <Button key={a.title} action={a} />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

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
