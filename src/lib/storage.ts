import type { Imovel, PropostaPermuta, Compromisso, Corretor } from "./types";

const KEY_IMOVEIS = "livit.imoveis";
const KEY_PROPOSTAS = "livit.propostas";
const KEY_COMPROMISSOS = "livit.compromissos.v1";
const KEY_PERFIL = "livit.perfil.v1";
const KEY_CONFIG = "livit.config.v1";

const isBrowser = () => typeof window !== "undefined";

export const gerarId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// ── Imóveis ──────────────────────────────────────────────────────────────────

export const listarImoveis = (): Imovel[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY_IMOVEIS);
    if (!raw) return [];
    return JSON.parse(raw) as Imovel[];
  } catch {
    return [];
  }
};

export const buscarImovel = (id: string): Imovel | null => {
  return listarImoveis().find((i) => i.id === id) ?? null;
};

export const salvarImovel = (imovel: Imovel): void => {
  if (!isBrowser()) return;
  const atuais = listarImoveis();
  const idx = atuais.findIndex((i) => i.id === imovel.id);
  if (idx >= 0) atuais[idx] = imovel;
  else atuais.unshift(imovel);
  window.localStorage.setItem(KEY_IMOVEIS, JSON.stringify(atuais));
};

export const removerImovel = (id: string): void => {
  if (!isBrowser()) return;
  const atuais = listarImoveis().filter((i) => i.id !== id);
  window.localStorage.setItem(KEY_IMOVEIS, JSON.stringify(atuais));
};

// ── Propostas ─────────────────────────────────────────────────────────────────

export const listarPropostas = (imovelId?: string): PropostaPermuta[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY_PROPOSTAS);
    const todas = raw ? (JSON.parse(raw) as PropostaPermuta[]) : [];
    return imovelId ? todas.filter((p) => p.imovelOrigemId === imovelId) : todas;
  } catch {
    return [];
  }
};

export const salvarProposta = (proposta: PropostaPermuta): void => {
  if (!isBrowser()) return;
  const atuais = listarPropostas();
  atuais.unshift(proposta);
  window.localStorage.setItem(KEY_PROPOSTAS, JSON.stringify(atuais));
};

export const removerProposta = (id: string): void => {
  if (!isBrowser()) return;
  const atuais = listarPropostas().filter((p) => p.id !== id);
  window.localStorage.setItem(KEY_PROPOSTAS, JSON.stringify(atuais));
};

// ── Compromissos ──────────────────────────────────────────────────────────────

export const listarCompromissos = (): Compromisso[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY_COMPROMISSOS);
    if (!raw) return [];
    return JSON.parse(raw) as Compromisso[];
  } catch {
    return [];
  }
};

export const salvarCompromisso = (compromisso: Compromisso): void => {
  if (!isBrowser()) return;
  const atuais = listarCompromissos();
  const idx = atuais.findIndex((c) => c.id === compromisso.id);
  if (idx >= 0) atuais[idx] = compromisso;
  else atuais.unshift(compromisso);
  window.localStorage.setItem(KEY_COMPROMISSOS, JSON.stringify(atuais));
};

export const removerCompromisso = (id: string): void => {
  if (!isBrowser()) return;
  const atuais = listarCompromissos().filter((c) => c.id !== id);
  window.localStorage.setItem(KEY_COMPROMISSOS, JSON.stringify(atuais));
};

// ── Perfil ─────────────────────────────────────────────────────────────────────

export const obterPerfil = (): Corretor | null => {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEY_PERFIL);
    if (!raw) return null;
    return JSON.parse(raw) as Corretor;
  } catch {
    return null;
  }
};

export const salvarPerfil = (perfil: Corretor): void => {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY_PERFIL, JSON.stringify(perfil));
};

// ── Configurações ─────────────────────────────────────────────────────────────

export interface Config {
  whatsapp?: string;
  comissaoPadrao?: number;
}

export const COMISSAO_PADRAO_DEFAULT = 6;

export const obterConfig = (): Config => {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(KEY_CONFIG);
    if (!raw) return {};
    return JSON.parse(raw) as Config;
  } catch {
    return {};
  }
};

export const salvarConfig = (config: Config): void => {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY_CONFIG, JSON.stringify(config));
};

export const limparTodosDados = (): void => {
  if (!isBrowser()) return;
  const keys = Object.keys(window.localStorage).filter((k) => k.startsWith("livit."));
  keys.forEach((k) => window.localStorage.removeItem(k));
};
