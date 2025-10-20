"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import EditableWebsiteText from "@/app/components/EditableWebsiteText";
import EditableWebsiteImage from "@/app/components/EditableWebsiteImage";
import { useContent } from "@/app/contexts/ContentContext";
import { mergeContent, toArray } from "@/lib/contentUtils";
import { siteConfig } from "@/lib/siteConfig";

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

interface CompaniesSectionCard {
  slug: string;
  brand: { name: string; logo: any; accent: string };
  tagline: string;
  summary: string;
  services: string[];
  media: { cover: string; alt: string };
  actions: readonly Action[];
}

interface CompaniesSectionAnimation {
  intervalMs: number;
  axis: "x";
  visible: number;
  focusIndex: number;
  scale: { inactive: number; active: number };
  depth: { inactiveZ: number; activeZ: number };
  transition: { durationMs: number; easing: string | number[] };
}

interface CompaniesSection {
  id: string;
  type: "cards-grid";
  title: string;
  cards: readonly CompaniesSectionCard[];
  presentation?: "slider";
  animation?: CompaniesSectionAnimation;
}

type AnySection = { type: string; id: string } & Partial<CompaniesSection>;

interface CarouselBase {
  companies: { title: string; subtitle: string };
  sections: CompaniesSection[];
}

const AUTOPLAY_RESUME_DELAY = 3000;
const DEFAULT_SUBTITLE = "Discover our portfolio of innovative businesses";

const clone = <T,>(value: T): T => mergeContent(value, undefined);

const HOME_CAROUSEL_BASE: CarouselBase = (() => {
  const rawCompaniesSection = siteConfig.website.sections.find(
    (section) =>
      (section as { id?: string }).id === "companies" &&
      (section as { type?: string }).type === "cards-grid"
  );

  if (!rawCompaniesSection) {
    throw new Error("Missing companies section in siteConfig");
  }

  const baseSectionEntry = clone(
    rawCompaniesSection
  ) as unknown as CompaniesSection;
  const baseCards = toArray<CompaniesSectionCard>(baseSectionEntry.cards);
  const cardsBySlug = new Map(
    baseCards.map((card) => [card.slug, clone(card) as CompaniesSectionCard])
  );

  const buildSection = (order: string[]) => {
    const sectionClone = clone(baseSectionEntry) as CompaniesSection;
    sectionClone.cards = order
      .map((slug) => {
        const card = cardsBySlug.get(slug);
        return card ? clone(card) : undefined;
      })
      .filter(Boolean) as CompaniesSectionCard[];
    return sectionClone;
  };

  return {
    companies: {
      title: baseSectionEntry.title,
      subtitle: DEFAULT_SUBTITLE,
    },
    sections: [buildSection(baseCards.map((card) => card.slug))],
  };
})();

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

export interface CompaniesCarouselProps {
  className?: string;
}

export default function CompaniesCarousel({
  className,
}: CompaniesCarouselProps = {}) {
  const { websiteContent } = useContent();
  const baseCarousel = HOME_CAROUSEL_BASE;
  const overrideData = {
    companies: websiteContent?.home?.companies,
    sections: websiteContent?.home?.sections,
  };

  const mergedCarousel = mergeContent(
    baseCarousel,
    overrideData
  ) as CarouselBase;
  const dynamicSections = mergedCarousel.sections;
  const carouselMeta = mergedCarousel.companies ?? baseCarousel.companies;

  const companies = useMemo(() => {
    const sectionsArray = toArray<AnySection>(dynamicSections);

    for (const section of sectionsArray) {
      if (section.type === "cards-grid") {
        const typedSection = section as CompaniesSection & { cards?: unknown };
        const normalizedCards = toArray<CompaniesSectionCard>(
          typedSection.cards
        ).map((card) => ({
          ...card,
          services: toArray<string>(card.services),
          actions: toArray<Action>(card.actions),
        }));

        return {
          ...typedSection,
          cards: normalizedCards,
        } as CompaniesSection;
      }
    }
    return undefined;
  }, [dynamicSections]);

  const prefersReducedMotion = usePrefersReducedMotion();
  const [companyIndex, setCompanyIndex] = useState(0);
  const sliderHoverRef = useRef(false);
  const manualNavigationRef = useRef(false);
  const cards = companies?.cards ?? [];

  useEffect(() => {
    setCompanyIndex(0);
  }, [cards.length]);

  useEffect(() => {
    if (
      !companies ||
      companies.presentation !== "slider" ||
      !companies.animation ||
      prefersReducedMotion ||
      cards.length === 0
    ) {
      return;
    }

    const { intervalMs } = companies.animation;
    const id = window.setInterval(() => {
      if (sliderHoverRef.current || manualNavigationRef.current) {
        return;
      }
      setCompanyIndex((idx) => (idx + 1) % cards.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [companies, prefersReducedMotion, cards.length]);

  useEffect(() => {
    if (manualNavigationRef.current) {
      const timer = window.setTimeout(() => {
        manualNavigationRef.current = false;
      }, AUTOPLAY_RESUME_DELAY);
      return () => window.clearTimeout(timer);
    }
  }, [companyIndex]);

  if (!companies || cards.length === 0) {
    return null;
  }

  function handlePrev() {
    manualNavigationRef.current = true;
    setCompanyIndex((idx) => (idx - 1 < 0 ? cards.length - 1 : idx - 1));
  }

  function handleNext() {
    manualNavigationRef.current = true;
    setCompanyIndex((idx) => (idx + 1) % cards.length);
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
    }
  }

  const sectionClassName = ["space-y-6", className].filter(Boolean).join(" ");

  return (
    <section
      id={companies.id}
      className={sectionClassName}
      aria-labelledby="companies-heading"
    >
      <header className="space-y-4 max-w-3xl text-center mx-auto mb-4">
        <h2
          id="companies-heading"
          className="font-heading text-3xl md:text-5xl tracking-tight bg-linear-to-r from-text to-text/70 bg-clip-text text-transparent"
        >
          <EditableWebsiteText path="home.companies.title">
            {websiteContent?.home?.companies?.title || carouselMeta.title}
          </EditableWebsiteText>
        </h2>
        <p className="text-muted text-base md:text-lg leading-relaxed">
          <EditableWebsiteText path="home.companies.subtitle">
            {websiteContent?.home?.companies?.subtitle ||
              carouselMeta.subtitle ||
              DEFAULT_SUBTITLE}
          </EditableWebsiteText>
        </p>
      </header>

      {companies.presentation === "slider" && (
        <div className="flex justify-center mb-4">
          <div className="hidden md:flex gap-3" aria-label="Slider controls">
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

      <div className="block lg:hidden">
        <div className="grid gap-6">
          {cards.map((card, cardIndex) => {
            const cardPath = `home.sections.0.cards.${cardIndex}`;

            return (
              <article
                key={card.slug}
                className="flex flex-col rounded-2xl overflow-hidden bg-surface shadow-soft ring-1 ring-black/5 hover:shadow-xl hover:ring-2 hover:ring-accent/20 transition-all duration-300"
                aria-labelledby={`${card.slug}-title-mobile`}
              >
                <div className="aspect-4/3 overflow-hidden bg-background relative">
                  <div className="absolute inset-0">
                    <EditableWebsiteImage
                      path={`${cardPath}.media.cover`}
                      src={card.media.cover}
                      alt={card.media.alt}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="space-y-2">
                    <h3
                      id={`${card.slug}-title-mobile`}
                      className="font-heading text-xl"
                    >
                      <EditableWebsiteText path={`${cardPath}.brand.name`}>
                        {card.brand.name}
                      </EditableWebsiteText>
                    </h3>
                    <p className="text-xs uppercase tracking-wide text-muted/90">
                      <EditableWebsiteText path={`${cardPath}.tagline`}>
                        {card.tagline}
                      </EditableWebsiteText>
                    </p>
                  </div>
                  <p className="text-sm text-muted leading-relaxed flex-1">
                    <EditableWebsiteText path={`${cardPath}.summary`}>
                      {card.summary}
                    </EditableWebsiteText>
                  </p>
                  <ul className="text-[13px] space-y-1">
                    {card.services.map((service, serviceIndex) => (
                      <li key={service} className="pl-4 relative">
                        <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                        <EditableWebsiteText
                          path={`${cardPath}.services.${serviceIndex}`}
                        >
                          {service}
                        </EditableWebsiteText>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <div className="flex flex-col gap-2">
                      {card.actions.map((action) => (
                        <Button key={action.title} action={action} />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

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
              {cards.map((card, idx) => {
                const { scale, depth, transition } = companies.animation!;
                const total = cards.length;
                const offset = (idx - companyIndex + total) % total;
                const isActive = offset === 0;

                let position;
                if (offset === 0) position = 0;
                else if (offset === 1) position = 1;
                else if (offset === total - 1) position = -1;
                else if (offset === 2) position = 2;
                else if (offset === total - 2) position = -2;
                else if (offset === 3) position = 3;
                else if (offset === total - 3) position = -3;
                else position = 0;

                const translateX = position * 65;
                const cardScale = isActive ? scale.active : scale.inactive;
                const z = isActive ? depth.activeZ : depth.inactiveZ;
                const hidden = Math.abs(position) > 3;

                const cardPath = `home.sections.0.cards.${idx}`;

                return (
                  <motion.article
                    key={card.slug}
                    className="absolute top-6 w-[400px] will-change-transform"
                    initial={false}
                    animate={{
                      x: `${translateX}%`,
                      scale: cardScale,
                      z,
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
                        <div className="absolute inset-0">
                          <EditableWebsiteImage
                            path={`${cardPath}.media.cover`}
                            src={card.media.cover}
                            alt={card.media.alt}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="p-6 flex flex-col gap-4 flex-1">
                        <div className="space-y-2">
                          <h3
                            id={`${card.slug}-title-desktop`}
                            className="font-heading text-xl"
                          >
                            <EditableWebsiteText
                              path={`${cardPath}.brand.name`}
                            >
                              {card.brand.name}
                            </EditableWebsiteText>
                          </h3>
                          <p className="text-xs uppercase tracking-wide text-muted/90">
                            <EditableWebsiteText path={`${cardPath}.tagline`}>
                              {card.tagline}
                            </EditableWebsiteText>
                          </p>
                        </div>
                        <p className="text-sm text-muted leading-relaxed flex-1">
                          <EditableWebsiteText path={`${cardPath}.summary`}>
                            {card.summary}
                          </EditableWebsiteText>
                        </p>
                        <ul className="text-[13px] space-y-1">
                          {card.services.map((service, serviceIndex) => (
                            <li key={service} className="pl-4 relative">
                              <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                              <EditableWebsiteText
                                path={`${cardPath}.services.${serviceIndex}`}
                              >
                                {service}
                              </EditableWebsiteText>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-4">
                          <div className="flex flex-col gap-2">
                            {card.actions.map((action) => (
                              <Button key={action.title} action={action} />
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

          <div className="sr-only" aria-live="polite">
            {`Showing ${cards[companyIndex].brand.name}`}
          </div>
        </div>
      )}

      {(!companies.presentation || companies.presentation !== "slider") && (
        <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto px-8">
          {cards.map((card, cardIndex) => {
            const cardPath = `home.sections.0.cards.${cardIndex}`;

            return (
              <article
                key={card.slug}
                className="flex flex-col rounded-2xl overflow-hidden bg-surface shadow-soft ring-1 ring-black/5 hover:shadow-xl hover:ring-2 hover:ring-accent/20 transition-all duration-300"
                aria-labelledby={`${card.slug}-title`}
              >
                <div className="aspect-4/3 overflow-hidden bg-background relative">
                  <div className="absolute inset-0">
                    <EditableWebsiteImage
                      path={`${cardPath}.media.cover`}
                      src={card.media.cover}
                      alt={card.media.alt}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="space-y-2">
                    <h3
                      id={`${card.slug}-title`}
                      className="font-heading text-xl"
                    >
                      <EditableWebsiteText path={`${cardPath}.brand.name`}>
                        {card.brand.name}
                      </EditableWebsiteText>
                    </h3>
                    <p className="text-xs uppercase tracking-wide text-muted/90">
                      <EditableWebsiteText path={`${cardPath}.tagline`}>
                        {card.tagline}
                      </EditableWebsiteText>
                    </p>
                  </div>
                  <p className="text-sm text-muted leading-relaxed flex-1">
                    <EditableWebsiteText path={`${cardPath}.summary`}>
                      {card.summary}
                    </EditableWebsiteText>
                  </p>
                  <ul className="text-[13px] space-y-1">
                    {card.services.map((service, serviceIndex) => (
                      <li key={service} className="pl-4 relative">
                        <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                        <EditableWebsiteText
                          path={`${cardPath}.services.${serviceIndex}`}
                        >
                          {service}
                        </EditableWebsiteText>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <div className="flex flex-col gap-2">
                      {card.actions.map((action) => (
                        <Button key={action.title} action={action} />
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
