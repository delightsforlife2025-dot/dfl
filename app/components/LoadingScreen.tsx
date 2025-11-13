"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after a minimum time to ensure smooth UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second minimum loading time

    // Also hide when the page is fully loaded
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 500); // Small delay after load
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center gap-4">
        {/* Loading spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
        </div>
        {/* Loading text */}
        <p className="text-text-light dark:text-text-dark text-lg font-medium">
          Yükleniyor...
        </p>
      </div>
    </div>
  );
}