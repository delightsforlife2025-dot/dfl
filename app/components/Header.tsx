"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { getNavItems, getSiteSetting } from "@/lib/api";
import { asGeneralSiteSettings, type NavItem } from "@/lib/types";

const FALLBACK_NAV: NavItem[] = [
  {
    id: "nav-fallback-home",
    label: "Ana Sayfa",
    href: "/",
    position: 0,
    visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "nav-fallback-menu",
    label: "Menü",
    href: "/menu",
    position: 10,
    visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "nav-fallback-contact",
    label: "İletişim",
    href: "/contact",
    position: 30,
    visible: true,
    created_at: "",
    updated_at: "",
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [siteName, setSiteName] = useState("Restaurant");
  const [logoUrl, setLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const displayNav = useMemo(
    () => (navItems.length > 0 ? navItems : FALLBACK_NAV),
    [navItems]
  );

  useEffect(() => {
    async function fetchData() {
      const [nav, generalSettings] = await Promise.all([
        getNavItems(),
        getSiteSetting("general_settings"),
      ]);
      setNavItems(nav);
      const g = asGeneralSiteSettings(generalSettings);
      if (g?.site_name) setSiteName(g.site_name);
      if (g?.logo_url) setLogoUrl(g.logo_url);
      setIsLoading(false);
    }

    fetchData();

    const handler = () => {
      fetchData();
    };

    window.addEventListener("site-settings-updated", handler as EventListener);

    return () => {
      window.removeEventListener("site-settings-updated", handler as EventListener);
    };
  }, []);

  const linkClass =
    "text-sm font-semibold text-[#2a1a00] transition-colors hover:text-primary";

  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-[#e8c44a] bg-[#f5bf00]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <div className="size-6 animate-pulse rounded bg-[#e8c44a]" />
            <div className="h-6 w-24 animate-pulse rounded bg-[#e8c44a]" />
          </div>
          <div className="hidden flex-1 justify-center gap-8 md:flex">
            <div className="flex items-center gap-9">
              <div className="h-4 w-12 animate-pulse rounded bg-[#e8c44a]" />
              <div className="h-4 w-16 animate-pulse rounded bg-[#e8c44a]" />
              <div className="h-4 w-20 animate-pulse rounded bg-[#e8c44a]" />
            </div>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-8 w-8 animate-pulse rounded bg-[#e8c44a]" />
            <div className="h-8 w-20 animate-pulse rounded bg-primary" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e8c44a] bg-[#f5bf00]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center">
          {logoUrl ? (
            <div className="relative h-12 w-auto sm:h-14 md:h-16 lg:h-[4.5rem]">
              <Image
                src={logoUrl}
                alt={siteName}
                width={280}
                height={112}
                className="h-full w-auto max-w-[200px] object-contain sm:max-w-[240px] md:max-w-none"
                priority
              />
            </div>
          ) : (
            <div className="size-12 text-primary sm:size-14 md:size-16">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
              </svg>
            </div>
          )}
          <span className="sr-only">{siteName}</span>
        </Link>

        {/* Desktop: center nav */}
        <nav className="hidden min-w-0 flex-1 justify-center gap-6 md:flex lg:gap-10" aria-label="Ana navigasyon">
          {displayNav.map((item) => (
            <Link key={item.id} className={linkClass} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop: always-visible Menü + İletişim */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Link
            href="/menu"
            className="rounded-full border-2 border-[#8f4800] bg-white/90 px-4 py-2 text-sm font-bold text-[#8f4800] shadow-sm transition hover:bg-primary hover:text-white"
          >
            Menü
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
          >
            İletişim
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/menu"
            className="rounded-full border-2 border-[#8f4800] bg-white/90 px-3 py-1.5 text-xs font-bold text-[#8f4800]"
          >
            Menü
          </Link>
          <button
            type="button"
            aria-label={open ? "Kapat" : "Menüyü aç"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-[#2a1a00] transition-colors hover:bg-[#e8c44a]/60"
          >
            {open ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <Link
            href="/contact"
            className="flex h-8 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-2 text-xs font-bold text-white hover:bg-primary-dark"
          >
            Rezervasyon
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#e8c44a] bg-[#f5bf00] md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-10">
            <nav className="flex flex-col gap-1" aria-label="Mobil menü">
              {displayNav.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-semibold text-[#2a1a00] hover:bg-[#fff9e6]"
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
