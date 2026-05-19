export type TipoImovel =
  | "Apartamento"
  | "Casa"
  | "Terreno"
  | "Comercial"
  | "Rural"
  | "Galpão";

export type AceitaPermutaEm =
  | "Imóvel"
  | "Veículo"
  | "Outro";

export interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Imovel {
  id: string;
  titulo: string;
  tipo: TipoImovel;
  valor: number;
  area: number; // m²
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  descricao: string;
  endereco: Endereco;
  fotos: string[]; // urls ou data URIs
  aceitaPermuta: boolean;
  aceitaPermutaEm: AceitaPermutaEm[];
  valorMaxPermuta?: number;
  comissaoPercentual: number;
  proprietario: {
    nome: string;
    telefone: string;
  };
  criadoEm: string;
}

export interface PropostaPermuta {
  id: string;
  imovelOrigemId: string;
  itemPermuta: {
    tipo: AceitaPermutaEm;
    descricao: string;
    valorEstimado: number;
    imovelId?: string;
  };
  diferencaValor: number;
  comissaoEsperada: number;
  observacoes?: string;
  criadoEm: string;
}

export interface Compromisso {
  id: string;
  titulo: string;
  data: string; // ISO date "YYYY-MM-DD"
  hora: string; // "HH:mm"
  imovelId?: string;
  contato?: string;
  observacoes?: string;
  criadoEm: string;
}

export interface Corretor {
  nome: string;
  creci: string;
  telefone: string;
  email: string;
  fotoUrl?: string;
  bio?: string;
}
