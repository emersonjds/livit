"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import PhotoGallery from "@/components/PhotoGallery";
import { formatBRL, formatArea, whatsappLink } from "@/lib/formatters";
import { useImovel, usePropostas, removerImovel } from "@/lib/store";

type Params = Promise<{ id: string }>;

export default function ImovelDetalhePage({ params }: { params: Params }) {
  const { id } = use(params);
  const router = useRouter();
  const imovel = useImovel(id);
  const propostas = usePropostas(id);

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

  return (
    <div className="px-4 md:px-0 pb-32 md:pb-12">
      <Header title={imovel.tipo} showBack />

      <div className="hidden md:flex items-center gap-2 mt-4 mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">Imóveis</Link>
        <span>/</span>
        <span className="text-foreground">{imovel.titulo}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
        <div className="space-y-6">
          <div className="md:rounded-2xl md:overflow-hidden md:border md:border-border">
            <PhotoGallery fotos={imovel.fotos} alt={imovel.titulo} />
          </div>

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted">{imovel.tipo}</p>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{imovel.titulo}</h1>
            <p className="text-sm md:text-base text-muted">
              {imovel.endereco.rua}, {imovel.endereco.numero}
              {imovel.endereco.complemento ? `, ${imovel.endereco.complemento}` : ""} —{" "}
              {imovel.endereco.bairro}, {imovel.endereco.cidade}/{imovel.endereco.estado}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 md:gap-3 text-center">
            <Stat label="Área" value={formatArea(imovel.area)} />
            <Stat label="Quartos" value={imovel.quartos ?? "—"} />
            <Stat label="Banhos" value={imovel.banheiros ?? "—"} />
            <Stat label="Vagas" value={imovel.vagas ?? "—"} />
          </div>

          {imovel.aceitaPermuta && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 md:p-5">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3l4 4-4 4M20 7H8M8 21l-4-4 4-4M4 17h12" />
                </svg>
                <p className="font-semibold text-primary">Aceita permuta</p>
              </div>
              <p className="mt-1 text-sm text-foreground/80">
                Em troca de:{" "}
                <span className="font-medium">{imovel.aceitaPermutaEm.join(", ")}</span>
              </p>
              {imovel.valorMaxPermuta !== undefined && (
                <p className="mt-1 text-sm text-foreground/80">
                  Valor máximo aceito:{" "}
                  <span className="font-medium">{formatBRL(imovel.valorMaxPermuta)}</span>
                </p>
              )}
              <Link
                href={`/imovel/${imovel.id}/permuta`}
                className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground w-full md:w-auto"
              >
                Simular permuta
              </Link>
            </div>
          )}

          {imovel.descricao && (
            <section>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
                Descrição
              </h3>
              <p className="whitespace-pre-line text-sm md:text-base leading-relaxed">
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
                  <div key={p.id} className="rounded-xl border border-border bg-card p-3 md:p-4">
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
                      <span className="text-primary font-semibold">
                        Comissão {formatBRL(p.comissaoEsperada)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted">Valor do imóvel</p>
            <p className="mt-1 text-3xl font-bold text-foreground">{formatBRL(imovel.valor)}</p>

            <div className="my-4 h-px bg-border" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Comissão ({imovel.comissaoPercentual}%)</span>
                <span className="font-semibold text-primary">{formatBRL(comissao)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Área</span>
                <span className="font-medium">{formatArea(imovel.area)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">R$ / m²</span>
                <span className="font-medium">
                  {formatBRL(Math.round(imovel.valor / imovel.area))}
                </span>
              </div>
            </div>

            {imovel.aceitaPermuta && (
              <Link
                href={`/imovel/${imovel.id}/permuta`}
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Simular permuta
              </Link>
            )}
            <div className="mt-2 flex gap-2">
              <a
                href={`tel:${imovel.proprietario.telefone.replace(/\D/g, "")}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {imovel.proprietario.telefone}
              </a>
              <a
                href={whatsappLink(
                  imovel.proprietario.telefone,
                  `Olá, ${imovel.proprietario.nome}! Tenho interesse no imóvel "${imovel.titulo}". Podemos conversar?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir conversa no WhatsApp"
                title="Abrir WhatsApp"
                className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-3 text-white shadow-sm transition hover:bg-[#1ebe5d] active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.554-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-2">
              Proprietário
            </h3>
            <p className="font-medium">{imovel.proprietario.nome}</p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/imovel/${imovel.id}/editar`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-base font-semibold text-foreground transition hover:bg-foreground/5"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Editar
            </Link>
            <Button variant="danger" onClick={handleExcluir} fullWidth={false} className="flex-1">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
              Excluir
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card py-3 px-2">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="text-sm md:text-base font-semibold mt-0.5">{value}</p>
    </div>
  );
}
