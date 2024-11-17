import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  current = { temperature: 0, humidity: 0, productCount: 0 };
  hourlyAverages = { temperature: 0, humidity: 0, productCount: 0 };
  maxHourly = { temperature: 0, humidity: 0, productCount: 0 };

  private refreshInterval: any;

  constructor(
    private analyticsService: AnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ngOnInit() is a lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
  ngOnInit(): void {
    this.loadData();

    if (isPlatformBrowser(this.platformId)) {
      this.startAutoRefresh();
    }
  }

  // ngOnDestroy() is a lifecycle hook that is called when a directive, pipe, or service is destroyed.
  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  // loadData() is a custom method that fetches data from the backend and updates the component's properties.
  loadData() {
    this.loadCurrentData();
    this.loadHourlyAverage();
    this.loadMaxHourlyAverage();
  }

  // loadCurrentData() is a custom method that fetches the current data from the backend.
  loadCurrentData() {
    this.analyticsService.getCurrentData().subscribe((data) => {
      this.current = data;
    });
  }

  // loadHourlyAverage() is a custom method that fetches the hourly averages from the backend.
  loadHourlyAverage() {
    this.analyticsService.getHourlyAverage().subscribe((data) => {
      this.hourlyAverages = data;
    });
  }

  // loadMaxHourlyAverage() is a custom method that fetches the maximum hourly averages from the backend.
  loadMaxHourlyAverage() {
    this.analyticsService.getMaxHourlyAverage().subscribe((data) => {
      this.maxHourly = data;
    });
  }

  // startAutoRefresh() is a custom method that starts the auto-refresh interval. - set interval to 15 seconds
  startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      this.loadData();
    }, 15000);
  }

  // stopAutoRefresh() is a custom method that stops the auto-refresh interval.
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}

