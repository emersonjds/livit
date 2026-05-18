"use client";

import { useMemo, useState } from "react";
import { formatBRL, parseCurrency } from "@/lib/formatters";
import { Field, Select } from "./Field";
import type { AceitaPermutaEm, Imovel } from "@/lib/types";

export type CalculadoraResultado = {
  itemTipo: AceitaPermutaEm;
  itemDescricao: string;
  itemValor: number;
  diferenca: number;
  comissao: number;
};

export default function PermutaCalculator({
  imovel,
  onChange,
}: {
  imovel: Imovel;
  onChange?: (r: CalculadoraResultado) => void;
}) {
  const [itemTipo, setItemTipo] = useState<AceitaPermutaEm>(
    imovel.aceitaPermutaEm[0] ?? "Outro"
  );
  const [itemDescricao, setItemDescricao] = useState("");
  const [itemValorStr, setItemValorStr] = useState("");

  const itemValor = parseCurrency(itemValorStr);
  const diferenca = imovel.valor - itemValor;
  const comissao = (imovel.valor * imovel.comissaoPercentual) / 100;
  const acimaDoTeto =
    imovel.valorMaxPermuta !== undefined && itemValor > imovel.valorMaxPermuta;

  const resultado = useMemo<CalculadoraResultado>(
    () => ({ itemTipo, itemDescricao, itemValor, diferenca, comissao }),
    [itemTipo, itemDescricao, itemValor, diferenca, comissao]
  );

  return (
    <div className="space-y-3">
      <Select
        label="O que está sendo oferecido em permuta?"
        value={itemTipo}
        onChange={(e) => setItemTipo(e.target.value as AceitaPermutaEm)}
        options={imovel.aceitaPermutaEm.map((t) => ({ value: t, label: t }))}
      />
      <Field
        label="Descrição do item"
        placeholder="ex: Honda Civic 2020, Apto Saúde 50m², Lote 200m²..."
        value={itemDescricao}
        onChange={(e) => setItemDescricao(e.target.value)}
      />
      <Field
        label="Valor estimado do item (R$)"
        inputMode="numeric"
        placeholder="R$ 0"
        value={itemValorStr}
        onChange={(e) => {
          const raw = parseCurrency(e.target.value);
          setItemValorStr(raw ? raw.toLocaleString("pt-BR") : "");
          if (onChange) onChange({ ...resultado, itemValor: raw });
        }}
        onBlur={() => onChange?.(resultado)}
      />

      {itemValor > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <Row label="Valor do imóvel" value={formatBRL(imovel.valor)} />
          <Row label={`Item em permuta (${itemTipo})`} value={`- ${formatBRL(itemValor)}`} />
          <div className="my-2 h-px bg-border" />
          <Row
            label="Diferença a pagar"
            value={formatBRL(Math.max(0, diferenca))}
            highlight
          />
          <Row
            label={`Comissão esperada (${imovel.comissaoPercentual}%)`}
            value={formatBRL(comissao)}
            accent
          />
          {acimaDoTeto && imovel.valorMaxPermuta !== undefined && (
            <p className="mt-2 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
              ⚠ Valor do item acima do teto aceito pelo vendedor (
              {formatBRL(imovel.valorMaxPermuta)})
            </p>
          )}
          {diferenca < 0 && (
            <p className="mt-2 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary">
              ⚠ Item vale mais que o imóvel — o vendedor pagaria a diferença.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  accent,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <span
        className={`font-semibold ${
          highlight ? "text-lg text-primary" : accent ? "text-accent" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
