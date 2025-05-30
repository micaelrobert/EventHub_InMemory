// src/app/ingresso-list/ingresso-list.component.ts (AJUSTADO)

import { Component, OnInit, inject } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { RouterModule } from "@angular/router";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Provavelmente precisa para spinner

// Módulos para filtro/formulário
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Serviços e modelos
import { IngressosService } from "../services/ingressos.service"; // Ajuste o caminho
import { NotificationService } from "../services/notification.service"; // Ajuste o caminho
import { AuthService } from '../services/auth.service'; // Ajuste o caminho
import { ApiResponse } from "../models/response.model"; // Ajuste o caminho
import { Ingresso, StatusIngresso } from "../models/ingresso.model"; // Importar Ingresso e StatusIngresso
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
    MatProgressSpinnerModule, // Adicionado para spinner (se usado no HTML)
    DatePipe,
    FormsModule, // Para usar ngModel nos filtros
    ReactiveFormsModule, // Para usar FormGroup
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
  public authService = inject(AuthService); // AuthService para isAdmin
  private fb = inject(FormBuilder); // Para o formulário de busca

  ingressos: Ingresso[] = [];
  ingressosFiltrados: Ingresso[] = [];
  buscando = false;
  filtroForm!: FormGroup;
  filtroStatus: StatusIngresso | '' = ''; // Para o filtro de status
  statusOptions: StatusIngresso[] = Object.values(StatusIngresso); // Opções para o select de status

  ngOnInit(): void {
    this.criarFormFiltro();
    this.carregarIngressos();

    // Reaplicar filtro quando os valores do formulário mudarem
    this.filtroForm.valueChanges.subscribe(() => {
      this.aplicarFiltro();
    });
  }

  private criarFormFiltro(): void {
    this.filtroForm = this.fb.group({
      termoBusca: [''],
      status: [''], // Campo para o filtro de status
    });
  }

  carregarIngressos(): void {
    this.buscando = true;
    let loadObservable: Observable<ApiResponse<Ingresso[]>>;

    if (this.authService.isAdmin()) {
      loadObservable = this.ingressosService.getIngressos(); // Admin vê todos
    } else {
      loadObservable = this.ingressosService.getMeusIngressos(); // Usuário comum vê só os seus
    }

    loadObservable.subscribe({
      next: (response: ApiResponse<Ingresso[]>) => {
        this.buscando = false;
        if (response.sucesso && response.dados) {
          this.ingressos = response.dados;
          this.aplicarFiltro(); // Aplica o filtro inicial
          if (this.ingressos.length === 0) {
            this.notificationService.info("Nenhum ingresso encontrado.");
          }
        } else {
          this.notificationService.error(response.mensagem || "Falha ao carregar ingressos.");
          this.ingressos = [];
          this.aplicarFiltro(); // Garante que a lista filtrada também fique vazia
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
    this.filtroStatus = this.filtroForm.get('status')?.value || ''; // Atualiza o filtroStatus

    this.ingressosFiltrados = this.ingressos.filter(ingresso => {
      const matchTermo =
        ingresso.nomeComprador.toLowerCase().includes(termoBusca) ||
        ingresso.emailComprador.toLowerCase().includes(termoBusca) ||
        ingresso.codigo.toLowerCase().includes(termoBusca) ||
        (ingresso.evento?.nome?.toLowerCase().includes(termoBusca)); // Busca no nome do evento

      // --- CORREÇÃO AQUI: USANDO getStatusText para filtrar ---
      const ingressoStatusText = this.getStatusText(ingresso);
      const matchStatus = !this.filtroStatus || ingressoStatusText === this.filtroStatus;

      return matchTermo && matchStatus;
    });
  }

  // --- MÉTODOS PARA OBTER STATUS E COR (COPIADOS DE MEUS INGRESSOS) ---
  getStatusColor(ingresso: Ingresso): string {
    if (ingresso.motivoDevolucao || ingresso.dataDevolucao) {
      return "warn"; // Cancelado
    }
    if (!ingresso.ativo) {
      return "accent"; // Usado (ou não ativo por outro motivo)
    }
    return "primary"; // Ativo
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

  // --- MÉTODOS EXISTENTES MANTIDOS ---
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

  // Adicione este método se você quiser poder deletar ingressos da lista (apenas admin)
  // deletarIngresso(ingresso: Ingresso): void {
  //   if (!this.authService.isAdmin()) {
  //     this.notificationService.error("Ação não permitida.");
  //     return;
  //   }
  //   if (confirm(`Tem certeza que deseja deletar o ingresso "${ingresso.codigo}"?`)) {
  //     // Implemente o serviço de deletar ingresso aqui
  //     this.notificationService.info("Funcionalidade de deletar ingresso será implementada.");
  //   }
  // }
}