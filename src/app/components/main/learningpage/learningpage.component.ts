// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-learningpage',
//   imports: [],
//   templateUrl: './learningpage.component.html',
//   styleUrl: './learningpage.component.css'
// })
// export class LearningpageComponent {

// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  CategoryWithCoursesDto, CourseBasicDto, UserLearningService } from '../../../services/user-learning.service';
import { jwtDecode } from 'jwt-decode';
import { DashboardServicesService } from '../../../services/homedashboard/dashboard-services.service';
import { MainheaderComponent } from '../mainheader/mainheader.component';
import { MainfooterComponent } from '../mainfooter/mainfooter.component';
import { TokenService } from '../../../services/Tokenservice/token.service';
import { Router } from '@angular/router';
 
interface Course {
  id: string;
  courseName: string;
  description: string;
  progress?: number;
  completedDate?: Date;
  category: 'all' | 'completed' | 'saved' | 'ongoing';
  imageUrl?: string;
  subCategory?: string;
  author?: string;
  isEnrolled?: boolean;
  isCompleted?: boolean;
  duration?: string;
}
 
interface Category {
  id: string;
  name: string;
  subCategory: string;
  imageUrl: string;
  courseCount: number;
}
 
@Component({
  selector: 'app-learning-page',
  standalone: true,
  imports: [CommonModule, MainheaderComponent , MainfooterComponent],
  templateUrl: './learningpage.component.html',
  styleUrl: './learningpage.component.css'
})
export class LearningpageComponent implements OnInit {
  activeCategory: 'all' | 'completed' | 'saved' | 'ongoing' = 'all';
 
  categories = [
    { key: 'all', label: 'All Categories', icon: '📚' },
    { key: 'completed', label: 'Completed Courses', icon: '✅' },
    { key: 'saved', label: 'Saved Courses', icon: '❤️' },
    { key: 'ongoing', label: 'Ongoing Courses', icon: '📖' }
  ] as const;
 
  // Data from API
  allCategories: Category[] = [];
  completedCourses: Course[] = [];
  ongoingCourses: Course[] = [];
  savedCourses: Course[] = []; // Will be implemented later
 
  filteredCourses: Course[] = [];
  isLoading = false;
  error: string | null = null;
 
  user = {
    userId: '',
    userName: '',
    userEmail: '',
    userAvatar: '',
    lobid: undefined as string | undefined,
    roleId: 0
  };
  
   // User ID will be set after decoding JWT
 
  constructor(private dashSerive: DashboardServicesService , private userLearningService:UserLearningService , private tokenService:TokenService , private router: Router) {
      // TODO: Get userId from your authentication service
      this.user = tokenService.getDecodedToken() ;
   
  }
  //    getDecodedUserId() {
  //     try {
  //         // Retrieve token from localStorage
  //         const token = localStorage.getItem("authToken");
  //         if (!token) {
  //             console.error("No auth token found in localStorage.");
  //             return null;
  //         }
 
  //         // Decode JWT
  //         const decodedToken: any = jwtDecode(token);
 
  //         console.log("=== DECODED TOKEN ===", decodedToken);
 
  //         // Extract UserId from possible claims
  //         const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
 
  //         console.log("=== EXTRACTED USER ID ===", userId);
  //         return userId;
  //     } catch (error) {
  //         console.error("Error decoding JWT:", error);
  //         return null;
  //     }
  // }
 
 
  ngOnInit() {
    this.loadInitialData();
  }
 
  private loadInitialData() {
    this.isLoading = true;
    this.error = null;
 
    // Load all categories first
    this.loadCategories();
   
    // Load completed and ongoing courses
    this.loadCompletedCourses();
    this.loadOngoingCourses();
    this.loadSavedCourses();
  }
 
 
  private loadSavedCourses(){
    this.dashSerive.getSavedCourses(this.user.userId).subscribe({
      next: (data:any) => {
        this.savedCourses = data;
        console.log('Saved courses without filter:', this.savedCourses);
         this.savedCourses = this.mapCoursesToUI( data , 'saved');
        this.filterCourses();

      },
      error: (error:any) => {
        console.error('Error loading saved  courses:', error);
        this.error = 'Failed to load saved courses';
        this.isLoading = false;
      }
    });
  }
  private loadCategories() {
    this.dashSerive.getAllCategories(this.user.userId).subscribe({
      next: (categories) => {
        console.log('yash  without mapping Raw categories data:', categories);
        this.allCategories = this.mapCategoriesToUI(categories);
        this.filterCourses();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories';
        this.isLoading = false;
      }
    });
  }
 
  private loadCompletedCourses() {
    this.userLearningService.getUserCompletedCourses(this.user.userId).subscribe({
      next: (courses:any) => {
        console.log('Raw completed courses data without mapping :', courses);
        this.completedCourses = this.mapCoursesToUI(courses, 'completed');
        this.filterCourses();
      },
      error: (error:any) => {
        console.error('Error loading completed courses:', error);
        this.error = 'Failed to load completed courses';
      }
    });
  }
 
  private loadOngoingCourses() {
    this.userLearningService.getUserInProgressCourses(this.user.userId).subscribe({
      next: (courses:any) => {
        this.ongoingCourses = this.mapCoursesToUI(courses, 'ongoing');
        this.filterCourses();
        this.isLoading = false;
      },
      error: (error:any) => {
        console.error('Error loading ongoing courses:', error);
        this.error = 'Failed to load ongoing courses';
        this.isLoading = false;
      }
    });
  }
 
private mapCategoriesToUI(apiCategories: CategoryWithCoursesDto[]): Category[] {
  return apiCategories.map(category => {
    const imageUrl = category.imagePath || this.getDefaultCategoryImage();
    console.log("after mapping og categoires ",imageUrl); // Log the image URL here
    return {
      id: category.id,
      name: category.name,
      subCategory: category.description || 'Learning Category',
      imageUrl: imageUrl,
      courseCount: category.courseCount
    };
  });
}
 
  private mapCoursesToUI(apiCourses: CourseBasicDto[], category: 'completed' | 'ongoing' | 'saved' ): Course[] {
    return apiCourses.map(course => ({
      id: course.courseId,
      courseName: course.courseName,
      description: course.description || '',
      category: category,
      imageUrl: `https://localhost:7264${this.getCourseImageUrl(course)}`,
      subCategory: 'Course', // You might want to add category info to your DTO
      author: course.author || 'Unknown Instructor',
      progress: course.progress || (category === 'completed' ? 100 : 0),
      isEnrolled: course.isEnrolled,
      isCompleted: course.isCompleted,
      duration: course.duration,
      completedDate: category === 'completed' ? new Date() : undefined // You might want to add this to your DTO
    }));
  }
 
  private getCourseImageUrl(course: CourseBasicDto): string {
    // Check multiple possible image field names from your DTO
    return course.thumbnailUrl ||
           course.imagePath ||
           course.imageUrl ||
           course.thumbnail ||
           course.image ||
           this.getDefaultCourseImage();
  }
 
  private getDefaultCategoryImage(): string {
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop';
  }
 
  private getDefaultCourseImage(): string {
    return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop';
  }
 
  switchCategory(category: 'all' | 'completed' | 'saved' | 'ongoing') {
    this.activeCategory = category;
    this.filterCourses();
  }
 
  private filterCourses() {
    switch (this.activeCategory) {
      case 'all':
        this.filteredCourses = [];
        break;
      case 'completed':
        this.filteredCourses = this.completedCourses;
        break;
      case 'ongoing':
        this.filteredCourses = this.ongoingCourses;
        break;
      case 'saved':
        this.filteredCourses = this.savedCourses;
        break;
      default:
        this.filteredCourses = [];
    }
  }
 
  getCourseCount(category: 'all' | 'completed' | 'saved' | 'ongoing'): number {
    switch (category) {
      case 'all':
        return this.allCategories.length;
      case 'completed':
        return this.completedCourses.length;
      case 'ongoing':
        return this.ongoingCourses.length;
      case 'saved':
        return this.savedCourses.length;
      default:
        return 0;
    }
  }
 
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = this.getDefaultCourseImage();
    }
  }
 
  // Method to handle category view button click
onViewCategory(categoryId: string , categoryName: string) {
  console.log('View category:', categoryId);
  this.router.navigate([`courses/${btoa(categoryId)}`], { 
    queryParams: { categoryName: categoryName } 
  });
}
 
  // Method to handle course view button click
  onViewCourse(courseId: string) {
    // Navigate to course detail page
    this.router.navigate([`module/${btoa(courseId)}`]);
    // Example: this.router.navigate(['/course', courseId]);
  }

 
  // Method to refresh data
  refreshData() {
    this.loadInitialData();
  }
}
