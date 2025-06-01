import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import type { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";
import type { Ingresso, ComprarIngresso, RefundIngresso } from "../models/ingresso.model";
import type { ApiResponse } from "../models/response.model";
import { AuthService } from "./auth.service"; 

@Injectable({
  providedIn: "root",
})
export class IngressosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService); 
  private apiUrl = environment.apiUrl;

 
  private _meusIngressos = new BehaviorSubject<Ingresso[]>([]);
  meusIngressos$ = this._meusIngressos.asObservable();

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

 // Fetch all tickets
getIngressos(): Observable<ApiResponse<Ingresso[]>> {
  return this.http.get<ApiResponse<Ingresso[]>>(`${this.apiUrl}/ingressos`, {
    headers: this.getAuthHeaders()
  });
}

// Fetch tickets for the logged-in user
getMeusIngressos(): Observable<ApiResponse<Ingresso[]>> {
  return this.http.get<ApiResponse<Ingresso[]>>(`${this.apiUrl}/ingressos/meus`, {
    headers: this.getAuthHeaders()
  });
}

// Fetch a ticket by its ID
getIngresso(id: number): Observable<ApiResponse<Ingresso>> {
  return this.http.get<ApiResponse<Ingresso>>(`${this.apiUrl}/ingressos/${id}`, {
    headers: this.getAuthHeaders()
  });
}

// Fetch tickets by email
getIngressosPorEmail(email: string): Observable<ApiResponse<Ingresso[]>> {
  return this.http.get<ApiResponse<Ingresso[]>>(`${this.apiUrl}/ingressos/email/${email}`, {
    headers: this.getAuthHeaders()
  });
}

// Fetch tickets by event ID
getIngressosPorEvento(eventoId: number): Observable<ApiResponse<Ingresso[]>> {
  return this.http.get<ApiResponse<Ingresso[]>>(`${this.apiUrl}/ingressos/evento/${eventoId}`, {
    headers: this.getAuthHeaders()
  });
}

// Purchase a ticket
comprarIngresso(compra: ComprarIngresso): Observable<ApiResponse<Ingresso>> {
  return this.http.post<ApiResponse<Ingresso>>(
    `${this.apiUrl}/ingressos/comprar`, 
    compra, 
    { headers: this.getAuthHeaders() }
  );
}

// Request a refund for a ticket
solicitarReembolso(id: number, refund: RefundIngresso): Observable<ApiResponse<boolean>> {
  return this.http.post<ApiResponse<boolean>>(
    `${this.apiUrl}/ingressos/${id}/reembolso`, 
    refund, 
    { headers: this.getAuthHeaders() }
  );
}

// Validate a ticket by its code
validarIngresso(codigo: string): Observable<ApiResponse<Ingresso>> {
  return this.http.get<ApiResponse<Ingresso>>(
    `${this.apiUrl}/ingressos/validar/${codigo}`, 
    { headers: this.getAuthHeaders() }
  );
}

// Download a ticket as a PDF
baixarIngressoPdf(id: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/ingressos/${id}/pdf`, {
    responseType: 'blob',
  });
}
}