"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSocialLinks, getSiteSetting } from "@/lib/api";
import type { SocialLink } from "@/lib/types";

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [siteName, setSiteName] = useState("Restaurant");
  const [logoUrl, setLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [socialLinksData, contact, generalSettings] = await Promise.all([
        getSiteSetting('social_links'),
        getSiteSetting('contact_info'),
        getSiteSetting('general_settings')
      ]);
      
      console.log('Footer - Social Links Data:', socialLinksData);
      console.log('Footer - Contact Info:', contact);
      console.log('Footer - General Settings:', generalSettings);
      
      // Convert social_links object to array format
      const socialArray: SocialLink[] = [];
      const now = new Date().toISOString();
      if (socialLinksData) {
        let id = 1;
        if (socialLinksData.facebook) {
          socialArray.push({ 
            id: String(id++), 
            platform: 'facebook', 
            url: socialLinksData.facebook, 
            position: 1,
            created_at: now,
            updated_at: now
          });
        }
        if (socialLinksData.instagram) {
          socialArray.push({ 
            id: String(id++), 
            platform: 'instagram', 
            url: socialLinksData.instagram, 
            position: 2,
            created_at: now,
            updated_at: now
          });
        }
        if (socialLinksData.twitter) {
          socialArray.push({ 
            id: String(id++), 
            platform: 'twitter', 
            url: socialLinksData.twitter, 
            position: 3,
            created_at: now,
            updated_at: now
          });
        }
        if (socialLinksData.youtube) {
          socialArray.push({ 
            id: String(id++), 
            platform: 'youtube', 
            url: socialLinksData.youtube, 
            position: 4,
            created_at: now,
            updated_at: now
          });
        }
      }
      
      setSocialLinks(socialArray);
      setContactInfo(contact);
      
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
      <footer className="w-full bg-border-light dark:bg-border-dark">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-subtle-light dark:text-subtle-dark">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="size-5 bg-subtle-light dark:bg-subtle-dark rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-subtle-light dark:bg-subtle-dark rounded animate-pulse"></div>
          </div>
          <div className="h-3 w-48 bg-subtle-light dark:bg-subtle-dark rounded animate-pulse mx-auto"></div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-border-light dark:bg-border-dark">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-subtle-light dark:text-subtle-dark">
        <div className="flex justify-center items-center gap-4 mb-4">
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
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
              </svg>
            </div>
          )}
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">{siteName}</h3>
        </div>
        {contactInfo && (
          <p className="text-sm">
            {contactInfo.address} | {contactInfo.phone}
          </p>
        )}
        <div className="flex justify-center gap-5 mt-4">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              className="hover:text-primary transition-colors capitalize"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.platform}
            </a>
          ))}
        </div>
        <p className="text-xs mt-6 opacity-70">© {new Date().getFullYear()} {siteName}. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
