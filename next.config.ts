import type { NextConfig } from "next";

/** Any project on supabase.co — avoids broken logos when build used placeholder env and runtime URL is the real project. */
const supabaseStoragePublic: {
  protocol: "https";
  hostname: string;
  pathname: string;
} = {
  protocol: "https",
  hostname: "**.supabase.co",
  pathname: "/storage/v1/object/public/**",
};

function supabaseCustomImageHost(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw || raw.includes("build-placeholder")) return undefined;
  try {
    const host = new URL(raw).hostname;
    if (!host || host.endsWith(".supabase.co")) return undefined;
    return host;
  } catch {
    return undefined;
  }
}

const supabaseCustomHost = supabaseCustomImageHost();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/admin", destination: "/dashboard/login", permanent: false },
      { source: "/admin/:path*", destination: "/dashboard/login", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      supabaseStoragePublic,
      ...(supabaseCustomHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseCustomHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};

export default nextConfig;
