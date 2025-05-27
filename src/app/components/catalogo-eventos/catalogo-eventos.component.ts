import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router, RouterLink } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import { MatDialog } from "@angular/material/dialog"
import { EventosService } from "../../services/eventos.service"
import { NotificationService } from "../../services/notification.service"
import type { Evento } from "../../models/evento.model"
import type { ApiResponse } from "../../models/response.model"
import { ComprarIngressoDialogComponent } from "../comprar-ingresso-dialog/comprar-ingresso-dialog.component"

@Component({
  selector: "app-evento-details",
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="evento-details-container" *ngIf="evento; else loading">
      <button mat-button routerLink="/eventos" class="back-button">
        <mat-icon>arrow_back</mat-icon>
        Voltar para Eventos
      </button>

      <mat-card class="evento-card">
        <mat-card-header>
          <mat-card-title>{{ evento.nome }}</mat-card-title>
          <mat-card-subtitle>
            <mat-icon>place</mat-icon>
            {{ evento.local }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="evento-info">
            <div class="info-section">
              <h3>Descrição</h3>
              <p>{{ evento.descricao }}</p>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div>
                  <strong>Data e Hora</strong>
                  <p>{{ evento.dataEvento | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>attach_money</mat-icon>
                <div>
                  <strong>Preço</strong>
                  <p>{{ evento.precoIngresso | currency:'BRL':'symbol':'1.2-2' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>people</mat-icon>
                <div>
                  <strong>Capacidade</strong>
                  <p>{{ evento.capacidadeMaxima }} pessoas</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>confirmation_number</mat-icon>
                <div>
                  <strong>Disponíveis</strong>
                  <p>{{ evento.ingressosDisponiveis }} ingressos</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>shopping_cart</mat-icon>
                <div>
                  <strong>Vendidos</strong>
                  <p>{{ evento.ingressosVendidos }} ingressos</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>calendar_today</mat-icon>
                <div>
                  <strong>Criado em</strong>
                  <p>{{ evento.dataCriacao | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>
            </div>

            <div class="status-section">
              <mat-chip-set>
                <mat-chip [color]="evento.ativo ? 'primary' : 'warn'">
                  {{ evento.ativo ? 'Ativo' : 'Inativo' }}
                </mat-chip>
                <mat-chip *ngIf="evento.ingressosDisponiveis === 0" color="warn">
                  Esgotado
                </mat-chip>
                <mat-chip *ngIf="evento.ingressosDisponiveis > 0 && evento.ingressosDisponiveis <= 10" color="accent">
                  Últimos ingressos
                </mat-chip>
              </mat-chip-set>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button 
            mat-raised-button 
            color="primary"
            [disabled]="!evento.ativo || evento.ingressosDisponiveis === 0"
            (click)="comprarIngresso()">
            <mat-icon>shopping_cart</mat-icon>
            Comprar Ingresso
          </button>
        </mat-card-actions>
      </mat-card>
    </div>

    <ng-template #loading>
      <div class="loading">
        <p>Carregando evento...</p>
      </div>
    </ng-template>
  `,
  styles: [
    `
    .evento-details-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .back-button {
      margin-bottom: 1rem;
    }

    .evento-card {
      width: 100%;
    }

    .evento-info {
      padding: 1rem 0;
    }

    .info-section {
      margin-bottom: 2rem;
    }

    .info-section h3 {
      color: #1976d2;
      margin-bottom: 0.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .info-item mat-icon {
      color: #1976d2;
      margin-top: 0.25rem;
    }

    .info-item strong {
      display: block;
      margin-bottom: 0.25rem;
      color: #333;
    }

    .info-item p {
      margin: 0;
      color: #666;
    }

    .status-section {
      margin: 2rem 0;
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .evento-details-container {
        padding: 1rem;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  ],
})
export class EventoDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private eventosService = inject(EventosService)
  private notificationService = inject(NotificationService)
  private dialog = inject(MatDialog)

  evento: Evento | null = null

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.carregarEvento(+id)
    } else {
      this.router.navigate(["/eventos"])
    }
  }

  carregarEvento(id: number): void {
    this.eventosService.getEvento(id).subscribe({
      next: (response: ApiResponse<Evento>) => {
        if (response.sucesso && response.dados) {
          this.evento = response.dados
        } else {
          this.notificationService.error(response.mensagem)
          this.router.navigate(["/eventos"])
        }
      },
      error: () => {
        this.notificationService.error("Erro ao carregar evento")
        this.router.navigate(["/eventos"])
      },
    })
  }

  comprarIngresso(): void {
    if (this.evento) {
      const dialogRef = this.dialog.open(ComprarIngressoDialogComponent, {
        width: "500px",
        data: { evento: this.evento },
        panelClass: "modern-dialog",
      })

      dialogRef.afterClosed().subscribe((result) => {
        if (result && this.evento) {
          this.carregarEvento(this.evento.id) // Recarregar para atualizar disponibilidade
        }
      })
    }
  }
}
