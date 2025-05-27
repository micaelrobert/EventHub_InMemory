import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { IngressosService } from "../../services/ingressos.service";
import { NotificationService } from "../../services/notification.service";
import { Evento } from "../../models/evento.model";
import { ComprarIngresso, Ingresso } from "../../models/ingresso.model";
import { ApiResponse } from "../../models/response.model";

@Component({
  selector: "app-comprar-ingresso-dialog",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: "./comprar-ingresso-dialog.html",
  styleUrls: ["./comprar-ingresso-dialog.css"]
})
export class ComprarIngressoDialogComponent {
  evento: Evento;
  compraForm!: FormGroup;
  quantidades: number[] = [];
  valorTotal = 0;
  comprando = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { evento: Evento },
    private fb: FormBuilder,
    private ingressosService: IngressosService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<ComprarIngressoDialogComponent>
  ) {
    this.evento = data.evento;
    this.gerarQuantidades();
    this.criarForm();
  }

  private gerarQuantidades(): void {
    const maxQuantidade = Math.min(this.evento.ingressosDisponiveis, 10);
    this.quantidades = Array.from({ length: maxQuantidade }, (_, i) => i + 1);
  }

  private criarForm(): void {
    this.compraForm = this.fb.group({
      nomeComprador: ["", [Validators.required, Validators.minLength(3)]],
      emailComprador: ["", [Validators.required, Validators.email]],
      telefoneComprador: ["", [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });

    this.calcularTotal();
  }

  calcularTotal(): void {
    const quantidade = this.compraForm.get("quantidade")?.value || 0;
    this.valorTotal = quantidade * this.evento.precoIngresso;
  }

confirmarCompra(): void {
  if (this.compraForm.invalid) {
    this.notificationService.error('Por favor, preencha todos os campos corretamente');
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
        this.notificationService.success('Compra realizada com sucesso!');
        this.dialogRef.close(true);
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

cancelar(): void {
  this.dialogRef.close(false);
}
  
  formatarTelefone(event: any): void {
    let input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 0) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    input.value = value;
    this.compraForm.get('telefoneComprador')?.setValue(value, { emitEvent: false });
  }

}