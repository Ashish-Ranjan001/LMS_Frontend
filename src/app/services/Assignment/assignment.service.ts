// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface AssignmentRequest {
//   smeId: string;
//   lobId: string;
//   courseId: string;
//   instructions?: string;
//   assignmentFile: File;
// }

// export interface UserInLob {
//   map_id: string;
//   user_id: string;
//   user_name: string;
//   user_email: string;
//   has_assignment: boolean;
//   // assignment_status: number;
//   last_assigned_by: string;
//   assignment_download_status: number;
// }

// export interface CompleteQuizRequest {
//   UserId: string;
//   CourseId: string;
//   QuizScore: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AssignmentService {

//   private apiBaseUrl = 'https://localhost:7264';

//   constructor(private http: HttpClient) { }

//   // Assign assignment to all users in a LOB
//   assignToLob(assignmentData: AssignmentRequest) {
//     const url = `${this.apiBaseUrl}/api/assignment/assign-to-lob`;
    
//     const formData = new FormData();
//     formData.append('SmeId', assignmentData.smeId);
//     formData.append('LobId', assignmentData.lobId);
//     formData.append('CourseId', assignmentData.courseId);
//     formData.append('Instructions', assignmentData.instructions || '');
//     formData.append('AssignmentFile', assignmentData.assignmentFile);

//     return this.http.post(url, formData);
//   }

//   // Get users in a specific LOB and Course
//   getUsersInLob(lobId: string, courseId: string): Observable<any> {
//     const url = `${this.apiBaseUrl}/api/assignment/users-in-lob?lobId=${lobId}&courseId=${courseId}`;
//     return this.http.get(url);
//   }

//   // Complete Quiz
//   completeQuiz(request: CompleteQuizRequest): Observable<any> {
//     const url =`${this.apiBaseUrl}/api/quiz/complete`;
//     return this.http.post(url, request);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssignmentRequest {
  smeId: string;
  lobId: string;
  courseId: string;
  instructions?: string;
  assignmentFile: File;
}

export interface UserInLob {
  map_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  has_assignment: boolean;
  assignment_status: number;
  last_assigned_by: string;
  assignment_download_status: number;
}

export interface CompleteQuizRequest {
  UserId: string;
  CourseId: string;
  QuizScore: number;
}

export interface SubmitAssignmentDto {
  UserId: string;
  CourseId: string;
  assignment_sme_file: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private apiBaseUrl = 'https://localhost:7264';

  constructor(private http: HttpClient) { }

  // Assign assignment to all users in a LOB
  assignToLob(assignmentData: AssignmentRequest) {
    const url = `${this.apiBaseUrl}/api/assignment/assign-to-lob`;
    
    const formData = new FormData();
    formData.append('SmeId', assignmentData.smeId);
    formData.append('LobId', assignmentData.lobId);
    formData.append('CourseId', assignmentData.courseId);
    formData.append('Instructions', assignmentData.instructions || '');
    formData.append('AssignmentFile', assignmentData.assignmentFile);

    return this.http.post(url, formData);
  }

  // Get users in a specific LOB and Course
  getUsersInLob(lobId: string, courseId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/assignment/users-in-lob?lobId=${lobId}&courseId=${courseId}`;
    return this.http.get(url);
  }

  // Complete Quiz
  completeQuiz(request: CompleteQuizRequest): Observable<any> {
    const url = `${this.apiBaseUrl}/api/quiz/complete`;
    return this.http.post(url, request);
  }

  submitAssignment(submitData: SubmitAssignmentDto): Observable<any> {
    const url = `${this.apiBaseUrl}/api/UserLearning/assignment/submit`;
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, submitData, { headers });
  }
  
}