import { HttpClient } from '@angular/common/http';
import { Injectable   } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http:HttpClient) { }
  private apiBaseUrl = 'https://localhost:7264';

   addUser(data: any) {
    const url = `${this.apiBaseUrl}/api/users`;
    return this.http.post(url, data);
  }

  viewUsers() {
    const url = `${this.apiBaseUrl}/api/users`;
    return this.http.get(url);
  }
  
  getUserById(userId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/users/${userId}`;
    return this.http.get(url);
    }


  updateUser(userId: string, data: any): Observable<any> {
    const url =`${this.apiBaseUrl}/api/users/${userId}`;
    return this.http.put(url,data);
    }

}
