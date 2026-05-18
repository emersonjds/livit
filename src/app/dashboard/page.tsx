"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useImoveis, usePropostas } from "@/lib/store";
import { formatBRL } from "@/lib/formatters";

export default function DashboardPage() {
  const imoveis = useImoveis();
  const propostas = usePropostas();

  const totalImoveis = imoveis.length;
  const comPermuta = imoveis.filter((i) => i.aceitaPermuta).length;
  const propostasAtivas = propostas.length;
  const valorTotal = imoveis.reduce((acc, i) => acc + i.valor, 0);
  const recentes = imoveis.slice(0, 5);

  return (
    <div>
      <Header title="Dashboard" />

      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Visão geral do seu portfólio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        <StatCard
          label="Total de imóveis"
          value={String(totalImoveis)}
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5 12 3l9 6.5V21H3z" />
              <path d="M9 21V12h6v9" />
            </svg>
          }
          color="primary"
        />
        <StatCard
          label="Aceitam permuta"
          value={String(comPermuta)}
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3l4 4-4 4M20 7H8M8 21l-4-4 4-4M4 17h12" />
            </svg>
          }
          color="success"
        />
        <StatCard
          label="Propostas ativas"
          value={String(propostasAtivas)}
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          }
          color="warning"
        />
        <StatCard
          label="Valor em portfólio"
          value={formatBRL(valorTotal)}
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
          color="secondary"
          small
        />
      </div>

      {/* Atalhos rápidos */}
      <div className="mt-5 rounded-lg border border-border bg-card p-4 shadow-sm md:p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Atalhos rápidos</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <QuickLink
            href="/cadastro"
            label="Cadastrar imóvel"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5 12 3l9 6.5V21H3z" />
                <path d="M12 12v9M9 21h6" />
                <path d="M12 8v4M10 10h4" />
              </svg>
            }
          />
          <QuickLink
            href="/permuta"
            label="Ver permutas"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 3l4 4-4 4M20 7H8M8 21l-4-4 4-4M4 17h12" />
              </svg>
            }
          />
          <QuickLink
            href="/agenda"
            label="Agendar visita"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Imóveis recentes */}
      <div className="mt-5 rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border md:px-6 md:py-4">
          <h2 className="text-base font-semibold text-foreground">Imóveis recentes</h2>
          <Link href="/" className="text-sm font-medium text-primary hover:text-primary-hover">
            Ver todos
          </Link>
        </div>
        {recentes.length === 0 ? (
          <div className="px-4 py-10 text-center md:px-6">
            <p className="text-sm text-muted">Nenhum imóvel cadastrado ainda.</p>
            <Link href="/cadastro" className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary-hover">
              Cadastrar o primeiro
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recentes.map((im) => (
              <li key={im.id}>
                <Link
                  href={`/imovel/${im.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors md:px-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9.5 12 3l9 6.5V21H3z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{im.titulo}</p>
                    <p className="text-xs text-muted truncate">
                      {im.endereco.bairro}, {im.endereco.cidade}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">{formatBRL(im.valor)}</p>
                    {im.aceitaPermuta && (
                      <span className="text-[10px] font-medium text-success">Permuta</span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  small = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "secondary";
  small?: boolean;
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    secondary: "bg-secondary/20 text-secondary dark:text-sky-300",
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm md:p-5">
      <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <p className={`font-bold text-foreground leading-tight ${small ? "text-lg" : "text-2xl"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-sm font-medium text-foreground transition-colors hover:bg-border hover:border-primary/30 active:scale-[0.98] dark:bg-card dark:hover:bg-border"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      {label}
    </Link>
  );
}
