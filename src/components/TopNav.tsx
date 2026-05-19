"use client";

import Link from "next/link";

export default function TopNav() {
  return (
    <header className="hidden md:flex sticky top-0 z-30 h-[57px] items-center gap-4 border-b border-border bg-card/95 backdrop-blur shadow-sm px-6">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white font-bold text-lg">
          L
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">Livit</span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/cadastro"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Novo imóvel
        </Link>
      </div>
    </header>
  );
}
