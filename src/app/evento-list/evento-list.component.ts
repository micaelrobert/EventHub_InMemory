// src/app/evento-list/evento-list.component.ts (AJUSTADO)

import { Component, inject, OnInit } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { RouterModule, Router } from "@angular/router"; // Importar Router aqui
import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // REMOVIDO: Não precisamos mais do MatDialog aqui
// import { ComprarIngressoDialogComponent } from '../components/comprar-ingresso-dialog/comprar-ingresso-dialog.component'; // REMOVIDO: Não precisamos mais do ComprarIngressoDialogComponent

import { EventosService } from "../services/eventos.service";
import type { Evento } from "../models/evento.model";
import type { ApiResponse } from "../models/response.model";
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: "app-evento-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    DatePipe,
    // MatDialogModule, // REMOVIDO: Não precisamos mais do MatDialogModule
  ],
  templateUrl: "./evento-list.component.html",
  styleUrls: ["./evento-list.component.css"],
})
export class EventoListComponent implements OnInit {
  private eventosService = inject(EventosService);
  // private dialog = inject(MatDialog); // REMOVIDO: Não precisamos mais do MatDialog aqui
  private router = inject(Router); // ADICIONADO: Injetar Router para navegação
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  eventos: Evento[] = [];

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    const loadObservable = this.authService.isAdmin()
      ? this.eventosService.getEventos()
      : this.eventosService.getEventosDisponiveis();

    loadObservable.subscribe({
      next: (response: ApiResponse<Evento[]>) => {
        if (response.sucesso && response.dados) {
          this.eventos = response.dados;
        } else {
          this.notificationService.error(response.mensagem || "Falha ao carregar eventos.");
        }
      },
      error: (err) => {
        this.notificationService.error("Erro de comunicação ao carregar eventos.");
        console.error("Erro ao carregar eventos:", err);
      }
    });
  }

  getImagemEvento(evento: Evento): string {
    if (evento.imagemUrl && evento.imagemUrl.trim() !== '') {
      return evento.imagemUrl;
    }
    return 'assets/imgs/evento-padrao.jpeg';
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/imgs/evento-padrao.jpeg';
  }

  getStatusColor(evento: Evento): string {
    if (!evento.ativo) return "warn";
    if (evento.ingressosDisponiveis === 0) return "warn";
    if (evento.ingressosDisponiveis <= 10) return "accent";
    return "primary";
  }

  deletar(evento: Evento): void {
    if (!this.authService.isAdmin()) {
      this.notificationService.error("Ação não permitida.");
      return;
    }

    if (confirm(`Tem certeza que deseja deletar o evento "${evento.nome}"?`)) {
      this.eventosService.deletarEvento(evento.id).subscribe({
        next: (response: ApiResponse<boolean>) => {
          if (response.sucesso) {
            this.notificationService.success("Evento deletado com sucesso!");
            this.carregarEventos();
          } else {
            this.notificationService.error(response.mensagem || "Não foi possível deletar o evento.");
          }
        },
        error: (err) => {
          this.notificationService.error("Erro de comunicação ao tentar deletar o evento.");
          console.error("Erro ao deletar evento:", err);
        }
      });
    }
  }

  // MÉTODO COMPRAR INGRESSO ATUALIZADO PARA NAVEGAR PARA A NOVA PAGE
  comprarIngresso(evento: Evento): void {
    // Navega para a nova rota de compra, passando o ID do evento
    this.router.navigate(['/comprar', evento.id]);
  }
}