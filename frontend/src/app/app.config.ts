import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Ensure correct path to `app.routes.ts`
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable optimized zone-based change detection
    provideZoneChangeDetection({ eventCoalescing: true }), 

    // Provide application routes
    provideRouter(routes),

    // Provide HTTP client for making API requests
    provideHttpClient(),
  ]
};