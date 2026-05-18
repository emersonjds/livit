"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function PhotoGallery({
  fotos,
  alt,
}: {
  fotos: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const goTo = useCallback((i: number) => {
    if (!ref.current) return;
    const w = ref.current.offsetWidth;
    ref.current.scrollTo({ left: i * w, behavior: "smooth" });
  }, []);

  const prev = useCallback(() => {
    if (fotos.length === 0) return;
    goTo((index - 1 + fotos.length) % fotos.length);
  }, [index, fotos.length, goTo]);

  const next = useCallback(() => {
    if (fotos.length === 0) return;
    goTo((index + 1) % fotos.length);
  }, [index, fotos.length, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  if (!fotos || fotos.length === 0) {
    return (
      <div className="rounded-2xl bg-foreground/5 aspect-[4/3] grid place-items-center text-muted">
        <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    );
  }

  const handleScroll = () => {
    if (!ref.current) return;
    const w = ref.current.offsetWidth;
    const i = Math.round(ref.current.scrollLeft / w);
    if (i !== index) setIndex(i);
  };

  return (
    <div className="group relative overflow-hidden">
      <div
        ref={ref}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar"
      >
        {fotos.map((src, i) => (
          <div
            key={i}
            className="relative w-full shrink-0 snap-center aspect-[4/3] md:aspect-[16/10]"
          >
            <Image
              src={src}
              alt={`${alt} - foto ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {fotos.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-foreground shadow-md transition opacity-90 hover:opacity-100 active:scale-95 md:opacity-0 md:group-hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-foreground shadow-md transition opacity-90 hover:opacity-100 active:scale-95 md:opacity-0 md:group-hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

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
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
