"use client";

import { siteConfig } from "@/lib/siteConfig";
import Link from "next/link";
import Image from "next/image";
import { useContent } from "@/app/contexts/ContentContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useState, useEffect } from "react";

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

// Custom EditableText component for companies page
function CompaniesPageEditableText({
  path,
  children,
  className = "",
  siteConfigData,
}: {
  path: string;
  children: React.ReactNode;
  className?: string;
  siteConfigData?: any;
}) {
  const { isAdmin } = useAuth();
  const { updateCompaniesPageText, companiesPageContent } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(children as string);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setText(children as string);
  }, [children]);

  const handleDoubleClick = () => {
    if (isAdmin) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (text.trim() === "") return;

    setIsLoading(true);
    try {
      // Special handling for services array updates
      if (path.includes(".services.")) {
        // Extract company slug and service index from path
        const pathParts = path.split(".");
        const companySlug = pathParts[1];
        const serviceIndex = parseInt(pathParts[3]);

        // Get current services array for this company with fallback
        let currentServices =
          companiesPageContent?.companies[companySlug]?.services;

        // Validate that currentServices is an array, if not use fallback from siteConfig
        if (!Array.isArray(currentServices)) {
          // Find the company in siteConfig as fallback
          const fallbackCompany = siteConfigData?.website?.sections
            ?.find((section: any) => section.type === "cards-grid")
            ?.cards?.find((card: any) => card.slug === companySlug);
          currentServices = fallbackCompany?.services || [];
        }

        // Create new services array with updated value
        const newServices = [...(currentServices || [])];
        newServices[serviceIndex] = text;

        // Update the entire services array
        await updateCompaniesPageText(
          `companies.${companySlug}.services`,
          newServices
        );
      } else {
        // Normal text update
        await updateCompaniesPageText(path, text);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating companies page text:", error);
      setText(children as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setText(children as string);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isAdmin) {
    return <span className={className}>{children}</span>;
  }

  if (isEditing) {
    return (
      <div className="relative border-2 border-accent rounded-lg p-2 bg-white">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border border-accent/20 rounded-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm"
          placeholder="Enter text"
          autoFocus
        />

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-3 py-1 bg-accent text-text rounded text-xs hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 border border-accent/20 text-accent rounded text-xs hover:bg-accent/10 transition-colors"
          >
            Cancel
          </button>
        </div>

        {isLoading && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className={`${className} cursor-pointer hover:bg-accent/30 hover:border-2 hover:border-accent/60 hover:shadow-md rounded px-2 py-1 transition-all duration-200 relative group`}
      title="Double-click to edit"
    >
      {children}
      <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/80 rounded transition-all duration-200 pointer-events-none opacity-0 group-hover:opacity-100"></div>
    </span>
  );
}

// Custom EditableImage component for companies page
function CompaniesPageEditableImage({
  companySlug,
  path,
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
}: {
  companySlug: string;
  path: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const { isAdmin } = useAuth();
  const { updateCompaniesPageImage } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [imageAlt, setImageAlt] = useState(alt);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (isAdmin) {
      setError(null);
      // Create a file input and trigger it
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          handleFileSelect(file);
        }
      };
      input.click();
    }
  };

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        setImageSrc(dataUrl);
        setIsEditing(true);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError("Error processing image");
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!imageSrc.trim()) return;

    setIsLoading(true);
    try {
      await updateCompaniesPageImage(companySlug, path, imageSrc);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating companies page image:", error);
      setError("Failed to save image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setImageSrc(src);
    setImageAlt(alt);
    setIsEditing(false);
    setError(null);
  };

  if (!isAdmin) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  if (isEditing) {
    return (
      <div className="relative border-2 border-accent rounded-lg p-4 bg-white">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-accent mb-2">
              Image Alt Text
            </label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="Enter alt text"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-accent text-text rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-accent/20 text-accent rounded-lg hover:bg-accent/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-accent rounded-full animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} cursor-pointer`}
        onClick={handleClick}
      />
      <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none border-2 border-transparent group-hover:border-accent/60">
        <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg text-sm font-medium text-text text-center shadow-lg border border-accent/20">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Click to change image</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Max 5MB, will be compressed
          </div>
        </div>
      </div>
    </div>
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

  const { companiesPageContent, companiesPageImages, isLoading } = useContent();

  // Make siteConfig available to child components
  const siteConfigData = siteConfig;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
              <div className="h-16 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-2xl mx-auto"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <CompaniesPageEditableText
              path="header.badge"
              className=""
              siteConfigData={siteConfigData}
            >
              {companiesPageContent?.header.badge || "Our Companies"}
            </CompaniesPageEditableText>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl leading-tight tracking-tight mb-6">
            <CompaniesPageEditableText
              path="header.title"
              className=""
              siteConfigData={siteConfigData}
            >
              {companiesPageContent?.header.title ||
                "Three companies, one vision"}
            </CompaniesPageEditableText>
          </h1>
          <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
            <CompaniesPageEditableText
              path="header.description"
              className=""
              siteConfigData={siteConfigData}
            >
              {companiesPageContent?.header.description ||
                "We unite interior architecture, brand strategy for F&B, and electromechanical execution. One group. Three expert companies. End-to-end delivery from concept to commissioning."}
            </CompaniesPageEditableText>
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
                    <CompaniesPageEditableImage
                      companySlug="companies-page"
                      path={`${card.slug}.coverSrc`}
                      src={
                        companiesPageImages?.[card.slug]?.coverSrc ||
                        card.media.cover
                      }
                      alt={
                        companiesPageImages?.[card.slug]?.coverAlt ||
                        card.media.alt
                      }
                      width={800}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      <CompaniesPageEditableText
                        path={`companies.${card.slug}.tagline`}
                        className=""
                        siteConfigData={siteConfigData}
                      >
                        {companiesPageContent?.companies[card.slug]?.tagline ||
                          card.tagline}
                      </CompaniesPageEditableText>
                    </div>
                    <h2 className="font-heading text-3xl lg:text-4xl text-text leading-tight">
                      <CompaniesPageEditableText
                        path={`companies.${card.slug}.brandName`}
                        className=""
                        siteConfigData={siteConfigData}
                      >
                        {companiesPageContent?.companies[card.slug]
                          ?.brandName || card.brand.name}
                      </CompaniesPageEditableText>
                    </h2>
                    <p className="text-lg text-muted leading-relaxed">
                      <CompaniesPageEditableText
                        path={`companies.${card.slug}.summary`}
                        className=""
                        siteConfigData={siteConfigData}
                      >
                        {companiesPageContent?.companies[card.slug]?.summary ||
                          card.summary}
                      </CompaniesPageEditableText>
                    </p>
                  </div>

                  {/* Services Description */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-text text-sm uppercase tracking-wide">
                      <CompaniesPageEditableText
                        path={`companies.${card.slug}.servicesLabel`}
                        className=""
                        siteConfigData={siteConfigData}
                      >
                        {companiesPageContent?.companies[card.slug]
                          ?.servicesLabel || "What we deliver"}
                      </CompaniesPageEditableText>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(companiesPageContent?.companies[card.slug]?.services &&
                      Array.isArray(
                        companiesPageContent.companies[card.slug].services
                      )
                        ? companiesPageContent.companies[card.slug].services
                        : card.services
                      ).map((service: string, serviceIndex: number) => (
                        <CompaniesPageEditableText
                          key={serviceIndex}
                          path={`companies.${card.slug}.services.${serviceIndex}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium"
                          siteConfigData={siteConfigData}
                        >
                          {service}
                        </CompaniesPageEditableText>
                      ))}
                    </div>
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
              <CompaniesPageEditableText
                path="cta.title"
                className=""
                siteConfigData={siteConfigData}
              >
                {companiesPageContent?.cta.title ||
                  "Ready to start your project?"}
              </CompaniesPageEditableText>
            </h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              <CompaniesPageEditableText
                path="cta.description"
                className=""
                siteConfigData={siteConfigData}
              >
                {companiesPageContent?.cta.description ||
                  "Whether you need interior design, F&B branding, or MEP services, we're here to help bring your vision to life."}
              </CompaniesPageEditableText>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                action={{
                  title:
                    companiesPageContent?.cta.primaryButton.title ||
                    "Get in Touch",
                  route:
                    companiesPageContent?.cta.primaryButton.route || "/contact",
                  variant: "primary",
                }}
              />
              <Button
                action={{
                  title:
                    companiesPageContent?.cta.secondaryButton.title ||
                    "View Services",
                  route:
                    companiesPageContent?.cta.secondaryButton.route ||
                    "/#services",
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
