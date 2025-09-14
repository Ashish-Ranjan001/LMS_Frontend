// import { HttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseServicesService {
  private apiBaseUrl = 'https://localhost:7264';

  constructor(private client: HttpClient) { }

  addCourse(courseData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/api/Course`;
    return this.client.post(url, courseData);
  } 

  viewCourses(): Observable<any> {
    const url = `${this.apiBaseUrl}/api/Course`;
    return this.client.get(url);
  }

  getCourseById(courseId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/Course/${courseId}`;
    return this.client.get<any>(url);
  }
  
  updateCourse(courseId: string, courseData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/api/Course/${courseId}`;
    return this.client.put(url, courseData);
  }
  
  addModule(data: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/api/Module`;
    return this.client.post(url, data); 
  }

  // Updated to return the full response object
  getModulesByCourseId(courseId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/Module/course/${courseId}`;
    return this.client.get<any>(url);
  }
  
  updateModule(moduleId: string, moduleData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/api/Module/${moduleId}`;
    return this.client.put(url, moduleData);
  }
  
  // Updated to return the full response object
  getAllModules(): Observable<any> {
    const url = `${this.apiBaseUrl}/api/Module`;
    return this.client.get<any>(url);
  }
  
  getModuleById(moduleId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/Module/${moduleId}`;
    return this.client.get<any>(url);
  }
  getCourseWithCategoriesLob(lobid: string) {
    const url = `${this.apiBaseUrl}/api/Course/coursewithcategories`;
    return this.client.get<any>(url, {
      params: {
        lobid: lobid
      }
    });
  }
}