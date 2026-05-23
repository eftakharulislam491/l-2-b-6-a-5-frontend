"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductDetailGalleryImage } from "./product-detail-types";

const ZOOM_MEDIA_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

type ProductGalleryProps = {
  title: string;
  images: ProductDetailGalleryImage[];
};

export default function ProductGallery({
  title,
  images,
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const thumbRef = useRef<HTMLDivElement>(null);

  const visibleImage = images[activeImage] ?? images[0];

  const scrollThumbs = (direction: "prev" | "next") => {
    if (!thumbRef.current) {
      return;
    }

    thumbRef.current.scrollBy({
      left: direction === "next" ? 160 : -160,
      behavior: "smooth",
    });
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!zoomEnabled) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(ZOOM_MEDIA_QUERY);

    const syncZoomAvailability = () => {
      setZoomEnabled(mediaQuery.matches);

      if (!mediaQuery.matches) {
        setShowZoom(false);
      }
    };

    syncZoomAvailability();
    mediaQuery.addEventListener("change", syncZoomAvailability);

    return () => {
      mediaQuery.removeEventListener("change", syncZoomAvailability);
    };
  }, []);

  useEffect(() => {
    const container = thumbRef.current;

    if (!container) {
      return;
    }

    const activeThumb = container.children.item(activeImage);

    if (!activeThumb) {
      return;
    }

    activeThumb.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeImage]);

  return (
    <section className="w-full min-w-0 space-y-4 rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm sm:space-y-5 sm:p-4">
      <div
        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          if (zoomEnabled) {
            setShowZoom(true);
          }
        }}
        onMouseLeave={() => setShowZoom(false)}
      >
        <div className="relative aspect-[4/3] sm:aspect-square">
        
          <img
            src={visibleImage.src}
            alt={visibleImage.alt || title}
            className="h-full w-full object-cover transition-transform duration-200 ease-out"
            style={{
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              transform: zoomEnabled && showZoom ? "scale(1.55)" : "scale(1)",
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent px-4 py-3 text-xs font-medium text-white sm:text-sm">
          <span>{images.length > 1 ? "High resolution preview" : title}</span>
          <span>
            {Math.min(activeImage + 1, images.length)} / {images.length}
          </span>
        </div>
      </div>

      {images.length > 1 ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollThumbs("prev")}
            aria-label="Previous thumbnails"
            className="absolute left-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            ref={thumbRef}
            className="flex gap-2 overflow-x-auto pb-1 pr-1 scroll-smooth scrollbar-none sm:gap-3 sm:px-12"
          >
            {images.map((image, index) => {
              const isActive = activeImage === index;

              return (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition sm:h-20 sm:w-20 ${
                    isActive
                      ? "border-blue-600 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt || `${title} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollThumbs("next")}
            aria-label="Next thumbnails"
            className="absolute right-1 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 sm:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
