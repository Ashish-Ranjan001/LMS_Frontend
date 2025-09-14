
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';

// interface Course {
//   id: number;
//   name: string;
//   imageUrl: string;
//   status: 'Published' | 'Unpublished';
// }

// @Component({
//   selector: 'app-view-course',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './view-course.component.html',
//   styleUrls: ['./view-course.component.css']
// })
// export class ViewCourseComponent implements OnInit {
//   courses: Course[] = [
//     { id: 1, name: 'Angular Mastery', imageUrl: 'assets/images/angular.png', status: 'Published' },
//     { id: 2, name: 'React Fundamentals', imageUrl: 'assets/images/react.png', status: 'Published' },
//     { id: 3, name: 'Vue Essentials', imageUrl: 'assets/images/vue.png', status: 'Unpublished' },
//     { id: 4, name: 'Node.js Deep Dive', imageUrl: 'assets/images/node.png', status: 'Unpublished' },
//     { id: 5, name: 'Python for Beginners', imageUrl: 'assets/images/python.png', status: 'Published' },
//     { id: 6, name: 'Data Science with R', imageUrl: 'assets/images/datascience.png', status: 'Published' }
//   ];

//   searchTerm: string = '';
//   filteredCourses: Course[] = [];
//   paginatedCourses: Course[] = [];

//   currentPage: number = 1;
//   itemsPerPage: number = 3;
//   totalPages: number = 1;
//   pages: number[] = [];

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.filterCourses();
//   }

//   search(): void {
//     this.currentPage = 1; // Reset page
//     this.filterCourses();
//   }

//   filterCourses(): void {
//     if (!this.searchTerm.trim()) {
//       this.filteredCourses = [...this.courses];
//     } else {
//       const term = this.searchTerm.toLowerCase().trim();
//       this.filteredCourses = this.courses.filter(course => course.name.toLowerCase().includes(term));
//     }

//     this.calculateTotalPages();
//     this.updatePagination();
//   }

//   calculateTotalPages(): void {
//     this.totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
//     this.generatePageArray();
//   }

//   generatePageArray(): void {
//     this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
//   }

//   updatePagination(): void {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     this.paginatedCourses = this.filteredCourses.slice(startIndex, startIndex + this.itemsPerPage);
//   }

//   goToPage(page: number): void {
//     if (page >= 1 && page <= this.totalPages) {
//       this.currentPage = page;
//       this.updatePagination();
//     }
//   }

//   goToFirstPage(): void {
//     this.goToPage(1);
//   }

//   goToLastPage(): void {
//     this.goToPage(this.totalPages);
//   }

//   goToPreviousPage(): void {
//     this.goToPage(this.currentPage - 1);
//   }

//   goToNextPage(): void {
//     this.goToPage(this.currentPage + 1);
//   }

//   editCourse(course: Course): void {
//     console.log('Edit course:', course);
//   }
// }

// // import { Component, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { HttpClient } from '@angular/common/http';

// // interface Course {
// //   id: number;
// //   name: string;
// //   imageUrl: string;
// //   subSet: string;
// //   status: 'Active' | 'Inactive';
// // }

// // @Component({
// //   selector: 'app-view-course',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule],
// //   templateUrl: './view-course.component.html',
// //   styleUrls: ['./view-course.component.css']
// // })
// // export class ViewCourseComponent implements OnInit {
// //   courses: Course[] = [];
    

// //   searchTerm: string = '';
// //   filteredCourses: Course[] = [];
// //   paginatedCourses: Course[] = [];
// //   isLoading: boolean = true;
// //   error: string | null = null;
// //   currentPage: number = 1;
// //   itemsPerPage: number = 3;
// //   totalPages: number = 1;
// //   pages: number[] = [];

// //   constructor(private http: HttpClient) {}

// //   ngOnInit(): void {
// //     this.filterCourses();
// //   }

// //   search(): void {
// //     this.currentPage = 1; // Reset page
// //     this.filterCourses();
// //   }

// //   filterCourses(): void {
// //     if (!this.searchTerm.trim()) {
// //       this.filteredCourses = [...this.courses];
// //     } else {
// //       const term = this.searchTerm.toLowerCase().trim();
// //       this.filteredCourses = this.courses.filter(course => 
// //         course.name.toLowerCase().includes(term) || 
// //         course.subSet.toLowerCase().includes(term)
// //       );
// //     }

// //     this.calculateTotalPages();
// //     this.updatePagination();
// //   }

// //   calculateTotalPages(): void {
// //     this.totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
// //     this.generatePageArray();
// //   }

// //   generatePageArray(): void {
// //     this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
// //   }

// //   updatePagination(): void {
// //     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
// //     this.paginatedCourses = this.filteredCourses.slice(startIndex, startIndex + this.itemsPerPage);
// //   }

// //   goToPage(page: number): void {
// //     if (page >= 1 && page <= this.totalPages) {
// //       this.currentPage = page;
// //       this.updatePagination();
// //     }
// //   }

// //   goToFirstPage(): void {
// //     this.goToPage(1);
// //   }

// //   goToLastPage(): void {
// //     this.goToPage(this.totalPages);
// //   }

// //   goToPreviousPage(): void {
// //     this.goToPage(this.currentPage - 1);
// //   }

// //   goToNextPage(): void {
// //     this.goToPage(this.currentPage + 1);
// //   }

// //   editCourse(course: Course): void {
// //     console.log('Edit course:', course);
// //   }
// // }



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CourseServicesService } from '../../../services/courses/course-services.service';
import { Router } from '@angular/router';

interface Course {
  course_id: string;
  course_name: string;
  imagepath: string;
  status: boolean;
}

@Component({
  selector: 'app-view-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.css']
})
export class ViewCourseComponent implements OnInit {
  courses: Course[] = [];
  searchTerm: string = '';
  filteredCourses: Course[] = [];
  paginatedCourses: Course[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(private courseService: CourseServicesService,private router:Router) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.viewCourses().subscribe({
      next: (response: any) => {
        // Handle the API response - assuming it returns an array of courses
        this.courses = Array.isArray(response.data) ? response.data : [response];
        console.log('Courses loaded:', this.courses);
        this.isLoading = false;
        this.filterCourses();
      },
      error: (err:any) => {
        console.error('Error loading courses:', err);
        this.error = 'Failed to load courses. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  search(): void {
    this.currentPage = 1; // Reset page
    this.filterCourses();
  }

  filterCourses(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCourses = [...this.courses];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredCourses = this.courses.filter(course => 
        course.course_name.toLowerCase().includes(term)
      );
    }

    this.calculateTotalPages();
    this.updatePagination();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
    this.generatePageArray();
  }

  generatePageArray(): void {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedCourses = this.filteredCourses.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  editCourse(course: Course): void {
    this.router.navigate(['dashboard/course/edit', btoa(course.course_id)]);
  }
  addModule(course: Course): void {
    this.router.navigate(['dashboard/module/add', course.course_id]);
  }
  viewModule(course: Course): void {
    this.router.navigate(['dashboard/module/view', course.course_id]);
  }
  
  getStatusText(status: boolean): string {
    return status ? 'Published' : 'Unpublished';
  }
}