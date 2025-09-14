import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardServicesService {

  private baseUrl = 'https://localhost:7264/api/UserLearning'; // ✅ Correct API URL

  constructor(private http: HttpClient) {}

  getStatsForHomeBanner(userId:string):Observable<any>{
    const url = `${this.baseUrl}/category-stats/${userId}`;
     return this.http.get<any>(url);
  }

  // getModuleById(moduleId: string): Observable<any> {
  //   const url = `${this.apiBaseUrl}/api/Module/${moduleId}`;
  //   return this.client.get<any>(url);
  // }

  getFavouoiteCourses(userId:string):Observable<any>
  {
    const url = `${this.baseUrl}/favorited-courses/${userId}`;
    return this.http.get<any>(url);
  }

  getSavedCourses(userId:string):Observable<any>
  {
    const url = `${this.baseUrl}/saved-courses/${userId}`;
    return this.http.get<any>(url);
  }

  getAllCategories(userId:string):Observable<any>
  {
    const url = `${this.baseUrl}/allcategoriesinlob/${userId}`;
    return this.http.get<any>(url);
  }
  
}
