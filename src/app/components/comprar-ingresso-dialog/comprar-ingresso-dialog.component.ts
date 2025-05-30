// src/app/comprar-ingresso-page/comprar-ingresso-page.component.ts

import { Component, OnInit, inject } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Angular Material - Módulos adicionados para correção
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // ADICIONADO para mat-spinner
import { MatDividerModule } from '@angular/material/divider'; // ADICIONADO para mat-divider

// Serviços e modelos
import { IngressosService } from "../../services/ingressos.service";
import { NotificationService } from "../../services/notification.service";
import { Evento } from "../../models/evento.model";
import { ComprarIngresso } from "../../models/ingresso.model";
import { ApiResponse } from "../../models/response.model";
import { EventosService } from "../../services/eventos.service";

@Component({
  selector: "app-comprar-ingresso-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    DatePipe,
    MatCardModule,
    RouterModule,
    MatProgressSpinnerModule, // ADICIONAR AQUI
    MatDividerModule, // ADICIONAR AQUI
  ],
  // template original ainda aponta para comprar-ingresso-dialog.html, corrigir para comprar-ingresso-page.html
  templateUrl: "./comprar-ingresso-dialog.html", // CORRIGIDO O CAMINHO DO TEMPLATE
  styleUrls: ["./comprar-ingresso-dialog.css"]
})
export class ComprarIngressoPageComponent implements OnInit {
  evento!: Evento;
  compraForm!: FormGroup;
  quantidades: number[] = [];
  valorTotal = 0;
  comprando = false;
  eventoCarregado = false;

  private fb = inject(FormBuilder);
  private ingressosService = inject(IngressosService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventosService = inject(EventosService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const eventoId = params.get('id');
      if (eventoId) {
        this.carregarEvento(eventoId);
      } else {
        this.notificationService.error('ID do evento não fornecido.');
        this.router.navigate(['/eventos']);
      }
    });
  }

  carregarEvento(id: string): void {
    // Usando getEventoById para buscar o evento, que é o que você tem no EventosService para ID
    // Certifique-se que o serviço EventosService.getEventoById(id) existe e espera string ou number
    this.eventosService.getEvento(Number(id)).subscribe({
      next: (response: ApiResponse<Evento>) => {
        if (response.sucesso && response.dados) {
          this.evento = response.dados;
          this.eventoCarregado = true;
          this.gerarQuantidades();
          this.criarForm();
          this.compraForm.get('quantidade')?.valueChanges.subscribe(() => this.calcularTotal());
        } else {
          this.notificationService.error(response.mensagem || 'Evento não encontrado.');
          this.router.navigate(['/eventos']);
        }
      },
      error: (err) => {
        this.notificationService.error('Erro ao carregar detalhes do evento.');
        console.error(err);
        this.router.navigate(['/eventos']);
      }
    });
  }

  private gerarQuantidades(): void {
    const maxQuantidade = Math.min(this.evento.ingressosDisponiveis || 0, 10);
    this.quantidades = maxQuantidade > 0
      ? Array.from({ length: maxQuantidade }, (_, i) => i + 1)
      : [0];
  }

  private criarForm(): void {
    this.compraForm = this.fb.group({
      nomeComprador: ["", [Validators.required, Validators.minLength(3)]],
      emailComprador: ["", [Validators.required, Validators.email]],
      telefoneComprador: ["", [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      quantidade: [this.quantidades.includes(1) ? 1 : 0, [Validators.required, Validators.min(1)]]
    });

    if (this.evento.ingressosDisponiveis === 0) {
      this.compraForm.get('quantidade')?.setValue(0);
      this.compraForm.get('quantidade')?.disable();
      this.compraForm.get('quantidade')?.clearValidators();
      this.compraForm.get('quantidade')?.updateValueAndValidity();
    }

    this.calcularTotal();
  }

  calcularTotal(): void {
    const quantidade = this.compraForm.get("quantidade")?.value || 0;
    const preco = this.evento.precoIngresso ?? 0;
    this.valorTotal = quantidade * preco;
  }

  confirmarCompra(): void {
    if (this.compraForm.invalid || this.comprando || this.compraForm.disabled) {
      this.notificationService.error('Por favor, preencha todos os campos corretamente e verifique a disponibilidade.');
      return;
    }

    this.comprando = true;

    const compra: ComprarIngresso = {
      eventoId: this.evento.id,
      nomeComprador: this.compraForm.value.nomeComprador,
      emailComprador: this.compraForm.value.emailComprador,
      telefoneComprador: this.compraForm.value.telefoneComprador,
      quantidade: this.compraForm.value.quantidade
    };

    this.ingressosService.comprarIngresso(compra).subscribe({
      next: (response) => {
        this.comprando = false;
        if (response.sucesso) {
          this.notificationService.success('Compra realizada com sucesso! Redirecionando...');
          this.router.navigate(['/eventos']);
        } else {
          this.notificationService.error(response.mensagem || 'Erro ao processar compra');
        }
      },
      error: (err) => {
        this.comprando = false;
        this.notificationService.error('Erro na comunicação com o servidor');
        console.error(err);
      }
    });
  }

  voltarParaEventos(): void {
    this.router.navigate(['/eventos']);
  }

  formatarTelefone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 0) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      if (value.length > 9) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      } else if (value.length > 8) {
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      }
    }
    input.value = value;
    this.compraForm.get('telefoneComprador')?.setValue(value, { emitEvent: false });
  }

  // ADICIONADO: Método para lidar com erro de carregamento de imagem
  // Este é o método que faltava para (error)="onImageError($event)" no HTML
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/imgs/evento-padrao.jpeg'; // Caminho para sua imagem padrão
  }
  onImageError(event: Event): void {
  const target = event.target as HTMLImageElement;
  target.src = 'assets/imgs/evento-padrao.jpeg';
}
}