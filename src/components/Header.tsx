"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

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
  return (
    <header className="md:hidden sticky top-0 z-40 -mx-4 mb-4 bg-primary text-primary-foreground shadow-sm">
      <div className="mx-auto flex max-w-md items-center gap-2 px-4 py-3">
        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Voltar"
            className="-ml-2 p-2 text-white/90 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-primary font-bold">
              L
            </span>
          </Link>
        )}
        <h1 className="flex-1 truncate text-lg font-semibold">{title}</h1>
        <ThemeToggle variant="onPrimary" />
        {right}
      </div>
    </header>
  );
}
