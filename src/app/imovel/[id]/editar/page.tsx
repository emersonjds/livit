"use client";

import { use } from "react";
import Header from "@/components/Header";
import ImovelForm from "@/components/ImovelForm";
import { useImovel } from "@/lib/store";

type Params = Promise<{ id: string }>;

export default function EditarImovelPage({ params }: { params: Params }) {
  const { id } = use(params);
  const imovel = useImovel(id);

  if (!imovel) {
    return (
      <div className="px-4 md:px-0">
        <Header title="Não encontrado" showBack />
        <p className="text-sm text-muted">Imóvel não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0">
      <Header title="Editar imóvel" showBack />
      <div className="mx-auto hidden max-w-3xl pb-6 md:block">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Editar imóvel</h1>
        <p className="mt-1 text-sm text-muted truncate">{imovel.titulo}</p>
      </div>
      <ImovelForm imovel={imovel} />
    </div>
  );
}
