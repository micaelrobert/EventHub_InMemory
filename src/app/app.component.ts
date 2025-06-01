import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AuthService } from './services/auth.service'; 
import { BrowserModule } from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    BrowserModule,
    MatListModule
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "EventHub - Gestão de Eventos";

  // the authService is injected and becomes a public property automatically
  constructor(public authService: AuthService) {
    // authService already tries to load the user from localStorage in its own constructor
  }

  logout(): void {
    this.authService.logout();
  }
}