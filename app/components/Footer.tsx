"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSiteSetting } from "@/lib/api";
import {
  asContactInfo,
  asGeneralSiteSettings,
  type ContactInfo,
  type SocialLink,
} from "@/lib/types";

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [siteName, setSiteName] = useState("Restaurant");
  const [logoUrl, setLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [socialLinksData, contact, generalSettings] = await Promise.all([
        getSiteSetting("social_links"),
        getSiteSetting("contact_info"),
        getSiteSetting("general_settings"),
      ]);

      const socialArray: SocialLink[] = [];
      const now = new Date().toISOString();
      let id = 1;
      if (socialLinksData && typeof socialLinksData === "object" && !Array.isArray(socialLinksData)) {
        const s = socialLinksData as Record<string, string>;
        if (s.facebook)
          socialArray.push({
            id: String(id++),
            platform: "facebook",
            url: s.facebook,
            position: 1,
            created_at: now,
            updated_at: now,
          });
        if (s.instagram)
          socialArray.push({
            id: String(id++),
            platform: "instagram",
            url: s.instagram,
            position: 2,
            created_at: now,
            updated_at: now,
          });
        if (s.twitter)
          socialArray.push({
            id: String(id++),
            platform: "twitter",
            url: s.twitter,
            position: 3,
            created_at: now,
            updated_at: now,
          });
        if (s.youtube)
          socialArray.push({
            id: String(id++),
            platform: "youtube",
            url: s.youtube,
            position: 4,
            created_at: now,
            updated_at: now,
          });
      }

      setSocialLinks(socialArray);
      setContactInfo(asContactInfo(contact));

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

  if (isLoading) {
    return (
      <footer className="w-full bg-border-light">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-subtle-light sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="size-5 animate-pulse rounded bg-subtle-light" />
            <div className="h-4 w-32 animate-pulse rounded bg-subtle-light" />
          </div>
          <div className="mx-auto h-3 w-48 animate-pulse rounded bg-subtle-light" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-border-light">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-subtle-light sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-center gap-4">
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
            <div className="size-5 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
              </svg>
            </div>
          )}
          <h3 className="text-lg font-bold text-text-light">{siteName}</h3>
        </div>
        {contactInfo ? (
          <p className="text-sm">
            {[contactInfo.address, contactInfo.phone].filter(Boolean).join(" | ")}
          </p>
        ) : null}
        <div className="mt-4 flex justify-center gap-5">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              className="capitalize transition-colors hover:text-primary"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.platform}
            </a>
          ))}
        </div>
        <p className="mt-6 text-xs opacity-70">
          © {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.{" "}
          <Link href="/dashboard/login" className="underline-offset-2 hover:text-primary hover:underline">
            Yönetim
          </Link>
        </p>
      </div>
    </footer>
  );
}
