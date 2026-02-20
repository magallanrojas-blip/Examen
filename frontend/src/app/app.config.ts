import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Rutas
    provideRouter(routes),

    // HTTP (para conectar con Spring Boot)
    provideHttpClient(),

    // Formularios (ngModel)
    importProvidersFrom(FormsModule),

    // SSR Hydration
    provideClientHydration(withEventReplay())
  ]
};
