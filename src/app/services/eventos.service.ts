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

 
 getEventos(): Observable<ApiResponse<Evento[]>> {
  // Fetches all events from the API.
  return this.http.get<ApiResponse<Evento[]>>(`${this.apiUrl}/eventos`);
}

getEvento(id: number): Observable<ApiResponse<Evento>> {
  // Fetches a single event by its ID from the API.
  return this.http.get<ApiResponse<Evento>>(`${this.apiUrl}/eventos/${id}`);
}

getEventosAtivos(): Observable<ApiResponse<Evento[]>> {
  // Fetches all active events from the API.
  return this.http.get<ApiResponse<Evento[]>>(`${this.apiUrl}/eventos/ativos`);
}

getEventosDisponiveis(): Observable<ApiResponse<Evento[]>> {
  // Fetches all available events from the API.
  return this.http.get<ApiResponse<Evento[]>>(`${this.apiUrl}/eventos/disponiveis`);
}

criarEvento(evento: CriarEvento): Observable<ApiResponse<Evento>> {
  // Creates a new event by sending a POST request to the API.
  return this.http.post<ApiResponse<Evento>>(`${this.apiUrl}/eventos`, evento);
}

atualizarEvento(id: number, evento: AtualizarEvento): Observable<ApiResponse<Evento>> {
  // Updates an existing event by its ID with the provided data via a PUT request.
  return this.http.put<ApiResponse<Evento>>(`${this.apiUrl}/eventos/${id}`, evento);
}

deletarEvento(id: number): Observable<ApiResponse<boolean>> {
  // Deletes an event by its ID using a DELETE request.
  return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/eventos/${id}`);
}
}