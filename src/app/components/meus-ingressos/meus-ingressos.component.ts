import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";

// Angular Material
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

// Serviços e modelos
import { IngressosService } from "../../services/ingressos.service";
import { NotificationService } from "../../services/notification.service";
import { AuthService } from "../../services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { StatusIngresso, Ingresso } from "../../models/ingresso.model";
import { ApiResponse } from "../../models/response.model";

@Component({
  selector: "app-meus-ingressos",
  standalone: true,
  templateUrl: "./meus-ingressos.component.html",
  styleUrls: ["./meus-ingressos.component.css"],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
})
export class MeusIngressosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ingressosService = inject(IngressosService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  buscaForm!: FormGroup;
  ingressos: Ingresso[] = [];
  buscando = false;
  emailBuscado = false;
  statusIngresso = StatusIngresso;

  ngOnInit(): void {
    this.criarForm();

    if (this.authService.isLoggedIn()) {
      this.buscarMeusIngressos();
    }
  }

  private criarForm(): void {
    this.buscaForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  buscarIngressos(): void {
    if (this.buscaForm.valid) {
      this.buscando = true;
      const email = this.buscaForm.value.email;

      this.ingressosService.getIngressosPorEmail(email).subscribe({
        next: (response: ApiResponse<Ingresso[]>) => {
          this.buscando = false;
          this.emailBuscado = true;

          if (response.sucesso && response.dados) {
            this.ingressos = response.dados;
            if (this.ingressos.length === 0) {
              this.notificationService.info("Nenhum ingresso encontrado para este email");
            }
          } else {
            this.notificationService.error(response.mensagem);
            this.ingressos = [];
          }
        },
        error: () => {
          this.buscando = false;
          this.emailBuscado = true;
          this.ingressos = [];
          this.notificationService.error("Erro ao buscar ingressos");
        },
      });
    }
  }

  buscarMeusIngressos(): void {
    this.buscando = true;
    this.emailBuscado = true;

    this.ingressosService.getMeusIngressos().subscribe({
      next: (response: ApiResponse<Ingresso[]>) => {
        this.buscando = false;
        if (response.sucesso && response.dados) {
          this.ingressos = response.dados;
          if (this.ingressos.length === 0) {
            this.notificationService.info("Você ainda não possui ingressos.");
          }
        } else {
          this.ingressos = [];
          this.notificationService.error(response.mensagem);
        }
      },
      error: () => {
        this.buscando = false;
        this.ingressos = [];
        this.notificationService.error("Erro ao buscar seus ingressos.");
      },
    });
  }

  getStatusColor(status: StatusIngresso): string {
    switch (status) {
      case StatusIngresso.Ativo:
        return "primary";
      case StatusIngresso.Cancelado:
        return "warn";
      case StatusIngresso.Usado:
        return "accent";
      default:
        return "";
    }
  }

  podeReembolsar(ingresso: Ingresso): boolean {
    if (!ingresso.evento?.dataEvento) return false;

    const dataEvento = new Date(ingresso.evento.dataEvento);
    const agora = new Date();
    const diferencaHoras = (dataEvento.getTime() - agora.getTime()) / (1000 * 60 * 60);

    return diferencaHoras > 24;
  }

  solicitarReembolso(ingresso: Ingresso): void {
    this.notificationService.info("Funcionalidade de reembolso será implementada");
  }

baixarIngresso(ingresso: Ingresso): void {
  const ingressoId = ingresso.id;

  this.ingressosService.baixarIngressoPdf(ingressoId).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ingresso_${ingressoId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      this.notificationService.success("Download iniciado com sucesso.");
    },
    error: (err) => {
      this.notificationService.error("Erro ao baixar o ingresso.");
    }
  });
}

}



