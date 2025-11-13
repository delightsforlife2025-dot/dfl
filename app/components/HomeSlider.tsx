"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
export interface SliderItem {
  title?: string;
  subtitle?: string;
  image?: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface HomeSliderProps {
  slides?: SliderItem[];
  className?: string;
}

const FALLBACK_SLIDES: SliderItem[] = [
  {
    title: "Spice. Flavor. Home.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Bold Flavors, Fresh Bites",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Taste Beyond Borders",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Desi Cuisine · Done Right",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1920&q=80",
  },
];

export default function HomeSlider({ slides, className }: HomeSliderProps) {
  const preparedSlides = useMemo(() => {
    const cleaned = (slides || [])
      .filter((slide) => typeof slide === "object" && slide !== null)
      .map((slide) => ({
        title: slide.title?.trim() || "",
        subtitle: slide.subtitle?.trim() || "",
        image: slide.image?.trim() || "",
        buttonText: slide.buttonText?.trim() || "",
        buttonUrl: slide.buttonUrl?.trim() || "",
      }))
      .filter((slide) => slide.image);

    return cleaned.length ? cleaned : FALLBACK_SLIDES;
  }, [slides]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideCount = preparedSlides.length;

  useEffect(() => {
    if (slideCount <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 6000);

    return () => clearInterval(interval);
  }, [slideCount]);

  if (!slideCount) return null;

  return (
    <section className={`relative w-full overflow-hidden bg-background-light dark:bg-background-dark ${className || ""}`}>
      <div className="relative h-[300px] sm:h-[380px] md:h-[440px] lg:h-[520px]">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {preparedSlides.map((slide, index) => (
            <div key={index} className="relative min-w-full h-full">
              <div className="absolute inset-0">
                <Image
                  src={slide.image || FALLBACK_SLIDES[0].image!}
                  alt={slide.title || `slider-${index}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/10" />
              </div>

              <div className="relative h-full flex items-center px-6 sm:px-10 lg:px-16">
                <div className="max-w-2xl text-white space-y-4 sm:space-y-6">
                  {slide.title ? (
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                      {slide.title}
                    </h2>
                  ) : null}
                  {slide.subtitle ? (
                    <p className="text-sm sm:text-lg lg:text-xl text-white/80 leading-relaxed">
                      {slide.subtitle}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {slideCount > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center px-4">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount)}
                className="rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
                aria-label="Önceki"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-4">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % slideCount)}
                className="rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
                aria-label="Sonraki"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {preparedSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${currentIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
                  aria-label={`Slider ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

