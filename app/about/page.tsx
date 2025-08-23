import { siteConfig as _cfg } from "@/lib/siteConfig";
import Image from "next/image";

export const metadata = {
  title: "About — c mon group",
  description:
    "About c mon group: integrated interior design, F&B brand systems, and electromechanical services.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Hero Section */}
      <section className="relative py-4">
        <div className="container mx-auto px-6 max-w-6xl relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none -z-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
          </div>

          {/* Header */}
          <div className="relative text-center space-y-6 mb-12 pb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              About Us
            </div>
            <div className="min-h-[1.2em] flex items-center justify-center">
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-tight bg-linear-to-r from-text via-text to-text/70 bg-clip-text text-transparent leading-[1.1] py-2">
                About c mon group
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              {_cfg.website.meta.description}
            </p>
          </div>

          {/* Mission Statement */}
          <div className="relative bg-surface rounded-3xl p-8 md:p-12 shadow-soft ring-1 ring-black/5 mb-16 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-accent via-accent/80 to-accent/60"></div>
            <div className="text-center space-y-6">
              <h2 className="font-heading text-2xl md:text-3xl text-text">
                Our Mission
              </h2>
              <p className="text-base md:text-lg text-muted leading-relaxed max-w-4xl mx-auto">
                We orchestrate{" "}
                <strong className="text-text font-semibold">
                  strategy, design, engineering and execution
                </strong>{" "}
                so clients move from idea to operating environment with one
                accountable team. Our integrated model reduces handover
                friction, accelerates timelines, and protects design & brand
                intent through build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 md:py-24 bg-surface/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Our Companies
            </div>
            <h2 className="font-heading text-3xl md:text-5xl tracking-tight bg-linear-to-r from-text to-text/70 bg-clip-text text-transparent py-2">
              Three specialist companies
            </h2>
            <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Each company brings specialized expertise while working seamlessly
              together
            </p>
          </div>

          <div className="grid gap-6 md:gap-8 md:grid-cols-3">
            {/* c mon design */}
            <div className="group bg-surface rounded-3xl p-8 shadow-soft ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-accent/20 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <span className="text-accent text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                    c
                  </span>
                </div>
                <h3 className="font-heading text-xl text-text group-hover:text-accent transition-colors duration-300">
                  c mon design
                </h3>
              </div>
              <p className="text-sm text-muted leading-relaxed group-hover:text-text/90 transition-colors duration-300">
                Interior design studio delivering concept through detailed
                documentation, contracting coordination and turnkey advisory.
              </p>
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-accent/10 transition-colors duration-300 pointer-events-none" />
            </div>

            {/* rebred */}
            <div className="group bg-surface rounded-3xl p-8 shadow-soft ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-accent/20 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <span className="text-accent text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                    r
                  </span>
                </div>
                <h3 className="font-heading text-xl text-text group-hover:text-accent transition-colors duration-300">
                  rebred
                </h3>
              </div>
              <p className="text-sm text-muted leading-relaxed group-hover:text-text/90 transition-colors duration-300">
                F&B brand architecture & rebranding: positioning, identity,
                spatial & packaging systems, launch campaigns and franchise
                readiness.
              </p>
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-accent/10 transition-colors duration-300 pointer-events-none" />
            </div>

            {/* GMEP */}
            <div className="group bg-surface rounded-3xl p-8 shadow-soft ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-accent/20 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <span className="text-accent text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                    G
                  </span>
                </div>
                <h3 className="font-heading text-xl text-text group-hover:text-accent transition-colors duration-300">
                  GMEP
                </h3>
              </div>
              <p className="text-sm text-muted leading-relaxed group-hover:text-text/90 transition-colors duration-300">
                Electromechanical engineering & contracting: MEP design,
                installations, testing, commissioning and lifecycle support.
              </p>
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-accent/10 transition-colors duration-300 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Integrated Section */}
      <section className="py-16 md:py-24 bg-surface/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Our Approach
            </div>

            <h2 className="font-heading text-3xl md:text-5xl tracking-tight bg-linear-to-r from-text to-text/70 bg-clip-text text-transparent py-2">
              Why integrated?
            </h2>

            <p className="text-lg md:text-xl text-muted leading-relaxed max-w-3xl mx-auto">
              Alignment across branding, spatial design, and
              mechanical/electrical decisions preserves narrative clarity while
              ensuring build feasibility and operational performance.
            </p>

            {/* Enhanced Benefits Grid */}
            <div className="grid gap-6 md:gap-8 md:grid-cols-3 pt-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-heading text-lg text-text">
                  Seamless Coordination
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  All disciplines work together from concept to completion
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-heading text-lg text-text">
                  Faster Delivery
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Reduced handover friction accelerates project timelines
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="font-heading text-lg text-text">
                  Design Integrity
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Brand and design intent preserved through construction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
