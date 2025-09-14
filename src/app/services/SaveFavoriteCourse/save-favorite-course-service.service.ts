import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface toggleSave {
  UserId: string;    // Should match backend DTO property names
  CourseId: string;
  IsFavorited: boolean;
  IsSaved: boolean;
  
}
export interface toggleFavorite {
  UserId: string;    // Should match backend DTO property names
  CourseId: string;
  IsFavorited: boolean;
  IsSaved: boolean;
}


@Injectable({
  providedIn: 'root'
})


export class SaveFavoriteCourseServiceService {

  private apiBaseUrl = 'https://localhost:7264';
  constructor(private http:HttpClient) { }


  toggleSave(toggleSave: toggleSave) {
    const url = `${this.apiBaseUrl}/api/UserLearning/toggle-save`;
    return this.http.post(url, toggleSave);
  }

  toggleFavorite(toggleFavorite: toggleFavorite) {
    const url = `${this.apiBaseUrl}/api/UserLearning/toggle-favorite`;
    return this.http.post(url, toggleFavorite); // ✅ pass the actual data
  }

}
