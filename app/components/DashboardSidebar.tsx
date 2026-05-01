"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSiteSetting } from "@/lib/api";
import { asGeneralSiteSettings } from "@/lib/types";

interface DashboardSidebarProps {
  activePage?: "dashboard" | "menu" | "categories" | "messages" | "comments" | "settings";
  unreadCount?: number;
}

export default function DashboardSidebar({ activePage = "dashboard", unreadCount = 0 }: DashboardSidebarProps) {
  const router = useRouter();
  const [siteName, setSiteName] = useState("Restaurant");
  const [logoUrl, setLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const g = asGeneralSiteSettings(await getSiteSetting("general_settings"));
      if (g?.site_name) setSiteName(g.site_name);
      if (g?.logo_url) setLogoUrl(g.logo_url);
      setIsLoading(false);
    }
    fetchSettings();

    const handler = () => {
      fetchSettings();
    };

    window.addEventListener('site-settings-updated', handler as EventListener);

    return () => {
      window.removeEventListener('site-settings-updated', handler as EventListener);
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  }

  if (isLoading) {
    return (
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border-light bg-white/95 shadow-sm backdrop-blur-sm lg:flex">
        <div className="flex h-full min-h-0 flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            {/* Logo skeleton */}
            <div className="flex items-center gap-3 p-2">
              <div className="size-8 animate-pulse rounded bg-border-light" />
              <div className="h-6 w-32 animate-pulse rounded bg-border-light" />
            </div>
            <div className="flex flex-col gap-2 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-border-light" />
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border-light bg-white/95 shadow-sm backdrop-blur-sm lg:flex">
      <div className="flex h-full min-h-0 flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 p-2">
            {logoUrl ? (
              <div className="relative h-8 w-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-8 w-auto object-contain"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <span className="material-symbols-outlined text-primary text-3xl">ramen_dining</span>
            )}
            <h1 className="text-text-light text-lg font-bold">{siteName}</h1>
          </Link>

          {/* Navigation */}
          <div className="flex flex-col gap-2 pt-4">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "dashboard"
                  ? "bg-primary/15"
                  : "hover:bg-[#2a1a00]/[0.06]"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "dashboard" ? "text-primary" : "text-subtle-light"
              }`}>
                dashboard
              </span>
              <p className={`text-sm font-${activePage === "dashboard" ? "semibold" : "medium"} leading-normal ${
                activePage === "dashboard" ? "text-primary" : "text-text-light"
              }`}>
                Genel Bakış
              </p>
            </Link>

            <Link
              href="/dashboard/menu"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "menu"
                  ? "bg-primary/15"
                  : "hover:bg-[#2a1a00]/[0.06]"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "menu" ? "text-primary" : "text-subtle-light"
              }`}>
                restaurant_menu
              </span>
              <p className={`text-sm font-${activePage === "menu" ? "semibold" : "medium"} leading-normal ${
                activePage === "menu" ? "text-primary" : "text-text-light"
              }`}>
                Menü Yönetimi
              </p>
            </Link>

            <Link
              href="/dashboard/categories"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "categories"
                  ? "bg-primary/15"
                  : "hover:bg-[#2a1a00]/[0.06]"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "categories" ? "text-primary" : "text-subtle-light"
              }`}>
                category
              </span>
              <p className={`text-sm font-${activePage === "categories" ? "semibold" : "medium"} leading-normal ${
                activePage === "categories" ? "text-primary" : "text-text-light"
              }`}>
                Kategoriler
              </p>
            </Link>

            <Link
              href="/dashboard/messages"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "messages"
                  ? "bg-primary/15"
                  : "hover:bg-[#2a1a00]/[0.06]"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "messages" ? "text-primary" : "text-subtle-light"
              }`}>
                inbox
              </span>
              <div className="flex items-center justify-between flex-1">
                <p className={`text-sm font-${activePage === "messages" ? "semibold" : "medium"} leading-normal ${
                  activePage === "messages" ? "text-primary" : "text-text-light"
                }`}>
                  Mesajlar
                </p>
                {unreadCount > 0 && (
                  <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </div>
            </Link>

            <Link
              href="/dashboard/comments"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "comments"
                  ? "bg-primary/15"
                  : "hover:bg-[#2a1a00]/[0.06]"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "comments" ? "text-primary" : "text-subtle-light"
              }`}>
                comment
              </span>
              <p className={`text-sm font-${activePage === "comments" ? "semibold" : "medium"} leading-normal ${
                activePage === "comments" ? "text-primary" : "text-text-light"
              }`}>
                Yorumlar
              </p>
            </Link>

            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "settings"
                  ? "bg-primary/15"
                  : "hover:bg-[#2a1a00]/[0.06]"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "settings" ? "text-primary" : "text-subtle-light"
              }`}>
                settings
              </span>
              <p className={`text-sm font-${activePage === "settings" ? "semibold" : "medium"} leading-normal ${
                activePage === "settings" ? "text-primary" : "text-text-light"
              }`}>
                Ayarlar
              </p>
            </Link>
          </div>
        </div>

        {/* User section */}
        <div className="flex flex-col gap-2 border-t border-border-light pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#2a1a00]/[0.06]"
          >
            <span className="material-symbols-outlined text-subtle-light">
              open_in_new
            </span>
            <p className="text-text-light text-sm font-medium leading-normal">
              Siteyi Görüntüle
            </p>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-[#2a1a00]/[0.06]"
          >
            <span className="material-symbols-outlined text-subtle-light">
              logout
            </span>
            <p className="text-text-light text-sm font-medium leading-normal">Çıkış Yap</p>
          </button>
        </div>
      </div>
    </aside>
  );
}
