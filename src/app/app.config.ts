import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { authInterceptor } from './interceptors/auth.interceptor';     // <<< IMPORTE O AUTH INTERCEPTOR
import { errorInterceptor } from './interceptors/error.interceptor';  // <<< IMPORTE O ERROR INTERCEPTOR

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,  // <<< AUTH INTERCEPTOR PRIMEIRO
        errorInterceptor  // <<< ERROR INTERCEPTOR DEPOIS
      ])
    ),
    provideClientHydration(withEventReplay())
  ]
};