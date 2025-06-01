

import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Ingresso } from '../../models/ingresso.model';

@Component({
  selector: 'app-solicitar-reembolso-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './solicitar-reembolso-dialog.component.html',
  styleUrls: ['./solicitar-reembolso-dialog.component.css']
})
export class SolicitarReembolsoDialogComponent {
 
  private fb = inject(FormBuilder); 

  reembolsoForm: FormGroup;
  ingresso: Ingresso;

  constructor(
    public dialogRef: MatDialogRef<SolicitarReembolsoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ingresso: Ingresso }
   
  ) {
    console.log('SolicitarReembolsoDialogComponent: Construtor chamado. Data recebida:', data); 
    this.ingresso = data.ingresso; 
    this.reembolsoForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
    console.log('SolicitarReembolsoDialogComponent: Formulário inicializado. Ingresso:', this.ingresso); 
  }

  onConfirm(): void {
    if (this.reembolsoForm.valid) {
      console.log('SolicitarReembolsoDialogComponent: Confirmar clicado. Motivo:', this.reembolsoForm.value.motivo); 
      this.dialogRef.close(this.reembolsoForm.value.motivo);
    } else {
      console.log('SolicitarReembolsoDialogComponent: Formulário inválido ao confirmar.'); 
      this.reembolsoForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    console.log('SolicitarReembolsoDialogComponent: Cancelar clicado.'); 
    this.dialogRef.close(undefined);
  }
}