// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ajuste o caminho
import { environment } from '../../environments/environment'; // Ajuste o caminho

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  // Define a URL base da sua API de forma mais robusta
  const baseApiUrl = environment.apiUrl.replace(/\/eventos$/, '').replace(/\/api$/, '') + '/api';


  // Adiciona o token apenas para requisições à sua API
  if (token && req.url.startsWith(baseApiUrl)) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};