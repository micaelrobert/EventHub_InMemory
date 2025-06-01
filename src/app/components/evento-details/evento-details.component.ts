

import { Component, type OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from '@angular/material/divider';
import { EventosService } from "../../services/eventos.service";
import { NotificationService } from "../../services/notification.service";
import type { Evento } from "../../models/evento.model";
import type { ApiResponse } from "../../models/response.model";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: "app-evento-details",
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule, MatProgressSpinnerModule],
  templateUrl: './evento-details.component.html',
  styleUrls: ['./evento-details.component.css'] 
})
export class EventoDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventosService = inject(EventosService);
  private notificationService = inject(NotificationService);
 

  evento: Evento | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.carregarEvento(+id); 
    } else {
      this.notificationService.warning("ID do evento não fornecido.");
      this.router.navigate(["/eventos"]); 
    }
  }

  carregarEvento(id: number): void {
    this.eventosService.getEvento(id).subscribe({
      next: (response: ApiResponse<Evento>) => {
        if (response.sucesso && response.dados) {
          this.evento = response.dados;
        } else {
          this.notificationService.error(response.mensagem || "Evento não encontrado.");
          this.router.navigate(["/eventos"]);
        }
      },
      error: (err) => {
        console.error("Erro ao carregar evento:", err);
        this.notificationService.error("Erro ao carregar os detalhes do evento.");
        this.router.navigate(["/eventos"]);
      },
    });
  }

  
  comprarIngresso(): void {
    if (this.evento && this.evento.id) { 
      this.router.navigate(['/comprar', this.evento.id]); 
    } else {
      this.notificationService.error("Não foi possível iniciar a compra: evento inválido.");
    }
  }
}