"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import PhotoHero from "@/components/PhotoHero";
import { formatBRL, formatArea, whatsappLink } from "@/lib/formatters";
import { useImovel, usePropostas, removerImovel } from "@/lib/store";

type Params = Promise<{ id: string }>;

export default function ImovelDetalhePage({ params }: { params: Params }) {
  const { id } = use(params);
  const router = useRouter();
  const imovel = useImovel(id);
  const propostas = usePropostas(id);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!imovel) {
    return (
      <div className="px-4 md:px-0">
        <Header title="Não encontrado" showBack />
        <p className="text-sm text-muted">Imóvel não encontrado.</p>
      </div>
    );
  }

  const handleExcluir = () => {
    if (confirm("Excluir este imóvel?")) {
      removerImovel(imovel.id);
      router.push("/");
    }
  };

  const comissao = (imovel.valor * imovel.comissaoPercentual) / 100;
  const mensagem = `Olá, ${imovel.proprietario.nome}! Tenho interesse no imóvel "${imovel.titulo}". Podemos conversar?`;
  const whatsappHref = whatsappLink(imovel.proprietario.telefone, mensagem);
  const telHref = `tel:${imovel.proprietario.telefone.replace(/\D/g, "")}`;

  return (
    <div className="px-4 md:px-0 pb-28 md:pb-12">
      <Header
        title={imovel.titulo}
        showBack
        right={
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Mais opções"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 hover:text-white hover:bg-white/15"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-11 z-50 min-w-[160px] rounded-lg border border-border bg-card shadow-lg overflow-hidden"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link
                  href={`/imovel/${imovel.id}/editar`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-surface"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleExcluir();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-danger/10"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />
                  </svg>
                  Excluir
                </button>
              </div>
            )}
          </div>
        }
      />

      <div className="mb-4 hidden md:block">
        <Breadcrumbs
          items={[
            { label: "Imóveis", href: "/" },
            { label: imovel.tipo, href: `/?tipo=${encodeURIComponent(imovel.tipo)}` },
            { label: imovel.titulo },
          ]}
        />
      </div>

      <div className="hidden md:flex md:items-start md:justify-between md:gap-4 md:mb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-foreground border border-border">
              {imovel.tipo}
            </span>
            {imovel.aceitaPermuta && (
              <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-semibold text-success border border-success/30">
                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth="2.5">
                  <path d="M16 3l4 4-4 4M20 7H8M8 21l-4-4 4-4M4 17h12" />
                </svg>
                Aceita permuta
              </span>
            )}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold leading-tight">{imovel.titulo}</h1>
          <p className="mt-1 text-sm text-muted flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {imovel.endereco.bairro}, {imovel.endereco.cidade}/{imovel.endereco.estado}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs uppercase tracking-wide text-muted">Valor</p>
          <p className="text-2xl lg:text-3xl font-bold text-primary">{formatBRL(imovel.valor)}</p>
        </div>
      </div>

      <PhotoHero fotos={imovel.fotos} alt={imovel.titulo} />

      {/* MOBILE: title + price block below photos */}
      <div className="md:hidden mt-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-foreground border border-border">
            {imovel.tipo}
          </span>
          {imovel.aceitaPermuta && (
            <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-semibold text-success border border-success/30">
              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth="2.5">
                <path d="M16 3l4 4-4 4M20 7H8M8 21l-4-4 4-4M4 17h12" />
              </svg>
              Aceita permuta
            </span>
          )}
        </div>
        <h1 className="text-xl font-bold leading-tight">{imovel.titulo}</h1>
        <p className="mt-1 text-sm text-muted flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 shrink-0" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {imovel.endereco.bairro}, {imovel.endereco.cidade}/{imovel.endereco.estado}
        </p>
        <p className="mt-3 text-2xl font-bold text-primary">{formatBRL(imovel.valor)}</p>
        <p className="text-xs text-muted">
          Comissão {imovel.comissaoPercentual}% ·{" "}
          <span className="font-medium text-success">{formatBRL(comissao)}</span>
        </p>
      </div>

      <div className="mt-4 md:mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
        <div className="space-y-5 md:space-y-6">
          <div className="grid grid-cols-4 gap-2 md:gap-3 text-center">
            <Stat label="Área" value={formatArea(imovel.area)} />
            <Stat label="Quartos" value={imovel.quartos ?? "—"} />
            <Stat label="Banhos" value={imovel.banheiros ?? "—"} />
            <Stat label="Vagas" value={imovel.vagas ?? "—"} />
          </div>

          {imovel.aceitaPermuta && (
            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-success" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3l4 4-4 4M20 7H8M8 21l-4-4 4-4M4 17h12" />
                </svg>
                <p className="font-semibold text-success">Aceita permuta</p>
              </div>
              <div className="mt-2 text-sm text-foreground/80 space-y-0.5">
                <p>
                  Em troca de:{" "}
                  <span className="font-medium">{imovel.aceitaPermutaEm.join(", ")}</span>
                </p>
                {imovel.valorMaxPermuta !== undefined && (
                  <p>
                    Valor máximo aceito:{" "}
                    <span className="font-medium">{formatBRL(imovel.valorMaxPermuta)}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {imovel.descricao && (
            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
                Descrição
              </h3>
              <p className="whitespace-pre-line text-sm md:text-[15px] leading-relaxed text-foreground/90">
                {imovel.descricao}
              </p>
            </section>
          )}

          {propostas.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
                Propostas de permuta ({propostas.length})
              </h3>
              <div className="space-y-2">
                {propostas.map((p) => (
                  <div key={p.id} className="rounded-lg border border-border bg-card p-3 md:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs uppercase text-muted">{p.itemPermuta.tipo}</p>
                        <p className="font-medium leading-tight">{p.itemPermuta.descricao}</p>
                        {p.observacoes && (
                          <p className="mt-1 text-xs text-muted line-clamp-2">{p.observacoes}</p>
                        )}
                      </div>
                      <span className="shrink-0 text-sm font-semibold">
                        {formatBRL(p.itemPermuta.valorEstimado)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted">
                      <span>Diferença: {formatBRL(Math.max(0, p.diferencaValor))}</span>
                      <span className="text-success font-semibold">
                        Comissão {formatBRL(p.comissaoEsperada)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
              Endereço completo
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {imovel.endereco.rua}, {imovel.endereco.numero}
              {imovel.endereco.complemento ? `, ${imovel.endereco.complemento}` : ""}
              <br />
              {imovel.endereco.bairro} — {imovel.endereco.cidade}/{imovel.endereco.estado}
              <br />
              CEP {imovel.endereco.cep}
            </p>
          </section>
        </div>

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block">
          <div className="lg:sticky lg:top-20 space-y-3">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted">Valor do imóvel</p>
              <p className="mt-1 text-3xl font-bold text-foreground">{formatBRL(imovel.valor)}</p>
              <p className="mt-1 text-xs text-muted">
                Comissão {imovel.comissaoPercentual}% ·{" "}
                <span className="font-semibold text-success">{formatBRL(comissao)}</span>
              </p>

              {imovel.aceitaPermuta && (
                <Link
                  href={`/imovel/${imovel.id}/permuta`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 3l4 4-4 4M20 7H8M8 21l-4-4 4-4M4 17h12" />
                  </svg>
                  Simular permuta
                </Link>
              )}

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1ebe5d]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                </svg>
                WhatsApp
              </a>

              <a
                href={telHref}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-border"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Ligar
              </a>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wider text-muted mb-1">Proprietário</p>
              <p className="text-sm font-semibold">{imovel.proprietario.nome}</p>
              <p className="text-xs text-muted">{imovel.proprietario.telefone}</p>
            </div>
          </div>
        </aside>

        {/* TABLET aside (md only) */}
        <aside className="hidden md:block lg:hidden">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted mb-1">Proprietário</p>
            <p className="text-sm font-semibold">{imovel.proprietario.nome}</p>
            <p className="text-xs text-muted">{imovel.proprietario.telefone}</p>
          </div>
        </aside>
      </div>

      {/* MOBILE/TABLET fixed bottom action bar */}
      <div className="lg:hidden fixed bottom-16 md:bottom-4 left-0 right-0 z-30 px-4 md:pl-72 md:pr-6">
        <div className="mx-auto flex max-w-md md:max-w-none gap-2 rounded-xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur">
          {imovel.aceitaPermuta && (
            <Link
              href={`/imovel/${imovel.id}/permuta`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 3l4 4-4 4M20 7H8M8 21l-4-4 4-4M4 17h12" />
              </svg>
              Simular permuta
            </Link>
          )}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className={`${imovel.aceitaPermuta ? "" : "flex-1"} inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-white shadow-sm`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            {imovel.aceitaPermuta ? "" : "Falar no WhatsApp"}
          </a>
          <a
            href={telHref}
            aria-label="Ligar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card py-2.5 px-2">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="text-sm md:text-base font-semibold mt-0.5">{value}</p>
    </div>
  );
}
