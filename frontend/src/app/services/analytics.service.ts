import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/analytics';

  async getCurrentData() {
    const response = await axios.get(`${this.apiUrl}/current`);
    return response.data;
  }

  async getHourlyAverage() {
    const response = await axios.get(`${this.apiUrl}/average`);
    return response.data;
  }

  async getMaxHourlyAverage() {
    const response = await axios.get(`${this.apiUrl}/max-average`);
    return response.data;
  }
}


