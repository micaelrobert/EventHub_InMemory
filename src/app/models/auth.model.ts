// O que esperamos receber do backend após o login
export interface LoginResponseDto {
  token: string;
  email: string;
  papel: string;
  nomeUsuario: string; // <<< ADICIONADO
  expiracao: Date;
}

// Uma interface simples para guardar informações do usuário logado no serviço
export interface UsuarioLogado {
  email: string;
  papel: string;
  nomeUsuario: string; // <<< ADICIONADO
}

// DTO para enviar ao fazer login
export interface LoginRequestDto {
  email: string;
  senha: string;
}

// DTO para enviar ao registrar
export interface RegistroRequestDto {
  nomeUsuario: string; // <<< ADICIONADO
  email: string;
  senha: string;
  confirmacaoSenha: string;
}