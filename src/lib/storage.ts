import type { Imovel, PropostaPermuta } from "./types";

const KEY_IMOVEIS = "livit.imoveis";
const KEY_PROPOSTAS = "livit.propostas";

const isBrowser = () => typeof window !== "undefined";

export const gerarId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

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
