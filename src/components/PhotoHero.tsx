"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function PhotoHero({
  fotos,
  alt,
}: {
  fotos: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((i: number) => {
    if (!scrollerRef.current) return;
    const w = scrollerRef.current.offsetWidth;
    scrollerRef.current.scrollTo({ left: i * w, behavior: "smooth" });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevLightbox = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i - 1 + fotos.length) % fotos.length));
  }, [fotos.length]);
  const nextLightbox = useCallback(() => {
    setLightbox((i) => (i === null ? null : (i + 1) % fotos.length));
  }, [fotos.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "ArrowRight") nextLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, prevLightbox, nextLightbox]);

  if (!fotos || fotos.length === 0) {
    return (
      <div className="rounded-xl bg-surface aspect-[4/3] md:aspect-[16/9] grid place-items-center text-muted">
        <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    );
  }

  const main = fotos[0];
  const thumbs = fotos.slice(1, 5);
  const remaining = Math.max(0, fotos.length - 5);

  return (
    <>
      {/* MOBILE: carousel */}
      <div className="md:hidden group relative overflow-hidden -mx-4">
        <div
          ref={scrollerRef}
          onScroll={() => {
            if (!scrollerRef.current) return;
            const w = scrollerRef.current.offsetWidth;
            const i = Math.round(scrollerRef.current.scrollLeft / w);
            if (i !== index) setIndex(i);
          }}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar"
        >
          {fotos.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(i)}
              className="relative w-full shrink-0 snap-center aspect-[4/3]"
              aria-label={`Foto ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} - foto ${i + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
            </button>
          ))}
        </div>
        {fotos.length > 1 && (
          <>
            <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              {index + 1} / {fotos.length}
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {fotos.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir para foto ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* DESKTOP: hero grid (main + 2x2 thumbnails) */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setLightbox(0)}
          className="relative col-span-2 row-span-2 group bg-surface"
        >
          <Image
            src={main}
            alt={`${alt} - foto 1`}
            fill
            sizes="(max-width: 1024px) 50vw, 600px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
        </button>
        {[0, 1, 2, 3].map((slot) => {
          const src = thumbs[slot];
          const isLast = slot === 3;
          const showOverlay = isLast && remaining > 0;
          if (!src) {
            return (
              <div
                key={slot}
                className="relative bg-surface grid place-items-center text-muted/40"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
            );
          }
          return (
            <button
              key={slot}
              type="button"
              onClick={() => setLightbox(slot + 1)}
              className="relative group bg-surface overflow-hidden"
            >
              <Image
                src={src}
                alt={`${alt} - foto ${slot + 2}`}
                fill
                sizes="300px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              {showOverlay && (
                <div className="absolute inset-0 grid place-items-center bg-black/55 text-white">
                  <span className="text-sm font-semibold">+{remaining} fotos</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Fechar"
            className="absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          {fotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightbox();
                }}
                aria-label="Foto anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightbox();
                }}
                aria-label="Próxima foto"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
          <div
            className="relative w-full max-w-5xl h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fotos[lightbox]}
              alt={`${alt} - foto ${lightbox + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
            {lightbox + 1} / {fotos.length}
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
