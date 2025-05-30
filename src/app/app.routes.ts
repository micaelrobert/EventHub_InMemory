// routes.ts

import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./home/home-component"),
  },
  {
    path: "eventos", // Rota para a lista de eventos
    loadComponent: () => import("./evento-list/evento-list.component").then((m) => m.EventoListComponent),
  },
  // --- ROTA PARA DETALHES DO EVENTO ---
  {
    path: "eventos/:id", // Ex: /eventos/1, /eventos/23
    loadComponent: () => import("./components/evento-details/evento-details.component").then((m) => m.EventoDetailsComponent),
  },
  // --- ROTA PARA A TELA DE COMPRA (NOVA) ---
  {
    path: "comprar/:id", // Ex: /comprar/123 - ID do evento para a tela de compra
    loadComponent: () => import("./components/comprar-ingresso-dialog/comprar-ingresso-dialog.component").then((m) => m.ComprarIngressoPageComponent),
  },
  // --- FIM DA NOVA ROTA DE COMPRA ---
  {
    path: "novo-evento",
    loadComponent: () => import("./evento-form/evento-form.component").then((m) => m.EventoFormComponent),
  },
  {
    path: "eventos/editar/:id",
    loadComponent: () => import("./evento-form/evento-form.component").then((m) => m.EventoFormComponent),
  },

  {
    path: "ingressos",
    loadComponent: () => import("./ingresso-list/ingresso-list.component").then((m) => m.IngressoListComponent),
  },
  {
    path: "meus-ingressos",
    loadComponent: () => import("./components/meus-ingressos/meus-ingressos.component").then((m) => m.MeusIngressosComponent),
  },
  {
    path: "login",
    loadComponent: () => import("./components/auth/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "registrar",
    loadComponent: () => import("./components/auth/registro/registro.component").then((m) => m.RegistroComponent),
  },

  {
    path: "**", // Esta rota deve ser sempre a última, para lidar com URLs não correspondentes
    redirectTo: "",
  },
];