import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminserviceService {
  private apiBaseUrl = 'https://localhost:7264'; // Base URL
  private apiUrl = 'https://localhost:7264/api/admins'; // Update this URL as needed

  constructor(private http: HttpClient) { }

  getAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Changed from number to string to match your admin ID format
  getAdminById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createAdmin(adminData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, adminData);
  }

  updateAdmin(adminID: string, adminData: { status: boolean }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/${adminID}`, adminData, { headers });
  }
}