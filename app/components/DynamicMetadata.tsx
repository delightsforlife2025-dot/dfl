"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getSiteSetting } from "@/lib/api";

export default function DynamicMetadata() {
  const pathname = usePathname();
  const cachedSettings = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    async function updateMetadata() {
      // Fetch settings if not cached
      if (!cachedSettings.current) {
        cachedSettings.current = await getSiteSetting("general_settings");
      }

      const generalSettings = cachedSettings.current;

      if (!mounted) return;

      if (generalSettings) {
        // Update page title
        if (generalSettings.site_name) {
          document.title = generalSettings.site_name;
        }

        // Update favicon: reuse existing element if present
        if (generalSettings.favicon_url) {
          let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
          if (!favicon) {
            favicon = document.createElement("link");
            favicon.rel = "icon";
            favicon.type = "image/x-icon";
            document.head.appendChild(favicon);
          }
          favicon.href = generalSettings.favicon_url;
        }

        // Update meta description
        if (generalSettings.site_tagline) {
          let metaDescription = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
          if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
          }
          metaDescription.content = generalSettings.site_tagline;
        }
      }
    }

    updateMetadata();

    const handler = () => {
      // Clear cache and re-fetch when settings change
      cachedSettings.current = null;
      updateMetadata();
    };

    window.addEventListener('site-settings-updated', handler as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('site-settings-updated', handler as EventListener);
    };
  }, [pathname]); // Re-run on every route change

  return null;
}
