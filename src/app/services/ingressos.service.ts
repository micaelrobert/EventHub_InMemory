import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import type { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";
import type { Ingresso, ComprarIngresso, RefundIngresso } from "../models/ingresso.model";
import type { ApiResponse } from "../models/response.model";
import { AuthService } from "./auth.service"; // Importe o AuthService

@Injectable({
  providedIn: "root",
})
export class IngressosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService); // Injete o AuthService
  private apiUrl = environment.apiUrl;

 // 1. Adicione um BehaviorSubject para gerenciar o estado dos ingressos
  private _meusIngressos = new BehaviorSubject<Ingresso[]>([]);
  meusIngressos$ = this._meusIngressos.asObservable();

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ⭐ Buscar todos os ingressos
  getIngressos(): Observable<ApiResponse<Ingresso[]>> {
    return this.http.get<ApiResponse<Ingresso[]>>(`${this.apiUrl}/ingressos`, {
      headers: this.getAuthHeaders()
    });
  }

  // ⭐ Buscar ingressos do usuário logado
  getMeusIngressos(): Observable<ApiResponse<Ingresso[]>> {
    return this.http.get<ApiResponse<Ingresso[]>>(`${this.apiUrl}/ingressos/meus`, {
      headers: this.getAuthHeaders()
    });
  }

  // ⭐ Buscar ingresso por ID
  getIngresso(id: number): Observable<ApiResponse<Ingresso>> {
    return this.http.get<ApiResponse<Ingresso>>(`${this.apiUrl}/ingressos/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ⭐ Buscar ingressos por email
  getIngressosPorEmail(email: string): Observable<ApiResponse<Ingresso[]>> {
    return this.http.get<ApiResponse<Ingresso[]>>(`${this.apiUrl}/ingressos/email/${email}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ⭐ Buscar ingressos por evento
  getIngressosPorEvento(eventoId: number): Observable<ApiResponse<Ingresso[]>> {
    return this.http.get<ApiResponse<Ingresso[]>>(`${this.apiUrl}/ingressos/evento/${eventoId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ⭐ Comprar ingresso
  comprarIngresso(compra: ComprarIngresso): Observable<ApiResponse<Ingresso>> {
    return this.http.post<ApiResponse<Ingresso>>(
      `${this.apiUrl}/ingressos/comprar`, 
      compra, 
      { headers: this.getAuthHeaders() }
    );
  }

  // ⭐ Solicitar reembolso
  solicitarReembolso(id: number, refund: RefundIngresso): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(
      `${this.apiUrl}/ingressos/${id}/reembolso`, 
      refund, 
      { headers: this.getAuthHeaders() }
    );
  }

  // ⭐ Validar ingresso
  validarIngresso(codigo: string): Observable<ApiResponse<Ingresso>> {
    return this.http.get<ApiResponse<Ingresso>>(
      `${this.apiUrl}/ingressos/validar/${codigo}`, 
      { headers: this.getAuthHeaders() }
    );
  }
  baixarIngressoPdf(id: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/ingressos/${id}/pdf`, {
    responseType: 'blob',
    
  });

  

  }}