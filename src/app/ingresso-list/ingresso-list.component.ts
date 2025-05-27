import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatChipsModule } from "@angular/material/chips"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { IngressosService } from "./../services/ingressos.service"
import type { Ingresso, StatusIngresso } from "./../models/ingresso.model"
import type { ApiResponse } from "./../models/response.model"

@Component({
  selector: "app-ingresso-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: "./ingresso-list.component.html",
  styleUrl: "./ingresso-list.component.css",
})
export class IngressoListComponent implements OnInit {
  private service = inject(IngressosService)

  ingressos: Ingresso[] = []
  ingressosFiltrados: Ingresso[] = []
  filtroCodigo = ""
  filtroStatus = ""

  displayedColumns = ["codigo", "evento", "comprador", "quantidade", "valor", "dataCompra", "status", "acoes"]

  ngOnInit(): void {
    this.carregarIngressos()
  }

  carregarIngressos(): void {
    this.service.getIngressos().subscribe({
      next: (response: ApiResponse<Ingresso[]>) => {
        if (response.sucesso && response.dados) {
          this.ingressos = response.dados
          this.aplicarFiltros()
        }
      },
      error: (error) => {
        console.error("Erro ao carregar ingressos:", error)
      },
    })
  }

  aplicarFiltros(): void {
    this.ingressosFiltrados = this.ingressos.filter((ingresso) => {
      const matchCodigo =
        !this.filtroCodigo || ingresso.codigo.toLowerCase().includes(this.filtroCodigo.toLowerCase())
      const matchStatus = !this.filtroStatus || ingresso.status === this.filtroStatus
      return matchCodigo && matchStatus
    })
  }

  getStatusColor(status: StatusIngresso): string {
    switch (status) {
      case "Ativo":
        return "primary"
      case "Cancelado":
        return "warn"
      case "Usado":
        return "accent"
      default:
        return ""
    }
  }

  validarIngresso(ingresso: Ingresso): void {
    this.service.validarIngresso(ingresso.codigo).subscribe({
      next: (response) => {
        if (response.sucesso) {
          console.log("Ingresso validado com sucesso!")
          this.carregarIngressos()
        }
      },
      error: (error) => {
        console.error("Erro ao validar ingresso:", error)
      },
    })
  }
}
