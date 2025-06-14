import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { AuthService } from "../services/auth.service" 

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: "./home-component.html",
  styleUrl: "./home-component.css",
})
export default class HomeComponent {
  constructor(public authService: AuthService) {
    
  }
}
