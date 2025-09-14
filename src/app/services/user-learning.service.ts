import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryWithCoursesDto {
  id: string;
  name: string;
  description: string;
  courseCount: number;
}

export interface CourseBasicDto {
  courseId: string;
  courseName: string;
  description?: string;
  
  // Image fields - add these based on what your API returns
  thumbnailUrl?: string;
  imagePath?: string;
  imageUrl?: string;
  thumbnail?: string;
  image?: string;
  
  // Course metadata
  duration?: string;
  author?: string;
  
  // Enrollment status
  isEnrolled: boolean;
  isCompleted: boolean;
  progress?: number;
  
  // Additional fields as needed
  categoryId?: string;
  level?: string;
  rating?: number;
}
export interface CourseDetailDto {
  assignmentPath: string;
  courseId: string;
  courseName: string;
  description: string;
  thumbnailUrl: string;
  modules: ModuleDto[];
  progress: number;
  isCompleted: boolean;
  assignmentDownloaded:boolean;
  assignmentSubmitted: boolean;
  quizSubmitted: boolean;
  quizPath: string;
  assignmentDownloadStatus: number;
}

// export interface CourseDetailDto1 {
//   assignmentPath: string;
//   courseId: string;
//   courseName: string;
//   description: string;
//   thumbnailUrl: string;
//   modules: ModuleDto[];
//   progress: number;
//   isCompleted: boolean;
//   assignmentDownloadStatus: number;
//   assignmentSubmitted: boolean;
//   quizSubmitted: boolean;
//   quizPath: string
// }

export interface ModuleDto {
  moduleId: string;
  moduleName: string;
  description: string;
  duration: number;
  videoUrl?: string;
  documentPath?: string;
  isCompleted: boolean;
  order: number;
}

export interface EnrollCourseDto {
  userId: string;
  courseId: string;
}

export interface UpdateProgressDto {
  userId: string;
  courseId: string;
  moduleId: string;
}

export interface CategoryWithCoursesDto {
  id: string;
  name: string;
  description: string;
  imagePath: string; // This is the key property for image loading
  courseCount: number;
  courses?: any[]; // Adjust based on your course structure
}

export interface CoursesByCategoryDto {
  courseId: string;
  courseName: string;
  description: string;
  imagePath: string;
  durationInMinutes: number;
  durationInHours: number;
  author: string;
  isEnrolled: boolean;
  completionPercentage: number;
  smeName: string;
  isFavorited: boolean;
  isSaved: boolean;
  favoriteCount: number;
  remainingMinutes: number;
  totalDurationInMinutes: number;
  categoryName: string;
  moduleCount: number;
  isCompleted?: boolean; // Optional property
  progress?: number; // Optional property
}

@Injectable({
  providedIn: 'root'
})
export class UserLearningService {
  private baseUrl = 'https://localhost:7264/api/UserLearning'; // Update with your API URL

  constructor(private http: HttpClient) { }

  getAllCategories(userId: string): Observable<CategoryWithCoursesDto[]> {
    return this.http.get<CategoryWithCoursesDto[]>(`${this.baseUrl}/allcategoriesinlob/${userId}`);
  }

  getCoursesByCategory(categoryId: string, userId: string): Observable<CoursesByCategoryDto[]> {
    return this.http.get<CoursesByCategoryDto[]>(`${this.baseUrl}/categories/${categoryId}/courses/${userId}`);
  }

  getCourseDetail(courseId: string, userId: string): Observable<CourseDetailDto> {
    return this.http.get<CourseDetailDto>(`${this.baseUrl}/courses/${courseId}/user/${userId}`);
  }

  // getCourseDetail1(courseId: string, userId: string): Observable<CourseDetailDto1> {
  //   return this.http.get<CourseDetailDto1>(`${this.baseUrl}/courses/${courseId}/user/${userId}`);
  // }

    getAssignment(courseId: string, userId: string) {
    return this.http.get(`${this.baseUrl}/courses/${courseId}/user/${userId}`);
  }


  enrollInCourse(enrollData: EnrollCourseDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/enroll`, enrollData);
  }

  updateModuleProgress(progressData: UpdateProgressDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/module/mark-complete`, progressData);
  }

  getUserDashboard(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/${userId}`);
  }

  getUserCompletedCourses(userId: string): Observable<CourseBasicDto[]> {
    return this.http.get<CourseBasicDto[]>(`${this.baseUrl}/completed/${userId}`);
  }

  getUserInProgressCourses(userId: string): Observable<CourseBasicDto[]> {
    return this.http.get<CourseBasicDto[]>(`${this.baseUrl}/inprogress/${userId}`);
  }

  downloadAssignment(userId: string, courseId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/assignment/download/${userId}/${courseId}`, {});
  }
}

