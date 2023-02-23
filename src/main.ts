import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { APP_ROUTES } from './app/app.routes';
import { AppComponent } from './app/app.component';
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTES),
  ]
}).catch(err => console.error(err));
