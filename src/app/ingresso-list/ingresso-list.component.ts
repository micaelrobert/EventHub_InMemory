import { Component, OnInit, inject } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { RouterModule } from "@angular/router";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


import { IngressosService } from "../services/ingressos.service"; 
import { NotificationService } from "../services/notification.service"; 
import { AuthService } from '../services/auth.service'; 
import { ApiResponse } from "../models/response.model"; 
import { Ingresso, StatusIngresso } from "../models/ingresso.model"; 
import { Observable } from 'rxjs';

@Component({
  selector: "app-ingresso-list",
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
    MatProgressSpinnerModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: "./ingresso-list.component.html",
  styleUrls: ["./ingresso-list.component.css"],
})
export class IngressoListComponent implements OnInit {
  private ingressosService = inject(IngressosService);
  private notificationService = inject(NotificationService);
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);

  ingressos: Ingresso[] = [];
  ingressosFiltrados: Ingresso[] = [];
  buscando = false;
  filtroForm!: FormGroup;
  filtroStatus: StatusIngresso | '' = '';
  statusOptions: StatusIngresso[] = Object.values(StatusIngresso);

  ngOnInit(): void {
    this.criarFormFiltro();
    this.carregarIngressos();

    this.filtroForm.valueChanges.subscribe(() => {
      this.aplicarFiltro();
    });
  }

  private criarFormFiltro(): void {
    this.filtroForm = this.fb.group({
      termoBusca: [''],
      status: [''],
    });
  }

  carregarIngressos(): void {
    this.buscando = true;
    let loadObservable: Observable<ApiResponse<Ingresso[]>>;

    if (this.authService.isAdmin()) {
      loadObservable = this.ingressosService.getIngressos();
    } else {
      loadObservable = this.ingressosService.getMeusIngressos();
    }

    loadObservable.subscribe({
      next: (response: ApiResponse<Ingresso[]>) => {
        this.buscando = false;
        if (response.sucesso && response.dados) {
          this.ingressos = response.dados;
          this.aplicarFiltro();
          if (this.ingressos.length === 0) {
            this.notificationService.info("Nenhum ingresso encontrado.");
          }
        } else {
          this.notificationService.error(response.mensagem || "Falha ao carregar ingressos.");
          this.ingressos = [];
          this.aplicarFiltro();
        }
      },
      error: (err) => {
        this.buscando = false;
        this.notificationService.error("Erro de comunicação ao carregar ingressos.");
        console.error("Erro ao carregar ingressos:", err);
        this.ingressos = [];
        this.aplicarFiltro();
      }
    });
  }
  gressosService = inject(IngressosService);
  private notificationSer!: NotificationService;

  displayedColumns: string[] = [
    'codigo',
    'evento',
    'comprador',
    'quantidade',
    'valor',
    'dataCompra',
    'status',
    'acoes'
  ];
filtroCodigo: string = '';
  aplicarFiltro(): void {
    const termoBusca = this.filtroForm.get('termoBusca')?.value?.toLowerCase() || '';
    this.filtroStatus = this.filtroForm.get('status')?.value || '';

    this.ingressosFiltrados = this.ingressos.filter(ingresso => {
      const matchTermo =
        ingresso.nomeComprador.toLowerCase().includes(termoBusca) ||
        ingresso.emailComprador.toLowerCase().includes(termoBusca) ||
        ingresso.codigo.toLowerCase().includes(termoBusca) ||
        (ingresso.evento?.nome?.toLowerCase().includes(termoBusca));

      const ingressoStatusText = this.getStatusText(ingresso);
      const matchStatus = !this.filtroStatus || ingressoStatusText === this.filtroStatus;

      return matchTermo && matchStatus;
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
        console.error("Erro no download do ingresso:", err);
      }
    });
  }
}