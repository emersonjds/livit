"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { Field } from "@/components/Field";
import {
  COMISSAO_PADRAO_DEFAULT,
  obterConfig,
  salvarConfig,
  limparTodosDados,
} from "@/lib/storage";

export default function ConfiguracoesPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [comissao, setComissao] = useState<string>(String(COMISSAO_PADRAO_DEFAULT));
  const [confirmandoLimpar, setConfirmandoLimpar] = useState(false);
  const [salvoMsg, setSalvoMsg] = useState(false);
  const [comissaoMsg, setComissaoMsg] = useState(false);

  useEffect(() => {
    const config = obterConfig();
    setWhatsapp(config.whatsapp ?? "");
    setComissao(String(config.comissaoPadrao ?? COMISSAO_PADRAO_DEFAULT));
  }, []);

  const handleSalvarContato = (e: React.FormEvent) => {
    e.preventDefault();
    const atual = obterConfig();
    salvarConfig({ ...atual, whatsapp });
    setSalvoMsg(true);
    setTimeout(() => setSalvoMsg(false), 2000);
  };

  const handleSalvarComissao = (e: React.FormEvent) => {
    e.preventDefault();
    const valor = Number(comissao);
    if (Number.isNaN(valor) || valor < 0 || valor > 100) return;
    const atual = obterConfig();
    salvarConfig({ ...atual, comissaoPadrao: valor });
    setComissaoMsg(true);
    setTimeout(() => setComissaoMsg(false), 2000);
  };

  const handleLimpar = () => {
    if (!confirmandoLimpar) {
      setConfirmandoLimpar(true);
      return;
    }
    limparTodosDados();
    setConfirmandoLimpar(false);
    window.location.reload();
  };

  return (
    <div>
      <Header title="Configurações" />

      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="mt-1 text-sm text-muted">Preferências do aplicativo</p>
      </div>

      <div className="space-y-5">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm md:p-6">
          <h2 className="mb-1 text-base font-semibold text-foreground">Comissão padrão</h2>
          <p className="mb-4 text-sm text-muted">
            Percentual aplicado por padrão em novos imóveis cadastrados. Pode ser ajustado
            individualmente em cada anúncio.
          </p>
          <form onSubmit={handleSalvarComissao} className="space-y-4">
            <Field
              label="Comissão (%)"
              inputMode="decimal"
              type="number"
              step="0.5"
              min={0}
              max={100}
              value={comissao}
              onChange={(e) => setComissao(e.target.value)}
              hint={`Padrão sugerido: ${COMISSAO_PADRAO_DEFAULT}%.`}
            />
            <div className="flex items-center gap-3">
              <Button type="submit" fullWidth={false} className="flex-1 md:flex-none md:w-auto">
                Salvar comissão
              </Button>
              {comissaoMsg && (
                <span className="text-sm font-medium text-success">Salvo!</span>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm md:p-6">
          <h2 className="mb-1 text-base font-semibold text-foreground">Contato padrão</h2>
          <p className="mb-4 text-sm text-muted">
            Número do seu WhatsApp usado nos links de contato direto.
          </p>
          <form onSubmit={handleSalvarContato} className="space-y-4">
            <Field
              label="WhatsApp"
              inputMode="tel"
              placeholder="55 11 9 0000-0000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              hint="Inclua o DDI (55 para Brasil)."
            />
            <div className="flex items-center gap-3">
              <Button type="submit" fullWidth={false} className="flex-1 md:flex-none md:w-auto">
                Salvar contato
              </Button>
              {salvoMsg && (
                <span className="text-sm font-medium text-success">Salvo!</span>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm md:p-6">
          <h2 className="mb-1 text-base font-semibold text-foreground">Dados locais</h2>
          <p className="mb-4 text-sm text-muted">
            Apaga todos os imóveis, propostas, compromissos e configurações armazenados neste
            dispositivo. Esta ação não pode ser desfeita.
          </p>
          {confirmandoLimpar ? (
            <div className="space-y-3 rounded-lg border border-danger/30 bg-danger/5 p-4">
              <p className="text-sm font-medium text-danger">
                Tem certeza? Todos os dados serão perdidos permanentemente.
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth={false}
                  onClick={() => setConfirmandoLimpar(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  fullWidth={false}
                  onClick={handleLimpar}
                  className="flex-1"
                >
                  Sim, apagar tudo
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="danger"
              fullWidth={false}
              onClick={handleLimpar}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              </svg>
              Limpar dados locais
            </Button>
          )}
        </section>
      </div>
    </div>
  );
}
