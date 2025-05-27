import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import 'zone.js'; // ⬅ necessário para o Angular funcionar corretamente

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
