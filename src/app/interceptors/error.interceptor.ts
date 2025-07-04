
import type { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service"; 

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = "Erro desconhecido";

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            
            if (error.error?.errors && typeof error.error.errors === 'object') {
                errorMessage = Object.values(error.error.errors).flat().join(' ');
            } else if (error.error?.mensagem) {
                errorMessage = error.error.mensagem;
            } else {
                errorMessage = "Dados inválidos ou requisição malformada.";
            }
            break;
          case 401:
            errorMessage = "Não autorizado. Faça login novamente.";
            
            break;
          case 403:
            errorMessage = "Acesso negado. Você não tem permissão para este recurso.";
            break;
          case 404:
            errorMessage = "Recurso não encontrado.";
            break;
          case 500:
            errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
            break;
          default:
            errorMessage = `Erro ${error.status}: ${error.statusText || error.message}`;
        }
      }

      notificationService.error(errorMessage);
      return throwError(() => error); 
    }),
  );
};