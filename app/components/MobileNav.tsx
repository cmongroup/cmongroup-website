"use client";

import React from "react";
import Link from "next/link";

interface NavItem {
  readonly title: string;
  readonly route: string;
  readonly children?: readonly NavItem[];
}

interface Header {
  readonly nav: readonly NavItem[];
  readonly cta: {
    readonly title: string;
    readonly route: string;
  };
}

interface MobileNavProps {
  header: Header;
  onLoginClick: () => void;
  isAdmin: boolean;
  onLogout: () => Promise<void>;
}

export default function MobileNav({
  header,
  onLoginClick,
  isAdmin,
  onLogout,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 flex flex-col justify-center items-center"
        aria-label="Toggle navigation menu"
      >
        <span
          className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
            isOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
          }`}
        />
        <span
          className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
            isOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ease-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Container */}
        <div
          className={`absolute top-0 left-0 right-0 bg-white shadow-xl transform transition-all duration-300 ease-out ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-accent/20">
            <div className="flex items-center justify-between">
              <div className="text-accent font-heading text-xl font-medium tracking-wide">
                Menu
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent/20 transition-colors"
                aria-label="Close navigation menu"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-6 space-y-3">
            {header.nav.map((item) => (
              <div key={item.title}>
                {item.children ? (
                  <div className="space-y-2">
                    <div className="block w-full p-4 rounded-xl bg-accent/5 border border-accent/10">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-text">
                          {item.title}
                        </span>
                        <svg
                          className="w-4 h-4 text-muted"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.route}
                          onClick={() => setIsOpen(false)}
                          className="block w-full p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors border border-accent/10 hover:border-accent/20"
                        >
                          <span className="text-sm font-medium text-text group-hover:text-accent transition-colors">
                            {child.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.route}
                    onClick={() => setIsOpen(false)}
                    className="block w-full p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors border border-accent/10 hover:border-accent/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-text group-hover:text-accent transition-colors">
                        {item.title}
                      </span>
                      <svg
                        className="w-4 h-4 text-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="p-6 border-t border-accent/20 bg-accent/5">
            <div className="text-center space-y-3">
              {isAdmin ? (
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full border border-accent/20 bg-accent/5 text-accent font-medium py-3 px-6 rounded-2xl hover:bg-accent hover:text-text transition-colors"
                >
                  Exit Admin
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsOpen(false);
                  }}
                  className="hidden md:block w-full border border-accent/20 bg-accent/5 text-accent font-medium py-3 px-2 rounded-2xl hover:bg-accent hover:text-text transition-colors"
                >
                  Sign In
                </button>
              )}
              <div>
                <p className="text-sm text-muted mb-3">Ready to get started?</p>
                <Link
                  href={header.cta.route}
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-accent text-text font-medium py-3 px-6 rounded-2xl hover:bg-accent-dark transition-colors shadow-sm"
                >
                  {header.cta.title}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
