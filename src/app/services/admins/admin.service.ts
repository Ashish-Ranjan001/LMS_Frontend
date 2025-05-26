import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7264/api/admins'; 

  constructor(private http: HttpClient) {}

  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.apiUrl);
  }
}