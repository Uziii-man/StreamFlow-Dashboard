import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {
  currentData: any = {};
  hourlyAverage: any = {};
  maxHourlyAverage: any = {};

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.fetchData();
    setInterval(() => this.fetchData(), 15000); // Refresh data every 15 seconds
  }

  // Fetch data from backend
  fetchData() {
    this.analyticsService.getCurrentData().subscribe((data) => (this.currentData = data));
    this.analyticsService.getHourlyAverage().subscribe((data) => (this.hourlyAverage = data));
    this.analyticsService.getMaxHourlyAverage().subscribe((data) => (this.maxHourlyAverage = data));
  }
}