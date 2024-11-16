import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/analytics'; // Backend API URL

  constructor(private http: HttpClient) {}

  // Fetch current data
  getCurrentData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current`);
  }

  // Fetch hourly average
  getHourlyAverage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/average`);
  }

  // Fetch maximum hourly average
  getMaxHourlyAverage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/max-average`);
  }
}