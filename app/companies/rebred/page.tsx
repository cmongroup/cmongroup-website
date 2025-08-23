"use client";
import { siteConfig } from "@/lib/siteConfig";
import Link from "next/link";
import { useContent } from "@/app/contexts/ContentContext";
import EditableText from "@/app/components/EditableText";
import EditableImage from "@/app/components/EditableImage";

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

  const { companyContent, companyImages, isLoading } = useContent();

  if (!company) {
    return <div>Company not found</div>;
  }

  // Show loading state while content is being fetched
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted">Loading content...</p>
          </div>
        </div>
      </main>
    );
  }

  const content = companyContent?.rebred;
  const images = companyImages?.rebred;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <EditableText companySlug="rebred" path="tagline">
              {content?.tagline || company.tagline}
            </EditableText>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl leading-tight tracking-tight mb-6">
            <EditableText companySlug="rebred" path="brandName">
              {content?.brandName || company.brand.name}
            </EditableText>
          </h1>
          <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
            <EditableText companySlug="rebred" path="description">
              {content?.description ||
                "We don't just rebrand restaurants—we reimagine them. Our strategic approach goes beyond visual identity to create comprehensive brand systems that drive customer engagement and business growth. From menu engineering to franchise development, we build brands that scale and succeed in competitive markets."}
            </EditableText>
          </p>
        </div>

        {/* Company Layout - Alternating Left/Right */}
        <div className="space-y-24">
          {/* Section 1: Company Overview - Left */}
          <article className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-4/3 overflow-hidden bg-background relative rounded-2xl shadow-soft ring-1 ring-black/5">
                <EditableImage
                  companySlug="rebred"
                  path="section1Src"
                  src={images?.section1Src || company.media.cover}
                  alt={images?.section1Alt || company.media.alt}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                  placeholderSrc={company.media.cover}
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                  <EditableText companySlug="rebred" path="tagline">
                    {content?.tagline || company.tagline}
                  </EditableText>
                </div>
                <h2 className="font-heading text-3xl lg:text-4xl text-text leading-tight">
                  <EditableText companySlug="rebred" path="section1.title">
                    {content?.section1?.title || "F&B Brand Architecture"}
                  </EditableText>
                </h2>
                <p className="text-lg text-muted leading-relaxed">
                  <EditableText companySlug="rebred" path="section1.summary">
                    {content?.section1?.summary || company.summary}
                  </EditableText>
                </p>
                <p className="text-muted leading-relaxed">
                  <EditableText companySlug="rebred" path="section1.summary">
                    {content?.section1?.summary ||
                      "We don't just rebrand restaurants—we reimagine them. Our strategic approach goes beyond visual identity to create comprehensive brand systems that drive customer engagement and business growth. From menu engineering to franchise development, we build brands that scale and succeed in competitive markets."}
                  </EditableText>
                </p>
              </div>

              {/* Services Description */}
              <div className="space-y-3">
                <h3 className="font-medium text-text text-sm uppercase tracking-wide">
                  <EditableText
                    companySlug="rebred"
                    path="section1.servicesLabel"
                  >
                    {content?.section1?.servicesLabel || "What we deliver"}
                  </EditableText>
                </h3>
                <p className="text-muted leading-relaxed">
                  <EditableText companySlug="rebred" path="section1.services">
                    {content?.section1?.services || company.services.join(", ")}
                  </EditableText>
                  .
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

          {/* Section 2: Our Expertise - Right */}
          <article className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-16 items-center">
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-4/3 overflow-hidden bg-background relative rounded-2xl shadow-soft ring-1 ring-black/5">
                <EditableImage
                  companySlug="rebred"
                  path="section2Src"
                  src={
                    images?.section2Src || "/images/placeholder-expertise.jpg"
                  }
                  alt={images?.section2Alt || "Brand strategy expertise"}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                  placeholderSrc="/images/placeholder-expertise.jpg"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="space-y-4">
                <h3 className="font-heading text-2xl text-text">
                  <EditableText companySlug="rebred" path="section2.title">
                    {content?.section2?.title || "Our Expertise"}
                  </EditableText>
                </h3>
                <p className="text-muted leading-relaxed">
                  <EditableText
                    companySlug="rebred"
                    path="section2.description"
                  >
                    {content?.section2?.description ||
                      "We specialize in transforming food and beverage concepts into powerful, scalable brands. Our team combines strategic thinking with creative execution, ensuring every brand element works together to create memorable customer experiences and drive business results."}
                  </EditableText>
                </p>
              </div>
            </div>
          </article>

          {/* Section 3: Why Choose Us - Left */}
          <article className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Image Section */}
            <div className="w-full lg:w-1/2">
              <div className="aspect-4/3 overflow-hidden bg-background relative rounded-2xl shadow-soft ring-1 ring-black/5">
                <EditableImage
                  companySlug="rebred"
                  path="section3Src"
                  src={
                    images?.section3Src || "/images/placeholder-reliability.jpg"
                  }
                  alt={images?.section3Alt || "Strategic brand development"}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                  placeholderSrc="/images/placeholder-reliability.jpg"
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="space-y-4">
                <h3 className="font-heading text-2xl text-text">
                  <EditableText companySlug="rebred" path="section3.title">
                    {content?.section3?.title || "Why Choose Us"}
                  </EditableText>
                </h3>
                <p className="text-muted leading-relaxed">
                  <EditableText
                    companySlug="rebred"
                    path="section3.description"
                  >
                    {content?.section3?.description ||
                      "Our F&B branding team brings deep industry knowledge and proven methodologies to every project. We understand the unique challenges of the food service industry and create solutions that not only look great but drive measurable business outcomes."}
                  </EditableText>
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-accent/10 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl mb-6">
              <EditableText companySlug="rebred" path="cta.heading">
                {content?.cta?.heading || "Ready to transform your brand?"}
              </EditableText>
            </h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              <EditableText companySlug="rebred" path="cta.description">
                {content?.cta?.description ||
                  "Let's discuss your F&B concept and explore how we can create a powerful brand system that drives customer engagement and business growth."}
              </EditableText>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                action={{
                  title: "Request a Quote",
                  route: "/contact?topic=rebred-quote",
                  variant: "primary",
                }}
              />
              <Button
                action={{
                  title: "View Projects",
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
