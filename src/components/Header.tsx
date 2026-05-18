"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header({
  title,
  showBack = false,
  right,
}: {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="md:hidden sticky top-0 z-40 -mx-4 mb-4 bg-primary text-white shadow-sm">
      <div className="mx-auto flex max-w-md items-center gap-1 px-3 py-3">
        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Voltar"
            title="Voltar"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 hover:text-white hover:bg-white/15"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-primary font-bold shadow-sm">
              L
            </span>
          </span>
        )}
        <h1 className="flex-1 truncate text-base font-semibold ml-1">{title}</h1>
        {showBack && !isHome && (
          <Link
            href="/"
            aria-label="Ir para a home"
            title="Home"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 hover:text-white hover:bg-white/15"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5 12 3l9 6.5V21H3z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </Link>
        )}
        {right}
      </div>
    </header>
  );
}
