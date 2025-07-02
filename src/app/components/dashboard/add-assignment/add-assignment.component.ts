// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-assignment',
//   imports: [],
//   templateUrl: './add-assignment.component.html',
//   styleUrl: './add-assignment.component.css'
// })
// export class AddAssignmentComponent {

// }

import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../../../services/Assignment/assignment.service';
import { CourseServicesService } from '../../../services/courses/course-services.service';
import { LobServicesService } from '../../../services/lobs/lob-services.service';
import { SmeServicesService } from '../../../services/smes/sme-services.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Sme {
  smeId: string;
  smeName: string;
  smeEmail?: string;
  status?: boolean;
}

export interface Lob {
  lobId: string;
  lobName: string;
  status?: boolean;
}

export interface Course {
  courseId: string;
  courseName: string;
  status?: boolean;
}

export interface AssignmentRequest {
  smeId: string;
  lobId: string;
  courseId: string;
  assignmentFile: File;
  instructions?: string;
}

export interface AssignmentResponse {
  success: boolean;
  message: string;
  assigned_count?: number;
  course_name?: string;
  lob_name?: string;
  assigned_users?: any[];
}

@Component({
  selector: 'app-add-assignment',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-assignment.component.html',
  styleUrl: './add-assignment.component.css'
})
export class AddAssignmentComponent implements OnInit {
  
  // Form data
  selectedSmeId: string = '';
  selectedLobId: string = '';
  selectedCourseId: string = '';
  assignmentFile: File | null = null;
  instructions: string = '';
  
  // Dropdown data
  smeList: Sme[] = [];
  lobList: Lob[] = [];
  courseList: Course[] = [];
  
  // Loading states
  loadingSmes: boolean = false;
  loadingLobs: boolean = false;
  loadingCourses: boolean = false;
  submittingAssignment: boolean = false;
  
  // Response data
  assignmentResponse: AssignmentResponse | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  
  // File validation
  maxFileSize = 10 * 1024 * 1024; // 10MB
  allowedFileTypes = ['.pdf', '.doc', '.docx', '.txt', '.zip', '.rar'];
  
  constructor(
    private assignmentService: AssignmentService,
    private courseService: CourseServicesService,
    private lobService: LobServicesService,
    private smeService: SmeServicesService
  ) { }

  ngOnInit(): void {
    this.loadSmes();
    this.loadLobs();
    this.loadCourses();
  }

  // Load SMEs from API
  loadSmes(): void {
    this.loadingSmes = true;
    this.smeService.viewSmes().subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response)) {
          this.smeList = response
            .filter((sme: any) => sme.status === true)
            .map((sme: any) => ({
              smeId: sme.smeId || sme.id,
              smeName: sme.smeName || sme.name,
              smeEmail: sme.smeEmail || sme.email,
              status: sme.status
            }));
        } else if (response && response.data) {
          this.smeList = response.data
            .filter((sme: any) => sme.status === true)
            .map((sme: any) => ({
              smeId: sme.smeId || sme.id,
              smeName: sme.smeName || sme.name,
              smeEmail: sme.smeEmail || sme.email,
              status: sme.status
            }));
        }
        this.loadingSmes = false;
      },
      error: (error) => {
        console.error('Error loading SMEs:', error);
        this.errorMessage = 'Error loading SMEs. Please try again.';
        this.loadingSmes = false;
      }
    });
  }

  // Load LOBs from API
  loadLobs(): void {
    this.loadingLobs = true;
    this.lobService.viewLobs().subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response)) {
          this.lobList = response
            .filter((lob: any) => lob.status === true)
            .map((lob: any) => ({
              lobId: lob.lobId || lob.id,
              lobName: lob.lobName || lob.name,
              status: lob.status
            }));
        } else if (response && response.data) {
          this.lobList = response.data
            .filter((lob: any) => lob.status === true)
            .map((lob: any) => ({
              lobId: lob.lobId || lob.id,
              lobName: lob.lobName || lob.name,
              status: lob.status
            }));
        }
        this.loadingLobs = false;
      },
      error: (error) => {
        console.error('Error loading LOBs:', error);
        this.errorMessage = 'Error loading LOBs. Please try again.';
        this.loadingLobs = false;
      }
    });
  }

  // Load Courses from API
  loadCourses(): void {
    this.loadingCourses = true;
    this.courseService.viewCourses().subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.courseList = response.data.map((course: any) => ({
            courseId: course.course_id,
            courseName: course.course_name,
            status: course.status
          }));
        } else {
          console.warn("Unexpected course response format:", response);
          this.courseList = [];
        }
        this.loadingCourses = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.errorMessage = 'Error loading courses. Please try again.';
        this.loadingCourses = false;
      }
    });
  }

  // Handle file selection
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > this.maxFileSize) {
        this.errorMessage = 'File size must be less than 10MB';
        this.assignmentFile = null;
        return;
      }

      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!this.allowedFileTypes.includes(fileExtension)) {
        this.errorMessage = `File type not allowed. Allowed types: ${this.allowedFileTypes.join(', ')}`;
        this.assignmentFile = null;
        return;
      }

      this.assignmentFile = file;
      this.errorMessage = '';
    }
  }

  // Handle form changes
  onFormChange(): void {
    this.assignmentResponse = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Check if form is valid
  isFormValid(): boolean {
    return this.selectedSmeId !== '' && 
           this.selectedLobId !== '' && 
           this.selectedCourseId !== '' && 
           this.assignmentFile !== null;
  }

  // Submit assignment
  submitAssignment(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill all required fields and select a file';
      return;
    }

    this.submittingAssignment = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.assignmentResponse = null;

    // Create assignment request object
    const assignmentRequest: AssignmentRequest = {
      smeId: this.selectedSmeId,
      lobId: this.selectedLobId,
      courseId: this.selectedCourseId,
      assignmentFile: this.assignmentFile!,
      instructions: this.instructions.trim() || undefined
    };

    this.assignmentService.assignToLob(assignmentRequest).subscribe({
      next: (response: any) => {
        this.assignmentResponse = response;
        if (response.success) {
          this.successMessage = response.message;
          this.resetForm();
        } else {
          this.errorMessage = response.message || 'Assignment submission failed';
        }
        this.submittingAssignment = false;
      },
      error: (error) => {
        console.error('Error submitting assignment:', error);
        this.errorMessage = error.error?.message || 'Error submitting assignment. Please try again.';
        this.submittingAssignment = false;
      }
    });
  }

  // Reset form
  resetForm(): void {
    this.selectedSmeId = '';
    this.selectedLobId = '';
    this.selectedCourseId = '';
    this.assignmentFile = null;
    this.instructions = '';
    
    // Reset file input
    const fileInput = document.getElementById('assignmentFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Get selected SME name
  getSelectedSmeName(): string {
    const selectedSme = this.smeList.find(sme => sme.smeId === this.selectedSmeId);
    return selectedSme ? selectedSme.smeName : '';
  }

  // Get selected LOB name
  getSelectedLobName(): string {
    const selectedLob = this.lobList.find(lob => lob.lobId === this.selectedLobId);
    return selectedLob ? selectedLob.lobName : '';
  }

  // Get selected Course name
  getSelectedCourseName(): string {
    const selectedCourse = this.courseList.find(course => course.courseId === this.selectedCourseId);
    return selectedCourse ? selectedCourse.courseName : '';
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}