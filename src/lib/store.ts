"use client";

import { useSyncExternalStore } from "react";
import * as storage from "./storage";
import { semearSeNecessario } from "./seed";
import type { Imovel, PropostaPermuta } from "./types";

export { gerarId } from "./storage";

const listeners = new Set<() => void>();
let seeded = false;

let imoveisCache: Imovel[] | null = null;
let propostasCache: PropostaPermuta[] | null = null;
const propostasByImovel = new Map<string, PropostaPermuta[]>();

const EMPTY_IMOVEIS: readonly Imovel[] = Object.freeze([]);
const EMPTY_PROPOSTAS: readonly PropostaPermuta[] = Object.freeze([]);

function ensureSeed() {
  if (seeded) return;
  if (typeof window === "undefined") return;
  semearSeNecessario();
  seeded = true;
}

function invalidate() {
  imoveisCache = null;
  propostasCache = null;
  propostasByImovel.clear();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getImoveisSnapshot(): readonly Imovel[] {
  ensureSeed();
  if (imoveisCache === null) imoveisCache = storage.listarImoveis();
  return imoveisCache;
}

function getPropostasSnapshot(): readonly PropostaPermuta[] {
  if (propostasCache === null) propostasCache = storage.listarPropostas();
  return propostasCache;
}

function getPropostasFor(imovelId: string): readonly PropostaPermuta[] {
  const cached = propostasByImovel.get(imovelId);
  if (cached) return cached;
  const filtered = getPropostasSnapshot().filter((p) => p.imovelOrigemId === imovelId);
  propostasByImovel.set(imovelId, filtered);
  return filtered;
}

export function useImoveis(): readonly Imovel[] {
  return useSyncExternalStore(subscribe, getImoveisSnapshot, () => EMPTY_IMOVEIS);
}

export function useImovel(id: string): Imovel | null {
  return useSyncExternalStore(
    subscribe,
    () => getImoveisSnapshot().find((i) => i.id === id) ?? null,
    () => null
  );
}

export function usePropostas(imovelId?: string): readonly PropostaPermuta[] {
  return useSyncExternalStore(
    subscribe,
    () => (imovelId ? getPropostasFor(imovelId) : getPropostasSnapshot()),
    () => EMPTY_PROPOSTAS
  );
}

export function salvarImovel(imovel: Imovel) {
  storage.salvarImovel(imovel);
  invalidate();
}

export function removerImovel(id: string) {
  storage.removerImovel(id);
  invalidate();
}

export function salvarProposta(p: PropostaPermuta) {
  storage.salvarProposta(p);
  invalidate();
}
