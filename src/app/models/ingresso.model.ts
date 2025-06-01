

export interface Ingresso {
  id: number;
  eventoId: number;
  nomeEvento: string;
  nomeComprador: string;
  emailComprador: string;
  telefoneComprador: string;
  quantidade: number;
  valorTotal: number;
  dataCompra: Date;
  precoIngresso: number;
  ingressosVendidos: number;
  codigo: string;
  ativo: boolean; 

  dataDevolucao?: Date | null;
  motivoDevolucao?: string | null;
  evento?: {
    nome: string;
    dataEvento: Date;
    local: string;
  };
}

export enum StatusIngresso {
  Ativo = "Ativo",
  Cancelado = "Cancelado",
  Usado = "Usado",
}

export interface ComprarIngresso {
  eventoId: number;
  nomeComprador: string;
  emailComprador: string;
  telefoneComprador: string;
  quantidade: number;
}

export interface RefundIngresso {
  motivo: string;
}