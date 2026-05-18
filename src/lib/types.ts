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
  valorMaxPermuta?: number; // teto que o vendedor aceita receber em permuta
  comissaoPercentual: number; // % de comissão do corretor
  proprietario: {
    nome: string;
    telefone: string;
  };
  criadoEm: string;
}

export interface PropostaPermuta {
  id: string;
  imovelOrigemId: string; // imóvel que está sendo vendido
  itemPermuta: {
    tipo: AceitaPermutaEm;
    descricao: string;
    valorEstimado: number;
    imovelId?: string; // se for permuta de imóvel cadastrado
  };
  diferencaValor: number; // valor que o comprador ainda paga em dinheiro
  comissaoEsperada: number; // calculada com base no comissaoPercentual do imóvel
  observacoes?: string;
  criadoEm: string;
}
