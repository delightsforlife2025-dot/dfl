"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getSiteSetting } from "@/lib/api";
import { asGeneralSiteSettings, type GeneralSiteSettings } from "@/lib/types";

function faviconMimeFromUrl(url: string): string {
  const path = url.split("?")[0].split("#")[0].toLowerCase();
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".ico")) return "image/x-icon";
  return "image/png";
}

export default function DynamicMetadata() {
  const pathname = usePathname();
  const cachedSettings = useRef<GeneralSiteSettings | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    async function updateMetadata() {
      if (cachedSettings.current === undefined) {
        const raw = await getSiteSetting("general_settings");
        cachedSettings.current = asGeneralSiteSettings(raw);
      }

      const generalSettings = cachedSettings.current;

      if (!mounted) return;

      if (generalSettings) {
        if (generalSettings.site_name) {
          document.title = generalSettings.site_name;
        }

        if (generalSettings.favicon_url) {
          let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
          if (!favicon) {
            favicon = document.createElement("link");
            favicon.rel = "icon";
            document.head.appendChild(favicon);
          }
          favicon.type = faviconMimeFromUrl(generalSettings.favicon_url);
          favicon.href = generalSettings.favicon_url;
        }

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
      cachedSettings.current = undefined;
      updateMetadata();
    };

    window.addEventListener("site-settings-updated", handler as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener("site-settings-updated", handler as EventListener);
    };
  }, [pathname]);

  return null;
}
