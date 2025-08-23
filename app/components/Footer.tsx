"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useContent } from "@/app/contexts/ContentContext";
import EditableFooterText from "@/app/components/EditableFooterText";

export default function Footer() {
  const { footerContent, isLoading } = useContent();
  const [localLoading, setLocalLoading] = useState(false);
  
  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timer);
    } else {
      setLocalLoading(false);
    }
  }, [isLoading]);
  
  // Use local loading state to prevent getting stuck
  const isActuallyLoading = isLoading && localLoading;

  // Show loading state while content is being fetched
  if (isActuallyLoading) {
    return (
      <footer className="mt-16 border-t border-black/5 text-sm text-muted/90">
        <div className="mx-auto max-w-container px-6 py-12 grid gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <div className="w-20 h-4 bg-muted/20 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-32 h-3 bg-muted/20 rounded animate-pulse"></div>
              <div className="w-24 h-3 bg-muted/20 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-20 h-4 bg-muted/20 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-24 h-3 bg-muted/20 rounded animate-pulse"></div>
              <div className="w-20 h-3 bg-muted/20 rounded animate-pulse"></div>
              <div className="w-28 h-3 bg-muted/20 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-20 h-4 bg-muted/20 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-24 h-3 bg-muted/20 rounded animate-pulse"></div>
              <div className="w-32 h-3 bg-muted/20 rounded animate-pulse"></div>
              <div className="w-28 h-3 bg-muted/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="border-t border-black/5">
          <div className="mx-auto max-w-container px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-48 h-3 bg-muted/20 rounded animate-pulse"></div>
            <div className="w-24 h-3 bg-muted/20 rounded animate-pulse"></div>
          </div>
        </div>
      </footer>
    );
  }

  // Use footer content from Firebase if available, otherwise use default
  const footer = footerContent || {
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
            type: "text",
            value: "hello@cmon.group",
          },
          {
            type: "text",
            value: "+961 00 000 000",
          },
        ],
      },
    ],
    bottom: {
      legal: "© 2025 c mon group. All rights reserved.",
    },
  };

  // Ensure footer object exists and has the required structure
  if (
    !footer ||
    !footer.columns ||
    !Array.isArray(footer.columns) ||
    footer.columns.length < 3
  ) {
    return (
      <footer className="mt-16 border-t border-black/5 text-sm text-muted/90">
        <div className="mx-auto max-w-container px-6 py-12 text-center">
          <p>Footer content loading...</p>
        </div>
      </footer>
    );
  }

  // Ensure each column has the required items
  const [col1, col2, col3] = footer.columns;
  if (
    !col1?.items ||
    !col2?.items ||
    !col3?.items ||
    col1.items.length < 2 ||
    col2.items.length < 3 ||
    col3.items.length < 3
  ) {
    return (
      <footer className="mt-16 border-t border-black/5 text-sm text-muted/90">
        <div className="mx-auto max-w-container px-6 py-12 text-center">
          <p>Footer content structure invalid...</p>
        </div>
      </footer>
    );
  }

  // Ensure specific items exist and have required properties
  const col1Item0 = col1.items[0];
  const col1Item1 = col1.items[1];
  const col2Item0 = col2.items[0];
  const col2Item1 = col2.items[1];
  const col2Item2 = col2.items[2];
  const col3Item0 = col3.items[0];
  const col3Item1 = col3.items[1];
  const col3Item2 = col3.items[2];

  if (
    !col1Item0?.value ||
    !col1Item1?.label ||
    !col1Item1?.route ||
    !col2Item0?.label ||
    !col2Item0?.route ||
    !col2Item1?.label ||
    !col2Item1?.route ||
    !col2Item2?.label ||
    !col2Item2?.route ||
    !col3Item0?.label ||
    !col3Item0?.route ||
    !col3Item1?.value ||
    !col3Item2?.value
  ) {
    return (
      <footer className="mt-16 border-t border-black/5 text-sm text-muted/90">
        <div className="mx-auto max-w-container px-6 py-12 text-center">
          <p>Footer content items invalid...</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-16 border-t border-black/5 text-sm text-muted/90">
      <div className="mx-auto max-w-container px-6 py-12 grid gap-10 md:grid-cols-3">
        {/* Column 1: c mon group */}
        <div className="space-y-4">
          <h3 className="font-heading text-base text-text">
            <EditableFooterText path="columns.0.title">
              {col1.title}
            </EditableFooterText>
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <EditableFooterText path="columns.0.items.0.value">
                {col1Item0.value}
              </EditableFooterText>
            </li>
            <li>
              <Link
                href={col1Item1.route}
                className="hover:text-accent transition-colors"
              >
                {col1Item1.label}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Companies */}
        <div className="space-y-4">
          <h3 className="font-heading text-base text-text">
            <EditableFooterText path="columns.1.title">
              {col2.title}
            </EditableFooterText>
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link
                href={col2Item0.route}
                className="hover:text-accent transition-colors"
              >
                {col2Item0.label}
              </Link>
            </li>
            <li>
              <Link
                href={col2Item1.route}
                className="hover:text-accent transition-colors"
              >
                {col2Item1.label}
              </Link>
            </li>
            <li>
              <Link
                href={col2Item2.route}
                className="hover:text-accent transition-colors"
              >
                {col2Item2.label}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="space-y-4">
          <h3 className="font-heading text-base text-text">
            <EditableFooterText path="columns.2.title">
              {col3.title}
            </EditableFooterText>
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link
                href={col3Item0.route}
                className="hover:text-accent transition-colors"
              >
                {col3Item0.label}
              </Link>
            </li>
            <li>
              <EditableFooterText path="columns.2.items.1.value">
                {col3Item1.value}
              </EditableFooterText>
            </li>
            <li>
              <EditableFooterText path="columns.2.items.2.value">
                {col3Item2.value}
              </EditableFooterText>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-black/5">
        <div className="mx-auto max-w-container px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs">
            <EditableFooterText path="bottom.legal">
              {footer.bottom.legal}
            </EditableFooterText>
          </p>
          <span className="opacity-60">c mon group</span>
        </div>
      </div>
    </footer>
  );
}
