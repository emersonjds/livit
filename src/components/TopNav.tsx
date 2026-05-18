"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const items = [
  { href: "/", label: "Imóveis" },
  { href: "/permuta", label: "Permuta" },
  { href: "/cadastro", label: "Cadastrar" },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <header className="hidden md:block sticky top-0 z-40 bg-primary text-primary-foreground shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-primary font-bold text-lg">
            L
          </span>
          <span className="text-lg font-bold tracking-tight">Livit</span>
        </Link>
        <nav className="flex items-center gap-1">
          {items.map((it) => {
            const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-primary"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                }`}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle variant="onPrimary" />
          <Link
            href="/cadastro"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-white/90"
          >
            + Novo imóvel
          </Link>
        </div>
      </div>
    </header>
  );
}
