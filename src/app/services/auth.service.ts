import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequestDto, LoginResponseDto, RegistroRequestDto, UsuarioLogado } from '../models/auth.model';
import { ApiResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authApiUrl = `${environment.apiUrl.replace('/eventos', '').replace('/api', '')}/api/auth`; 

  private usuarioAtualSubject = new BehaviorSubject<UsuarioLogado | null>(this.getUsuarioLogadoFromStorage());
  public usuarioAtual$ = this.usuarioAtualSubject.asObservable();

  constructor() { }

  private getUsuarioLogadoFromStorage(): UsuarioLogado | null {
    const email = localStorage.getItem('userEmail');
    const papel = localStorage.getItem('userRole');
    const nomeUsuario = localStorage.getItem('userName'); 
    if (email && papel && nomeUsuario) {
      return { email, papel, nomeUsuario };
    }
    return null;
  }

  public get usuarioLogadoValor(): UsuarioLogado | null {
    return this.usuarioAtualSubject.value;
  }

  login(credenciais: LoginRequestDto): Observable<ApiResponse<LoginResponseDto>> {
    return this.http.post<ApiResponse<LoginResponseDto>>(`${this.authApiUrl}/login`, credenciais)
      .pipe(
        tap(response => {
          if (response.sucesso && response.dados) {
            localStorage.setItem('authToken', response.dados.token);
            localStorage.setItem('userEmail', response.dados.email);
            localStorage.setItem('userRole', response.dados.papel);
            localStorage.setItem('userName', response.dados.nomeUsuario); 
            this.usuarioAtualSubject.next({
              email: response.dados.email,
              papel: response.dados.papel,
              nomeUsuario: response.dados.nomeUsuario 
            });
          }
        })
      );
  }

  registrar(infoUsuario: RegistroRequestDto): Observable<ApiResponse<object>> {
    return this.http.post<ApiResponse<object>>(`${this.authApiUrl}/registrar`, infoUsuario);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName'); 
    this.usuarioAtualSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getPapelUsuario(): string | null {
    if(this.usuarioAtualSubject.value) { // prioritize behaviorSubject
      return this.usuarioAtualSubject.value.papel;
    }
    return localStorage.getItem('userRole'); // Fallback
  }

  getNomeUsuario(): string | null {
    if(this.usuarioAtualSubject.value) {
      return this.usuarioAtualSubject.value.nomeUsuario;
    }
    return localStorage.getItem('userName');
  }

  isAdmin(): boolean {
    return this.getPapelUsuario() === 'Admin';
  }

  isComum(): boolean {
    return this.getPapelUsuario() === 'Comum';
  }
}