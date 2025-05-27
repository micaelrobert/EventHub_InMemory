import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

// 1. Define a configuração específica do servidor.
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

// 2. Junta a configuração principal do app (appConfig) com a do servidor (serverConfig)
// e exporta a variável 'config' que outros arquivos (como o main.server.ts) utilizam.
export const config = mergeApplicationConfig(appConfig, serverConfig);