import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserreportService {
  private apiBaseUrl = 'https://localhost:7264';

  constructor(private http: HttpClient) {}

  getUserAnalytics(userId: string) {
    const url = `${this.apiBaseUrl}/api/UserAnalytics/${userId}`;
    return this.http.get(url);
  }

  getUserAnalyticsByEmail(email: string) {
    const encodedEmail = encodeURIComponent(email);
    const url = `${this.apiBaseUrl}/api/UserAnalytics/by-email/${encodedEmail}`;
    return this.http.get(url);
  }

  getTopPerformers(count: number = 10) {
    const url = `${this.apiBaseUrl}/api/UserAnalytics/top-performers?count=${count}`;
    return this.http.get(url);
  }
}