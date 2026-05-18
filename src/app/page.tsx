"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import ImovelCard from "@/components/ImovelCard";
import { Field, Chip } from "@/components/Field";
import { useImoveis } from "@/lib/store";
import type { TipoImovel } from "@/lib/types";

const TIPOS: TipoImovel[] = ["Apartamento", "Casa", "Terreno", "Comercial", "Rural", "Galpão"];

export default function HomePage() {
  const imoveis = useImoveis();
  const [query, setQuery] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<TipoImovel | null>(null);
  const [apenasPermuta, setApenasPermuta] = useState(false);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return imoveis.filter((i) => {
      if (tipoFiltro && i.tipo !== tipoFiltro) return false;
      if (apenasPermuta && !i.aceitaPermuta) return false;
      if (!q) return true;
      return (
        i.titulo.toLowerCase().includes(q) ||
        i.endereco.bairro.toLowerCase().includes(q) ||
        i.endereco.cidade.toLowerCase().includes(q)
      );
    });
  }, [imoveis, query, tipoFiltro, apenasPermuta]);

  return (
    <div className="px-4 md:px-0">
      <Header title="Livit" />

      <section className="mb-6 hidden md:block">
        <h1 className="text-3xl font-bold tracking-tight">Imóveis disponíveis</h1>
        <p className="mt-1 text-muted">
          Busque, filtre e simule permutas em tempo real durante a negociação.
        </p>
      </section>

      <div className="space-y-3">
        <Field
          placeholder="Buscar por bairro, cidade ou título..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto">
          <div className="flex w-max md:w-full md:flex-wrap gap-2 pb-1">
            <Chip active={apenasPermuta} onClick={() => setApenasPermuta((v) => !v)}>
              ⇄ Aceita permuta
            </Chip>
            {TIPOS.map((t) => (
              <Chip
                key={t}
                active={tipoFiltro === t}
                onClick={() => setTipoFiltro(tipoFiltro === t ? null : t)}
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-muted">
            {filtrados.length} {filtrados.length === 1 ? "imóvel" : "imóveis"}
          </p>
        </div>

        {filtrados.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filtrados.map((i) => (
              <ImovelCard key={i.id} imovel={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
      <p className="text-sm text-muted">Nenhum imóvel encontrado com esses filtros.</p>
    </div>
  );
}
