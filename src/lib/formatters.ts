export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const formatArea = (v: number) => `${v.toLocaleString("pt-BR")} m²`;

export const parseCurrency = (s: string): number => {
  const digits = s.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits);
};

export const formatCurrencyInput = (v: number): string => {
  if (!v) return "";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
};

export const whatsappLink = (telefone: string, mensagem?: string): string => {
  const digits = telefone.replace(/\D/g, "");
  if (!digits) return "#";
  const comDDI = digits.startsWith("55") ? digits : `55${digits}`;
  const query = mensagem ? `?text=${encodeURIComponent(mensagem)}` : "";
  return `https://wa.me/${comDDI}${query}`;
};
