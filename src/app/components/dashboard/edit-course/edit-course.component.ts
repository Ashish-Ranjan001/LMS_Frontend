// // edit-course.component.ts
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CourseServicesService } from '../../../services/courses/course-services.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-edit-course',
//   templateUrl: './edit-course.component.html',
//   styleUrls: ['./edit-course.component.css'],
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
// })
// export class EditCourseComponent implements OnInit {
//   courseForm: FormGroup;
//   courseId: string = '';
//   imagePreview: string | ArrayBuffer | null = null;
//   selectedImageFile: File | null = null;
//   selectedQuizFile: File | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private courseService: CourseServicesService,
//     private router: Router
//   ) {
//     this.courseForm = this.fb.group({
//       course_name: ['', Validators.required],
//       description: [''],
//       author: [''],
//       status: [false],
//       imagepath: [null],
//       category_id: [''],
//       sme_id: [''],
//       lob_id: [''],
//       quizPath: [null]
//     });
//   }

//   ngOnInit(): void {
//     this.courseId = this.route.snapshot.paramMap.get('id')!;
//     this.loadCourseData();
//   }

//   loadCourseData(): void {
//     this.courseService.getCourseById(this.courseId).subscribe({
//       next: (response) => {
//         const course = response.data || response; // Handle both response formats
//         this.courseForm.patchValue({
//           course_name: course.course_name,
//           description: course.description,
//           author: course.author,
//           status: course.status,
//           category_id: course.category_id,
//           sme_id: course.sme_id,
//           lob_id: course.lob_id
//         });
        
//         // Set image preview if exists
//         if (course.imagepath) {
//           this.imagePreview = 'https://localhost:7264' + course.imagepath;
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching course:', err);
//         alert('Error loading course data');
//       }
//     });
//   }

//   onImageSelected(event: Event): void {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (file) {
//       this.selectedImageFile = file;
//       this.courseForm.patchValue({ imagepath: file });
      
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.imagePreview = reader.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   onQuizSelected(event: Event): void {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (file) {
//       this.selectedQuizFile = file;
//       this.courseForm.patchValue({ quizPath: file });
//     }
//   }

//   onSubmit(): void {
//     if (this.courseForm.invalid) {
//       alert('Please fill in all required fields');
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append('course_name', this.courseForm.get('course_name')?.value || '');
//     formData.append('description', this.courseForm.get('description')?.value || '');
//     formData.append('author', this.courseForm.get('author')?.value || '');
//     formData.append('category_id', this.courseForm.get('category_id')?.value || '');
//     formData.append('sme_id', this.courseForm.get('sme_id')?.value || '');
//     formData.append('lob_id', this.courseForm.get('lob_id')?.value || '');
    
//     // Add image file if selected
//     if (this.selectedImageFile) {
//       formData.append('imagepath', this.selectedImageFile);
//     }

//     // Add quiz file if selected
//     if (this.selectedQuizFile) {
//       formData.append('quizPath', this.selectedQuizFile);
//     }
  
//     this.courseService.updateCourse(this.courseId, formData).subscribe({
//       next: (response) => {
//         console.log('Course updated successfully:', response);
//         alert('Course updated successfully!');
//         this.router.navigate(['/view-courses']);
//       },
//       error: (err) => {
//         console.error('Error updating course:', err);
//         alert('Error updating course: ' + (err.error?.message || 'Unknown error'));
//       }
//     });
//   }

//   cancel(): void {
//     this.router.navigate(['/view-courses']);
//   }
// }

// =============================================================================================

// // edit-course.component.ts
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CourseServicesService } from '../../../services/courses/course-services.service';
// import { CommonModule } from '@angular/common';
// import { SmeServicesService } from '../../../services/smes/sme-services.service';
// import { LobServicesService } from '../../../services/lobs/lob-services.service';
// import { CategoriesServiceService } from '../../../services/Categories/categories-service.service';

// @Component({
//   selector: 'app-edit-course',
//   templateUrl: './edit-course.component.html',
//   styleUrls: ['./edit-course.component.css'],
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
// })
// export class EditCourseComponent implements OnInit {
//   courseForm: FormGroup;
//   courseId: string = '';
//   imagePreview: string | ArrayBuffer | null = null;
//   selectedImageFile: File | null = null;
//   selectedQuizFile: File | null = null;
//   quizFileName: string = 'Choose CSV file';
//   quizError: string = '';
//   isSubmitting: boolean = false;

//   // Dropdown data arrays
//   categories: any[] = [];
//   smeList: any[] = [];
//   lobList: any[] = [];
//   errorMessage: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private courseService: CourseServicesService,
//     private router: Router,
   
//     private smeService: SmeServicesService,
//     private lobService: LobServicesService,
//     private categoriesService: CategoriesServiceService
//   ) {
//     this.courseForm = this.fb.group({
//       course_name: ['', [Validators.required, Validators.minLength(3)]],
//       description: [''],
//       author: [''],
//       status: [false],
//       imagepath: [null],
//       category_id: ['', Validators.required],
//       sme_id: ['', Validators.required],
//       lob_id: ['', Validators.required],
//       quizPath: [null]
//     });
//   }

//   ngOnInit(): void {
//     this.courseId = this.route.snapshot.paramMap.get('id')!;
//     this.initializeData();
//   }

//   async initializeData(): Promise<void> {
//     try {
//       // Load all dropdown data in parallel
//       await Promise.all([
//         this.loadCategories(),
//         this.loadSmes(),
//         this.loadLobs()
//       ]);
      
//       // Load course data after dropdowns are loaded
//       this.loadCourseData();
//     } catch (error) {
//       console.error('Error initializing data:', error);
//       this.errorMessage = 'Failed to load required data. Please refresh the page.';
//     }
//   }

//   loadCourseData(): void {
//     this.courseService.getCourseById(this.courseId).subscribe({
//       next: (response) => {
//         const course = response.data || response;
//         this.courseForm.patchValue({
//           course_name: course.course_name,
//           description: course.description,
//           author: course.author,
//           status: course.status,
//           category_id: course.category_id,
//           sme_id: course.sme_id,
//           lob_id: course.lob_id
//         });
        
//         // Set image preview if exists
//         if (course.imagepath) {
//           this.imagePreview = 'https://localhost:7264' + course.imagepath;
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching course:', err);
//         this.errorMessage = 'Error loading course data';
//       }
//     });
//   }

//   // Load Categories - Replace with your actual service
//   loadCategories(): Promise<void> {
//     return new Promise<void>((resolve) => {
//       // Replace this with your actual categoriesService call
     
//       this.categoriesService.getCategories().subscribe({
//         next: (response: any) => {
//           console.log('Categories received:', response);
          
//           if (Array.isArray(response)) {
//             this.categories = response;
//           } else if (response && response.data && Array.isArray(response.data)) {
//             this.categories = response.data;
//           } else {
//             console.error('Unexpected Categories response format:', response);
//             this.categories = [];
//             this.errorMessage = 'Failed to load Categories data. Please refresh the page.';
//           }
          
//           resolve();
//         },
//         error: (error: any) => {
//           console.error('Error loading Categories:', error);
//           this.categories = [];
//           this.errorMessage = 'Failed to load Categories data. Please refresh the page.';
//           resolve();
//         }
//       });
      
      
    
//     });
//   }

//   // Load SMEs - Replace with your actual service
//   loadSmes(): Promise<void> {
//     return new Promise<void>((resolve) => {
//       // Replace this with your actual smeService call
      
//       this.smeService.viewSmes().subscribe({
//         next: (response: any) => {
//           console.log('SMEs received:', response);
          
//           if (Array.isArray(response)) {
//             this.smeList = response;
//           } else if (response && response.data && Array.isArray(response.data)) {
//             this.smeList = response.data;
//           } else {
//             console.error('Unexpected SME response format:', response);
//             this.smeList = [];
//             this.errorMessage = 'Failed to load SME data. Please refresh the page.';
//           }
          
//           resolve();
//         },
//         error: (error: any) => {
//           console.error('Error loading SMEs:', error);
//           this.smeList = [];
//           this.errorMessage = 'Failed to load SME data. Please refresh the page.';
//           resolve();
//         }
//       });
      
      
      
//     });
//   }

//   // Load LOBs - Replace with your actual service
//   loadLobs(): Promise<void> {
//     return new Promise<void>((resolve) => {
//       // Replace this with your actual lobService call
      
//       this.lobService.viewLobs().subscribe({
//         next: (response: any) => {
//           console.log('LOBs received:', response);
          
//           if (Array.isArray(response)) {
//             this.lobList = response;
//           } else if (response && response.data && Array.isArray(response.data)) {
//             this.lobList = response.data;
//           } else {
//             console.error('Unexpected LOB response format:', response);
//             this.lobList = [];
//             this.errorMessage = 'Failed to load LOB data. Please refresh the page.';
//           }
          
//           resolve();
//         },
//         error: (error: any) => {
//           console.error('Error loading LOBs:', error);
//           this.lobList = [];
//           this.errorMessage = 'Failed to load LOB data. Please refresh the page.';
//           resolve();
//         }
//       });
      
      
      
//     });
//   }

//   onImageSelected(event: Event): void {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (file) {
//       // Validate image file
//       if (!this.validateImageFile(file)) {
//         return;
//       }

//       this.selectedImageFile = file;
//       this.courseForm.patchValue({ imagepath: file });
      
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.imagePreview = reader.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   validateImageFile(file: File): boolean {
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//     const maxSize = 5 * 1024 * 1024; // 5MB

//     if (!allowedTypes.includes(file.type)) {
//       alert('Please upload a valid image file (JPG, PNG, GIF)');
//       return false;
//     }

//     if (file.size > maxSize) {
//       alert('Image file size should be less than 5MB');
//       return false;
//     }

//     return true;
//   }

//   removeImage(): void {
//     this.selectedImageFile = null;
//     this.imagePreview = null;
//     this.courseForm.patchValue({ imagepath: null });
    
//     // Clear the file input
//     const fileInput = document.getElementById('imagepath') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   }

//   onQuizSelected(event: Event): void {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (file) {
//       if (this.validateQuizFile(file)) {
//         this.selectedQuizFile = file;
//         this.quizFileName = file.name;
//         this.quizError = '';
//         this.courseForm.patchValue({ quizPath: file });
//       } else {
//         // Clear the file input if validation fails
//         const fileInput = event.target as HTMLInputElement;
//         fileInput.value = '';
//       }
//     }
//   }

//   validateQuizFile(file: File): boolean {
//     // Check if it's a CSV file
//     if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
//       this.quizError = 'Please upload a CSV file only';
//       return false;
//     }
    
//     // Check file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       this.quizError = 'File size should be less than 5MB';
//       return false;
//     }
    
//     return true;
//   }

//   clearQuizFile(): void {
//     this.selectedQuizFile = null;
//     this.quizFileName = 'Choose CSV file';
//     this.quizError = '';
//     this.courseForm.patchValue({ quizPath: null });
    
//     // Clear the file input
//     const fileInput = document.getElementById('quizPath') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   }

//   onSubmit(): void {
//     if (this.courseForm.invalid) {
//       this.markFormGroupTouched();
//       return;
//     }

//     this.isSubmitting = true;
  
//     const formData = new FormData();
//     formData.append('course_name', this.courseForm.get('course_name')?.value || '');
//     formData.append('description', this.courseForm.get('description')?.value || '');
//     formData.append('author', this.courseForm.get('author')?.value || '');
//     formData.append('category_id', this.courseForm.get('category_id')?.value || '');
//     formData.append('sme_id', this.courseForm.get('sme_id')?.value || '');
//     formData.append('lob_id', this.courseForm.get('lob_id')?.value || '');
//     formData.append('status', this.courseForm.get('status')?.value ? 'true' : 'false');
    
    
//     // Add image file if selected
//     if (this.selectedImageFile) {
//       formData.append('imagepath', this.selectedImageFile);
//     }

//     // Add quiz file if selected
//     if (this.selectedQuizFile) {
//       formData.append('quizPath', this.selectedQuizFile);
//     }
  
//     this.courseService.updateCourse(this.courseId, formData).subscribe({
//       next: (response) => {
//         console.log('Course updated successfully:', response);
//         this.isSubmitting = false;
        
//         // Show success message and redirect
//         alert('Course updated successfully!');
//         this.router.navigate(['/dashboard/course/viewcourse']);
//       },
//       error: (err) => {
//         console.error('Error updating course:', err);
//         this.isSubmitting = false;
//         alert('Error updating course: ' + (err.error?.message || 'Unknown error'));
//       }
//     });
//   }

//   private markFormGroupTouched(): void {
//     Object.keys(this.courseForm.controls).forEach(key => {
//       const control = this.courseForm.get(key);
//       control?.markAsTouched();
//     });
//   }

//   cancel(): void {
//     this.router.navigate(['/dashboard/course/viewcourse']);
//   }
// }




// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseServicesService } from '../../../services/courses/course-services.service';
import { CommonModule } from '@angular/common';
import { SmeServicesService } from '../../../services/smes/sme-services.service';
import { LobServicesService } from '../../../services/lobs/lob-services.service';
import { CategoriesServiceService } from '../../../services/Categories/categories-service.service';


interface Category {
  id: string
  name: string
}

interface SME {
  smeId: string
  name: string
}

interface LOB {
  lobId: string
  lobName: string
}

@Component({
  selector: "app-edit-course",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./edit-course.component.html",
  styleUrls: ["./edit-course.component.css"],
})
export class EditCourseComponent implements OnInit {
  courseForm: FormGroup
  courseId = ""
  categories: Category[] = []
  smeList: SME[] = []
  lobList: LOB[] = []
  imagePreview: string | ArrayBuffer | null = null
  selectedImageFile: File | null = null
  selectedQuizFile: File | null = null
  quizFileName = "Choose CSV file"
  quizError = ""
  isSubmitting = false
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private courseService: CourseServicesService,
    private router: Router,
    private smeService: SmeServicesService,
    private lobService: LobServicesService,
    private categoriesService: CategoriesServiceService,
  ) {
    this.courseForm = this.fb.group({
      course_name: ["", [Validators.required, Validators.minLength(3)]],
      author: [""],
      description: [""],
      category_id: ["", Validators.required],
      sme_id: ["", Validators.required],
      lob_id: ["", Validators.required],
      status: [false],
      imagepath: [""],
      quizPath: [""],
    })
  }

  ngOnInit(): void {
    this.courseId = atob(this.route.snapshot.paramMap.get("id")!)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    try {
      // Load all dropdown data in parallel
      await Promise.all([this.loadCategories(), this.loadSMEs(), this.loadLOBs()])

      // Load course data after dropdowns are loaded
      this.loadCourseData()
    } catch (error) {
      console.error("Error initializing data:", error)
      this.errorMessage = "Failed to load required data. Please refresh the page."
    }
  }

  loadCourseData(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (response) => {
        const course = response.data || response
        this.courseForm.patchValue({
          course_name: course.course_name,
          description: course.description,
          author: course.author,
          status: course.status,
          category_id: course.category_id,
          sme_id: course.sme_id,
          lob_id: course.lob_id,
        })

        // Set image preview if exists
        if (course.imagepath) {
          this.imagePreview = "https://localhost:7264" + course.imagepath
        }
      },
      error: (err) => {
        console.error("Error fetching course:", err)
        this.errorMessage = "Error loading course data"
      },
    })
  }

  // Load Categories - Replace with your actual service
  loadCategories(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Replace this with your actual categoriesService call
      this.categoriesService.getCategories().subscribe({
        next: (response: any) => {
          console.log("Categories received:", response)

          if (Array.isArray(response)) {
            this.categories = response
          } else if (response && response.data && Array.isArray(response.data)) {
            this.categories = response.data
          } else {
            console.error("Unexpected Categories response format:", response)
            this.categories = []
            this.errorMessage = "Failed to load Categories data. Please refresh the page."
          }

          resolve()
        },
        error: (error: any) => {
          console.error("Error loading Categories:", error)
          this.categories = []
          this.errorMessage = "Failed to load Categories data. Please refresh the page."
          resolve()
        },
      })
    })
  }

  // Load SMEs - Replace with your actual service
  loadSMEs(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Replace this with your actual smeService call
      this.smeService.viewSmes().subscribe({
        next: (response: any) => {
          console.log("SMEs received:", response)

          if (Array.isArray(response)) {
            this.smeList = response
          } else if (response && response.data && Array.isArray(response.data)) {
            this.smeList = response.data
          } else {
            console.error("Unexpected SME response format:", response)
            this.smeList = []
            this.errorMessage = "Failed to load SME data. Please refresh the page."
          }

          resolve()
        },
        error: (error: any) => {
          console.error("Error loading SMEs:", error)
          this.smeList = []
          this.errorMessage = "Failed to load SME data. Please refresh the page."
          resolve()
        },
      })
    })
  }

  // Load LOBs - Replace with your actual service
  loadLOBs(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Replace this with your actual lobService call
      this.lobService.viewLobs().subscribe({
        next: (response: any) => {
          console.log("LOBs received:", response)

          if (Array.isArray(response)) {
            this.lobList = response
          } else if (response && response.data && Array.isArray(response.data)) {
            this.lobList = response.data
          } else {
            console.error("Unexpected LOB response format:", response)
            this.lobList = []
            this.errorMessage = "Failed to load LOB data. Please refresh the page."
          }

          resolve()
        },
        error: (error: any) => {
          console.error("Error loading LOBs:", error)
          this.lobList = []
          this.errorMessage = "Failed to load LOB data. Please refresh the page."
          resolve()
        },
      })
    })
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      // Validate image file
      if (!this.validateImageFile(file)) {
        return
      }

      this.selectedImageFile = file
      this.courseForm.patchValue({ imagepath: file })

      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  validateImageFile(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, GIF)")
      return false
    }

    if (file.size > maxSize) {
      alert("Image file size should be less than 5MB")
      return false
    }

    return true
  }

  removeImage(): void {
    this.selectedImageFile = null
    this.imagePreview = null
    this.courseForm.patchValue({ imagepath: null })

    // Clear the file input
    const fileInput = document.getElementById("imagepath") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  onQuizSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      if (this.validateQuizFile(file)) {
        this.selectedQuizFile = file
        this.quizFileName = file.name
        this.quizError = ""
        this.courseForm.patchValue({ quizPath: file })
      } else {
        // Clear the file input if validation fails
        const fileInput = event.target as HTMLInputElement
        fileInput.value = ""
      }
    }
  }

  validateQuizFile(file: File): boolean {
    // Check if it's a CSV file
    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
      this.quizError = "Please upload a CSV file only"
      return false
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.quizError = "File size should be less than 5MB"
      return false
    }

    return true
  }

  clearQuizFile(): void {
    this.selectedQuizFile = null
    this.quizFileName = "Choose CSV file"
    this.quizError = ""
    this.courseForm.patchValue({ quizPath: null })

    // Clear the file input
    const fileInput = document.getElementById("quizPath") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched()
      return
    }

    this.isSubmitting = true

    const formData = new FormData()
    formData.append("course_name", this.courseForm.get("course_name")?.value || "")
    formData.append("description", this.courseForm.get("description")?.value || "")
    formData.append("author", this.courseForm.get("author")?.value || "")
    formData.append("category_id", this.courseForm.get("category_id")?.value || "")
    formData.append("sme_id", this.courseForm.get("sme_id")?.value || "")
    formData.append("lob_id", this.courseForm.get("lob_id")?.value || "")
    formData.append("status", this.courseForm.get("status")?.value ? "true" : "false")

    // Add image file if selected
    if (this.selectedImageFile) {
      formData.append("imagepath", this.selectedImageFile)
    }

    // Add quiz file if selected
    if (this.selectedQuizFile) {
      formData.append("quizPath", this.selectedQuizFile)
    }

    this.courseService.updateCourse(this.courseId, formData).subscribe({
      next: (response) => {
        console.log("Course updated successfully:", response)
        this.isSubmitting = false

        // Show success message and redirect
        alert("Course updated successfully!")
        this.router.navigate(["/dashboard/course/viewcourse"])
      },
      error: (err) => {
        console.error("Error updating course:", err)
        this.isSubmitting = false
        alert("Error updating course: " + (err.error?.message || "Unknown error"))
      },
    })
  }

  private markFormGroupTouched(): void {
    Object.keys(this.courseForm.controls).forEach((key) => {
      const control = this.courseForm.get(key)
      control?.markAsTouched()
    })
  }

  cancel(): void {
    this.router.navigate(["/dashboard/course/viewcourse"])
  }
}
