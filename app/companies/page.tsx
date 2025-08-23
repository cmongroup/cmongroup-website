import { siteConfig } from "@/lib/siteConfig";

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

        {/* Companies Grid */}
        {companies && (
          <div className="grid gap-8 lg:grid-cols-3">
            {companies.cards.map((card: any) => (
              <article
                key={card.slug}
                className="flex flex-col rounded-2xl overflow-hidden bg-surface shadow-soft ring-1 ring-black/5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-4/3 overflow-hidden bg-background relative">
                  <img
                    src={card.media.cover}
                    alt={card.media.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col gap-4 flex-1">
                  <div className="space-y-2">
                    <h3 className="font-heading text-2xl text-text">
                      {card.brand.name}
                    </h3>
                    <p className="text-sm uppercase tracking-wide text-muted/90">
                      {card.tagline}
                    </p>
                  </div>
                  <p className="text-muted leading-relaxed flex-1">
                    {card.summary}
                  </p>
                  <ul className="text-sm space-y-2">
                    {card.services.map((service: string) => (
                      <li key={service} className="pl-4 relative">
                        <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                        {service}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <div className="flex flex-col gap-3">
                      {card.actions.map((action: any) => (
                        <a
                          key={action.title}
                          href={action.route}
                          className={`inline-flex items-center justify-center text-xs font-medium tracking-wide transition-colors rounded-full px-6 py-2.5 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-accent ${
                            action.variant === "accent"
                              ? "bg-accent text-text hover:bg-black hover:text-white"
                              : "border border-text/60 text-text hover:bg-text hover:text-white"
                          }`}
                        >
                          {action.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-accent/10 rounded-3xl p-12 max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl mb-6">
              Ready to start your project?
            </h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              Whether you need interior design, F&B branding, or MEP services,
              we&apos;re here to help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center text-sm font-medium tracking-wide transition-colors rounded-full px-8 py-3 bg-black text-white hover:bg-accent hover:text-text"
              >
                Get in Touch
              </a>
              <a
                href="/#services"
                className="inline-flex items-center justify-center text-sm font-medium tracking-wide transition-colors rounded-full px-8 py-3 border border-text/60 text-text hover:bg-text hover:text-white"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
