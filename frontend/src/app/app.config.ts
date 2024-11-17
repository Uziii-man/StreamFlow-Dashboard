import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; 
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // enable optimized zone-based change detection
    provideZoneChangeDetection({ eventCoalescing: true }), 

    // provides application routes
    provideRouter(routes),

    // provide HTTP client for making API requests
    provideHttpClient(),
  ]
};