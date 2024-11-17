// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// import { DashboardComponent } from './app/pages/dashboard/dashboard.component';


// // bootstrapApplication(AppComponent, appConfig)
// //   .catch((err) => console.error(err));


// bootstrapApplication(DashboardComponent, appConfig)
//   .catch((err) => console.error(err));

// import { bootstrapApplication } from '@angular/platform-browser';

// bootstrapApplication(DashboardComponent);


// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { DashboardComponent } from './app/pages/dashboard/dashboard.component';

// bootstrapApplication(DashboardComponent, {
//   providers: [
//     provideRouter([]), // Add routes here if needed
//   ],
// });



import { bootstrapApplication } from '@angular/platform-browser';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';

bootstrapApplication(DashboardComponent);
