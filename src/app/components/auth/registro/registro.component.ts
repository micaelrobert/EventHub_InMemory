import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';
import { RegistroRequestDto } from '../../../models/auth.model';
import { NotificationService } from '../../../services/notification.service';
import { ApiResponse } from '../../../models/response.model';
import { HttpErrorResponse } from '@angular/common/http';

export function senhasCoincidemValidator(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('senha');
  const confirmacaoSenha = control.get('confirmacaoSenha');

  if (senha?.value !== confirmacaoSenha?.value) {
    confirmacaoSenha?.setErrors({ senhasNaoCoincidem: true });
    return { senhasNaoCoincidem: true };
  }
  if (confirmacaoSenha?.hasError('senhasNaoCoincidem')) {
    const बाकीErrors = { ...confirmacaoSenha.errors };
    delete बाकीErrors['senhasNaoCoincidem'];
    if (Object.keys(बाकीErrors).length === 0) {
      confirmacaoSenha.setErrors(null);
    } else {
      confirmacaoSenha.setErrors(बाकीErrors);
    }
  }
  return null;
}


@Component({
  selector: 'app-registro',
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
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nomeUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', [Validators.required]]
    }, { validators: senhasCoincidemValidator });
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.notificationService.warning('Por favor, corrija os erros no formulário.');
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload: RegistroRequestDto = this.registroForm.value;

    this.authService.registrar(payload).subscribe({
      next: (response: ApiResponse<object>) => {
        this.isLoading = false;
        if (response.sucesso) {
          this.notificationService.success(response.mensagem || 'Usuário registrado com sucesso! Faça o login.');
          this.router.navigate(['/login']);
        } else {
          const errorMsg = (response.erros && response.erros.length > 0)
                            ? response.erros.join(' ')
                            : (response.mensagem || 'Falha no registro. Verifique os dados.');
          this.notificationService.error(errorMsg);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        let errorMsg = 'Erro ao tentar registrar. Tente novamente mais tarde.';
        if (err.error && typeof err.error === 'object') {
            const validationErrors = err.error.errors;
            if (validationErrors && typeof validationErrors === 'object') {
              errorMsg = Object.values(validationErrors).flat().join(' ');
            } else if (err.error.mensagem) {
              errorMsg = err.error.mensagem;
            }
        } else if (typeof err.error === 'string') {
             errorMsg = err.error;
        }
        this.notificationService.error(errorMsg);
        console.error("Erro no registro:", err);
      }
    });
  }
}