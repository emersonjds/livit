"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { Field, Select, Textarea } from "@/components/Field";
import { useCompromissos, salvarCompromisso, removerCompromisso, gerarId } from "@/lib/store";
import type { Compromisso } from "@/lib/types";

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function toYMD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDiasDoMes(ano: number, mes: number): { dia: number | null; date: string }[] {
  const primeiro = new Date(ano, mes, 1);
  const ultimo = new Date(ano, mes + 1, 0);
  const resultado: { dia: number | null; date: string }[] = [];
  for (let i = 0; i < primeiro.getDay(); i++) {
    resultado.push({ dia: null, date: "" });
  }
  for (let d = 1; d <= ultimo.getDate(); d++) {
    const dt = new Date(ano, mes, d);
    resultado.push({ dia: d, date: toYMD(dt) });
  }
  return resultado;
}

export default function AgendaPage() {
  const hoje = new Date();
  const [anoMes, setAnoMes] = useState({ ano: hoje.getFullYear(), mes: hoje.getMonth() });
  const [diaSelecionado, setDiaSelecionado] = useState(toYMD(hoje));
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Compromisso | null>(null);

  const compromissos = useCompromissos();
  const datasComCompromisso = new Set(compromissos.map((c) => c.data));
  const compromissosNoDia = compromissos
    .filter((c) => c.data === diaSelecionado)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const dias = getDiasDoMes(anoMes.ano, anoMes.mes);

  const irMesAnterior = () => {
    setAnoMes(({ ano, mes }) => {
      if (mes === 0) return { ano: ano - 1, mes: 11 };
      return { ano, mes: mes - 1 };
    });
  };

  const irProximoMes = () => {
    setAnoMes(({ ano, mes }) => {
      if (mes === 11) return { ano: ano + 1, mes: 0 };
      return { ano, mes: mes + 1 };
    });
  };

  const abrirNovoCompromisso = () => {
    setEditando(null);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEditando(null);
  };

  const handleRemover = (id: string) => {
    removerCompromisso(id);
  };

  return (
    <div>
      <Header title="Agenda" />

      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
        <p className="mt-1 text-sm text-muted">Gerencie suas visitas e compromissos</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        {/* Calendário */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border md:px-6">
            <button
              type="button"
              onClick={irMesAnterior}
              aria-label="Mês anterior"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-foreground transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <p className="text-sm font-semibold text-foreground">
              {MESES[anoMes.mes]} {anoMes.ano}
            </p>
            <button
              type="button"
              onClick={irProximoMes}
              aria-label="Próximo mês"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-foreground transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="p-4 md:p-6">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DIAS_SEMANA.map((d) => (
                <p key={d} className="text-center text-[11px] font-semibold uppercase text-muted py-1">
                  {d}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {dias.map((item, idx) => {
                if (!item.dia) return <div key={idx} />;
                const isHoje = item.date === toYMD(hoje);
                const isSelecionado = item.date === diaSelecionado;
                const temCompromisso = datasComCompromisso.has(item.date);
                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => setDiaSelecionado(item.date)}
                    className={`relative flex flex-col items-center justify-center rounded-lg py-2 text-sm font-medium transition-colors min-h-[44px] ${
                      isSelecionado
                        ? "bg-primary text-white"
                        : isHoje
                        ? "border border-primary text-primary"
                        : "text-foreground hover:bg-surface"
                    }`}
                  >
                    {item.dia}
                    {temCompromisso && (
                      <span
                        className={`absolute bottom-1 h-1 w-1 rounded-full ${
                          isSelecionado ? "bg-white/70" : "bg-primary"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lista do dia */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border md:px-6">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {new Date(diaSelecionado + "T12:00:00").toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <p className="text-xs text-muted">
                {compromissosNoDia.length} compromisso{compromissosNoDia.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6">
            {compromissosNoDia.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted">Nenhum compromisso neste dia.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {compromissosNoDia.map((c) => (
                  <li key={c.id} className="rounded-lg border border-border bg-surface p-3 dark:bg-card/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5">
                            {c.hora}
                          </span>
                          <p className="text-sm font-medium text-foreground truncate">{c.titulo}</p>
                        </div>
                        {c.contato && (
                          <p className="mt-1 text-xs text-muted">{c.contato}</p>
                        )}
                        {c.observacoes && (
                          <p className="mt-1 text-xs text-muted line-clamp-2">{c.observacoes}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemover(c.id)}
                        aria-label={`Remover compromisso ${c.titulo}`}
                        title="Remover"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={abrirNovoCompromisso}
        aria-label="Novo compromisso"
        title="Novo compromisso"
        className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-hover transition-colors md:bottom-10 md:right-8"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {/* Modal */}
      {modalAberto && (
        <NovoCompromissoModal
          dataPadrao={diaSelecionado}
          compromisso={editando}
          onClose={fecharModal}
        />
      )}
    </div>
  );
}

function NovoCompromissoModal({
  dataPadrao,
  compromisso,
  onClose,
}: {
  dataPadrao: string;
  compromisso: Compromisso | null;
  onClose: () => void;
}) {
  const [titulo, setTitulo] = useState(compromisso?.titulo ?? "");
  const [data, setData] = useState(compromisso?.data ?? dataPadrao);
  const [hora, setHora] = useState(compromisso?.hora ?? "09:00");
  const [contato, setContato] = useState(compromisso?.contato ?? "");
  const [observacoes, setObservacoes] = useState(compromisso?.observacoes ?? "");

  const HORAS = Array.from({ length: 28 }, (_, i) => {
    const h = Math.floor(i / 2) + 7;
    const m = i % 2 === 0 ? "00" : "30";
    return `${String(h).padStart(2, "0")}:${m}`;
  });

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    const novo: Compromisso = {
      id: compromisso?.id ?? gerarId(),
      titulo,
      data,
      hora,
      contato: contato || undefined,
      observacoes: observacoes || undefined,
      criadoEm: compromisso?.criadoEm ?? new Date().toISOString(),
    };
    salvarCompromisso(novo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-card p-6 shadow-xl md:rounded-2xl md:mx-4">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Novo compromisso</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-foreground transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSalvar} className="space-y-4">
          <Field
            label="Título"
            placeholder="Ex: Visita ao apartamento"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
            <Select
              label="Horário"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              options={HORAS.map((h) => ({ value: h, label: h }))}
            />
          </div>
          <Field
            label="Contato"
            placeholder="Nome ou telefone"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
          />
          <Textarea
            label="Observações"
            rows={3}
            placeholder="Detalhes, endereço, etc."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
          <Button type="submit">Salvar compromisso</Button>
        </form>
      </div>
    </div>
  );
}
