// import { Component, OnInit } from '@angular/core';
// //import { AssignmentService, UserInLob } from '../../../services/Assignment/assignment.service.spec';
// import { CourseServicesService } from '../../../services/courses/course-services.service';
// import { LobServicesService } from '../../../services/lobs/lob-services.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AssignmentService, UserInLob } from '../../../services/Assignment/assignment.service';

// export interface Lob {
//   lobId: string;
//   lobName: string;
// }

// export interface Course {
//   courseId: string;
//   courseName: string;
// }

// export interface UsersInLobResponse {
//   success: boolean;
//   total_users: number;
//   users: UserInLob[];
// }

// @Component({
//   selector: 'app-view-assignment',
//   imports: [
//     // other modules
//     FormsModule, CommonModule
//   ],
//   templateUrl: './view-assignment.component.html',
//   styleUrl: './view-assignment.component.css'
// })

// export class ViewAssignmentComponent implements OnInit  {

//    // Form data
//    selectedLobId: string = '';
//    selectedCourseId: string = '';
   
//    // Dropdown data
//    lobList: Lob[] = [];
//    courseList: Course[] = [];
   
//    // Loading states
//    loadingLobs: boolean = false;
//    loadingCourses: boolean = false;
//    loadingUsers: boolean = false;
   
//    // Response data
//    usersData: UsersInLobResponse | null = null;
//    errorMessage: string = '';
   
//    constructor(
//      private assignmentService: AssignmentService,
//      private courseService: CourseServicesService,
//      private lobService: LobServicesService
//    ) { }
 
//    ngOnInit(): void {
//      this.loadLobs();
//      this.loadCourses();
//    }
 
//    // Load LOBs from API
//    loadLobs(): void {
//      this.loadingLobs = true;
//      this.lobService.viewLobs().subscribe({
//        next: (response: any) => {
//          if (response && Array.isArray(response)) {
//            this.lobList = response.map((lob: any) => ({
//              lobId: lob.lobId || lob.id,
//              lobName: lob.lobName || lob.name,
//              lobDescription: lob.lobDescription || lob.description,
//              status: lob.status
//            }));
//          } else if (response && response.data) {
//            this.lobList = response.data.map((lob: any) => ({
//              lobId: lob.lobId || lob.id,
//              lobName: lob.lobName || lob.name,
//              lobDescription: lob.lobDescription || lob.description,
//              status: lob.status
//            }));
//          }
//          this.loadingLobs = false;
//        },
//        error: (error) => {
//          console.error('Error loading LOBs:', error);
//          this.loadingLobs = false;
//        }
//      });
//    }
 
// loadCourses(): void {
//   this.loadingCourses = true;

//   this.courseService.viewCourses().subscribe({
//     next: (response: any) => {
//       console.log("Raw course response:", response);

//       if (response && Array.isArray(response.data)) {
//         this.courseList = response.data.map((course: any, i: number) => {
//           console.log(`Course[${i}]`, course);
//           return {
//             courseId: course.course_id,
//             courseName: course.course_name
//           };
//         });
//       } else {
//         console.warn("Unexpected course response format:", response);
//         this.courseList = [];
//       }

//       console.log("Parsed course list:", this.courseList);
//       this.loadingCourses = false;
//     },
//     error: (error) => {
//       console.error('Error loading courses:', error);
//       this.loadingCourses = false;
//     }
//   });
// }


 
//    // Handle form changes
//    onFormChange(): void {
//      // Clear previous results when form changes
//      this.usersData = null;
//      this.errorMessage = '';
//    }
 
//    // Check if view button should be enabled
//    canViewUsers(): boolean {
//      return this.selectedLobId !== '' && this.selectedCourseId !== '';
//    }
 
   
//    // View users in LOB
//    viewUsersInLob(): void {
//      if (!this.canViewUsers()) {
//        this.errorMessage = 'Please select both LOB and Course';
//        return;
//      }
 
//      this.loadingUsers = true;
//      this.errorMessage = '';
//      this.usersData = null;
 
//      this.assignmentService.getUsersInLob(this.selectedLobId, this.selectedCourseId).subscribe({
//        next: (response: any) => {
//          this.usersData = response;
//          this.loadingUsers = false;
//        },
//        error: (error) => {
//          console.error('Error loading users:', error);
//          this.errorMessage = error.error?.message || 'Error loading users. Please try again.';
//          this.loadingUsers = false;
//        }
//      });
//    }
 
//    getAssignmentStatusText(status: any): string {
//     const normalized = Number(status);  // Converts "0" or "1" (string) to number
  
//     switch (normalized) {
//       case 0: return 'Not Started';
//       case 1: return 'Downloaded';
//       default: return 'Unknown';
//     }
//   }
  
//   getAssignmentStatusClass(status: any): string {
//     const normalized = Number(status);
  
//     switch (normalized) {
//       case 0: return 'status-not-started';
//       case 1: return 'status-downloaded';  // Custom class you can define in CSS
//       default: return 'status-unknown';
//     }
//   }
  
//    // Get selected LOB name
//    getSelectedLobName(): string {
//      const selectedLob = this.lobList.find(lob => lob.lobId === this.selectedLobId);
//      return selectedLob ? selectedLob.lobName : '';
//    }
 
//    // Get selected Course name
//    getSelectedCourseName(): string {
//      const selectedCourse = this.courseList.find(course => course.courseId === this.selectedCourseId);
//      return selectedCourse ? selectedCourse.courseName : '';
//    }
// }
import { Component, OnInit } from '@angular/core';
import { CourseServicesService } from '../../../services/courses/course-services.service';
import { LobServicesService } from '../../../services/lobs/lob-services.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssignmentService, UserInLob } from '../../../services/Assignment/assignment.service';

export interface Lob {
  lobId: string;
  lobName: string;
}

export interface Course {
  courseId: string;
  courseName: string;
}

export interface UsersInLobResponse {
  success: boolean;
  total_users: number;
  users: UserInLob[];
}

@Component({
  selector: 'app-view-assignment',
  imports: [FormsModule, CommonModule],
  templateUrl: './view-assignment.component.html',
  styleUrl: './view-assignment.component.css'
})
export class ViewAssignmentComponent implements OnInit {
  selectedLobId: string = '';
  selectedCourseId: string = '';

  lobList: Lob[] = [];
  courseList: Course[] = [];

  loadingLobs: boolean = false;
  loadingCourses: boolean = false;
  loadingUsers: boolean = false;

  usersData: UsersInLobResponse | null = null;
  errorMessage: string = '';

  constructor(
    private assignmentService: AssignmentService,
    private courseService: CourseServicesService,
    private lobService: LobServicesService
  ) {}

  ngOnInit(): void {
    this.loadLobs();
    this.loadCourses();
  }

  loadLobs(): void {
    this.loadingLobs = true;
    this.lobService.viewLobs().subscribe({
      next: (response: any) => {
        this.lobList = Array.isArray(response?.data || response)
          ? (response.data || response).map((lob: any) => ({
              lobId: lob.lobId || lob.id,
              lobName: lob.lobName || lob.name,
              lobDescription: lob.lobDescription || lob.description,
              status: lob.status
            }))
          : [];
        this.loadingLobs = false;
      },
      error: (error) => {
        console.error('Error loading LOBs:', error);
        this.loadingLobs = false;
      }
    });
  }

  loadCourses(): void {
    this.loadingCourses = true;
    this.courseService.viewCourses().subscribe({
      next: (response: any) => {
        if (Array.isArray(response.data)) {
          this.courseList = response.data.map((course: any) => ({
            courseId: course.course_id,
            courseName: course.course_name
          }));
        } else {
          this.courseList = [];
        }
        this.loadingCourses = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loadingCourses = false;
      }
    });
  }

  onFormChange(): void {
    this.usersData = null;
    this.errorMessage = '';
  }

  canViewUsers(): boolean {
    return this.selectedLobId !== '' && this.selectedCourseId !== '';
  }

  viewUsersInLob(): void {
    if (!this.canViewUsers()) {
      this.errorMessage = 'Please select both LOB and Course';
      return;
    }

    this.loadingUsers = true;
    this.usersData = null;

    this.assignmentService.getUsersInLob(this.selectedLobId, this.selectedCourseId).subscribe({
      next: (response: any) => {
        console.log("📦 assignment_download_status values:");
        response.users?.forEach((user: any, i: number) => {
          console.log(`User[${i}] assignment_download_status:`, user.assignment_download_status);
        });

        this.usersData = response;
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = error.error?.message || 'Error loading users. Please try again.';
        this.loadingUsers = false;
      }
    });
  }

  getAssignmentStatusText(status: any): string {
    const normalized = Number(status);
    if (isNaN(normalized)) return 'Not Started'; // fallback
    switch (normalized) {
      case 0: return 'Not Started';
      case 1: return 'Downloaded';
      default: return 'Unknown';
    }
  }

  getAssignmentStatusClass(status: any): string {
    const normalized = Number(status);
    if (isNaN(normalized)) return 'status-not-started';
    switch (normalized) {
      case 0: return 'status-not-started';
      case 1: return 'status-downloaded';
      default: return 'status-unknown';
    }
  }

  getSelectedLobName(): string {
    const selectedLob = this.lobList.find(lob => lob.lobId === this.selectedLobId);
    return selectedLob ? selectedLob.lobName : '';
  }

  getSelectedCourseName(): string {
    const selectedCourse = this.courseList.find(course => course.courseId === this.selectedCourseId);
    return selectedCourse ? selectedCourse.courseName : '';
  }
}
