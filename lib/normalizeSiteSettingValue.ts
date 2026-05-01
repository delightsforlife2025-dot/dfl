/** Ensure JSON we send to Supabase has stable keys (JSON.stringify drops `undefined`). */

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function normalizeSiteSettingValue(key: string, value: unknown): unknown {
  if (key === "general_settings" && isRecord(value)) {
    return {
      site_name: typeof value.site_name === "string" ? value.site_name : "",
      site_tagline: typeof value.site_tagline === "string" ? value.site_tagline : "",
      logo_url: typeof value.logo_url === "string" ? value.logo_url : "",
      favicon_url: typeof value.favicon_url === "string" ? value.favicon_url : "",
      primary_color:
        typeof value.primary_color === "string" && value.primary_color.trim()
          ? value.primary_color.trim()
          : "#ff6b35",
    };
  }

  if (key === "contact_info" && isRecord(value)) {
    return {
      address: typeof value.address === "string" ? value.address : "",
      phone: typeof value.phone === "string" ? value.phone : "",
      email: typeof value.email === "string" ? value.email : "",
      hours: typeof value.hours === "string" ? value.hours : "",
    };
  }

  if (key === "social_links" && isRecord(value)) {
    return {
      facebook: typeof value.facebook === "string" ? value.facebook : "",
      instagram: typeof value.instagram === "string" ? value.instagram : "",
      twitter: typeof value.twitter === "string" ? value.twitter : "",
      youtube: typeof value.youtube === "string" ? value.youtube : "",
    };
  }

  if (key === "home_content" && isRecord(value)) {
    try {
      return JSON.parse(JSON.stringify(value)) as unknown;
    } catch {
      return value;
    }
  }

  return value;
}
