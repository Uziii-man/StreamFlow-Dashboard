import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private baseUrl = 'http://localhost:3000/analytics';

  constructor(private http: HttpClient) {}

// Observable is a generic type that represents a stream of data. It is used to handle asynchronous data streams in Angular.
  getCurrentData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/current`).pipe(
      map((data: any) => ({
        temperature: data.temperature.temperature,
        humidity: data.humidity.humidity,
        productCount: data.productCount.productCount,
      }))
    );
  }

  getHourlyAverage(): Observable<any> {
    return this.http.get(`${this.baseUrl}/average`).pipe(
      map((data: any) => ({
        temperature: data.temperatureAvg,
        humidity: data.humidityAvg,
        productCount: data.productCountAvg,
      }))
    );
  }

  getMaxHourlyAverage(): Observable<any> {
    return this.http.get(`${this.baseUrl}/max-average`).pipe(
      map((data: any) => ({
        temperature: data.maxTemperatureAvg,
        humidity: data.maxHumidityAvg,
        productCount: data.maxProductCountAvg,
      }))
    );
  }
}