


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VideoModuleResponse {
  module_id: string;
  course_id: string;
  modulename: string;
  duration: number;
  videopath: string;
  category_id:string;
  pdfPath: string;
}

export interface ApiResponse {
  data: VideoModuleResponse;
  msg: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModuleServicesService {
  private readonly baseUrl = 'https://localhost:7264/api/Module';

  constructor(private http: HttpClient) { }

  getVideoModuleById(moduleId: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/video/${moduleId}`);
  }
}