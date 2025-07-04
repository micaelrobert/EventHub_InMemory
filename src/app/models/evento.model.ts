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


export interface AtualizarEvento extends CriarEvento {
  id: number; 
  ativo: boolean;
}