"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getNavItems, getSiteSetting } from "@/lib/api";
import type { NavItem } from "@/lib/types";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [siteName, setSiteName] = useState("Restaurant");
  const [logoUrl, setLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [nav, generalSettings] = await Promise.all([
        getNavItems(),
        getSiteSetting('general_settings')
      ]);
      setNavItems(nav);
      if (generalSettings) {
        if (generalSettings.site_name) setSiteName(generalSettings.site_name);
        if (generalSettings.logo_url) setLogoUrl(generalSettings.logo_url);
      }
      setIsLoading(false);
    }

    fetchData();

    const handler = () => {
      // re-fetch when settings updated elsewhere
      fetchData();
    };

    window.addEventListener('site-settings-updated', handler as EventListener);

    return () => {
      window.removeEventListener('site-settings-updated', handler as EventListener);
    };
  }, []);

  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 sm:px-6 lg:px-10 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="size-6 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
          </div>

          {/* Desktop nav skeleton */}
          <div className="hidden md:flex flex-1 justify-center gap-8">
            <div className="flex items-center gap-9">
              <div className="h-4 w-12 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
            </div>
          </div>

          {/* Mobile skeleton */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-primary rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 sm:px-6 lg:px-10 py-3 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center">
          {logoUrl ? (
            <div className="relative h-28 w-auto md:h-32 lg:h-36">
              <Image 
                src={logoUrl} 
                alt={siteName}
                width={360}
                height={144}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          ) : (
            <div className="size-20 text-primary md:size-24 lg:size-28">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
              </svg>
            </div>
          )}
          <span className="sr-only">{siteName}</span>
        </Link>

        {/* Desktop nav (centered) */}
        <div className="hidden md:flex flex-1 justify-center gap-8">
          <div className="flex items-center gap-9">
            {navItems.map((item) => (
              <Link
                key={item.id}
                className="text-sm font-medium leading-normal hover:text-primary transition-colors"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile: hamburger button + reservations */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            aria-label={open ? "Kapat" : "Menüyü aç"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md hover:bg-border-light dark:hover:bg-border-dark transition-colors"
          >
            {open ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <Link href="/contact" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-3 bg-primary text-text-light text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
            Rezervasyon
          </Link>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-surface-light dark:hover:bg-surface-dark"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
