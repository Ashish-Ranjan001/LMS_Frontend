import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../components/dashboard/view-user/view-user.component';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(private http: HttpClient) {}
  private apiBaseUrl = 'https://localhost:7264';

  addUser(data: any) {
    const url = `${this.apiBaseUrl}/api/users`;
    return this.http.post(url, data);
  }

  viewUsers() {
    const url = `${this.apiBaseUrl}/api/users`;
    return this.http.get(url);
  }
  updateUser(userId: string, userData: any) {
    return this.http.put(`api/users/${userId}`, userData);
  }

  getUserById(userId: string) {
    return this.http.get<User>(`api/users/${userId}`);
  }
}
