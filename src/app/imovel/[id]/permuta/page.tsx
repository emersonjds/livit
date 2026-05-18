"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import { Textarea } from "@/components/Field";
import PermutaCalculator, {
  type CalculadoraResultado,
} from "@/components/PermutaCalculator";
import { gerarId, salvarProposta, useImovel } from "@/lib/store";

type Params = Promise<{ id: string }>;

export default function PropostaPermutaPage({ params }: { params: Params }) {
  const { id } = use(params);
  const router = useRouter();
  const imovel = useImovel(id);
  const [resultado, setResultado] = useState<CalculadoraResultado | null>(null);
  const [observacoes, setObservacoes] = useState("");

  if (!imovel) {
    return (
      <div className="px-4">
        <Header title="Não encontrado" showBack />
        <p className="text-sm text-muted">Imóvel não encontrado.</p>
      </div>
    );
  }

  if (!imovel.aceitaPermuta) {
    return (
      <div className="px-4">
        <Header title="Permuta indisponível" showBack />
        <p className="text-sm text-muted">Este imóvel não aceita permuta.</p>
      </div>
    );
  }

  const handleSalvar = () => {
    if (!resultado || resultado.itemValor === 0) return;
    salvarProposta({
      id: gerarId(),
      imovelOrigemId: imovel.id,
      itemPermuta: {
        tipo: resultado.itemTipo,
        descricao: resultado.itemDescricao,
        valorEstimado: resultado.itemValor,
      },
      diferencaValor: resultado.diferenca,
      comissaoEsperada: resultado.comissao,
      observacoes: observacoes || undefined,
      criadoEm: new Date().toISOString(),
    });
    router.push(`/imovel/${imovel.id}`);
  };

  return (
    <div className="px-4 md:px-0 pb-32">
      <Header title="Simular permuta" showBack />

      <div className="mb-4 hidden md:block">
        <Breadcrumbs
          items={[
            { label: "Imóveis", href: "/" },
            { label: imovel.titulo, href: `/imovel/${imovel.id}` },
            { label: "Simular permuta" },
          ]}
        />
      </div>

      <div className="mb-4 rounded-lg border border-border bg-card p-4">
        <p className="text-xs uppercase text-muted">Imóvel</p>
        <p className="font-medium leading-tight">{imovel.titulo}</p>
        <p className="mt-0.5 text-sm text-muted">
          {imovel.endereco.bairro}, {imovel.endereco.cidade}
        </p>
      </div>

      <div className="space-y-4">
        <PermutaCalculator imovel={imovel} onChange={setResultado} />

        <Textarea
          label="Observações"
          rows={3}
          placeholder="Notas sobre o estado do item, contrapartidas, prazos..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />

        <div className="sticky bottom-20 z-30 pb-2">
          <Button onClick={handleSalvar} disabled={!resultado || resultado.itemValor === 0}>
            Salvar proposta
          </Button>
        </div>
      </div>
    </div>
  );
}
