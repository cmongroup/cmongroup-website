"use client";

import React from "react";
import Link from "next/link";
import MobileNav from "./MobileNav";
import LoginModal from "./LoginModal";
import AdminToolbar from "./AdminToolbar";
import { useAuth } from "@/app/contexts/AuthContext";

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
  readonly brand: {
    readonly text: string;
    readonly route: string;
  };
}

interface HeaderProps {
  header: Header;
}

export default function Header({ header }: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const { isAdmin, logout } = useAuth();

  return (
    <>
      <AdminToolbar />
      <header className="top-0 z-40 w-full sticky bg-background/70 backdrop-blur-sm border-b border-black/5">
        <div className="mx-auto flex items-center justify-between px-6 py-4 max-w-container">
          {/* Mobile Navigation - Left side */}
          <div className="md:hidden">
            <MobileNav
              header={header}
              onLoginClick={() => setIsLoginModalOpen(true)}
              isAdmin={isAdmin}
              onLogout={logout}
            />
          </div>

          {/* Desktop CTA - Left side */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin ? (
              <button
                onClick={logout}
                className="rounded-full border border-accent/20 bg-accent/5 text-accent px-6 py-2 text-sm font-medium hover:bg-accent hover:text-text transition-colors"
              >
                Exit Admin
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="rounded-full border border-accent/20 bg-accent/5 text-accent px-6 py-2 text-sm font-medium hover:bg-accent hover:text-text transition-colors"
              >
                Sign In
              </button>
            )}
            <Link
              href={header.cta.route}
              className="rounded-full bg-black text-white px-6 py-2 text-sm font-medium hover:bg-accent hover:text-text transition-colors"
            >
              {header.cta.title}
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {header.nav.map((item: any) => {
              if (item.children?.length) {
                return (
                  <div key={item.title} className="relative group">
                    <Link
                      href={item.route}
                      className="hover:text-accent transition-colors inline-flex items-center gap-1"
                    >
                      {item.title}
                      <span className="mt-px text-[10px]">▾</span>
                    </Link>
                    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute left-0 top-full pt-3">
                      <div className="rounded-lg shadow-soft ring-1 ring-black/5 bg-surface min-w-[220px] p-2 flex flex-col">
                        {item.children.map((c: any) => (
                          <Link
                            key={c.route}
                            href={c.route}
                            className="px-3 py-2 rounded-md hover:bg-background/60 hover:text-accent text-[13px]"
                          >
                            {c.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.title}
                  href={item.route}
                  className="hover:text-accent transition-colors"
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Mobile CTA - Right side */}
          <div className="md:hidden">
            <Link
              href={header.cta.route}
              className="rounded-full bg-black text-white px-4 py-2 text-sm font-medium hover:bg-accent hover:text-text transition-colors"
            >
              {header.cta.title}
            </Link>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
