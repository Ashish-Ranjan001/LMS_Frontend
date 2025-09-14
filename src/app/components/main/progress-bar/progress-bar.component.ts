// import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DashboardServicesService } from '../../../services/homedashboard/dashboard-services.service';
// import { jwtDecode } from 'jwt-decode';

// interface CourseData {
//   label: string;
//   value: number;
//   maxValue: number;
//   color: string;
//   percentage: number;
// }

// interface CategoryStats {
//   categoryName: string;
//   totalCourses: number;
//   enrolledCourses: number;
//   completedCourses: number;
//   inProgressCourses: number;
// }

// @Component({
//   selector: 'app-progress-bar',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './progress-bar.component.html',
//   styleUrls: ['./progress-bar.component.css']
// })
// export class ProgressBarComponent implements OnInit, OnDestroy {
//   @Output() progressUpdate = new EventEmitter<any>();

//   hoveredSegment: string | null = null;
//   animationProgress = 0;
//   private animationFrame: number | null = null;
  
//   // Dynamic data properties
//   userId: string | null = null;
//   isLoading = true;
//   error: string | null = null;

//   // Course data that will be populated from API
//   courseData: CourseData[] = [];

//   // Totals from all categories
//   totalCourses = 0;
//   enrolledCourses = 0;
//   inProgressCourses = 0;
//   completedCourses = 0;

//   constructor(private dashboardService: DashboardServicesService) {}

//   ngOnInit(): void {
//     this.userId = this.getDecodedUserId();
//     if (this.userId) {
//       this.loadCourseStats();
//     } else {
//       this.error = 'Unable to retrieve user ID from token';
//       this.isLoading = false;
//       this.setDefaultData();
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.animationFrame) {
//       cancelAnimationFrame(this.animationFrame);
//     }
//   }

//   getDecodedUserId(): string | null {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.error("No auth token found in localStorage.");
//         return null;
//       }

//       const decodedToken: any = jwtDecode(token);
//       console.log("=== DECODED TOKEN ===", decodedToken);

//       const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
//       console.log("=== EXTRACTED USER ID ===", userId);
//       return userId ? String(userId) : null;
//     } catch (error) {
//       console.error("Error decoding JWT:", error);
//       return null;
//     }
//   }

//   loadCourseStats(): void {
//     if (!this.userId) return;

//     this.isLoading = true;
//     // Convert string userId to number for the API call
//     // const userIdNumber = parseInt(this.userId, 10);
    
//     this.dashboardService.getStatsForHomeBanner(this.userId).subscribe({
//       next: (data: any) => {
//         console.log('Course stats received:', data);
//         this.processCategoryStats(data);
//         this.isLoading = false;
//         this.error = null;
//         this.startAnimation();
//       },
//       error: (error: any) => {
//         console.error('Error loading course stats:', error);
//         this.error = 'Failed to load course statistics';
//         this.isLoading = false;
//         this.setDefaultData();
//         this.startAnimation();
//       }
//     });
//   }

//   processCategoryStats(categoryStats: CategoryStats[]): void {
//     // Reset totals
//     this.totalCourses = 0;
//     this.enrolledCourses = 0;
//     this.inProgressCourses = 0;
//     this.completedCourses = 0;

//     // Calculate totals from all categories
//     categoryStats.forEach((category: CategoryStats) => {
//       this.totalCourses += category.totalCourses || 0;
//       this.enrolledCourses += category.enrolledCourses || 0;
//       this.inProgressCourses += category.inProgressCourses || 0;
//       this.completedCourses += category.completedCourses || 0;
//     });

//     // Prepare course data for the radial chart
//     this.courseData = [
//       {
//         label: 'Total Courses',
//         value: this.totalCourses,
//         maxValue: this.totalCourses,
//         color: '#8B5CF6',
//         percentage: 100
//       },
//       {
//         label: 'Enrolled Courses',
//         value: this.enrolledCourses,
//         maxValue: this.totalCourses,
//         color: '#A855F7',
//         percentage: this.totalCourses > 0 ? (this.enrolledCourses / this.totalCourses) * 100 : 0
//       },
//       {
//         label: 'In Progress',
//         value: this.inProgressCourses,
//         maxValue: this.totalCourses,
//         color: '#C084FC',
//         percentage: this.totalCourses > 0 ? (this.inProgressCourses / this.totalCourses) * 100 : 0
//       },
//       {
//         label: 'Completed',
//         value: this.completedCourses,
//         maxValue: this.totalCourses,
//         color: '#DDD6FE',
//         percentage: this.totalCourses > 0 ? (this.completedCourses / this.totalCourses) * 100 : 0
//       }
//     ];
//   }

//   setDefaultData(): void {
//     // Set default data when API fails or no user ID
//     this.courseData = [
//       {
//         label: 'Total Courses',
//         value: 0,
//         maxValue: 1,
//         color: '#8B5CF6',
//         percentage: 0
//       },
//       {
//         label: 'Enrolled Courses',
//         value: 0,
//         maxValue: 1,
//         color: '#A855F7',
//         percentage: 0
//       },
//       {
//         label: 'In Progress',
//         value: 0,
//         maxValue: 1,
//         color: '#C084FC',
//         percentage: 0
//       },
//       {
//         label: 'Completed',
//         value: 0,
//         maxValue: 1,
//         color: '#DDD6FE',
//         percentage: 0
//       }
//     ];
//   }

  // private startAnimation(): void {
  //   const duration = 2000; // 2 seconds
  //   const startTime = performance.now();

  //   const animate = (currentTime: number) => {
  //     const elapsed = currentTime - startTime;
  //     const progress = Math.min(elapsed / duration, 1);
      
  //     // Easing function for smooth animation
  //     this.animationProgress = this.easeOutCubic(progress);
      
  //     if (progress < 1) {
  //       this.animationFrame = requestAnimationFrame(animate);
  //     } else {
  //       this.emitProgressUpdate();
  //     }
  //   };

  //   this.animationFrame = requestAnimationFrame(animate);
  // }

//   private easeOutCubic(t: number): number {
//     return 1 - Math.pow(1 - t, 3);
//   }

//   getProgressDasharray(percentage: number, radius: number): string {
//     const circumference = 2 * Math.PI * radius;
//     const arcLength = circumference * 0.75; // 270 degrees (3/4 of circle)
//     const progress = (percentage / 100) * this.animationProgress;
//     const dashLength = arcLength * progress;
//     const gapLength = circumference - dashLength;
//     return `${dashLength} ${gapLength}`;
//   }

//   getBackgroundDasharray(radius: number): string {
//     const circumference = 2 * Math.PI * radius;
//     const arcLength = circumference * 0.75; // 270 degrees
//     const gapLength = circumference - arcLength;
//     return `${arcLength} ${gapLength}`;
//   }

//   onSegmentHover(label: string): void {
//     this.hoveredSegment = label;
//   }

//   onSegmentLeave(): void {
//     this.hoveredSegment = null;
//   }

//   getHoveredData(): CourseData | null {
//     return this.courseData.find(item => item.label === this.hoveredSegment) || null;
//   }

//   private emitProgressUpdate(): void {
//     this.progressUpdate.emit({
//       courseData: this.courseData,
//       animationComplete: true,
//       totals: {
//         total: this.totalCourses,
//         enrolled: this.enrolledCourses,
//         inProgress: this.inProgressCourses,
//         completed: this.completedCourses
//       }
//     });
//   }

//   refreshData(): void {
//     if (this.userId) {
//       this.loadCourseStats();
//     }
//   }
// }

import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardServicesService } from '../../../services/homedashboard/dashboard-services.service';
import { jwtDecode } from 'jwt-decode';

interface CourseData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  percentage: number;
}

interface CategoryStats {
  categoryName: string;
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
}

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit, OnDestroy {
  @Output() progressUpdate = new EventEmitter<any>();

  hoveredSegment: string | null = null;

  userId: string | null = null;
  isLoading = true;
  error: string | null = null;

  courseData: CourseData[] = [];

  totalCourses = 0;
  enrolledCourses = 0;
  inProgressCourses = 0;
  completedCourses = 0;

  private sessionStorageKey: string = '';

  constructor(private dashboardService: DashboardServicesService) {}

  ngOnInit(): void {
    this.userId = this.getDecodedUserId();
    if (this.userId) {
      this.sessionStorageKey = `progressBarStats_${this.userId}`;
      // Check session storage first
      const cached = sessionStorage.getItem(this.sessionStorageKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          this.processCategoryStats(parsed);
          this.isLoading = false;
          this.error = null;
          this.emitProgressUpdate();
        } catch (e) {
          // If corrupted, fallback to API
          this.loadCourseStats();
        }
      } else {
        this.loadCourseStats();
      }
      // Listen for logout event (storage event)
      window.addEventListener('storage', this.handleStorageChange);
    } else {
      this.error = 'Unable to retrieve user ID from token';
      this.isLoading = false;
      this.setDefaultData();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange);
  }

  // Listen for logout (token removal)
  handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'authToken' && event.newValue === null) {
      if (this.sessionStorageKey) {
        sessionStorage.removeItem(this.sessionStorageKey);
      }
    }
  };

  getDecodedUserId(): string | null {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found in localStorage.");
        return null;
      }
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
      return userId ? String(userId) : null;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }

  loadCourseStats(): void {
    if (!this.userId) return;
    this.isLoading = true;

    this.dashboardService.getStatsForHomeBanner(this.userId).subscribe({
      next: (data: any) => {
        // Cache to session storage
        sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(data));
        this.processCategoryStats(data);
        this.isLoading = false;
        this.error = null;
        this.emitProgressUpdate();
      },
      error: (error: any) => {
        console.error('Error loading course stats:', error);
        this.error = 'Failed to load course statistics';
        this.isLoading = false;
        this.setDefaultData();
        this.emitProgressUpdate();
      }
    });
  }

  processCategoryStats(categoryStats: CategoryStats[]): void {
    // Reset totals
    this.totalCourses = 0;
    this.enrolledCourses = 0;
    this.inProgressCourses = 0;
    this.completedCourses = 0;
    // Calculate totals from all categories
    categoryStats.forEach((category: CategoryStats) => {
      this.totalCourses += category.totalCourses || 0;
      this.enrolledCourses += category.enrolledCourses || 0;
      this.inProgressCourses += category.inProgressCourses || 0;
      this.completedCourses += category.completedCourses || 0;
    });
    // Prepare course data for the radial chart
    this.courseData = [
      {
        label: 'Total Courses',
        value: this.totalCourses,
        maxValue: this.totalCourses,
        color: '#8B5CF6',
        percentage: this.totalCourses > 0 ? 100 : 0
      },
      {
        label: 'Enrolled Courses',
        value: this.enrolledCourses,
        maxValue: this.totalCourses,
        color: '#A855F7',
        percentage: this.totalCourses > 0 ? (this.enrolledCourses / this.totalCourses) * 100 : 0
      },
      {
        label: 'In Progress',
        value: this.inProgressCourses,
        maxValue: this.totalCourses,
        color: '#C084FC',
        percentage: this.totalCourses > 0 ? (this.inProgressCourses / this.totalCourses) * 100 : 0
      },
      {
        label: 'Completed',
        value: this.completedCourses,
        maxValue: this.totalCourses,
        color: '#DDD6FE',
        percentage: this.totalCourses > 0 ? (this.completedCourses / this.totalCourses) * 100 : 0
      }
    ];
  }

  setDefaultData(): void {
    this.courseData = [
      {
        label: 'Total Courses',
        value: 0,
        maxValue: 1,
        color: '#8B5CF6',
        percentage: 0
      },
      {
        label: 'Enrolled Courses',
        value: 0,
        maxValue: 1,
        color: '#A855F7',
        percentage: 0
      },
      {
        label: 'In Progress',
        value: 0,
        maxValue: 1,
        color: '#C084FC',
        percentage: 0
      },
      {
        label: 'Completed',
        value: 0,
        maxValue: 1,
        color: '#DDD6FE',
        percentage: 0
      }
    ];
  }

  getProgressDasharray(percentage: number, radius: number): string {
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * 0.75; // 270 degrees (3/4 of circle)
    const progress = percentage / 100;
    const dashLength = arcLength * progress;
    const gapLength = circumference - dashLength;
    return `${dashLength} ${gapLength}`;
  }

  getBackgroundDasharray(radius: number): string {
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * 0.75; // 270 degrees
    const gapLength = circumference - arcLength;
    return `${arcLength} ${gapLength}`;
  }

  onSegmentHover(label: string): void {
    this.hoveredSegment = label;
  }

  onSegmentLeave(): void {
    this.hoveredSegment = null;
  }

  getHoveredData(): CourseData | null {
    return this.courseData.find(item => item.label === this.hoveredSegment) || null;
  }

  private emitProgressUpdate(): void {
    this.progressUpdate.emit({
      courseData: this.courseData,
      animationComplete: true,
      totals: {
        total: this.totalCourses,
        enrolled: this.enrolledCourses,
        inProgress: this.inProgressCourses,
        completed: this.completedCourses
      }
    });
  }

  refreshData(): void {
    if (this.userId) {
      // Clear cache and fetch again
      sessionStorage.removeItem(this.sessionStorageKey);
      this.loadCourseStats();
    }
  }
}