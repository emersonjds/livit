"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./Button";
import { Field, Select, Textarea, Toggle, Chip } from "./Field";
import { formatCurrencyInput, parseCurrency } from "@/lib/formatters";
import { gerarId, salvarImovel } from "@/lib/store";
import { COMISSAO_PADRAO_DEFAULT, obterConfig } from "@/lib/storage";
import type { AceitaPermutaEm, Imovel, TipoImovel } from "@/lib/types";

const TIPOS: TipoImovel[] = ["Apartamento", "Casa", "Terreno", "Comercial", "Rural", "Galpão"];
const PERMUTAS: AceitaPermutaEm[] = ["Imóvel", "Veículo", "Outro"];

const numStr = (n?: number) => (n === undefined || n === null ? "" : String(n));

export default function ImovelForm({ imovel }: { imovel?: Imovel }) {
  const router = useRouter();
  const isEdit = Boolean(imovel);

  const [titulo, setTitulo] = useState(imovel?.titulo ?? "");
  const [tipo, setTipo] = useState<TipoImovel>(imovel?.tipo ?? "Apartamento");
  const [valor, setValor] = useState(numStr(imovel?.valor));
  const [area, setArea] = useState(numStr(imovel?.area));
  const [quartos, setQuartos] = useState(numStr(imovel?.quartos));
  const [banheiros, setBanheiros] = useState(numStr(imovel?.banheiros));
  const [vagas, setVagas] = useState(numStr(imovel?.vagas));
  const [descricao, setDescricao] = useState(imovel?.descricao ?? "");

  const [cep, setCep] = useState(imovel?.endereco.cep ?? "");
  const [rua, setRua] = useState(imovel?.endereco.rua ?? "");
  const [numero, setNumero] = useState(imovel?.endereco.numero ?? "");
  const [complemento, setComplemento] = useState(imovel?.endereco.complemento ?? "");
  const [bairro, setBairro] = useState(imovel?.endereco.bairro ?? "");
  const [cidade, setCidade] = useState(imovel?.endereco.cidade ?? "");
  const [estado, setEstado] = useState(imovel?.endereco.estado ?? "SP");

  const [aceitaPermuta, setAceitaPermuta] = useState(imovel?.aceitaPermuta ?? false);
  const [aceitaPermutaEm, setAceitaPermutaEm] = useState<AceitaPermutaEm[]>(
    imovel?.aceitaPermutaEm ?? []
  );
  const [valorMaxPermuta, setValorMaxPermuta] = useState(numStr(imovel?.valorMaxPermuta));
  const [comissao, setComissao] = useState(() => {
    if (imovel) return numStr(imovel.comissaoPercentual);
    const padrao = obterConfig().comissaoPadrao ?? COMISSAO_PADRAO_DEFAULT;
    return String(padrao);
  });

  const [nomeProp, setNomeProp] = useState(imovel?.proprietario.nome ?? "");
  const [telProp, setTelProp] = useState(imovel?.proprietario.telefone ?? "");

  const [saving, setSaving] = useState(false);

  const toggleTipoPermuta = (t: AceitaPermutaEm) => {
    setAceitaPermutaEm((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const salvo: Imovel = {
      id: imovel?.id ?? gerarId(),
      titulo,
      tipo,
      valor: parseCurrency(valor),
      area: Number(area) || 0,
      quartos: quartos ? Number(quartos) : undefined,
      banheiros: banheiros ? Number(banheiros) : undefined,
      vagas: vagas ? Number(vagas) : undefined,
      descricao,
      endereco: {
        cep,
        rua,
        numero,
        complemento: complemento || undefined,
        bairro,
        cidade,
        estado,
      },
      fotos: imovel?.fotos ?? [],
      aceitaPermuta,
      aceitaPermutaEm: aceitaPermuta ? aceitaPermutaEm : [],
      valorMaxPermuta:
        aceitaPermuta && valorMaxPermuta ? parseCurrency(valorMaxPermuta) : undefined,
      comissaoPercentual: Number(comissao) || 0,
      proprietario: { nome: nomeProp, telefone: telProp },
      criadoEm: imovel?.criadoEm ?? new Date().toISOString(),
    };
    salvarImovel(salvo);
    router.push(`/imovel/${salvo.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl space-y-6">
      <Section
        title="Dados principais"
        subtitle="Informações básicas do anúncio que aparecem na busca."
      >
        <Field
          label="Título do anúncio"
          placeholder="Ex: Apartamento 2 dorm, Pinheiros"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <div className="grid gap-3 md:grid-cols-2">
          <Select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoImovel)}
            options={TIPOS.map((t) => ({ value: t, label: t }))}
          />
          <Field
            label="Valor (R$)"
            inputMode="numeric"
            placeholder="R$ 0"
            value={valor ? formatCurrencyInput(parseCurrency(valor)) : ""}
            onChange={(e) => setValor(String(parseCurrency(e.target.value)))}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Field
            label="Área (m²)"
            inputMode="numeric"
            value={area}
            onChange={(e) => setArea(e.target.value.replace(/\D/g, ""))}
            required
          />
          <Field
            label="Quartos"
            inputMode="numeric"
            value={quartos}
            onChange={(e) => setQuartos(e.target.value.replace(/\D/g, ""))}
          />
          <Field
            label="Banheiros"
            inputMode="numeric"
            value={banheiros}
            onChange={(e) => setBanheiros(e.target.value.replace(/\D/g, ""))}
          />
          <Field
            label="Vagas"
            inputMode="numeric"
            value={vagas}
            onChange={(e) => setVagas(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <Textarea
          label="Descrição"
          rows={4}
          placeholder="Pontos fortes, reformas, diferenciais..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </Section>

      <Section title="Endereço" subtitle="Onde está o imóvel.">
        <div className="grid gap-3 md:grid-cols-[140px_1fr]">
          <Field
            label="CEP"
            inputMode="numeric"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
          <Field label="Rua" value={rua} onChange={(e) => setRua(e.target.value)} required />
        </div>
        <div className="grid gap-3 md:grid-cols-[140px_1fr]">
          <Field
            label="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
          <Field
            label="Complemento"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_80px]">
          <Field
            label="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            required
          />
          <Field
            label="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          />
          <Field
            label="UF"
            maxLength={2}
            value={estado}
            onChange={(e) => setEstado(e.target.value.toUpperCase())}
            required
          />
        </div>
      </Section>

      <Section
        title="Permuta"
        subtitle="O grande diferencial: permita que o cliente ofereça bens em troca."
      >
        <Toggle checked={aceitaPermuta} onChange={setAceitaPermuta} label="Aceita permuta" />
        {aceitaPermuta && (
          <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
            <div>
              <p className="mb-2 text-sm font-medium">Aceita em troca:</p>
              <div className="flex flex-wrap gap-2">
                {PERMUTAS.map((t) => (
                  <Chip
                    key={t}
                    active={aceitaPermutaEm.includes(t)}
                    onClick={() => toggleTipoPermuta(t)}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </div>
            <Field
              label="Valor máximo aceito em permuta (R$)"
              hint="Teto que o vendedor topa receber em itens. Acima disso a calculadora avisa."
              inputMode="numeric"
              placeholder="R$ 0"
              value={
                valorMaxPermuta ? formatCurrencyInput(parseCurrency(valorMaxPermuta)) : ""
              }
              onChange={(e) => setValorMaxPermuta(String(parseCurrency(e.target.value)))}
            />
          </div>
        )}
      </Section>

      <Section title="Comissão e contato" subtitle="Dados internos do corretor e do proprietário.">
        <div className="grid gap-3 md:grid-cols-[160px_1fr_220px]">
          <Field
            label="Comissão (%)"
            inputMode="decimal"
            value={comissao}
            onChange={(e) => setComissao(e.target.value.replace(",", "."))}
            required
          />
          <Field
            label="Nome do proprietário"
            value={nomeProp}
            onChange={(e) => setNomeProp(e.target.value)}
            required
          />
          <Field
            label="Telefone"
            inputMode="tel"
            placeholder="(11) 9 0000-0000"
            value={telProp}
            onChange={(e) => setTelProp(e.target.value)}
            required
          />
        </div>
      </Section>

      <div className="sticky bottom-20 z-30 -mx-4 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:bottom-0 md:mx-0 md:flex md:items-center md:justify-end md:gap-3 md:rounded-xl md:border md:px-4 md:py-3 md:shadow-sm">
        <p className="hidden text-sm text-muted md:block md:mr-auto">
          {isEdit ? "Suas alterações serão salvas localmente." : "Você poderá editar depois."}
        </p>
        {isEdit && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/imovel/${imovel!.id}`)}
            fullWidth={false}
            className="hidden md:inline-flex"
          >
            Cancelar
          </Button>
        )}
        <div className="flex gap-2 md:contents">
          {isEdit && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/imovel/${imovel!.id}`)}
              fullWidth={false}
              className="flex-1 md:hidden"
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={saving}
            fullWidth={!isEdit}
            className={isEdit ? "flex-1 md:flex-none md:w-auto md:px-6" : "md:w-auto md:px-6"}
          >
            {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar imóvel"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm md:p-6">
      <header className="mb-4">
        <h2 className="text-base font-semibold md:text-lg">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
