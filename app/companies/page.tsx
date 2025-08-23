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

export default function CompaniesPage() {
  const { companies } = siteConfig.website.sections.reduce(
    (acc, section) => {
      if (section.type === "cards-grid") {
        acc.companies = section;
      }
      return acc;
    },
    {} as { companies?: any }
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            Our Companies
          </div>
          <h1 className="font-heading text-4xl md:text-6xl leading-tight tracking-tight mb-6">
            Three companies, one vision
          </h1>
          <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
            We unite interior architecture, brand strategy for F&B, and
            electromechanical execution. One group. Three expert companies.
            End-to-end delivery from concept to commissioning.
          </p>
        </div>

        {/* Companies Alternating Layout */}
        {companies && (
          <div className="space-y-24">
            {companies.cards.map((card: any, index: number) => (
              <article
                key={card.slug}
                className={`flex flex-col lg:flex-row gap-12 lg:gap-16 items-center ${
                  index % 2 === 0 ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2">
                  <div className="aspect-4/3 overflow-hidden bg-background relative rounded-2xl shadow-soft ring-1 ring-black/5">
                    <img
                      src={card.media.cover}
                      alt={card.media.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      {card.tagline}
                    </div>
                    <h2 className="font-heading text-3xl lg:text-4xl text-text leading-tight">
                      {card.brand.name}
                    </h2>
                    <p className="text-lg text-muted leading-relaxed">
                      {card.summary}
                    </p>

                    {/* Company-specific detailed descriptions */}
                    {card.slug === "cmon-design" && (
                      <p className="text-muted leading-relaxed">
                        From concept to completion, we transform spaces into
                        experiences. Our team combines creative vision with
                        technical expertise, delivering bespoke interior
                        solutions that reflect your brand's unique identity. We
                        handle everything from initial sketches to final
                        installation, ensuring every detail meets our exacting
                        standards.
                      </p>
                    )}

                    {card.slug === "rebred" && (
                      <p className="text-muted leading-relaxed">
                        We don't just rebrand restaurants—we reimagine them. Our
                        strategic approach goes beyond visual identity to create
                        comprehensive brand systems that drive customer
                        engagement and business growth. From menu engineering to
                        franchise development, we build brands that scale and
                        succeed in competitive markets.
                      </p>
                    )}

                    {card.slug === "gmep" && (
                      <p className="text-muted leading-relaxed">
                        Precision engineering meets practical execution. Our MEP
                        specialists ensure building systems work seamlessly
                        together, from HVAC optimization to smart building
                        integration. We handle complex technical challenges
                        while maintaining focus on energy efficiency,
                        sustainability, and long-term reliability.
                      </p>
                    )}
                  </div>

                  {/* Services Description */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-text text-sm uppercase tracking-wide">
                      What we deliver
                    </h3>
                    <p className="text-muted leading-relaxed">
                      {card.services.join(", ")}.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {card.actions.map((action: any) => (
                      <Button key={action.title} action={action} />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-accent/10 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl mb-6">
              Ready to start your project?
            </h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              Whether you need interior design, F&B branding, or MEP services,
              we&apos;re here to help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                action={{
                  title: "Get in Touch",
                  route: "/contact",
                  variant: "primary",
                }}
              />
              <Button
                action={{
                  title: "View Services",
                  route: "/#services",
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
