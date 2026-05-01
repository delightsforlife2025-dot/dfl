"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading screen after a minimum time to ensure smooth UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5bf00]">
      <div className="flex flex-col items-center gap-4">
        {/* Loading spinner */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
        </div>
        {/* Loading text */}
        <p className="text-lg font-medium text-text-light">
          Yükleniyor...
        </p>
      </div>
    </div>
  );
}