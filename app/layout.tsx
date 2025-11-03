import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DynamicMetadata from "./components/DynamicMetadata";
import LoadingScreen from "./components/LoadingScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant",
  description: "Lezzet ve kalite bir arada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Tailwind CDN with plugins */}
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

        {/* Google Fonts and Material Symbols */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        
        {/* Favicon will be dynamically injected via ClientFavicon component */}

        {/* Tailwind runtime config to extend theme with required colors and font family */}
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ee8c2b",
                        "background-light": "#f8f7f6",
                        "background-dark": "#221910",
                        "text-light": "#1b140d",
                        "text-dark": "#f8f7f6",
                        "subtle-light": "#9a734c",
                        "subtle-dark": "#a19182",
                        "border-light": "#f3ede7",
                        "border-dark": "#3a2d20",
                    },
                    fontFamily: {
                        "display": ["Manrope", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                },
            },
        }`,
          }}
        />
      </head>
      <body
        className={` ${geistSans.variable} ${geistMono.variable} antialiased font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
      >
        <LoadingScreen />
        <DynamicMetadata />
        {children}
      </body>
    </html>
  );
}
