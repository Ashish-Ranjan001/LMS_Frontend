// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { Course } from '../../../models/course';
// import { Quiz } from '../../../models/quiz';
// import { CourseModule } from '../../../models/course-module';
// import { CourseFormComponent } from '../course-form/course-form.component';
// import { QuizFormComponent } from '../quiz-form/quiz-form.component';
// import { ModuleFormComponent } from '../module-form/module-form.component';

// @Component({
//   selector: 'app-course-creator',
//   standalone: true,
//   imports: [
//     CommonModule,
   
//     CourseFormComponent,
//     QuizFormComponent,
//     ModuleFormComponent
//   ],
//   templateUrl: './course-creator.component.html',
//   styleUrl: './course-creator.component.css'
// })
// export class CourseCreatorComponent {
//   currentStep: number = 0;
//   steps: { name: string, completed: boolean }[] = [
//     { name: 'Course Details', completed: false },
//     { name: 'Quiz Setup', completed: false },
//     { name: 'Module Creation', completed: false }
//   ];

//   courseData: Course = {
//     name: '',
//     category: '',
//     description: '',
//     sme: '',
//     lob: '',
//     author: ''
//   };
  
//   thumbnailImage?: File;
  
//   quizData: Quiz = {};
  
//   moduleData: CourseModule = {
//     name: '',
//     duration: '',
//     description: ''
//   };

//   goToStep(stepIndex: number): void {
//     if (stepIndex < 0 || stepIndex > this.steps.length - 1) {
//       return;
//     }

//     // If trying to go forward, validate the current step
//     if (stepIndex > this.currentStep) {
//       if (!this.validateCurrentStep()) {
//         return;
//       }
//     }

//     this.currentStep = stepIndex;
//   }

//   validateCurrentStep(): boolean {
//     switch (this.currentStep) {
//       case 0:
//         // Validate course form
//         return this.validateCourseForm();
//       case 1:
//         // Validate quiz form
//         return this.validateQuizForm();
//       case 2:
//         // Validate module form
//         return this.validateModuleForm();
//       default:
//         return true;
//     }
//   }

//   validateCourseForm(): boolean {
//     // Check if required course fields are filled
//     return !!(this.courseData.name && this.courseData.category && this.courseData.description);
//   }

//   validateQuizForm(): boolean {
//     // For now, just allow navigation (will implement validation later)
//     return true;
//   }

//   validateModuleForm(): boolean {
//     // Check if required module fields are filled
//     return !!(this.moduleData.name && this.moduleData.duration && this.moduleData.description);
//   }

//   onCourseDataChange(data: { course: Course, thumbnailImage?: File }): void {
//     this.courseData = data.course;
//     this.thumbnailImage = data.thumbnailImage;
//     this.steps[0].completed = true;
//   }

//   onQuizDataChange(data: Quiz): void {
//     this.quizData = data;
//     this.steps[1].completed = true;
//   }

//   onModuleDataChange(data: CourseModule): void {
//     this.moduleData = data;
//     this.steps[2].completed = true;
//   }

//   submitCourse(): void {
//     // Combine all data into a single object
//     const courseSubmission = {
//       course: this.courseData,
//       thumbnailImage: this.thumbnailImage,
//       quiz: this.quizData,
//       module: this.moduleData
//     };

//     // Here you would call a service to submit the data
//     console.log('Submitting course data:', courseSubmission);
    
//     // Call to service would be something like:
//     // this.courseService.createCourse(courseSubmission).subscribe(
//     //   response => {
//     //     console.log('Course created successfully', response);
//     //     // Navigate to courses list or show success message
//     //   },
//     //   error => {
//     //     console.error('Error creating course', error);
//     //     // Show error message
//     //   }
//     // );
    
//     alert('Course submitted successfully!');
//   }
// }



// // =======================================================================

// // import { Component } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { Router } from '@angular/router';

// // import { Course } from '../../../models/course';
// // import { Quiz } from '../../../models/quiz';
// // import { CourseModule } from '../../../models/course-module';
// // import { CourseFormComponent } from '../course-form/course-form.component';
// // import { QuizFormComponent } from '../quiz-form/quiz-form.component';
// // import { ModuleFormComponent } from '../module-form/module-form.component';

// // import { CourseServicesService } from '../../../services/courses/course-services.service';

// // @Component({
// //   selector: 'app-course-creator',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     CourseFormComponent,
// //     QuizFormComponent,
// //     ModuleFormComponent
// //   ],
// //   templateUrl: './course-creator.component.html',
// //   styleUrl: './course-creator.component.css'
// // })
// // export class CourseCreatorComponent {
// //   currentStep: number = 0;
// //   steps: { name: string, completed: boolean }[] = [
// //     { name: 'Course Details', completed: false },
// //     { name: 'Quiz Setup', completed: false },
// //     { name: 'Module Creation', completed: false }
// //   ];

// //   courseData: Course = {
// //     name: '',
// //     category: '',
// //     description: '',
// //     smeId: '',
// //     lobId: '',
// //     author: ''
// //   };
  
// //   thumbnailImage?: File;
  
// //   quizData: Quiz = {};
  
// //   moduleData: CourseModule = {
// //     name: '',
// //     duration: '',
// //     description: ''
// //   };

// //   isSubmitting = false;
// //   submissionError = '';
// //   courseId: string = '';

// //   constructor(
// //     private courseService: CourseServicesService,
// //     private router: Router
// //   ) {}

// //   goToStep(stepIndex: number): void {
// //     if (stepIndex < 0 || stepIndex > this.steps.length - 1) {
// //       return;
// //     }

// //     // If trying to go forward, validate the current step
// //     if (stepIndex > this.currentStep) {
// //       if (!this.validateCurrentStep()) {
// //         return;
// //       }
// //     }

// //     this.currentStep = stepIndex;
// //   }

// //   validateCurrentStep(): boolean {
// //     switch (this.currentStep) {
// //       case 0:
// //         // Validate course form
// //         return this.validateCourseForm();
// //       case 1:
// //         // Validate quiz form
// //         return this.validateQuizForm();
// //       case 2:
// //         // Validate module form
// //         return this.validateModuleForm();
// //       default:
// //         return true;
// //     }
// //   }

// //   validateCourseForm(): boolean {
// //     // Check if required course fields are filled
// //     return !!(this.courseData.name && this.courseData.category && this.courseData.description && 
// //               this.courseData.smeId && this.courseData.lobId);
// //   }

// //   validateQuizForm(): boolean {
// //     // Check if quiz file is uploaded
// //     return !!this.quizData.quizFile;
// //   }

// //   validateModuleForm(): boolean {
// //     // Check if required module fields are filled
// //     return !!(this.moduleData.name && this.moduleData.duration && this.moduleData.description);
// //   }

// //   onCourseDataChange(data: { course: Course, thumbnailImage?: File }): void {
// //     this.courseData = data.course;
// //     this.thumbnailImage = data.thumbnailImage;
// //     this.steps[0].completed = this.validateCourseForm();
// //   }

// //   onQuizDataChange(data: Quiz): void {
// //     this.quizData = data;
// //     this.steps[1].completed = this.validateQuizForm();
// //   }

// //   onModuleDataChange(data: CourseModule): void {
// //     this.moduleData = data;
// //     this.steps[2].completed = this.validateModuleForm();
// //   }

// //   submitCourse(): void {
// //     if (!this.validateCurrentStep()) {
// //       alert('Please fill all required fields before submitting.');
// //       return;
// //     }

// //     this.isSubmitting = true;
// //     this.submissionError = '';

// //     // Step 1: Submit course data
// //     this.submitCourseData()
// //       .then(courseId => {
// //         this.courseId = courseId;
// //         // Step 2: Submit quiz data with courseId
// //         return this.submitQuizData(courseId);
// //       })
// //       .then(() => {
// //         // Step 3: Submit module data with courseId
// //         return this.submitModuleData(this.courseId);
// //       })
// //       .then(() => {
// //         // All submissions successful
// //         this.isSubmitting = false;
// //         alert('Course created successfully!');
// //         this.navigateToCoursesList();
// //       })
// //       .catch(error => {
// //         this.isSubmitting = false;
// //         this.submissionError = `Error: ${error.message || 'Unknown error occurred'}`;
// //         console.error('Error creating course:', error);
// //         alert('Failed to create course. Please try again.');
// //       });
// //   }

// //   private submitCourseData(): Promise<string> {
// //     return new Promise((resolve, reject) => {
// //       const formData = new FormData();
// //       formData.append('name', this.courseData.name);
// //       formData.append('category', this.courseData.category);
// //       formData.append('description', this.courseData.description);
// //       formData.append('smeId', this.courseData.smeId || '');
// //       formData.append('lobId', this.courseData.lobId || '');
// //       formData.append('author', this.courseData.author || '');
      
// //       if (this.thumbnailImage) {
// //         formData.append('thumbnailImage', this.thumbnailImage, this.thumbnailImage.name);
// //       }

// //       this.courseService.addCourse(formData).subscribe({
// //         next: (response: any) => {
// //           console.log('Course created successfully:', response);
// //           // Extract courseId from response and return it
// //           if (response && response.id) {
// //             resolve(response.id);
// //           } else {
// //             reject(new Error('Course ID not found in response'));
// //           }
// //         },
// //         error: (error: any) => {
// //           console.error('Error creating course:', error);
// //           reject(error);
// //         }
// //       });
// //     });
// //   }

// //   private submitQuizData(courseId: string): Promise<void> {
// //     return new Promise((resolve, reject) => {
// //       if (!this.quizData.quizFile) {
// //         resolve(); // No quiz file to upload
// //         return;
// //       }

// //       const formData = new FormData();
// //       formData.append('courseId', courseId);
// //       formData.append('quizFile', this.quizData.quizFile, this.quizData.quizFile.name);
      
// //       this.courseService.addQuiz(formData).subscribe({
// //         next: (response: any) => {
// //           console.log('Quiz added successfully:', response);
// //           resolve();
// //         },
// //         error: (error: any) => {
// //           console.error('Error adding quiz:', error);
// //           reject(error);
// //         }
// //       });
// //     });
// //   }

// //   private submitModuleData(courseId: string): Promise<void> {
// //     return new Promise((resolve, reject) => {
// //       const formData = new FormData();
// //       formData.append('courseId', courseId);
// //       formData.append('name', this.moduleData.name);
// //       formData.append('duration', this.moduleData.duration);
// //       formData.append('description', this.moduleData.description);
      
// //       if (this.moduleData.videoFile) {
// //         formData.append('videoFile', this.moduleData.videoFile, this.moduleData.videoFile.name);
// //       }
      
// //       if (this.moduleData.pdfFile) {
// //         formData.append('pdfFile', this.moduleData.pdfFile, this.moduleData.pdfFile.name);
// //       }
      
// //       this.courseService.addModule(formData).subscribe({
// //         next: (response: any) => {
// //           console.log('Module added successfully:', response);
// //           resolve();
// //         },
// //         error: (error: any) => {
// //           console.error('Error adding module:', error);
// //           reject(error);
// //         }
// //       });
// //     });
// //   }

// //   private navigateToCoursesList(): void {
// //     // Navigate to the courses list page
// //     this.router.navigate(['/courses']);
// //   }
// // }



// // -----------------------------------------------------------------------------

// // import { Component } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { Router } from '@angular/router';

// // import { Course } from '../../../models/course';
// // import { CourseModule } from '../../../models/course-module';
// // import { CourseFormComponent } from '../course-form/course-form.component';
// // import { QuizFormComponent } from '../quiz-form/quiz-form.component';
// // import { ModuleFormComponent } from '../module-form/module-form.component';

// // import { CourseServicesService } from '../../../services/courses/course-services.service';

// // @Component({
// //   selector: 'app-course-creator',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     CourseFormComponent,
// //     QuizFormComponent,
// //     ModuleFormComponent
// //   ],
// //   templateUrl: './course-creator.component.html',
// //   styleUrl: './course-creator.component.css'
// // })
// // export class CourseCreatorComponent {
// //   currentStep: number = 0;
// //   steps: { name: string, completed: boolean }[] = [
// //     { name: 'Course Details', completed: false },
// //     { name: 'Quiz Setup', completed: false },
// //     { name: 'Module Creation', completed: false }
// //   ];

// //   courseData: Course = {
// //     name: '',
// //     category: '',
// //     description: '',
// //     smeId: '',
// //     lobId: '',
// //     author: ''
// //   };
  
// //   thumbnailImage?: File;
// //   quizFile?: File;
  
// //   moduleData: CourseModule = {
// //     name: '',
// //     duration: '',
// //     description: ''
// //   };

// //   isSubmitting = false;
// //   submissionError = '';
// //   courseId: string = '';

// //   constructor(
// //     private courseService: CourseServicesService,
// //     private router: Router
// //   ) {}

// //   goToStep(stepIndex: number): void {
// //     if (stepIndex < 0 || stepIndex > this.steps.length - 1) {
// //       return;
// //     }

// //     // If trying to go forward, validate the current step
// //     if (stepIndex > this.currentStep) {
// //       if (!this.validateCurrentStep()) {
// //         return;
// //       }
// //     }

// //     this.currentStep = stepIndex;
// //   }

// //   validateCurrentStep(): boolean {
// //     switch (this.currentStep) {
// //       case 0:
// //         // Validate course form
// //         return this.validateCourseForm();
// //       case 1:
// //         // Validate quiz form
// //         return this.validateQuizForm();
// //       case 2:
// //         // Validate module form
// //         return this.validateModuleForm();
// //       default:
// //         return true;
// //     }
// //   }

// //   validateCourseForm(): boolean {
// //     // Check if required course fields are filled
// //     return !!(this.courseData.name && this.courseData.category && this.courseData.description && 
// //               this.courseData.smeId && this.courseData.lobId);
// //   }

// //   validateQuizForm(): boolean {
// //     // Check if quiz file is uploaded
// //     return !!this.quizFile;
// //   }

// //   validateModuleForm(): boolean {
// //     // Check if required module fields are filled
// //     return !!(this.moduleData.name && this.moduleData.duration && this.moduleData.description);
// //   }

// //   onCourseDataChange(data: { course: Course, thumbnailImage?: File }): void {
// //     this.courseData = data.course;
// //     this.thumbnailImage = data.thumbnailImage;
// //     this.steps[0].completed = this.validateCourseForm();
// //   }

// //   onQuizDataChange(data: File): void {
// //     this.quizFile = data;
// //     this.steps[1].completed = this.validateQuizForm();
// //   }

// //   onModuleDataChange(data: CourseModule): void {
// //     this.moduleData = data;
// //     this.steps[2].completed = this.validateModuleForm();
// //   }

// //   submitCourse(): void {
// //     if (!this.validateCurrentStep()) {
// //       alert('Please fill all required fields before submitting.');
// //       return;
// //     }

// //     this.isSubmitting = true;
// //     this.submissionError = '';

// //     // Submit course data along with quiz in one request
// //     this.submitCourseWithQuiz()
// //       .then(courseId => {
// //         this.courseId = courseId;
// //         // Submit module data with courseId
// //         return this.submitModuleData(courseId);
// //       })
// //       .then(() => {
// //         // All submissions successful
// //         this.isSubmitting = false;
// //         alert('Course created successfully!');
// //         this.navigateToCoursesList();
// //       })
// //       .catch(error => {
// //         this.isSubmitting = false;
// //         this.submissionError = `Error: ${error.message || 'Unknown error occurred'}`;
// //         console.error('Error creating course:', error);
// //         alert('Failed to create course. Please try again.');
// //       });
// //   }

// //   private submitCourseWithQuiz(): Promise<string> {
// //     return new Promise((resolve, reject) => {
// //       const formData = new FormData();
// //       formData.append('course_name', this.courseData.name);
// //       // Convert category to string since it might be a number and category_id expects an int
// //       formData.append('category_id', String(this.courseData.category));
// //       formData.append('description', this.courseData.description);
// //       formData.append('sme_id', this.courseData.smeId ||"");
// //       formData.append('lob_id', this.courseData.lobId || "");
// //       formData.append('author', this.courseData.author || '');
      
// //       if (this.thumbnailImage) {
// //         formData.append('imagepath', this.thumbnailImage, this.thumbnailImage.name);
// //       }
      
// //       if (this.quizFile) {
// //         formData.append('quizPath', this.quizFile, this.quizFile.name);
// //       }

// //       this.courseService.addCourse(formData).subscribe({
// //         next: (response: any) => {
// //           console.log('Course created successfully:', response);
// //           // Extract courseId from response and return it
// //           if (response && response.data.course_id) {
// //             resolve(response.data.course_id);
// //           } else {
// //             reject(new Error('Course ID not found in response'));
// //           }
// //         },
// //         error: (error: any) => {
// //           console.error('Error creating course:', error);
// //           reject(error);
// //         }
// //       });
// //     });
// //   }

// //   private submitModuleData(courseId: string): Promise<void> {
// //     return new Promise((resolve, reject) => {
// //       const formData = new FormData();
// //       formData.append('courseId', courseId);
// //       formData.append('name', this.moduleData.name);
// //       formData.append('duration', this.moduleData.duration);
// //       formData.append('description', this.moduleData.description);
      
// //       if (this.moduleData.videoFile) {
// //         formData.append('videoFile', this.moduleData.videoFile, this.moduleData.videoFile.name);
// //       }
      
// //       if (this.moduleData.pdfFile) {
// //         formData.append('pdfFile', this.moduleData.pdfFile, this.moduleData.pdfFile.name);
// //       }
      
// //       this.courseService.addModule(formData).subscribe({
// //         next: (response: any) => {
// //           console.log('Module added successfully:', response);
// //           resolve();
// //         },
// //         error: (error: any) => {
// //           console.error('Error adding module:', error);
// //           reject(error);
// //         }
// //       });
// //     });
// //   }

// //   private navigateToCoursesList(): void {
// //     // Navigate to the courses list page
// //     this.router.navigate(['/courses']);
// //   }
// // }









// // -------------------------------------------------------------------------------


// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// import { Course } from '../../../models/course';
// import { CourseModule } from '../../../models/course-module';
// import { CourseFormComponent } from '../course-form/course-form.component';
// import { QuizFormComponent } from '../quiz-form/quiz-form.component';
// import { ModuleFormComponent } from '../module-form/module-form.component';

// import { CourseServicesService } from '../../../services/courses/course-services.service';

// @Component({
//   selector: 'app-course-creator',
//   standalone: true,
//   imports: [
//     CommonModule,
//     CourseFormComponent,
//     QuizFormComponent,
//     ModuleFormComponent
//   ],
//   templateUrl: './course-creator.component.html',
//   styleUrl: './course-creator.component.css'
// })
// export class CourseCreatorComponent {
//   currentStep: number = 0;
//   steps: { name: string, completed: boolean }[] = [
//     { name: 'Course Details', completed: false },
//     { name: 'Quiz Setup', completed: false },
//     { name: 'Module Creation', completed: false }
//   ];

//   courseData: Course = {
//     name: '',
//     category: '',
//     description: '',
//     smeId: '',
//     lobId: '',
//     author: ''
//   };
  
//   thumbnailImage?: File;
//   quizFile?: File;
  
//   moduleData: CourseModule = {
//     name: '',
//     duration: '',
//     description: ''
//   };

//   isSubmitting = false;
//   submissionError = '';
//   courseId: string = '';

//   constructor(
//     private courseService: CourseServicesService,
//     private router: Router
//   ) {}

//   goToStep(stepIndex: number): void {
//     if (stepIndex < 0 || stepIndex > this.steps.length - 1) {
//       return;
//     }

//     // If trying to go forward, validate the current step
//     if (stepIndex > this.currentStep) {
//       if (!this.validateCurrentStep()) {
//         return;
//       }
//     }

//     this.currentStep = stepIndex;
//   }

//   validateCurrentStep(): boolean {
//     switch (this.currentStep) {
//       case 0:
//         // Validate course form
//         return this.validateCourseForm();
//       case 1:
//         // Validate quiz form
//         return this.validateQuizForm();
//       case 2:
//         // Validate module form
//         return this.validateModuleForm();
//       default:
//         return true;
//     }
//   }

//   validateCourseForm(): boolean {
//     // Check if required course fields are filled
//     return !!(this.courseData.name && this.courseData.category && this.courseData.description && 
//               this.courseData.smeId && this.courseData.lobId);
//   }

//   validateQuizForm(): boolean {
//     // Check if quiz file is uploaded
//     return !!this.quizFile;
//   }

//   validateModuleForm(): boolean {
//     // Check if required module fields are filled
//     return !!(this.moduleData.name && this.moduleData.duration && this.moduleData.description);
//   }

//   onCourseDataChange(data: { course: Course, thumbnailImage?: File }): void {
//     this.courseData = data.course;
//     this.thumbnailImage = data.thumbnailImage;
//     this.steps[0].completed = this.validateCourseForm();
//   }

//   onQuizDataChange(file: File): void {
//     this.quizFile = file;
//     this.steps[1].completed = this.validateQuizForm();
//   }

//   onModuleDataChange(data: CourseModule): void {
//     this.moduleData = data;
//     this.steps[2].completed = this.validateModuleForm();
//   }

//   submitCourse(): void {
//     if (!this.validateCurrentStep()) {
//       alert('Please fill all required fields before submitting.');
//       return;
//     }

//     this.isSubmitting = true;
//     this.submissionError = '';

//     // Submit course data along with quiz in one request
//     this.submitCourseWithQuiz()
//       .then(courseId => {
//         this.courseId = courseId;
//         // Submit module data with courseId
//         return this.submitModuleData(courseId);
//       })
//       .then(() => {
//         // All submissions successful
//         this.isSubmitting = false;
//         alert('Course created successfully!');
//         this.navigateToCoursesList();
//       })
//       .catch(error => {
//         this.isSubmitting = false;
//         this.submissionError = `Error: ${error.message || 'Unknown error occurred'}`;
//         console.error('Error creating course:', error);
//         alert('Failed to create course. Please try again.');
//       });
//   }

//   private submitCourseWithQuiz(): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const formData = new FormData();
//       formData.append('course_name', this.courseData.name);
//       // Convert category to string since it might be a number and category_id expects an int
//       formData.append('category_id', String(this.courseData.category));
//       formData.append('description', this.courseData.description);
//       formData.append('sme_id', this.courseData.smeId || "");
//       formData.append('lob_id', this.courseData.lobId || "");
//       formData.append('author', this.courseData.author || '');
      
//       if (this.thumbnailImage) {
//         formData.append('imagepath', this.thumbnailImage, this.thumbnailImage.name);
//       }
      
//       if (this.quizFile) {
//         formData.append('quizPath', this.quizFile, this.quizFile.name);
//       }

//       this.courseService.addCourse(formData).subscribe({
//         next: (response: any) => {
//           console.log('Course created successfully:', response);
//           // Extract courseId from response and return it
//           if (response && response.data && response.data.course_id) {
//             resolve(response.data.course_id);
//           } else {
//             reject(new Error('Course ID not found in response'));
//           }
//         },
//         error: (error: any) => {
//           console.error('Error creating course:', error);
//           reject(error);
//         }
//       });
//     });
//   }

//   private submitModuleData(courseId: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       const formData = new FormData();
//       formData.append('courseId', courseId);
//       formData.append('name', this.moduleData.name);
//       formData.append('duration', this.moduleData.duration);
//       formData.append('description', this.moduleData.description);
      
//       if (this.moduleData.videoFile) {
//         formData.append('videoFile', this.moduleData.videoFile, this.moduleData.videoFile.name);
//       }
      
//       if (this.moduleData.pdfFile) {
//         formData.append('pdfFile', this.moduleData.pdfFile, this.moduleData.pdfFile.name);
//       }
      
//       this.courseService.addModule(formData).subscribe({
//         next: (response: any) => {
//           console.log('Module added successfully:', response);
//           resolve();
//         },
//         error: (error: any) => {
//           console.error('Error adding module:', error);
//           reject(error);
//         }
//       });
//     });
//   }

//   private navigateToCoursesList(): void {
//     // Navigate to the courses list page
//     this.router.navigate(['/courses']);
//   }
// }


// ------------------ final code ------------------------


import { Component , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Course } from '../../../models/course';
import { Quiz } from '../../../models/quiz';
import { CourseModule } from '../../../models/course-module';
import { CourseFormComponent } from '../course-form/course-form.component';
import { QuizFormComponent } from '../quiz-form/quiz-form.component';
import { ModuleFormComponent } from '../module-form/module-form.component';
import { CourseServicesService } from '../../../services/courses/course-services.service';


@Component({
  selector: 'app-course-creator',
  standalone: true,
  imports: [
    CommonModule,
    CourseFormComponent,
    QuizFormComponent,
    ModuleFormComponent
  ],
  templateUrl: './course-creator.component.html',
  styleUrl: './course-creator.component.css'
})
export class CourseCreatorComponent {
  currentStep: number = 0;
  steps: { name: string, completed: boolean }[] = [
    { name: 'Course Details', completed: false },
    { name: 'Quiz Setup', completed: false },
    { name: 'Module Creation', completed: false }
  ];

  courseData: Course = {
    name: '',
    category: '',
    description: '',
    smeId: '',
    lobId: '',
    author: ''
  };
  
  thumbnailImage?: File;
  
  quizData: Quiz = {};
  
  moduleData: CourseModule = {
    modulename: '',
    duration: '',
    description: ''
  };

  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  createdCourseId: number | null = null;

  constructor(private courseService: CourseServicesService , ) {}

  router:any=inject(Router)
  goToStep(stepIndex: number): void {
    if (stepIndex < 0 || stepIndex > this.steps.length - 1) {
      return;
    }

    // If trying to go forward, validate the current step
    if (stepIndex > this.currentStep) {
      if (!this.validateCurrentStep()) {
        return;
      }
    }

    this.currentStep = stepIndex;
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 0:
        // Validate course form
        return this.validateCourseForm();
      case 1:
        // Validate quiz form
        return this.validateQuizForm();
      case 2:
        // Validate module form
        return this.validateModuleForm();
      default:
        return true;
    }
  }

  validateCourseForm(): boolean {
    // Check if required course fields are filled
    return !!(this.courseData.name && this.courseData.category && this.courseData.description && this.thumbnailImage);
  }

  validateQuizForm(): boolean {
    // Quiz is optional, but if a file is chosen it should be valid
    return this.quizData.quizFile !== undefined || true;
  }

  validateModuleForm(): boolean {
    // Check if required module fields are filled
    return !!(this.moduleData.modulename && this.moduleData.duration && this.moduleData.description);
  }

  onCourseDataChange(data: { course: Course, thumbnailImage?: File }): void {
    this.courseData = data.course;
    this.thumbnailImage = data.thumbnailImage;
    this.steps[0].completed = this.validateCourseForm();
  }

  onQuizDataChange(data: Quiz): void {
    this.quizData = data;
    this.steps[1].completed = this.validateQuizForm();
  }

  onModuleDataChange(data: CourseModule): void {
    this.moduleData = data;
    this.steps[2].completed = this.validateModuleForm();
  }

  async submitCourse(): Promise<void> {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // First submit the course data
      await this.submitCourseData();
      
      // If module data is provided and course was created successfully, submit module
      if (this.createdCourseId && this.validateModuleForm()) {
        await this.submitModuleData();
      }
      
      this.successMessage = 'Course and module created successfully!';
      alert( 'Course and module created successfully!');
      this.router.navigate(['dashboard/course/viewcourse']);
    } catch (error) {
      console.error('Error during submission:', error);
      this.errorMessage = 'An error occurred during submission. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  private async submitCourseData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.validateCourseForm()) {
        reject('Course form validation failed');
        return;
      }

      // Create FormData for course submission
      const courseFormData = new FormData();
      courseFormData.append('course_name', this.courseData.name);
      courseFormData.append('description', this.courseData.description);
      courseFormData.append('sme_id', this.courseData.smeId || '');
      courseFormData.append('lob_id', this.courseData.lobId || '');
      courseFormData.append('category_id', this.courseData.category);
      courseFormData.append('author', this.courseData.author || '');
      
      // Add thumbnail image
      if (this.thumbnailImage) {
        courseFormData.append('imagepath', this.thumbnailImage);
      }
      
      // Add quiz file if available (as it's part of the course in the backend)
      if (this.quizData.quizFile) {
        courseFormData.append('quizPath', this.quizData.quizFile);
      }

      this.courseService.addCourse(courseFormData).subscribe({
        next: (response: any) => {
          console.log('Course created successfully:', response);
          
          // Extract course_id from response for module creation
          if (response && response.data && response.data.course_id) {
            this.createdCourseId = response.data.course_id;
            resolve();
          } else {
            console.error('Invalid response format, cannot get course_id:', response);
            reject('Failed to get course ID from response');
          }
        },
        error: (error:any) => {
          console.error('Error creating course:', error);
          reject(error);
        }
      });
    });
  }

  private async submitModuleData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.createdCourseId) {
        reject('No course ID available for module creation');
        return;
      }

      // Create FormData for module submission
      const moduleFormData = new FormData();
      moduleFormData.append('modulename', this.moduleData.modulename);
      moduleFormData.append('description', this.moduleData.description);
      moduleFormData.append('duration', this.moduleData.duration.toString());
      moduleFormData.append('course_id', this.createdCourseId.toString());
      
      // Add files if available
      if (this.moduleData.videoFile) {
        moduleFormData.append('VideoFile', this.moduleData.videoFile);
      }
      
      if (this.moduleData.pdfFile) {
        moduleFormData.append('PdfFile', this.moduleData.pdfFile);
      }

      this.courseService.addModule(moduleFormData).subscribe({
        next: (response:any) => {
          console.log('Module created successfully:', response);
          resolve();
        },
        error: (error:any) => {
          console.error('Error creating module:', error);
          reject(error);
        }
      });
    });
  }
}