// src/app/models/ingresso.model.ts (AJUSTADO PARA O BACKEND C#)

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
  // Propriedade 'status' removida. Adicionando 'ativo' para corresponder ao backend
  ativo: boolean; // <<<<<< AGORA CORRESPONDE AO 'bool Ativo' DO SEU DTO C#

  dataDevolucao?: Date | null;
  motivoDevolucao?: string | null;
  evento?: {
    nome: string;
    dataEvento: Date;
    local: string;
  };
}

// O enum StatusIngresso ainda pode ser útil para display ou lógica interna,
// mas ele não será mais diretamente mapeado da propriedade 'status' do backend.
// Manter ele aqui para uso no frontend, como em `getStatusColor`.
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