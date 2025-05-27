import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
// Make sure the config file exists at this path, or update the path if necessary
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
