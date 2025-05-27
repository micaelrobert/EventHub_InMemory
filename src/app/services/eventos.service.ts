import { Injectable, inject } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { environment } from "../../environments/environment"
import type { Evento, CriarEvento, AtualizarEvento } from "../models/evento.model"
import type { ApiResponse } from "../models/response.model"

@Injectable({
  providedIn: "root",
})
export class EventosService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl

  // ⭐ Buscar todos os eventos
  getEventos(): Observable<ApiResponse<Evento[]>> {
    return this.http.get<ApiResponse<Evento[]>>(`${this.apiUrl}/eventos`)
  }

  // ⭐ Buscar evento por ID
  getEvento(id: number): Observable<ApiResponse<Evento>> {
    return this.http.get<ApiResponse<Evento>>(`${this.apiUrl}/eventos/${id}`)
  }

  // ⭐ Buscar eventos ativos
  getEventosAtivos(): Observable<ApiResponse<Evento[]>> {
    return this.http.get<ApiResponse<Evento[]>>(`${this.apiUrl}/eventos/ativos`)
  }

  // ⭐ Buscar eventos com ingressos disponíveis
  getEventosDisponiveis(): Observable<ApiResponse<Evento[]>> {
    return this.http.get<ApiResponse<Evento[]>>(`${this.apiUrl}/eventos/disponiveis`)
  }

  // ⭐ Criar novo evento
  criarEvento(evento: CriarEvento): Observable<ApiResponse<Evento>> {
    return this.http.post<ApiResponse<Evento>>(`${this.apiUrl}/eventos`, evento)
  }

  // ⭐ Atualizar evento
  atualizarEvento(id: number, evento: AtualizarEvento): Observable<ApiResponse<Evento>> {
    return this.http.put<ApiResponse<Evento>>(`${this.apiUrl}/eventos/${id}`, evento)
  }

  // ⭐ Deletar evento
  deletarEvento(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/eventos/${id}`)
  }
}
