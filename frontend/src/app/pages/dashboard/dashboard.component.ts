// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.scss'
// })
// export class DashboardComponent {

// }


// import { Component, OnInit } from '@angular/core';
// import { AnalyticsService } from '../../services/analytics.service';

// @Component({
//   selector: 'app-dashboard',
//   // imports: [],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
// })
// export class DashboardComponent implements OnInit {
//   currentData: any = {};
//   hourlyAverage: any = {};
//   maxAverage: any = {};

//   constructor(private analyticsService: AnalyticsService) {}

//   async ngOnInit() {
//     this.currentData = await this.analyticsService.getCurrentData();
//     this.hourlyAverage = await this.analyticsService.getHourlyAverage();
//     this.maxAverage = await this.analyticsService.getMaxHourlyAverage();
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { AnalyticsService } from '../../services/analytics.service';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
// })
// export class DashboardComponent implements OnInit {
//   currentData: any = {};
//   hourlyAverage: any = {};
//   maxAverage: any = {};

//   constructor(private analyticsService: AnalyticsService) {}

//   async ngOnInit() {
//     this.currentData = await this.analyticsService.getCurrentData();
//     this.hourlyAverage = await this.analyticsService.getHourlyAverage();
//     this.maxAverage = await this.analyticsService.getMaxHourlyAverage();
//   }
// }


import { Component } from '@angular/core';
import { CellComponent } from '../../components/cell/cell.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true, // Declare as standalone
  imports: [CommonModule, CellComponent], // Import CellComponent and CommonModule
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  currentData: any = {};
  hourlyAverage: any = {};
  maxAverage: any = {};

  constructor() {}

  async ngOnInit() {
    // Example data (replace with actual API calls or service data)
    this.currentData = {
      temperature: { temperature: 25.79 },
      humidity: { humidity: 50.15 },
      productCount: { productCount: 37 },
    };

    this.hourlyAverage = {
      temperatureAvg: 24.5,
      humidityAvg: 48.9,
      productCountAvg: 35,
    };

    this.maxAverage = {
      maxTemperatureAvg: 27.3,
      maxHumidityAvg: 52.7,
      maxProductCountAvg: 39,
    };
  }
}
