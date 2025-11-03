"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSiteSetting } from "@/lib/api";

interface DashboardSidebarProps {
  activePage?: "dashboard" | "menu" | "categories" | "messages" | "settings";
  unreadCount?: number;
}

export default function DashboardSidebar({ activePage = "dashboard", unreadCount = 0 }: DashboardSidebarProps) {
  const router = useRouter();
  const [siteName, setSiteName] = useState("Restaurant");
  const [logoUrl, setLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const generalSettings = await getSiteSetting("general_settings");
      if (generalSettings) {
        if (generalSettings.site_name) setSiteName(generalSettings.site_name);
        if (generalSettings.logo_url) setLogoUrl(generalSettings.logo_url);
      }
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
      <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hidden lg:flex">
        <div className="flex h-full min-h-0 flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            {/* Logo skeleton */}
            <div className="flex items-center gap-3 p-2">
              <div className="size-8 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
            </div>
            {/* Nav skeleton */}
            <div className="flex flex-col gap-2 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-border-light dark:bg-border-dark rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hidden lg:flex">
      <div className="flex h-full min-h-0 flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 p-2">
            {logoUrl ? (
              <div className="relative h-8 w-auto">
                <Image 
                  src={logoUrl} 
                  alt={siteName}
                  width={96}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
              </div>
            ) : (
              <span className="material-symbols-outlined text-primary text-3xl">ramen_dining</span>
            )}
            <h1 className="text-text-light dark:text-text-dark text-lg font-bold">{siteName}</h1>
          </Link>

          {/* Navigation */}
          <div className="flex flex-col gap-2 pt-4">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "dashboard"
                  ? "bg-primary/10 dark:bg-primary/20"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "dashboard" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"
              }`}>
                dashboard
              </span>
              <p className={`text-sm font-${activePage === "dashboard" ? "semibold" : "medium"} leading-normal ${
                activePage === "dashboard" ? "text-primary" : "text-text-light dark:text-text-dark"
              }`}>
                Genel Bakış
              </p>
            </Link>

            <Link
              href="/dashboard/menu"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "menu"
                  ? "bg-primary/10 dark:bg-primary/20"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "menu" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"
              }`}>
                restaurant_menu
              </span>
              <p className={`text-sm font-${activePage === "menu" ? "semibold" : "medium"} leading-normal ${
                activePage === "menu" ? "text-primary" : "text-text-light dark:text-text-dark"
              }`}>
                Menü Yönetimi
              </p>
            </Link>

            <Link
              href="/dashboard/categories"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "categories"
                  ? "bg-primary/10 dark:bg-primary/20"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "categories" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"
              }`}>
                category
              </span>
              <p className={`text-sm font-${activePage === "categories" ? "semibold" : "medium"} leading-normal ${
                activePage === "categories" ? "text-primary" : "text-text-light dark:text-text-dark"
              }`}>
                Kategoriler
              </p>
            </Link>

            <Link
              href="/dashboard/messages"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "messages"
                  ? "bg-primary/10 dark:bg-primary/20"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "messages" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"
              }`}>
                inbox
              </span>
              <div className="flex items-center justify-between flex-1">
                <p className={`text-sm font-${activePage === "messages" ? "semibold" : "medium"} leading-normal ${
                  activePage === "messages" ? "text-primary" : "text-text-light dark:text-text-dark"
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
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                activePage === "settings"
                  ? "bg-primary/10 dark:bg-primary/20"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <span className={`material-symbols-outlined ${
                activePage === "settings" ? "text-primary" : "text-text-secondary-light dark:text-text-secondary-dark"
              }`}>
                settings
              </span>
              <p className={`text-sm font-${activePage === "settings" ? "semibold" : "medium"} leading-normal ${
                activePage === "settings" ? "text-primary" : "text-text-light dark:text-text-dark"
              }`}>
                Ayarlar
              </p>
            </Link>
          </div>
        </div>

        {/* User section */}
        <div className="flex flex-col gap-2 pt-4 border-t border-border-light dark:border-border-dark">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
              open_in_new
            </span>
            <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal">
              Siteyi Görüntüle
            </p>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left w-full"
          >
            <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
              logout
            </span>
            <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal">Çıkış Yap</p>
          </button>
        </div>
      </div>
    </aside>
  );
}
