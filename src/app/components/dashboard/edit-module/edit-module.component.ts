// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-edit-module',
// //   imports: [],
// //   templateUrl: './edit-module.component.html',
// //   styleUrl: './edit-module.component.css'
// // })
// // export class EditModuleComponent {

// // }
// import { CommonModule } from '@angular/common';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CourseModule } from '../../../models/course-module';
// //import { CourseServicesService } from '../../../services/course-services.service';
// import {CourseServicesService} from '../../../services/courses/course-services.service'
// @Component({
//   selector: 'app-edit-module',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './edit-module.component.html',
//   styleUrl: './edit-module.component.css'
// })
// export class EditModuleComponent implements OnInit, OnDestroy {
//   moduleData: CourseModule = {
//     modulename: '',
//     duration: '',
//     description: ''
//   };

//   moduleId: string = '';
//   courseId: string = '';
//   videoFile?: File;
//   pdfFile?: File;
//   videoFileName: string = 'No file chosen';
//   pdfFileName: string = 'No file chosen';
//   videoError: string = '';
//   pdfError: string = '';
//   videoPreview: string | null = null;
//   isSubmitting: boolean = false;
//   isLoading: boolean = true;
  
//   // Store existing file paths
//   existingVideoPath: string = '';
//   existingPdfPath: string = '';

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private courseService: CourseServicesService
//   ) {}

//   ngOnInit(): void {
//     // Get module ID from URL
//     this.moduleId = this.route.snapshot.paramMap.get('moduleId') || 
//                    this.route.snapshot.paramMap.get('id') || '';
    
//     // Get course ID from URL or query params
//     this.courseId = this.route.snapshot.paramMap.get('courseId') || 
//                    this.route.snapshot.queryParamMap.get('courseId') || '';

//     console.log('Module ID:', this.moduleId);
//     console.log('Course ID:', this.courseId);

//     if (this.moduleId) {
//       this.loadModuleData();
//     } else {
//       console.error('Module ID is required');
//       alert('Module ID is missing');
//       this.router.navigate(['/courses']);
//     }
//   }

//   loadModuleData(): void {
//     this.isLoading = true;
    
//     this.courseService.getModuleById(this.moduleId).subscribe({
//       next: (response: any) => {
//         console.log('Module data loaded:', response);
        
//         // Map the response to your component data structure
//         this.moduleData = {
//           modulename: response.modulename || '',
//           duration: response.duration || '',
//           description: response.description || ''
//         };

//         this.courseId = response.course_id || this.courseId;
        
//         // Handle existing files
//         if (response.videopath) {
//           this.existingVideoPath = response.videopath;
//           this.videoFileName = this.extractFileName(response.videopath) || 'Existing video file';
//         }
        
//         if (response.documentpath) {
//           this.existingPdfPath = response.documentpath;
//           this.pdfFileName = this.extractFileName(response.documentpath) || 'Existing PDF file';
//         }

//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading module:', error);
//         alert('Error loading module data');
//         this.isLoading = false;
//         this.router.navigate(['/courses']);
//       }
//     });
//   }

//   extractFileName(filePath: string): string {
//     if (!filePath) return '';
//     return filePath.split('/').pop() || '';
//   }

//   onVideoFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
    
//     if (input.files && input.files.length > 0) {
//       const file = input.files[0];
      
//       if (this.validateVideoFile(file)) {
//         this.videoFile = file;
//         this.videoFileName = file.name;
//         this.videoError = '';
        
//         // Create video preview
//         this.createVideoPreview(file);
//       }
//     }
//   }

//   createVideoPreview(file: File): void {
//     // Clean up existing preview
//     if (this.videoPreview) {
//       URL.revokeObjectURL(this.videoPreview);
//     }
//     // Create a blob URL for video preview
//     this.videoPreview = URL.createObjectURL(file);
//   }

//   onPdfFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
    
//     if (input.files && input.files.length > 0) {
//       const file = input.files[0];
      
//       if (this.validatePdfFile(file)) {
//         this.pdfFile = file;
//         this.pdfFileName = file.name;
//         this.pdfError = '';
//       }
//     }
//   }

//   validateVideoFile(file: File): boolean {
//     // Check if it's an MP4 file or other common video formats
//     const validVideoExtensions = ['.mp4', '.mov', '.avi', '.webm'];
//     const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
//     if (!validVideoExtensions.includes(fileExtension)) {
//       this.videoError = 'Please upload a video file (MP4, MOV, AVI, or WEBM)';
//       return false;
//     }
    
//     // Check file size (max 100MB)
//     if (file.size > 100 * 1024 * 1024) {
//       this.videoError = 'File size should be less than 100MB';
//       return false;
//     }
    
//     return true;
//   }

//   validatePdfFile(file: File): boolean {
//     // Check if it's a PDF file
//     if (!file.name.toLowerCase().endsWith('.pdf')) {
//       this.pdfError = 'Please upload a PDF file';
//       return false;
//     }
    
//     // Check file size (max 20MB)
//     if (file.size > 20 * 1024 * 1024) {
//       this.pdfError = 'File size should be less than 20MB';
//       return false;
//     }
    
//     return true;
//   }
  
//   clearVideoFile(): void {
//     this.videoFile = undefined;
//     this.videoFileName = this.existingVideoPath ? 
//       this.extractFileName(this.existingVideoPath) || 'Existing video file' : 
//       'No file chosen';
//     this.videoError = '';
    
//     if (this.videoPreview) {
//       URL.revokeObjectURL(this.videoPreview);
//       this.videoPreview = null;
//     }
    
//     // Reset file input
//     const videoInput = document.getElementById('videoFile') as HTMLInputElement;
//     if (videoInput) {
//       videoInput.value = '';
//     }
//   }
  
//   clearPdfFile(): void {
//     this.pdfFile = undefined;
//     this.pdfFileName = this.existingPdfPath ? 
//       this.extractFileName(this.existingPdfPath) || 'Existing PDF file' : 
//       'No file chosen';
//     this.pdfError = '';
    
//     // Reset file input
//     const pdfInput = document.getElementById('pdfFile') as HTMLInputElement;
//     if (pdfInput) {
//       pdfInput.value = '';
//     }
//   }

//   onSubmit(): void {
//     // Validate required fields
//     if (!this.moduleData.modulename || !this.moduleData.duration || !this.moduleData.description) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     // Trim whitespace from inputs
//     this.moduleData.modulename = this.moduleData.modulename.trim();
//     this.moduleData.duration = this.moduleData.duration.trim();
//     this.moduleData.description = this.moduleData.description.trim();
    
//     if (!this.moduleData.modulename) {
//       alert('Module name cannot be empty or just whitespace');
//       return;
//     }

//     console.log('Updating module:', this.moduleId);
//     this.isSubmitting = true;

//     // Create FormData for submission
//     const formData = new FormData();
//     formData.append('modulename', this.moduleData.modulename);
//     formData.append('duration', this.moduleData.duration);
//     formData.append('description', this.moduleData.description);
//     formData.append('course_id', this.courseId);

//     // Only append files if new ones are selected
//     if (this.videoFile) {
//       formData.append('VideoFile', this.videoFile);
//     }

//     if (this.pdfFile) {
//       formData.append('PdfFile', this.pdfFile);
//     }

//     // Log FormData contents for debugging
//     console.log('FormData contents:');
//     formData.forEach((value, key) => {
//       console.log(key + ':', value);
//     });

//     // Submit the updated module
//     this.courseService.updateModule(this.moduleId, formData).subscribe({
//       next: (response) => {
//         console.log('Module updated successfully:', response);
//         alert('Module updated successfully!');
//         this.isSubmitting = false;
        
//         // Navigate back to course details or module list
//         if (this.courseId) {
//           this.router.navigate(['/courses', this.courseId]);
//         } else {
//           this.router.navigate(['/courses']);
//         }
//       },
//       error: (error) => {
//         console.error('Error updating module:', error);
//         console.error('Error details:', error.error);
        
//         let errorMessage = 'Error updating module. Please try again.';
        
//         // Handle specific duplicate key error
//         if (error.message && error.message.includes('duplicate key')) {
//           errorMessage = 'A module with this name already exists. Please choose a different name.';
//         } else if (error.error && error.error.errors) {
//           const errorDetails = Object.values(error.error.errors).flat().join(', ');
//           errorMessage = `Validation Error: ${errorDetails}`;
//         } else if (error.status === 500 && error.error) {
//           if (error.error.includes('duplicate key') || error.error.includes('IX_Modules_modulename')) {
//             errorMessage = 'A module with this name already exists. Please choose a different name.';
//           }
//         }
        
//         alert(errorMessage);
//         this.isSubmitting = false;
//       }
//     });
//   }

//   onCancel(): void {
//     if (this.courseId) {
//       this.router.navigate(['/courses', this.courseId]);
//     } else {
//       this.router.navigate(['/courses']);
//     }
//   }
  
//   ngOnDestroy(): void {
//     // Clean up blob URLs to prevent memory leaks
//     if (this.videoPreview) {
//       URL.revokeObjectURL(this.videoPreview);
//     }
//   }
// }


// 


// ----------------------------------------------------------------------------------------------------------

// import { CommonModule } from '@angular/common';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CourseModule } from '../../../models/course-module';
// import { CourseServicesService } from '../../../services/courses/course-services.service';

// @Component({
//   selector: 'app-edit-module',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './edit-module.component.html',
//   styleUrl: './edit-module.component.css'
// })
// export class EditModuleComponent implements OnInit, OnDestroy {
//   moduleData: CourseModule = {
//     modulename: '',
//     duration: '',
//     description: ''
//   };

//   moduleId: string = '';
//   courseId: string = '';
//   videoFile?: File;
//   pdfFile?: File;
//   videoFileName: string = 'No file chosen';
//   pdfFileName: string = 'No file chosen';
//   videoError: string = '';
//   pdfError: string = '';
//   videoPreview: string | null = null;
//   isSubmitting: boolean = false;
//   isLoading: boolean = true;
  
//   // Store existing file paths
//   existingVideoPath: string = '';
//   existingPdfPath: string = '';
  
//   // Track if files should be removed
//   removeExistingVideo: boolean = false;
//   removeExistingPdf: boolean = false;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private courseService: CourseServicesService
//   ) {}

//   ngOnInit(): void {
//     // Get module ID from URL
//     this.moduleId = this.route.snapshot.paramMap.get('moduleId') || 
//                    this.route.snapshot.paramMap.get('id') || '';
    
//     // Get course ID from URL or query params
//     this.courseId = this.route.snapshot.paramMap.get('courseId') || 
//                    this.route.snapshot.queryParamMap.get('courseId') || '';

//     console.log('Module ID:', this.moduleId);
//     console.log('Course ID:', this.courseId);

//     if (this.moduleId) {
//       this.loadModuleData();
//     } else {
//       console.error('Module ID is required');
//       alert('Module ID is missing');
//       this.router.navigate(['/courses']);
//     }
//   }

//   loadModuleData(): void {
//     this.isLoading = true;
    
//     this.courseService.getModuleById(this.moduleId).subscribe({
//       next: (response: any) => {
//         console.log('Module data loaded:', response);
        
//         // Handle different response structures
//         const moduleData = response.data || response;
        
//         // Map the response to your component data structure
//         this.moduleData = {
//           modulename: moduleData.modulename || moduleData.moduleName || '',
//           duration: moduleData.duration || '',
//           description: moduleData.description || ''
//         };

//         // Get course ID from response if not already set
//         this.courseId = moduleData.course_id || moduleData.courseId || this.courseId;
        
//         // Handle existing files
//         if (moduleData.videopath || moduleData.videoPath) {
//           this.existingVideoPath = moduleData.videopath || moduleData.videoPath;
//           this.videoFileName = this.extractFileName(this.existingVideoPath) || 'Existing video file';
//         }
        
//         if (moduleData.documentpath || moduleData.documentPath || moduleData.pdfPath) {
//           this.existingPdfPath = moduleData.documentpath || moduleData.documentPath || moduleData.pdfPath;
//           this.pdfFileName = this.extractFileName(this.existingPdfPath) || 'Existing PDF file';
//         }

//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Error loading module:', error);
//         let errorMessage = 'Error loading module data';
        
//         if (error.status === 404) {
//           errorMessage = 'Module not found';
//         } else if (error.status === 0) {
//           errorMessage = 'Unable to connect to server. Please check your connection.';
//         }
        
//         alert(errorMessage);
//         this.isLoading = false;
//         this.router.navigate(['/courses']);
//       }
//     });
//   }

//   extractFileName(filePath: string): string {
//     if (!filePath) return '';
//     // Handle both forward and backward slashes
//     const fileName = filePath.split(/[/\\]/).pop() || '';
//     return fileName;
//   }

//   // Fixed: Added method to trigger file input click
//   triggerVideoFileInput(): void {
//     const fileInput = document.getElementById('videoFile') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.click();
//     }
//   }

//   // Fixed: Added method to trigger PDF file input click
//   triggerPdfFileInput(): void {
//     const fileInput = document.getElementById('pdfFile') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.click();
//     }
//   }

//   onVideoFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
    
//     if (input.files && input.files.length > 0) {
//       const file = input.files[0];
      
//       // Reset previous errors
//       this.videoError = '';
      
//       if (this.validateVideoFile(file)) {
//         this.videoFile = file;
//         this.videoFileName = file.name;
//         this.removeExistingVideo = false;
        
//         // Create video preview
//         this.createVideoPreview(file);
//       } else {
//         // Clear the input if validation fails
//         input.value = '';
//       }
//     }
//   }

//   createVideoPreview(file: File): void {
//     // Clean up existing preview
//     if (this.videoPreview) {
//       URL.revokeObjectURL(this.videoPreview);
//     }
    
//     try {
//       // Create a blob URL for video preview
//       this.videoPreview = URL.createObjectURL(file);
//     } catch (error) {
//       console.error('Error creating video preview:', error);
//       this.videoPreview = null;
//     }
//   }

//   onPdfFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
    
//     if (input.files && input.files.length > 0) {
//       const file = input.files[0];
      
//       // Reset previous errors
//       this.pdfError = '';
      
//       if (this.validatePdfFile(file)) {
//         this.pdfFile = file;
//         this.pdfFileName = file.name;
//         this.removeExistingPdf = false;
//       } else {
//         // Clear the input if validation fails
//         input.value = '';
//       }
//     }
//   }

//   validateVideoFile(file: File): boolean {
//     // Check file type
//     const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
//     const validVideoExtensions = ['.mp4', '.mov', '.avi', '.webm'];
//     const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
//     if (!validVideoTypes.includes(file.type) && !validVideoExtensions.includes(fileExtension)) {
//       this.videoError = 'Please upload a valid video file (MP4, MOV, AVI, or WEBM)';
//       return false;
//     }
    
//     // Check file size (max 100MB)
//     const maxSize = 100 * 1024 * 1024; // 100MB in bytes
//     if (file.size > maxSize) {
//       this.videoError = `File size should be less than 100MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
//       return false;
//     }
    
//     return true;
//   }

//   validatePdfFile(file: File): boolean {
//     // Check file type
//     if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
//       this.pdfError = 'Please upload a valid PDF file';
//       return false;
//     }
    
//     // Check file size (max 20MB)
//     const maxSize = 20 * 1024 * 1024; // 20MB in bytes
//     if (file.size > maxSize) {
//       this.pdfError = `File size should be less than 20MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
//       return false;
//     }
    
//     return true;
//   }
  
//   clearVideoFile(): void {
//     this.videoFile = undefined;
//     this.videoError = '';
    
//     if (this.existingVideoPath) {
//       this.removeExistingVideo = true;
//       this.videoFileName = 'File will be removed';
//     } else {
//       this.videoFileName = 'No file chosen';
//     }
    
//     // Clean up preview
//     if (this.videoPreview) {
//       URL.revokeObjectURL(this.videoPreview);
//       this.videoPreview = null;
//     }
    
//     // Reset file input
//     const videoInput = document.getElementById('videoFile') as HTMLInputElement;
//     if (videoInput) {
//       videoInput.value = '';
//     }
//   }
  
//   clearPdfFile(): void {
//     this.pdfFile = undefined;
//     this.pdfError = '';
    
//     if (this.existingPdfPath) {
//       this.removeExistingPdf = true;
//       this.pdfFileName = 'File will be removed';
//     } else {
//       this.pdfFileName = 'No file chosen';
//     }
    
//     // Reset file input
//     const pdfInput = document.getElementById('pdfFile') as HTMLInputElement;
//     if (pdfInput) {
//       pdfInput.value = '';
//     }
//   }

//   onSubmit(): void {
//     // Fixed: Safe validation without using trim() directly on potentially undefined values
//     const moduleName = this.moduleData.modulename || '';
//     const duration = this.moduleData.duration || '';
//     const description = this.moduleData.description || '';

//     if (!moduleName.trim() || !duration.trim() || !description.trim()) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     // Fixed: Safe trimming
//     this.moduleData.modulename = moduleName.trim();
//     this.moduleData.duration = duration.trim();
//     this.moduleData.description = description.trim();

//     console.log('Updating module:', this.moduleId);
//     this.isSubmitting = true;

//     // Create FormData for submission
//     const formData = new FormData();
    
//     // Add basic module data
//     formData.append('modulename', this.moduleData.modulename);
//     formData.append('duration', this.moduleData.duration);
//     formData.append('description', this.moduleData.description);
    
//     // Add course ID if available
//     if (this.courseId) {
//       formData.append('course_id', this.courseId);
//     }

//     // Handle video file
//     if (this.videoFile) {
//       formData.append('VideoFile', this.videoFile, this.videoFile.name);
//     } else if (this.removeExistingVideo) {
//       formData.append('removeVideo', 'true');
//     }

//     // Handle PDF file
//     if (this.pdfFile) {
//       formData.append('PdfFile', this.pdfFile, this.pdfFile.name);
//     } else if (this.removeExistingPdf) {
//       formData.append('removePdf', 'true');
//     }

//     // Log FormData contents for debugging
//     console.log('FormData contents:');
//     for (const pair of formData.entries()) {
//       console.log(pair[0] + ':', pair[1]);
//     }

//     // Submit the updated module
//     this.courseService.updateModule(this.moduleId, formData).subscribe({
//       next: (response) => {
//         console.log('Module updated successfully:', response);
//         alert('Module updated successfully!');
//         this.isSubmitting = false;
        
//         // Navigate back to course details or module list
//         if (this.courseId) {
//           this.router.navigate(['/courses', this.courseId]);
//         } else {
//           this.router.navigate(['/courses']);
//         }
//       },
//       error: (error) => {
//         console.error('Error updating module:', error);
//         console.error('Error details:', error.error);
        
//         let errorMessage = 'Error updating module. Please try again.';
        
//         // Handle specific errors
//         if (error.status === 400) {
//           if (error.error?.message) {
//             errorMessage = error.error.message;
//           } else if (error.error?.errors) {
//             const errorDetails = Object.values(error.error.errors).flat().join(', ');
//             errorMessage = `Validation Error: ${errorDetails}`;
//           }
//         } else if (error.status === 404) {
//           errorMessage = 'Module not found. It may have been deleted.';
//         } else if (error.status === 409 || 
//                    (error.error && (error.error.includes('duplicate key') || 
//                     error.error.includes('IX_Modules_modulename')))) {
//           errorMessage = 'A module with this name already exists. Please choose a different name.';
//         } else if (error.status === 413) {
//           errorMessage = 'File size too large. Please choose smaller files.';
//         } else if (error.status === 0) {
//           errorMessage = 'Unable to connect to server. Please check your connection.';
//         }
        
//         alert(errorMessage);
//         this.isSubmitting = false;
//       }
//     });
//   }

//   onCancel(): void {
//     // Fixed: Safe checking for changes without using trim() on potentially undefined values
//     const hasFileChanges = this.videoFile || this.pdfFile || 
//                           this.removeExistingVideo || this.removeExistingPdf;
    
//     const hasDataChanges = (this.moduleData.modulename || '').trim() !== '' ||
//                           (this.moduleData.duration || '').trim() !== '' ||
//                           (this.moduleData.description || '').trim() !== '';
    
//     const hasChanges = hasFileChanges || hasDataChanges;
    
//     if (hasChanges && !confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
//       return;
//     }
    
//     if (this.courseId) {
//       this.router.navigate(['/courses', this.courseId]);
//     } else {
//       this.router.navigate(['/courses']);
//     }
//   }
  
//   ngOnDestroy(): void {
//     // Clean up blob URLs to prevent memory leaks
//     if (this.videoPreview) {
//       URL.revokeObjectURL(this.videoPreview);
//     }
//   }
// }






import { CommonModule } from "@angular/common"
import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { FormsModule } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import  { CourseModule } from "../../../models/course-module"
import  { CourseServicesService } from "../../../services/courses/course-services.service"

@Component({
  selector: "app-edit-module",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./edit-module.component.html",
  styleUrls: ["./edit-module.component.css"],
})
export class EditModuleComponent implements OnInit, OnDestroy {
  moduleData: CourseModule = {
    modulename: "",
    duration: "",
    description: "",
  }

  // Store original data for comparison and reset
  originalModuleData: CourseModule = {
    modulename: "",
    duration: "",
    description: "",
  }

  moduleId = ""
  courseId = ""
  videoFile?: File
  pdfFile?: File
  videoFileName = "No file chosen"
  pdfFileName = "No file chosen"
  videoError = ""
  pdfError = ""
  videoPreview: string | null = null
  isSubmitting = false
  isLoading = true

  // Store existing file paths
  existingVideoPath = ""
  existingPdfPath = ""

  // Track if files should be removed
  removeExistingVideo = false
  removeExistingPdf = false

  // Drag and drop states
  videoDragOver = false
  pdfDragOver = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseServicesService,
  ) {}

  ngOnInit(): void {
    // Get module ID from URL
    this.moduleId = this.route.snapshot.paramMap.get("moduleId") || this.route.snapshot.paramMap.get("id") || ""

    // Get course ID from URL or query params
    this.courseId =
      this.route.snapshot.paramMap.get("courseId") || this.route.snapshot.queryParamMap.get("courseId") || ""

    console.log("Module ID:", this.moduleId)
    console.log("Course ID:", this.courseId)

    if (this.moduleId) {
      this.loadModuleData()
    } else {
      console.error("Module ID is required")
      alert("Module ID is missing")
      this.router.navigate(["/dashboard/course/viewcourse"])
    }
  }

  loadModuleData(): void {
    this.isLoading = true

    this.courseService.getModuleById(this.moduleId).subscribe({
      next: (response: any) => {
        console.log("Module data loaded:", response)

        // Handle different response structures
        const moduleData = response.data || response

        // Map the response to your component data structure
        this.moduleData = {
          modulename: moduleData.modulename || moduleData.moduleName || "",
          duration: moduleData.duration || "",
          description: moduleData.description || "",
        }

        // Store original data for reset functionality
        this.originalModuleData = { ...this.moduleData }

        // Get course ID from response if not already set
        this.courseId = moduleData.course_id || moduleData.courseId || this.courseId

        // Handle existing files
        if (moduleData.videopath || moduleData.videoPath) {
          this.existingVideoPath = moduleData.videopath || moduleData.videoPath
          this.videoFileName = this.extractFileName(this.existingVideoPath) || "Existing video file"
        }

        if (moduleData.documentpath || moduleData.documentPath || moduleData.pdfPath) {
          this.existingPdfPath = moduleData.documentpath || moduleData.documentPath || moduleData.pdfPath
          this.pdfFileName = this.extractFileName(this.existingPdfPath) || "Existing PDF file"
        }

        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading module:", error)
        let errorMessage = "Error loading module data"

        if (error.status === 404) {
          errorMessage = "Module not found"
        } else if (error.status === 0) {
          errorMessage = "Unable to connect to server. Please check your connection."
        }

        alert(errorMessage)
        this.isLoading = false
        this.router.navigate(["/dashboard/course/viewcourse"])
      },
    })
  }

  extractFileName(filePath: string): string {
    if (!filePath) return ""
    // Handle both forward and backward slashes
    const fileName = filePath.split(/[/\\]/).pop() || ""
    return fileName
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // File input triggers
  triggerVideoFileInput(): void {
    const fileInput = document.getElementById("videoFile") as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  triggerPdfFileInput(): void {
    const fileInput = document.getElementById("pdfFile") as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  // Drag and drop handlers for video
  onVideoDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.videoDragOver = true
  }

  onVideoDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.videoDragOver = false
  }

  onVideoDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.videoDragOver = false

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      const file = files[0]
      this.processVideoFile(file)
    }
  }

  // Drag and drop handlers for PDF
  onPdfDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.pdfDragOver = true
  }

  onPdfDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.pdfDragOver = false
  }

  onPdfDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    this.pdfDragOver = false

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      const file = files[0]
      this.processPdfFile(file)
    }
  }

  onVideoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement

    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.processVideoFile(file)
    }
  }

  processVideoFile(file: File): void {
    // Reset previous errors
    this.videoError = ""

    if (this.validateVideoFile(file)) {
      this.videoFile = file
      this.videoFileName = file.name
      this.removeExistingVideo = false

      // Create video preview
      this.createVideoPreview(file)
    }
  }

  createVideoPreview(file: File): void {
    // Clean up existing preview
    if (this.videoPreview) {
      URL.revokeObjectURL(this.videoPreview)
    }

    try {
      // Create a blob URL for video preview
      this.videoPreview = URL.createObjectURL(file)
    } catch (error) {
      console.error("Error creating video preview:", error)
      this.videoPreview = null
    }
  }

  onPdfFileChange(event: Event): void {
    const input = event.target as HTMLInputElement

    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.processPdfFile(file)
    }
  }

  processPdfFile(file: File): void {
    // Reset previous errors
    this.pdfError = ""

    if (this.validatePdfFile(file)) {
      this.pdfFile = file
      this.pdfFileName = file.name
      this.removeExistingPdf = false
    }
  }

  validateVideoFile(file: File): boolean {
    // Check file type
    const validVideoTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"]
    const validVideoExtensions = [".mp4", ".mov", ".avi", ".webm"]
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    if (!validVideoTypes.includes(file.type) && !validVideoExtensions.includes(fileExtension)) {
      this.videoError = "Please upload a valid video file (MP4, MOV, AVI, or WEBM)"
      return false
    }

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB in bytes
    if (file.size > maxSize) {
      this.videoError = `File size should be less than 100MB. Current size: ${this.formatFileSize(file.size)}`
      return false
    }

    return true
  }

  validatePdfFile(file: File): boolean {
    // Check file type
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      this.pdfError = "Please upload a valid PDF file"
      return false
    }

    // Check file size (max 20MB)
    const maxSize = 20 * 1024 * 1024 // 20MB in bytes
    if (file.size > maxSize) {
      this.pdfError = `File size should be less than 20MB. Current size: ${this.formatFileSize(file.size)}`
      return false
    }

    return true
  }

  clearVideoFile(event?: Event): void {
    if (event) {
      event.stopPropagation()
    }

    this.videoFile = undefined
    this.videoError = ""

    if (this.existingVideoPath) {
      this.removeExistingVideo = true
      this.videoFileName = "File will be removed"
    } else {
      this.videoFileName = "No file chosen"
    }

    // Clean up preview
    if (this.videoPreview) {
      URL.revokeObjectURL(this.videoPreview)
      this.videoPreview = null
    }

    // Reset file input
    const videoInput = document.getElementById("videoFile") as HTMLInputElement
    if (videoInput) {
      videoInput.value = ""
    }
  }

  clearPdfFile(event?: Event): void {
    if (event) {
      event.stopPropagation()
    }

    this.pdfFile = undefined
    this.pdfError = ""

    if (this.existingPdfPath) {
      this.removeExistingPdf = true
      this.pdfFileName = "File will be removed"
    } else {
      this.pdfFileName = "No file chosen"
    }

    // Reset file input
    const pdfInput = document.getElementById("pdfFile") as HTMLInputElement
    if (pdfInput) {
      pdfInput.value = ""
    }
  }

  resetForm(): void {
    if (confirm("Are you sure you want to reset the form? All changes will be lost.")) {
      // Reset module data to original values
      this.moduleData = { ...this.originalModuleData }

      // Reset file states
      this.clearVideoFile()
      this.clearPdfFile()
      this.removeExistingVideo = false
      this.removeExistingPdf = false

      // Reset file names to original state
      if (this.existingVideoPath) {
        this.videoFileName = this.extractFileName(this.existingVideoPath) || "Existing video file"
      } else {
        this.videoFileName = "No file chosen"
      }

      if (this.existingPdfPath) {
        this.pdfFileName = this.extractFileName(this.existingPdfPath) || "Existing PDF file"
      } else {
        this.pdfFileName = "No file chosen"
      }

      // Clear errors
      this.videoError = ""
      this.pdfError = ""
    }
  }

  onSubmit(): void {
    // Validate required fields
    const moduleName = this.moduleData.modulename || ""
    const duration = this.moduleData.duration || ""
    const description = this.moduleData.description || ""
    console.log("Module data before submission:", this.moduleData)

    if (!moduleName.trim() || !duration.trim() || !description.trim()) {
      alert("Please fill in all required fields")
      return
    }

    // Trim values
    this.moduleData.modulename = moduleName.trim()
    this.moduleData.duration = duration.trim()
    this.moduleData.description = description.trim()

    console.log("Updating module:", this.moduleId)
    this.isSubmitting = true

    // Create FormData for submission - only include changed fields
    const formData = new FormData()

    // Only add fields that have changed
    if (this.moduleData.modulename !== this.originalModuleData.modulename) {
      formData.append("modulename", this.moduleData.modulename)
    }

    if (this.moduleData.duration !== this.originalModuleData.duration) {
      formData.append("duration", this.moduleData.duration)
    }

    if (this.moduleData.description !== this.originalModuleData.description) {
      formData.append("description", this.moduleData.description)
    }

    // Add course ID if available
    if (this.courseId) {
      formData.append("course_id", this.courseId)
    }

    // Handle video file - only if there's a change
    if (this.videoFile) {
      formData.append("VideoFile", this.videoFile, this.videoFile.name)
    } else if (this.removeExistingVideo) {
      formData.append("removeVideo", "true")
    }

    // Handle PDF file - only if there's a change
    if (this.pdfFile) {
      formData.append("PdfFile", this.pdfFile, this.pdfFile.name)
    } else if (this.removeExistingPdf) {
      formData.append("removePdf", "true")
    }

    // Log FormData contents for debugging
    console.log("FormData contents:")
    for (const pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1])
    }

    // Submit the updated module
    this.courseService.updateModule(this.moduleId, formData).subscribe({
      next: (response) => {
        console.log("Module updated successfully:", response)
        alert("Module updated successfully!")
        this.isSubmitting = false

        // Navigate back to course details
        this.goBack()
      },
      error: (error) => {
        console.error("Error updating module:", error)
        console.error("Error details:", error.error)

        let errorMessage = "Error updating module. Please try again."

        // Handle specific errors
        if (error.status === 400) {
          if (error.error?.message) {
            errorMessage = error.error.message
          } else if (error.error?.errors) {
            const errorDetails = Object.values(error.error.errors).flat().join(", ")
            errorMessage = `Validation Error: ${errorDetails}`
          }
        } else if (error.status === 404) {
          errorMessage = "Module not found. It may have been deleted."
        } else if (
          error.status === 409 ||
          (error.error && (error.error.includes("duplicate key") || error.error.includes("IX_Modules_modulename")))
        ) {
          errorMessage = "A module with this name already exists. Please choose a different name."
        } else if (error.status === 413) {
          errorMessage = "File size too large. Please choose smaller files."
        } else if (error.status === 0) {
          errorMessage = "Unable to connect to server. Please check your connection."
        }

        alert(errorMessage)
        this.isSubmitting = false
      },
    })
  }

  goBack(): void {
    // Navigate to dashboard/course/viewcourse
    this.router.navigate(["/dashboard/course/viewcourse"])
  }

  onCancel(): void {
    // Check for unsaved changes
    const hasDataChanges =
      this.moduleData.modulename !== this.originalModuleData.modulename ||
      this.moduleData.duration !== this.originalModuleData.duration ||
      this.moduleData.description !== this.originalModuleData.description

    const hasFileChanges = this.videoFile || this.pdfFile || this.removeExistingVideo || this.removeExistingPdf

    const hasChanges = hasDataChanges || hasFileChanges

    if (hasChanges && !confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      return
    }

    this.goBack()
  }

  ngOnDestroy(): void {
    // Clean up blob URLs to prevent memory leaks
    if (this.videoPreview) {
      URL.revokeObjectURL(this.videoPreview)
    }
  }
}
