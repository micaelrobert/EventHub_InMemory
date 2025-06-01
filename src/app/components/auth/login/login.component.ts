import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';
import { LoginRequestDto } from '../../../models/auth.model';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.notificationService.warning('Por favor, preencha todos os campos corretamente.');
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const credenciais: LoginRequestDto = this.loginForm.value;

    this.authService.login(credenciais).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.sucesso && response.dados) {
          this.notificationService.success('Login realizado com sucesso!');
          if (response.dados.papel === 'Admin') {
            this.router.navigate(['/eventos']);
          } else {
            this.router.navigate(['/catalogo']);
          }
        } else {
          this.notificationService.error(response.mensagem || 'Falha no login.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
            this.notificationService.error('Email ou senha inválidos.');
        } else {
            this.notificationService.error('Ocorreu um erro ao tentar fazer login. Tente novamente.');
        }
        console.error("Erro no login:", err);
      }
    });
  }
}