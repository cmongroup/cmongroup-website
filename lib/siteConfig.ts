export const siteConfig = {
  website: {
    meta: {
      title: "c mon group — Design • F&B Rebranding • Electromechanical",
      description:
        "c mon group unites three specialized companies: c mon design (interior design, contracting, consulting), rebred (F&B brand architecture, rebranding, marketing, franchising), and GMEP (electromechanical services & contracting).",
      keywords: [
        "c mon group",
        "c mon design",
        "rebred",
        "GMEP",
        "interior design",
        "contracting",
        "consulting",
        "F&B design",
        "rebranding",
        "marketing strategy",
        "franchising",
        "electromechanical",
        "MEP contracting",
      ],
      author: "c mon group",
      year: 2025,
      openGraph: {
        type: "website",
        title: "c mon group",
        description:
          "Design, F&B brand systems, and MEP contracting under one roof.",
        image: "/assets/og/cmon-group.jpg",
        url: "https://cmon.group",
      },
      favicon: "/logo.png",
      themeColor: "#b89f6b",
    },
    styles: {
      colors: {
        background: "#ececec",
        surface: "#ffffff",
        text: "#0e0e0e",
        muted: "#4a4a4a",
        accent: "#b89f6b",
        accentDark: "#9c875b",
        black: "#000000",
        white: "#ffffff",
      },
      typography: {
        heading: ["Canela, 'Cormorant Garamond', Georgia, serif"],
        body: ["Inter, 'Helvetica Neue', Arial, sans-serif"],
        weights: { regular: 400, medium: 500, semibold: 600 },
        scale: {
          h1: "clamp(40px,4vw,72px)",
          h2: "clamp(28px,3vw,48px)",
          h3: "clamp(20px,2.4vw,28px)",
          body: "clamp(14px,1.1vw,18px)",
        },
        tracking: { tight: "-0.01em", normal: "0", wide: "0.02em" },
      },
      layout: {
        container: "max-w-container",
        gutter: "clamp(16px,3vw,40px)",
        radius: { pill: "9999px", xl: "24px", lg: "16px" },
        shadow: {
          soft: "0 10px 30px rgba(0,0,0,0.08)",
          hard: "0 8px 20px rgba(0,0,0,0.12)",
        },
      },
      buttons: {
        primary: {
          bg: "#000000",
          fg: "#ffffff",
          radius: "9999px",
          px: "28px",
          py: "14px",
        },
        ghost: {
          bg: "transparent",
          fg: "#0e0e0e",
          border: "1px solid #0e0e0e",
          radius: "9999px",
          px: "22px",
          py: "12px",
        },
        accent: {
          bg: "#b89f6b",
          fg: "#0e0e0e",
          radius: "9999px",
          px: "24px",
          py: "12px",
        },
      },
    },
    header: {
      brand: {
        text: "c mon group",
        logoSrc: "/logo.png",
        alt: "c mon group logo",
        route: "/",
      },
      nav: [
        { title: "Home", route: "/" },
        { title: "Services", route: "/#services" },
        {
          title: "Companies",
          route: "#",
          children: [
            { title: "c mon design", route: "/companies/cmon-design" },
            { title: "rebred", route: "/companies/rebred" },
            { title: "GMEP", route: "/companies/gmep" },
          ],
        },
        { title: "About", route: "/about" },
        { title: "Contact", route: "/contact" },
      ],
      cta: { title: "Book now", route: "/contact", variant: "primary" },
      style: { sticky: true, background: "transparent", blend: "light" },
    },
    hero: {
      id: "hero",
      layout: "two-column",
      background: { color: "#ececec" },
      left: {
        eyebrow: {
          text: "c mon group",
          style: { color: "#b89f6b", weight: 600, letterSpacing: "0.08em" },
        },
        heading: "Elevate Your Space with Bespoke Interior Design",
        subtext:
          "We unite interior architecture, brand strategy for F&B, and electromechanical execution. One group. Three expert companies. End-to-end delivery from concept to commissioning.",
        actions: [
          { title: "Learn more", route: "/#services", variant: "primary" },
          { title: "What we deliver", route: "/#services", variant: "ghost" },
        ],
      },
      right: {
        image: {
          src: "/images/hero/hero-main.jpeg",
          alt: "Refined interior space hero image",
          ratio: "3:4",
          style: { radius: "24px", shadow: "soft", objectFit: "cover" },
        },
      },
    },
    sections: [
      {
        id: "companies",
        type: "cards-grid",
        presentation: "slider",
        animation: {
          intervalMs: 5000,
          axis: "x",
          visible: 3,
          focusIndex: 1,
          scale: { inactive: 0.9, active: 1.05 },
          depth: { inactiveZ: 0, activeZ: 50 },
          transition: { durationMs: 600, easing: [0.4, 0.0, 0.2, 1] },
        },
        title: "Our Companies",
        columns: 3,
        cards: [
          {
            slug: "cmon-design",
            brand: { name: "c mon design", logo: null, accent: "#0e0e0e" },
            tagline: "Interior Design • Build",
            summary: "Complete interior projects from design to delivery.",
            services: [
              "Interior design",
              "Technical drawings",
              "Construction",
              "Consulting",
            ],
            media: {
              cover: "/images/companies/cmon-design-cover.jpg",
              alt: "Interior design moodboard and materials",
            },
            actions: [
              {
                title: "Learn More",
                route: "/companies/cmon-design",
                variant: "accent",
              },
              {
                title: "Book consultation",
                route: "/contact?topic=design-consultation",
                variant: "ghost",
              },
            ],
          },
          {
            slug: "rebred",
            brand: { name: "rebred", logo: null, accent: "#b89f6b" },
            tagline: "F&B Branding • Marketing",
            summary: "Restaurant brands that scale and sell.",
            services: [
              "Brand strategy",
              "Menu design",
              "Marketing campaigns",
              "Franchise systems",
            ],
            media: {
              cover: "/images/companies/rebred-cover.jpg",
              alt: "F&B brand assets and packaging on table",
            },
            actions: [
              {
                title: "Learn More",
                route: "/companies/rebred",
                variant: "accent",
              },
              {
                title: "Request brand audit",
                route: "/contact?topic=brand-audit",
                variant: "ghost",
              },
            ],
          },
          {
            slug: "gmep",
            brand: { name: "GMEP", logo: null, accent: "#3a3a3a" },
            tagline: "MEP Engineering • Installation",
            summary: "Building systems that work perfectly.",
            services: [
              "MEP design",
              "HVAC & electrical",
              "Installation",
              "Commissioning",
            ],
            media: {
              cover: "/images/companies/gmep-cover.jpg",
              alt: "MEP drawings and on-site coordination",
            },
            actions: [
              {
                title: "Learn More",
                route: "/companies/gmep",
                variant: "accent",
              },
              {
                title: "Request a quote",
                route: "/contact?topic=gmep-quote",
                variant: "ghost",
              },
            ],
          },
        ],
      },
      {
        id: "services",
        type: "tabs",
        title: "What we deliver",
        tabs: [
          {
            label: "Design",
            content: {
              bullets: [
                "Concept, schematic, design development",
                "Material libraries & supplier orchestration",
                "3D visualization & mood narratives",
                "Tender packages & BOQs",
              ],
              cta: {
                title: "Start a design brief",
                route: "/contact?topic=design-brief",
                variant: "primary",
              },
            },
          },
          {
            label: "Brand & F&B",
            content: {
              bullets: [
                "Positioning, naming, visual identity",
                "Menu engineering & customer journey",
                "Launch campaigns & content systems",
                "Franchise manuals & ops SOPs",
              ],
              cta: {
                title: "Request brand workshop",
                route: "/contact?topic=brand-workshop",
                variant: "primary",
              },
            },
          },
          {
            label: "MEP & Build",
            content: {
              bullets: [
                "Shop drawings & authority approvals",
                "HVAC, power, plumbing & ELV systems",
                "On-site coordination & supervision",
                "Testing, commissioning & maintenance",
              ],
              cta: {
                title: "Discuss MEP scope",
                route: "/contact?topic=mepscope",
                variant: "primary",
              },
            },
          },
        ],
      },
      {
        id: "cta-band",
        type: "cta",
        theme: "accent",
        heading: "One team from vision to handover.",
        text: "Tell us about your space or brand and we’ll assemble the right team across design, branding, and MEP to deliver end-to-end.",
        actions: [
          {
            title: "Book a discovery call",
            route: "/contact?topic=discovery-call",
            variant: "black",
          },
          {
            title: "Send your RFP",
            route: "/contact?topic=rfp",
            variant: "ghost",
          },
        ],
      },
    ],
    footer: {
      columns: [
        {
          title: "c mon group",
          items: [
            {
              type: "text",
              value: "Design • F&B Rebranding • Electromechanical",
            },
            { type: "link", label: "About", route: "/about" },
          ],
        },
        {
          title: "Companies",
          items: [
            {
              type: "link",
              label: "c mon design",
              route: "/companies/cmon-design",
            },
            { type: "link", label: "rebred", route: "/companies/rebred" },
            { type: "link", label: "GMEP", route: "/companies/gmep" },
          ],
        },
        {
          title: "Contact",
          items: [
            { type: "link", label: "Book now", route: "/contact" },
            {
              type: "link",
              label: "hello@cmon.group",
              route: "mailto:hello@cmon.group",
            },
            {
              type: "link",
              label: "+961 00 000 000",
              route: "tel:+96100000000",
            },
          ],
        },
      ],
      bottom: {
        legal: "© 2025 c mon group. All rights reserved.",
      },
    },
    routes: [
      {
        path: "/companies/cmon-design",
        meta: {
          title: "c mon design — Interior Design Studio",
          description: "Bespoke interiors, contracting, and consulting.",
        },
        hero: {
          heading: "c mon design",
          subtext: "Interior Design Studio — Contracting & Consulting",
          image: "/images/companies/cmon-design-cover.jpg",
        },
        modules: [
          {
            type: "services-list",
            items: [
              "Interior architecture & FF&E",
              "Detailing & specifications",
              "Contracting & supervision",
              "Design consulting",
            ],
          },
          {
            type: "cta",
            heading: "Start your project",
            action: {
              title: "Book consultation",
              route: "/contact?topic=design-consultation",
            },
          },
        ],
      },
      {
        path: "/companies/rebred",
        meta: {
          title: "rebred — F&B Design & Rebranding",
          description:
            "Brand systems, spatial branding, marketing strategies, and franchising.",
        },
        hero: {
          heading: "rebred",
          subtext: "F&B Design • Rebranding • Marketing • Franchising",
          image: "/images/companies/rebred-cover.jpg",
        },
        modules: [
          {
            type: "services-list",
            items: [
              "Brand strategy & identity",
              "Menu & concept design",
              "Campaigns & content",
              "Franchise playbooks",
            ],
          },
          {
            type: "cta",
            heading: "Request a brand audit",
            action: {
              title: "Get started",
              route: "/contact?topic=brand-audit",
            },
          },
        ],
      },
      {
        path: "/companies/gmep",
        meta: {
          title: "GMEP — Electromechanical Services",
          description: "MEP design, installation, testing & commissioning.",
        },
        hero: {
          heading: "GMEP",
          subtext: "Electromechanical Services & Contracting",
          image: "/images/companies/gmep-cover.jpg",
        },
        modules: [
          {
            type: "services-list",
            items: [
              "MEP design & shop drawings",
              "HVAC • Electrical • Plumbing",
              "ELV & controls",
              "Commissioning & handover",
            ],
          },
          {
            type: "cta",
            heading: "Have a scope to price?",
            action: {
              title: "Request a quote",
              route: "/contact?topic=gmep-quote",
            },
          },
        ],
      },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type WebsiteConfig = typeof siteConfig.website;
export type HeroConfig = typeof siteConfig.website.hero;
export type Section = (typeof siteConfig.website.sections)[number];
export type Action = { title: string; route: string; variant: string };
