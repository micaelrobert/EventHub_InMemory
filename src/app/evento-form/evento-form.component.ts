import { Component, OnInit } from "@angular/core";
import { CommonModule, formatDate } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { EventosService } from "./../services/eventos.service";
import { CriarEvento, AtualizarEvento, Evento } from "./../models/evento.model";
import { ApiResponse } from "./../models/response.model";

@Component({
  selector: "app-evento-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule
  ],
  templateUrl: "./evento-form.component.html",
  styleUrls: ["./evento-form.component.css"],
})
export class EventoFormComponent implements OnInit {
  form!: FormGroup;
  eventId: number | null = null;
  isEditMode = false;
  imagemPreview: string | null = null;
  selectedFile?: File;

  constructor(
    private fb: FormBuilder,
    private eventoService: EventosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ["", [Validators.required, Validators.minLength(3)]],
      descricao: ["", [Validators.required, Validators.minLength(10)]],
      dataEvento: [null, [Validators.required]],
      horaEvento: ['09:00', [Validators.required]],
      local: ["", [Validators.required, Validators.minLength(5)]],
      precoIngresso: [0, [Validators.required, Validators.min(0)]],
      capacidadeMaxima: [1, [Validators.required, Validators.min(1)]],
      ativo: [true]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.eventId = +idParam;
      this.form.controls['ativo'].enable();
      this.carregarDadosDoEvento(this.eventId);
    } else {
      this.isEditMode = false;
      this.form.controls['ativo'].disable();
    }
  }

  carregarDadosDoEvento(id: number): void {
    // Supondo que seu serviço tenha um método getEventoById que retorna ApiResponse<Evento>
    this.eventoService.getEvento(id).subscribe({ // << Corrigido para getEvento
      next: (response: ApiResponse<Evento>) => { // << Adicionada tipagem aqui para clareza
        if (response.sucesso && response.dados) {
          const evento: Evento = response.dados;
          this.form.patchValue({
            nome: evento.nome,
            descricao: evento.descricao,
            dataEvento: evento.dataEvento,
            local: evento.local,
            precoIngresso: evento.precoIngresso,
            capacidadeMaxima: evento.capacidadeMaxima,
            ativo: evento.ativo
          });
          if (evento.dataEvento) {
            this.form.controls['horaEvento'].setValue(formatDate(evento.dataEvento, 'HH:mm', 'en-US'));
          }
        } else {
          console.error("Erro ao buscar dados do evento:", response.mensagem);
          this.router.navigate(['/eventos']);
        }
      },
      error: (err: any) => {
        console.error("Erro na requisição para buscar evento:", err);
        this.router.navigate(['/eventos']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.log("Formulário inválido.");
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.value;
    const dataSelecionada = new Date(formValues.dataEvento);
    const [horas, minutos] = formValues.horaEvento.split(':').map(Number);

    const dataEventoCompleta = new Date(
      dataSelecionada.getFullYear(),
      dataSelecionada.getMonth(),
      dataSelecionada.getDate(),
      horas,
      minutos
    );

    // --- ADICIONADOS OS CONSOLE.LOGS PARA DEBUG ---
    console.log("--- DEBUG SUBMIT (EDIÇÃO OU CRIAÇÃO) ---");
    console.log("Valor dataEvento do form (original):", formValues.dataEvento);
    console.log("Valor horaEvento do form:", formValues.horaEvento);
    console.log("Data selecionada (após new Date):", dataSelecionada.toISOString(), dataSelecionada);
    console.log("Horas parseadas:", horas, "Minutos parseados:", minutos);
    console.log("DataEventoCompleta a ser enviada (objeto Date):", dataEventoCompleta);
    console.log("DataEventoCompleta a ser enviada (ISO String):", dataEventoCompleta.toISOString());
    // --- FIM DOS CONSOLE.LOGS ---

    if (this.isEditMode && this.eventId !== null) {
      const eventoAtualizado: AtualizarEvento = {
        id: this.eventId,
        nome: formValues.nome,
        descricao: formValues.descricao,
        dataEvento: dataEventoCompleta,
        local: formValues.local,
        precoIngresso: formValues.precoIngresso,
        capacidadeMaxima: formValues.capacidadeMaxima,
        ativo: formValues.ativo
      };

      // --- CONSOLE.LOG DO PAYLOAD DE ATUALIZAÇÃO ---
      console.log("Payload enviado para atualizarEvento:", eventoAtualizado);
      // --- FIM DO CONSOLE.LOG ---

      this.eventoService.atualizarEvento(this.eventId, eventoAtualizado).subscribe({
        next: () => {
          console.log("Evento atualizado com sucesso!");
          this.router.navigate(['/eventos']);
        },
        error: (err) => {
          console.error("Erro ao atualizar evento:", err);
        }
      });
    } else {
      const novoEvento: CriarEvento = {
        nome: formValues.nome,
        descricao: formValues.descricao,
        dataEvento: dataEventoCompleta,
        local: formValues.local,
        precoIngresso: formValues.precoIngresso,
        capacidadeMaxima: formValues.capacidadeMaxima
      };

      // --- CONSOLE.LOG DO PAYLOAD DE CRIAÇÃO ---
      console.log("Payload enviado para criarEvento:", novoEvento);
      // --- FIM DO CONSOLE.LOG ---

      this.eventoService.criarEvento(novoEvento).subscribe({
        next: () => {
          console.log("Evento criado com sucesso!");
          this.router.navigate(['/eventos']);
        },
        error: (err) => {
          console.error("Erro ao criar evento:", err);
        }
      });
    }
  }
        onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          const file = input.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            this.imagemPreview = reader.result as string;
            // Optionally, store the file for upload
            this.selectedFile = file;
          };
          reader.readAsDataURL(file);
        }
      }

  onCancel(): void {
    this.router.navigate(['/eventos']);
  }
}