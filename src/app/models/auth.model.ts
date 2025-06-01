// backend após o login
export interface LoginResponseDto {
  token: string;
  email: string;
  papel: string;
  nomeUsuario: string; 
  expiracao: Date;
}

export interface UsuarioLogado {
  email: string;
  papel: string;
  nomeUsuario: string; 
}

export interface LoginRequestDto {
  email: string;
  senha: string;
}

export interface RegistroRequestDto {
  nomeUsuario: string; 
  email: string;
  senha: string;
  confirmacaoSenha: string;
}