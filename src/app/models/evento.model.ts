export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  dataEvento: Date;
  local: string;
  precoIngresso: number;
  capacidadeMaxima: number;
  ingressosVendidos: number;
  ingressosDisponiveis: number;
  ativo: boolean;
  dataCriacao: Date;
  imagemUrl: string;
}
export interface Evento {
  // ... other properties
  status: 'aberto' | 'encerrado' | 'esgotado' | string;
}

export interface CriarEvento {
  nome: string;
  descricao: string;
  dataEvento: Date;
  local: string;
  precoIngresso: number;
  capacidadeMaxima: number;
}

// A interface AtualizarEvento pode herdar de CriarEvento para evitar repetição
export interface AtualizarEvento extends CriarEvento {
  id: number; // Precisamos do ID para saber qual evento atualizar
  ativo: boolean;
}