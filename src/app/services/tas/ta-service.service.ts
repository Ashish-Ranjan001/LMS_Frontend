// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class TaServiceService {
//   private apiBaseUrl = 'https://localhost:7264';

//   constructor(private http: HttpClient) {}

//   getTaById(taId: number) {
//     const url = `${this.apiBaseUrl}/api/Ta/${taId}`;
//     return this.http.get<{ status: boolean }>(url);
//   }

//   updateTa(taId: number, taData: { status: boolean }) {
//     const url = `${this.apiBaseUrl}/api/Ta/${taId}`;
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//     return this.http.put(url, taData, { headers });
//   }

//   addTa(taData: any) {
//     const url = `${this.apiBaseUrl}/api/Ta`;
//     return this.http.post(url, taData);
//   }

//   viewTas() {
//     const url = `${this.apiBaseUrl}/api/Ta`;
//     return this.http.get(url);
//   }
// }
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface Ta {
  taId: number;
  adminId: number;
  name: string;
  email: string;
  phone: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaServiceService {
  private apiBaseUrl = 'https://localhost:7264';

  constructor(private http: HttpClient) {}

  viewTas() {
    const url = `${this.apiBaseUrl}/api/Ta`;
    return this.http.get<Ta[]>(url);
  }

  addTa(taData: any) {
    const url = `${this.apiBaseUrl}/api/Ta`;
    return this.http.post(url, taData);
  }

  getTaById(taId: number) {
    const url = `${this.apiBaseUrl}/api/Ta/${taId}`;
    return this.http.get<Ta>(url);
  }

  updateTa(taId: number, taData: { status: boolean }) {
    const url = `${this.apiBaseUrl}/api/Ta/${taId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(url, taData, { headers });
  }
  changePassword(taId: number, newPassword: string) {
  const url = `${this.apiBaseUrl}/api/Ta/${taId}/change-password`;
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.put(url, { newPassword }, { headers });
}

} 

