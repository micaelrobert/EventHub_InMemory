// routes.ts

import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./home/home-component"),
  },
  {
    path: "eventos", 
    loadComponent: () => import("./evento-list/evento-list.component").then((m) => m.EventoListComponent),
  },
 
  {
    path: "eventos/:id", 
    loadComponent: () => import("./components/evento-details/evento-details.component").then((m) => m.EventoDetailsComponent),
  },

  {
    path: "comprar/:id", 
    loadComponent: () => import("./components/comprar-ingresso-dialog/comprar-ingresso-dialog.component").then((m) => m.ComprarIngressoPageComponent),
  },

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
    path: "**", 
    redirectTo: "",
  },
];