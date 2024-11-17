import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
})
export class DashboardComponent {
  // Define the properties used in the template
  current = {
    temperature: 25, // Example temperature value
    humidity: 65, // Example humidity value
    productCount: 120, // Example product count
  };

  hourlyAverages = {
    temperature: 23.5, // Example hourly average temperature
    humidity: 63.2, // Example hourly average humidity
    productCount: 115, // Example hourly average product count
  };

  maxHourly = {
    temperature: 26.1, // Example max hourly average temperature
    humidity: 67.8, // Example max hourly average humidity
    productCount: 125, // Example max hourly average product count
  };
}