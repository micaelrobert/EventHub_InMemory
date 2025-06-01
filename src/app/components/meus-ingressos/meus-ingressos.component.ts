
import { Component, OnInit, inject } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatChipsModule } from '@angular/material/chips';
import { IngressosService } from "../../services/ingressos.service";
import { NotificationService } from "../../services/notification.service";
import { AuthService } from "../../services/auth.service"; 
import { StatusIngresso, Ingresso, RefundIngresso } from "../../models/ingresso.model";
import { ApiResponse } from "../../models/response.model";
import { SolicitarReembolsoDialogComponent } from '../solicitar-reembolso-dialog/solicitar-reembolso-dialog.component';

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
    MatProgressSpinnerModule,
    MatDialogModule,
    MatChipsModule,
    DatePipe
  ],
})
export class MeusIngressosComponent implements OnInit {
  private fb: FormBuilder; // Declarar como propriedade
  private ingressosService: IngressosService;
  private notificationService: NotificationService;
  public authService: AuthService; // <<-- DECLARAR AQUI (antes de injetar no construtor)
  private dialog: MatDialog;

   public console = console;
   
  buscaForm!: FormGroup;
  ingressos: Ingresso[] = [];
  buscando = false;
  emailBuscado = false;
  statusIngresso = StatusIngresso;

  constructor( 
    fb: FormBuilder, 
    ingressosService: IngressosService,
    notificationService: NotificationService,
    authService: AuthService, 
    dialog: MatDialog 
  ) {
 
    this.fb = fb;
    this.ingressosService = ingressosService;
    this.notificationService = notificationService;
    this.authService = authService; 
    this.dialog = dialog;
  }

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
        error: (err) => {
          this.buscando = false;
          this.emailBuscado = true;
          this.ingressos = [];
          this.notificationService.error("Erro ao buscar ingressos");
          console.error("Erro na busca de ingressos por email:", err);
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
      error: (err) => {
        this.buscando = false;
        this.ingressos = [];
        this.notificationService.error("Erro ao buscar seus ingressos.");
        console.error("Erro na busca de meus ingressos:", err);
      },
    });
  }

  getStatusColor(ingresso: Ingresso): string {
    if (ingresso.motivoDevolucao || ingresso.dataDevolucao) {
      return "warn";
    }
    if (!ingresso.ativo) {
      return "accent";
    }
    return "primary";
  }

  getStatusText(ingresso: Ingresso): string {
    if (ingresso.motivoDevolucao || ingresso.dataDevolucao) {
      return StatusIngresso.Cancelado;
    }
    if (!ingresso.ativo) {
      return StatusIngresso.Usado;
    }
    return StatusIngresso.Ativo;
  }

  podeReembolsar(ingresso: Ingresso): boolean {
    console.log(`--- Depurando ingresso ID: ${ingresso.id} (Evento: ${ingresso.evento?.nome || 'N/A'}) ---`);
    console.log(`Ingresso ATIVO (do backend): ${ingresso.ativo}`);
    console.log(`Ingresso completo para depuração:`, ingresso);

    if (!ingresso.ativo || ingresso.motivoDevolucao || ingresso.dataDevolucao) {
      console.log(`RESULTADO: Não reembolsável. Motivo: Ingresso não está ATIVO ou já foi solicitado reembolso/devolvido.`);
      return false;
    }

    console.log(`Dados do Evento: ${JSON.stringify(ingresso.evento)}`);
    if (!ingresso.evento || !ingresso.evento.dataEvento) {
      console.log(`RESULTADO: Não reembolsável. Motivo: Dados do evento ou data do evento faltando.`);
      return false;
    }

    const dataEvento = new Date(ingresso.evento.dataEvento);
    const agora = new Date();
    const diferencaMs = dataEvento.getTime() - agora.getTime();
    const diferencaHoras = diferencaMs / (1000 * 60 * 60);

    console.log(`Data do Evento (convertida): ${dataEvento.toLocaleString('pt-BR')}`);
    console.log(`Hora Atual: ${agora.toLocaleString('pt-BR')}`);
    console.log(`Diferença em horas até o evento: ${diferencaHoras}`);

    const elegivelPeloPrazo = diferencaHoras > 24;
    if (!elegivelPeloPrazo) {
      console.log(`RESULTADO: Não reembolsável. Motivo: Faltam menos de 24 horas para o evento ou evento já passou.`);
    } else {
      console.log(`RESULTADO: Reembolsável. Motivo: Faltam mais de 24 horas para o evento.`);
    }
    console.log(`--- Fim da depuração para ingresso ID: ${ingresso.id} ---`);

    return elegivelPeloPrazo;
  }

  solicitarReembolso(ingresso: Ingresso): void {
    const dialogRef = this.dialog.open(SolicitarReembolsoDialogComponent, {
      width: '400px',
      data: { ingresso },
      disableClose: true,
      panelClass: 'modern-dialog'
    });

    dialogRef.afterClosed().subscribe((motivo: string | undefined) => {
      if (motivo) {
        this.notificationService.info('Solicitando reembolso...');
        const refundData: RefundIngresso = { motivo: motivo };

        this.ingressosService.solicitarReembolso(ingresso.id, refundData).subscribe({
          next: (response: ApiResponse<boolean>) => {
            if (response.sucesso) {
              this.notificationService.success('Solicitação de reembolso enviada com sucesso!');
              this.buscarMeusIngressos();
            } else {
              this.notificationService.error(response.mensagem || 'Falha ao solicitar reembolso.');
            }
          },
          error: (err) => {
            this.notificationService.error('Erro na comunicação ao solicitar reembolso.');
            console.error('Erro de reembolso:', err);
          },
        });
      } else {
        this.notificationService.info('Solicitação de reembolso cancelada.');
      }
    });
  }

  baixarIngresso(ingresso: Ingresso): void {
    const ingressoId = ingresso.id;

    this.ingressosService.baixarIngressoPdf(ingressoId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ingresso_${ingressoId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.notificationService.success('Download do ingresso iniciado.');
      },
      error: (err) => {
        this.notificationService.error('Erro ao baixar ingresso.');
        console.error('Erro ao baixar ingresso:', err);
      }
    });
  }
}