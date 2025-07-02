import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface AssignmentRequest {
  smeId: string;
  lobId: string;
  courseId: string;
  assignmentFile: File;
  instructions?: string;
}

export interface UserInLob {
  map_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  has_assignment: boolean;
  assignment_status: number;
  last_assigned_by: string;
}

export interface AssignmentResponse {
  success: boolean;
  message: string;
  assigned_count?: number;
  course_name?: string;
  lob_name?: string;
  assigned_users?: any[];
}

export interface UsersInLobResponse {
  success: boolean;
  total_users: number;
  users: UserInLob[];
}

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private baseUrl = 'https://localhost:7264/api/Assignment';

  constructor(private http: HttpClient) {}

  // Get SME ID from JWT token stored in localStorage
  getSmeIdFromToken(): string | null {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const decodedToken: any = jwtDecode(token);
      return decodedToken['UserId'] || decodedToken['NameIdentifier'] || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Get authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Assign assignment to LOB
  assignToLob(request: AssignmentRequest): Observable<AssignmentResponse> {
    const formData = new FormData();
    formData.append('SmeId', request.smeId);
    formData.append('LobId', request.lobId);
    formData.append('CourseId', request.courseId);
    formData.append('AssignmentFile', request.assignmentFile);
    if (request.instructions) {
      formData.append('Instructions', request.instructions);
    }

    return this.http.post<AssignmentResponse>(
      `${this.baseUrl}/assign-to-lob`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get users in a specific LOB and Course
  getUsersInLob(lobId: string, courseId: string): Observable<UsersInLobResponse> {
    return this.http.get<UsersInLobResponse>(
      `${this.baseUrl}/users-in-lob?lobId=${lobId}&courseId=${courseId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Helper method to get user info from token
  getUserInfoFromToken(): any {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const decodedToken: any = jwtDecode(token);
      return {
        userId: decodedToken['UserId'] || decodedToken['NameIdentifier'],
        email: decodedToken['Email'] || decodedToken['email'],
        name: decodedToken['Name'],
        role: decodedToken['Role'] || decodedToken['role'],
        roleId: decodedToken['RoleId'],
        isSuperAdmin: decodedToken['IsSuperAdmin'] === 'true'
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}