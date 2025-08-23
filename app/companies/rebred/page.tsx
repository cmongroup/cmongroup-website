import { siteConfig } from "@/lib/siteConfig";
import Link from "next/link";

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

export default function RebredPage() {
  const company = siteConfig.website.sections
    .find((section) => section.type === "cards-grid")
    ?.cards.find((card) => card.slug === "rebred");

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            {company.tagline}
          </div>
          <h1 className="font-heading text-4xl md:text-6xl leading-tight tracking-tight mb-6">
            {company.brand.name}
          </h1>
          <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
            We don&apos;t just rebrand restaurants—we reimagine them. Our
            strategic approach goes beyond visual identity to create
            comprehensive brand systems that drive customer engagement and
            business growth. From menu engineering to franchise development, we
            build brands that scale and succeed in competitive markets.
          </p>
        </div>

        {/* Company Layout - Alternating Left/Right */}
        <div className="space-y-24">
          {/* Section 1: Company Overview - Left */}
          <article className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-4/3 overflow-hidden bg-background relative rounded-2xl shadow-soft ring-1 ring-black/5">
                <img
                  src={company.media.cover}
                  alt={company.media.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  {company.tagline}
                </div>
                <h2 className="font-heading text-3xl lg:text-4xl text-text leading-tight">
                  F&B Brand Architecture
                </h2>
                <p className="text-lg text-muted leading-relaxed">
                  {company.summary}
                </p>
                <p className="text-muted leading-relaxed">
                  We don&apos;t just rebrand restaurants—we reimagine them. Our
                  strategic approach goes beyond visual identity to create
                  comprehensive brand systems that drive customer engagement and
                  business growth. From menu engineering to franchise
                  development, we build brands that scale and succeed in
                  competitive markets.
                </p>
              </div>

              {/* Services Description */}
              <div className="space-y-3">
                <h3 className="font-medium text-text text-sm uppercase tracking-wide">
                  What we deliver
                </h3>
                <p className="text-muted leading-relaxed">
                  {company.services.join(", ")}.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {company.actions.map((action: any) => (
                  <Button key={action.title} action={action} />
                ))}
              </div>
            </div>
          </article>

          {/* Section 2: Our Process - Right */}
          <article className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-16 items-center">
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-4/3 overflow-hidden bg-background relative rounded-2xl shadow-soft ring-1 ring-black/5">
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-2xl text-text">Brand Process</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="space-y-4">
                <h3 className="font-heading text-2xl text-text">Our Process</h3>
                <p className="text-muted leading-relaxed">
                  We start with deep market research and competitive analysis to
                  understand your unique positioning opportunities. This
                  foundation informs our brand strategy, visual identity, and
                  marketing approach, ensuring every element works together to
                  create a cohesive brand experience.
                </p>
                <ul className="space-y-2 text-muted">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    <span>Brand positioning and market analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    <span>Visual identity and brand guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    <span>Menu engineering and concept development</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* Section 3: Why Choose Us - Left */}
          <article className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-4/3 overflow-hidden bg-background relative rounded-2xl shadow-soft ring-1 ring-black/5">
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-2xl text-text">Industry Expertise</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="space-y-4">
                <h3 className="font-heading text-2xl text-text">Why Choose Us</h3>
                <p className="text-muted leading-relaxed">
                  Our team combines deep F&B industry knowledge with cutting-edge
                  marketing expertise. We understand the unique challenges of
                  restaurant branding and have helped numerous establishments
                  transform their market presence and drive sustainable growth.
                </p>
                <ul className="space-y-2 text-muted">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    <span>Proven track record in F&B rebranding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    <span>Comprehensive franchise development support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                    <span>Ongoing marketing and growth strategies</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-accent/10 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl mb-6">
              Ready to transform your brand?
            </h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your F&B concept and explore how we can create
              a brand system that drives growth, customer loyalty, and market
              success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                action={{
                  title: "Request Brand Audit",
                  route: "/contact?topic=brand-audit",
                  variant: "primary",
                }}
              />
              <Button
                action={{
                  title: "View Case Studies",
                  route: "/#companies",
                  variant: "ghost",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
