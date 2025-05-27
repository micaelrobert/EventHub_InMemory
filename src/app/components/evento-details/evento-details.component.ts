import { Component, type OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { EventosService } from "../../services/eventos.service"; // Verifique se o caminho está correto
import { NotificationService } from "../../services/notification.service"; // Verifique se o caminho está correto
import type { Evento } from "../../models/evento.model"; // Verifique se o caminho está correto
import type { ApiResponse } from "../../models/response.model"; // Verifique se o caminho está correto
import { ComprarIngressoDialogComponent } from "../comprar-ingresso-dialog/comprar-ingresso-dialog.component"; // Verifique se o caminho está correto

@Component({
  selector: "app-evento-details",
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  // ATUALIZADO AQUI:
  templateUrl: './evento-details.component.html',
  styleUrls: ['./evento-details.component.css'] // Note o 'Urls' no plural e o array
})
export class EventoDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventosService = inject(EventosService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);

  evento: Evento | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.carregarEvento(+id); // O '+' converte string para number
    } else {
      // Se não houver ID, talvez redirecionar para uma página de erro ou lista
      this.notificationService.warning("ID do evento não fornecido.");
      this.router.navigate(["/eventos"]); // Ou para o catálogo, se fizer mais sentido
    }
  }

  carregarEvento(id: number): void {
    this.eventosService.getEvento(id).subscribe({ // <<< Corrigido para getEvento conforme definido no serviço
      next: (response: ApiResponse<Evento>) => {
        if (response.sucesso && response.dados) {
          this.evento = response.dados;
        } else {
          this.notificationService.error(response.mensagem || "Evento não encontrado.");
          this.router.navigate(["/eventos"]); // Ou catálogo
        }
      },
      error: (err) => {
        console.error("Erro ao carregar evento:", err); // Log para o console do dev
        this.notificationService.error("Erro ao carregar os detalhes do evento.");
        this.router.navigate(["/eventos"]); // Ou catálogo
      },
    });
  }

  comprarIngresso(): void {
    if (this.evento) {
      const dialogRef = this.dialog.open(ComprarIngressoDialogComponent, {
        width: "500px",
        data: { evento: this.evento }, // Passa o objeto evento completo para o dialog
        panelClass: "modern-dialog", // Se você tiver estilos globais para dialogs
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && this.evento) {
          // 'result' pode ser true se a compra foi "bem-sucedida" no dialog
          // Recarregar o evento pode ser útil para atualizar o número de ingressos disponíveis
          this.carregarEvento(this.evento.id);
          this.notificationService.success("Compra de ingresso simulada com sucesso!");
        }
      });
    }
  }
}