"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { Field, Textarea } from "@/components/Field";
import { usePerfil, salvarPerfilStore } from "@/lib/store";
import type { Corretor } from "@/lib/types";

const PERFIL_PADRAO: Corretor = {
  nome: "",
  creci: "",
  telefone: "",
  email: "",
  fotoUrl: "",
  bio: "",
};

export default function PerfilPage() {
  const perfilSalvo = usePerfil();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<Corretor>(perfilSalvo ?? PERFIL_PADRAO);
  const [salvando, setSalvando] = useState(false);

  const perfil = perfilSalvo ?? PERFIL_PADRAO;
  const inicial = perfil.nome ? perfil.nome[0].toUpperCase() : "C";

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    salvarPerfilStore(form);
    setSalvando(false);
    setEditando(false);
  };

  const handleEditar = () => {
    setForm(perfilSalvo ?? PERFIL_PADRAO);
    setEditando(true);
  };

  const handleCancelar = () => {
    setForm(perfilSalvo ?? PERFIL_PADRAO);
    setEditando(false);
  };

  return (
    <div>
      <Header title="Perfil" />

      <div className="hidden md:block mb-6">
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
        <p className="mt-1 text-sm text-muted">Suas informações como corretor</p>
      </div>

      {/* Banner */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary to-primary/70 md:h-36" />
        <div className="-mt-12 px-4 pb-5 md:px-6 md:pb-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-card bg-primary text-2xl font-bold text-white shadow-sm md:h-24 md:w-24 md:text-3xl">
              {perfil.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={perfil.fotoUrl}
                  alt={perfil.nome}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                inicial
              )}
            </div>
            {!editando && (
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                onClick={handleEditar}
                className="mb-1"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Editar
              </Button>
            )}
          </div>
          {!editando && (
            <div className="mt-3">
              {perfil.nome ? (
                <>
                  <h2 className="text-xl font-bold text-foreground">{perfil.nome}</h2>
                  <p className="text-sm text-muted">
                    {perfil.creci ? `CRECI ${perfil.creci}` : "CRECI não informado"}
                  </p>
                  {perfil.telefone && (
                    <p className="mt-1 text-sm text-muted">{perfil.telefone}</p>
                  )}
                  {perfil.email && (
                    <p className="text-sm text-muted">{perfil.email}</p>
                  )}
                  {perfil.bio && (
                    <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{perfil.bio}</p>
                  )}
                </>
              ) : (
                <div className="mt-3">
                  <p className="text-sm text-muted">Perfil não configurado.</p>
                  <button
                    type="button"
                    onClick={handleEditar}
                    className="mt-1 text-sm font-medium text-primary hover:text-primary-hover"
                  >
                    Configurar agora
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Formulário de edição */}
      {editando && (
        <div className="mt-5 rounded-lg border border-border bg-card p-4 shadow-sm md:p-6">
          <h3 className="mb-4 text-base font-semibold text-foreground">Editar perfil</h3>
          <form onSubmit={handleSalvar} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Nome completo"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                required
              />
              <Field
                label="CRECI"
                placeholder="Ex: 12345-SP"
                value={form.creci}
                onChange={(e) => setForm((f) => ({ ...f, creci: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Telefone / WhatsApp"
                inputMode="tel"
                placeholder="(11) 9 0000-0000"
                value={form.telefone}
                onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
              />
              <Field
                label="E-mail"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <Textarea
              label="Bio / Apresentação"
              rows={3}
              placeholder="Fale um pouco sobre você..."
              value={form.bio ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
            <div className="flex gap-3">
              <Button type="button" variant="secondary" fullWidth={false} onClick={handleCancelar} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={salvando} fullWidth={false} className="flex-1">
                {salvando ? "Salvando..." : "Salvar perfil"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
