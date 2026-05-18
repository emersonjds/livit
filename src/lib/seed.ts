import { listarImoveis, salvarImovel } from "./storage";
import type { Imovel } from "./types";

// Unsplash photos (CC0) — IDs estáveis
const PH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const SEED: Imovel[] = [
  {
    id: "seed-1",
    titulo: "Apartamento Vila Mariana — 2 dorm, suíte",
    tipo: "Apartamento",
    valor: 650000,
    area: 72,
    quartos: 2,
    banheiros: 2,
    vagas: 1,
    descricao:
      "Apartamento totalmente reformado, 2 dormitórios sendo 1 suíte, cozinha americana com armários planejados, varanda gourmet e vista livre. Próximo ao metrô Vila Mariana, escolas e supermercados. Prédio com lazer completo: piscina, academia, salão de festas e portaria 24h.",
    endereco: {
      cep: "04101-300",
      rua: "Rua Vergueiro",
      numero: "2500",
      complemento: "Apto 81",
      bairro: "Vila Mariana",
      cidade: "São Paulo",
      estado: "SP",
    },
    fotos: [
      PH("photo-1502672260266-1c1ef2d93688"),
      PH("photo-1556909114-f6e7ad7d3136"),
      PH("photo-1560448204-e02f11c3d0e2"),
      PH("photo-1493809842364-78817add7ffb"),
    ],
    aceitaPermuta: true,
    aceitaPermutaEm: ["Veículo", "Imóvel"],
    valorMaxPermuta: 250000,
    comissaoPercentual: 5,
    proprietario: { nome: "Maria Silva", telefone: "(11) 98765-4321" },
    criadoEm: new Date().toISOString(),
  },
  {
    id: "seed-2",
    titulo: "Casa Térrea Tatuapé — 3 dorm, quintal amplo",
    tipo: "Casa",
    valor: 980000,
    area: 180,
    quartos: 3,
    banheiros: 3,
    vagas: 2,
    descricao:
      "Casa térrea em rua tranquila, 3 dormitórios sendo 1 suíte, sala ampla com 2 ambientes, cozinha grande, quintal com churrasqueira e edícula. Garagem coberta para 2 carros + vaga descoberta. Excelente para família.",
    endereco: {
      cep: "03340-000",
      rua: "Rua Tuiuti",
      numero: "800",
      bairro: "Tatuapé",
      cidade: "São Paulo",
      estado: "SP",
    },
    fotos: [
      PH("photo-1568605114967-8130f3a36994"),
      PH("photo-1583608205776-bfb35f0d9f83"),
      PH("photo-1600585154340-be6161a56a0c"),
      PH("photo-1600566753190-17f0baa2a6c3"),
    ],
    aceitaPermuta: true,
    aceitaPermutaEm: ["Imóvel"],
    valorMaxPermuta: 500000,
    comissaoPercentual: 6,
    proprietario: { nome: "João Pereira", telefone: "(11) 91234-5678" },
    criadoEm: new Date().toISOString(),
  },
  {
    id: "seed-3",
    titulo: "Terreno 500m² — Granja Viana, em condomínio",
    tipo: "Terreno",
    valor: 480000,
    area: 500,
    descricao:
      "Terreno plano em condomínio fechado, infraestrutura completa (asfalto, água, luz, esgoto), pronto para construir. Condomínio com portaria 24h, área verde e clube.",
    endereco: {
      cep: "06710-000",
      rua: "Estrada da Aldeinha",
      numero: "S/N",
      complemento: "Lote 42",
      bairro: "Granja Viana",
      cidade: "Cotia",
      estado: "SP",
    },
    fotos: [
      PH("photo-1500382017468-9049fed747ef"),
      PH("photo-1416331108676-a22ccb276e35"),
    ],
    aceitaPermuta: false,
    aceitaPermutaEm: [],
    comissaoPercentual: 5,
    proprietario: { nome: "Carlos Mendes", telefone: "(11) 99876-1122" },
    criadoEm: new Date().toISOString(),
  },
  {
    id: "seed-4",
    titulo: "Cobertura Duplex Pinheiros — 3 suítes, vista panorâmica",
    tipo: "Apartamento",
    valor: 2400000,
    area: 220,
    quartos: 3,
    banheiros: 4,
    vagas: 3,
    descricao:
      "Cobertura duplex em condomínio alto padrão, 3 suítes, sala em 3 ambientes, lavabo, cozinha gourmet, terraço com piscina privativa e churrasqueira. Vista 360° de Pinheiros. Acabamento de alto padrão, ar condicionado em todos os ambientes.",
    endereco: {
      cep: "05423-010",
      rua: "Rua Cristiano Viana",
      numero: "450",
      complemento: "Cobertura 1",
      bairro: "Pinheiros",
      cidade: "São Paulo",
      estado: "SP",
    },
    fotos: [
      PH("photo-1512917774080-9991f1c4c750"),
      PH("photo-1600596542815-ffad4c1539a9"),
      PH("photo-1600607687939-ce8a6c25118c"),
      PH("photo-1600210492486-724fe5c67fb0"),
    ],
    aceitaPermuta: true,
    aceitaPermutaEm: ["Imóvel", "Veículo"],
    valorMaxPermuta: 800000,
    comissaoPercentual: 5,
    proprietario: { nome: "Ana Beatriz Costa", telefone: "(11) 98123-7700" },
    criadoEm: new Date().toISOString(),
  },
  {
    id: "seed-5",
    titulo: "Sítio 5.000m² — Atibaia, casa sede + lago",
    tipo: "Rural",
    valor: 1300000,
    area: 5000,
    quartos: 4,
    banheiros: 3,
    vagas: 4,
    descricao:
      "Sítio com 5.000m², casa sede de 280m² com 4 dormitórios sendo 2 suítes, sala de TV, sala de jogos, cozinha caipira, piscina aquecida, lago com peixes, pomar com mais de 30 árvores frutíferas, horta orgânica e área de campo. Documentação ok.",
    endereco: {
      cep: "12940-000",
      rua: "Estrada do Tanque",
      numero: "Km 12",
      bairro: "Tanque",
      cidade: "Atibaia",
      estado: "SP",
    },
    fotos: [
      PH("photo-1600585154340-be6161a56a0c"),
      PH("photo-1564013799919-ab600027ffc6"),
      PH("photo-1605276374104-dee2a0ed3cd6"),
    ],
    aceitaPermuta: true,
    aceitaPermutaEm: ["Imóvel", "Veículo", "Outro"],
    valorMaxPermuta: 700000,
    comissaoPercentual: 6,
    proprietario: { nome: "Roberto Almeida", telefone: "(11) 97654-3210" },
    criadoEm: new Date().toISOString(),
  },
  {
    id: "seed-6",
    titulo: "Galpão Industrial 800m² — Guarulhos, próx. Dutra",
    tipo: "Galpão",
    valor: 1850000,
    area: 800,
    vagas: 10,
    descricao:
      "Galpão industrial com 800m² de área construída em terreno de 1.200m². Pé direito 9m, docas para caminhão, escritório administrativo, vestiários e refeitório. Localização estratégica próximo à Rod. Dutra.",
    endereco: {
      cep: "07112-000",
      rua: "Av. Industrial",
      numero: "1450",
      bairro: "Cumbica",
      cidade: "Guarulhos",
      estado: "SP",
    },
    fotos: [
      PH("photo-1565793298595-6a879b1d9492"),
      PH("photo-1581094288338-2314dddb7ece"),
    ],
    aceitaPermuta: true,
    aceitaPermutaEm: ["Imóvel"],
    valorMaxPermuta: 900000,
    comissaoPercentual: 4,
    proprietario: { nome: "Indústria Almeida Ltda", telefone: "(11) 94455-8899" },
    criadoEm: new Date().toISOString(),
  },
  {
    id: "seed-7",
    titulo: "Sala Comercial — Av. Paulista, alto padrão",
    tipo: "Comercial",
    valor: 720000,
    area: 65,
    banheiros: 1,
    vagas: 1,
    descricao:
      "Sala comercial em edifício corporativo de alto padrão na Av. Paulista. Piso vinílico, ar condicionado central, divisórias removíveis, recepção, banheiro privativo. Prédio com manobrista, segurança 24h e auditório.",
    endereco: {
      cep: "01310-100",
      rua: "Av. Paulista",
      numero: "1842",
      complemento: "Conj. 1203",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
    },
    fotos: [
      PH("photo-1497366216548-37526070297c"),
      PH("photo-1497366754035-f200968a6e72"),
    ],
    aceitaPermuta: false,
    aceitaPermutaEm: [],
    comissaoPercentual: 5,
    proprietario: { nome: "Patricia Tanaka", telefone: "(11) 91122-3344" },
    criadoEm: new Date().toISOString(),
  },
];

const SEED_VERSION = "v2-fotos";
const KEY_VERSION = "livit.seedVersion";

export const semearSeNecessario = (): void => {
  if (typeof window === "undefined") return;
  const versaoAtual = window.localStorage.getItem(KEY_VERSION);
  const atuais = listarImoveis();
  if (atuais.length === 0 || versaoAtual !== SEED_VERSION) {
    // mantém imóveis cadastrados pelo usuário (não-seed) e adiciona os seeds atualizados
    const naoSeed = atuais.filter((i) => !i.id.startsWith("seed-"));
    window.localStorage.removeItem("livit.imoveis");
    [...SEED, ...naoSeed].forEach(salvarImovel);
    window.localStorage.setItem(KEY_VERSION, SEED_VERSION);
  }
};

export const reseedar = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("livit.imoveis");
  SEED.forEach(salvarImovel);
};
