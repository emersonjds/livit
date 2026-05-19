"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import ImovelCard from "@/components/ImovelCard";
import { Field, Chip } from "@/components/Field";
import { formatBRL, parseCurrency } from "@/lib/formatters";
import { useImoveis } from "@/lib/store";
import type { AceitaPermutaEm } from "@/lib/types";

const TIPOS_PERMUTA: AceitaPermutaEm[] = ["Imóvel", "Veículo", "Outro"];

export default function PermutaPage() {
  const imoveis = useImoveis();
  const [bairroOuCidade, setBairroOuCidade] = useState("");
  const [valorMaxStr, setValorMaxStr] = useState("");
  const [aceitaTipos, setAceitaTipos] = useState<AceitaPermutaEm[]>([]);

  const valorMax = parseCurrency(valorMaxStr);

  const filtrados = useMemo(() => {
    const q = bairroOuCidade.trim().toLowerCase();
    return imoveis
      .filter((i) => i.aceitaPermuta)
      .filter((i) => (valorMax ? i.valor <= valorMax : true))
      .filter((i) =>
        aceitaTipos.length === 0
          ? true
          : aceitaTipos.some((t) => i.aceitaPermutaEm.includes(t))
      )
      .filter((i) => {
        if (!q) return true;
        return (
          i.endereco.bairro.toLowerCase().includes(q) ||
          i.endereco.cidade.toLowerCase().includes(q)
        );
      });
  }, [imoveis, bairroOuCidade, valorMax, aceitaTipos]);

  const toggleTipo = (t: AceitaPermutaEm) => {
    setAceitaTipos((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <div className="px-4 md:px-0">
      <Header title="Imóveis com Permuta" showBack />

      <section className="mb-6 hidden md:block">
        <h1 className="text-3xl font-bold tracking-tight">Imóveis com Permuta</h1>
        <p className="mt-1 text-muted">
          Para usar durante a negociação: filtre por região, valor máximo e o tipo de bem que o
          cliente pode oferecer em troca.
        </p>
      </section>
      <p className="mb-4 text-sm text-muted md:hidden">
        Para usar durante a negociação: filtre por região, valor máximo e o tipo de bem que o
        cliente pode oferecer em troca.
      </p>

      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            placeholder="Bairro ou cidade"
            value={bairroOuCidade}
            onChange={(e) => setBairroOuCidade(e.target.value)}
          />
          <Field
            inputMode="numeric"
            placeholder="Valor máximo (R$)"
            value={valorMaxStr ? formatBRL(parseCurrency(valorMaxStr)) : ""}
            onChange={(e) => setValorMaxStr(String(parseCurrency(e.target.value)))}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Cliente quer dar em troca:</p>
          <div className="flex flex-wrap gap-2">
            {TIPOS_PERMUTA.map((t) => (
              <Chip key={t} active={aceitaTipos.includes(t)} onClick={() => toggleTipo(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>

        <p className="pt-2 text-sm text-muted">
          {filtrados.length} {filtrados.length === 1 ? "imóvel disponível" : "imóveis disponíveis"}
        </p>

        {filtrados.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
            <p className="text-sm text-muted">Nenhum imóvel encontrado para esses critérios.</p>
          </div>
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
