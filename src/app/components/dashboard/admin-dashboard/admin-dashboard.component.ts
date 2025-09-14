// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-admin-dashboard',
// //   imports: [],
// //   templateUrl: './admin-dashboard.component.html',
// //   styleUrl: './admin-dashboard.component.css'
// // })
// // export class AdminDashboardComponent {

// // }

// import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { Chart, ChartConfiguration, registerables } from 'chart.js';
// // import { Component, OnInit } from '@angular/core';
// import { 
//   AdminDashboardService, 
//   OverviewStats, 
//   UserAnalytics, 
//   CoursePerformance, 
//   EnrollmentTracking,
//   ModuleInsights,
//   SmePanel,
//   LobInsights,
//   RecentActivities
// } from '../../../services/admin-dashboard.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin-dashboard',
//   imports: [CommonModule],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.css']
// })


// export class AdminDashboardComponent implements OnInit {
  
//   // Data properties
//   overviewStats: OverviewStats | null = null;
//   userAnalytics: UserAnalytics | null = null;
//   coursePerformance: CoursePerformance | null = null;
//   enrollmentTracking: EnrollmentTracking | null = null;
//   moduleInsights: ModuleInsights | null = null;
//   smePanel: SmePanel | null = null;
//   lobInsights: LobInsights | null = null;
//   recentActivities: RecentActivities | null = null;

//   // Loading states
//   isLoading = {
//     overview: false,
//     userAnalytics: false,
//     coursePerformance: false,
//     enrollmentTracking: false,
//     moduleInsights: false,
//     smePanel: false,
//     lobInsights: false,
//     recentActivities: false
//   };

//   // Active tab for navigation
//   activeTab = 'overview';

//   // Chart options for different visualizations
//   chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//       title: {
//         display: true,
//         text: ''
//       }
//     }
//   };

//   constructor(private dashboardService: AdminDashboardService) {}

//   ngOnInit(): void {
//     this.loadAllData();
//   }

//   loadAllData(): void {
//     this.loadOverviewStats();
//     this.loadUserAnalytics();
//     this.loadCoursePerformance();
//     this.loadEnrollmentTracking();
//     this.loadModuleInsights();
//     this.loadSmePanel();
//     this.loadLobInsights();
//     this.loadRecentActivities();
//   }

//   loadOverviewStats(): void {
//     this.isLoading.overview = true;
//     this.dashboardService.getOverviewStats().subscribe({
//       next: (data) => {
//         this.overviewStats = data;
//         this.isLoading.overview = false;
//       },
//       error: (error) => {
//         console.error('Error loading overview stats:', error);
//         this.isLoading.overview = false;
//       }
//     });
//   }


//   debugUserAnalytics(): void {
//     console.log('=== USER ANALYTICS DEBUG ===');
//     console.log('userAnalytics object:', this.userAnalytics);
//     console.log('userAnalytics type:', typeof this.userAnalytics);
//     console.log('userAnalytics null?', this.userAnalytics === null);
//     console.log('userAnalytics undefined?', this.userAnalytics === undefined);
    
//     if (this.userAnalytics) {
//       console.log('lobDistribution:', this.userAnalytics.lobDistribution);
//       console.log('lobDistribution length:', this.userAnalytics.lobDistribution?.length);
//       console.log('genderDistribution:', this.userAnalytics.genderDistribution);
//       console.log('genderDistribution length:', this.userAnalytics.genderDistribution?.length);
//       console.log('roleDistribution:', this.userAnalytics.roleDistribution);
//       console.log('userTrend:', this.userAnalytics.userTrend);
//     }
//     console.log('activeTab:', this.activeTab);
//     console.log('=== END DEBUG ===');
//   }


//   // loadUserAnalytics(): void {
//   //   this.isLoading.userAnalytics = true;
//   //   this.dashboardService.getUserAnalytics().subscribe({
//   //     next: (data) => {
//   //       this.userAnalytics = data;
//   //       this.isLoading.userAnalytics = false;
//   //     },
//   //     error: (error) => {
//   //       console.error('Error loading user analytics:', error);
//   //       this.isLoading.userAnalytics = false;
//   //     }
//   //   });
//   // }

//   loadUserAnalytics(): void {
//     this.isLoading.userAnalytics = true;
//     console.log('Starting to load user analytics...');
    
//     this.dashboardService.getUserAnalytics().subscribe({
//       next: (data) => {
//         console.log('Raw API response:', data);
//         this.userAnalytics = data;
//         this.isLoading.userAnalytics = false;
        
//         // Call debug method after data is loaded
//         setTimeout(() => {
//           this.debugUserAnalytics();
//         }, 100);
//       },
//       error: (error) => {
//         console.error('Error loading user analytics:', error);
//         this.isLoading.userAnalytics = false;
//       }
//     });
//   }

//   loadCoursePerformance(): void {
//     this.isLoading.coursePerformance = true;
//     this.dashboardService.getCoursePerformance().subscribe({
//       next: (data) => {
//         this.coursePerformance = data;
//         this.isLoading.coursePerformance = false;
//       },
//       error: (error) => {
//         console.error('Error loading course performance:', error);
//         this.isLoading.coursePerformance = false;
//       }
//     });
//   }

//   loadEnrollmentTracking(): void {
//     this.isLoading.enrollmentTracking = true;
//     this.dashboardService.getEnrollmentTracking().subscribe({
//       next: (data) => {
//         this.enrollmentTracking = data;
//         this.isLoading.enrollmentTracking = false;
//       },
//       error: (error) => {
//         console.error('Error loading enrollment tracking:', error);
//         this.isLoading.enrollmentTracking = false;
//       }
//     });
//   }

//   loadModuleInsights(): void {
//     this.isLoading.moduleInsights = true;
//     this.dashboardService.getModuleInsights().subscribe({
//       next: (data) => {
//         this.moduleInsights = data;
//         this.isLoading.moduleInsights = false;
//       },
//       error: (error) => {
//         console.error('Error loading module insights:', error);
//         this.isLoading.moduleInsights = false;
//       }
//     });
//   }

//   loadSmePanel(): void {
//     this.isLoading.smePanel = true;
//     this.dashboardService.getSmePanel().subscribe({
//       next: (data) => {
//         this.smePanel = data;
//         this.isLoading.smePanel = false;
//       },
//       error: (error) => {
//         console.error('Error loading SME panel:', error);
//         this.isLoading.smePanel = false;
//       }
//     });
//   }

//   loadLobInsights(): void {
//     this.isLoading.lobInsights = true;
//     this.dashboardService.getLobInsights().subscribe({
//       next: (data) => {
//         this.lobInsights = data;
//         this.isLoading.lobInsights = false;
//       },
//       error: (error) => {
//         console.error('Error loading LOB insights:', error);
//         this.isLoading.lobInsights = false;
//       }
//     });
//   }

//   loadRecentActivities(): void {
//     this.isLoading.recentActivities = true;
//     this.dashboardService.getRecentActivities().subscribe({
//       next: (data) => {
//         this.recentActivities = data;
//         this.isLoading.recentActivities = false;
//       },
//       error: (error) => {
//         console.error('Error loading recent activities:', error);
//         this.isLoading.recentActivities = false;
//       }
//     });
//   }

//   // Tab navigation
//   setActiveTab(tab: string): void {
//     this.activeTab = tab;
//   }

//   // Helper methods for data processing
//   getProgressBucketsData() {
//     if (!this.enrollmentTracking) return { labels: [], data: [] };
    
//     const buckets = this.enrollmentTracking.progressBuckets;
//     return {
//       labels: Object.keys(buckets),
//       data: Object.values(buckets)
//     };
//   }

//   getUserTrendData() {
//     if (!this.userAnalytics) return { labels: [], data: [] };
    
//     return {
//       labels: this.userAnalytics.userTrend.map(item => item.month),
//       data: this.userAnalytics.userTrend.map(item => item.count)
//     };
//   }

//   getRoleDistributionData() {
//     if (!this.userAnalytics) return { labels: [], data: [] };
    
//     return {
//       labels: this.userAnalytics.roleDistribution.map(item => item.role),
//       data: this.userAnalytics.roleDistribution.map(item => item.count)
//     };
//   }

//   getPopularCoursesData() {
//     if (!this.coursePerformance) return { labels: [], enrollments: [], completions: [] };
    
//     return {
//       labels: this.coursePerformance.popularCourses.map(course => course.courseName),
//       enrollments: this.coursePerformance.popularCourses.map(course => course.enrollments),
//       completions: this.coursePerformance.popularCourses.map(course => course.completions)
//     };
//   }

//   getCompletionTrendsData() {
//     if (!this.coursePerformance) return { labels: [], data: [] };
    
//     return {
//       labels: this.coursePerformance.completionTrends.map(item => item.month),
//       data: this.coursePerformance.completionTrends.map(item => item.completions)
//     };
//   }

//   // Utility methods
//   formatDuration(minutes: number): string {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   }

//   formatDate(dateString: string): string {
//     return new Date(dateString).toLocaleDateString();
//   }

//   getStatusBadgeClass(status: string): string {
//     switch (status.toLowerCase()) {
//       case 'completed':
//         return 'badge-success';
//       case 'in progress':
//         return 'badge-warning';
//       case 'submitted':
//         return 'badge-info';
//       case 'graded':
//         return 'badge-success';
//       default:
//         return 'badge-secondary';
//     }
//   }

//   // Add these methods to your AdminDashboardComponent class

// /**
//  * Calculate percentage for LOB insights
//  * @param count - Individual count
//  * @param lobDistribution - Array of LOB distribution data
//  * @returns Percentage value
//  */
// getPercentage(count: number, lobDistribution: { lob: string; count: number }[] | undefined): number {
//   if (!lobDistribution || lobDistribution.length === 0) {
//     return 0;
//   }
  
//   // Calculate total from all LOB counts
//   const total = lobDistribution.reduce((sum, item) => sum + item.count, 0);
  
//   if (total === 0) {
//     return 0;
//   }
  
//   return Math.round((count / total) * 100);
// }

// /**
//  * Format number to display with proper decimal places
//  * @param value - Number to format
//  * @returns Formatted number string
//  */
// formatNumber(value: number): string {
//   if (value === null || value === undefined) {
//     return '0';
//   }
  
//   // If it's already a whole number, return as is
//   if (value % 1 === 0) {
//     return value.toString();
//   }
  
//   // Otherwise, format to 1 decimal place
//   return value.toFixed(1);
// }

// /**
//  * Calculate percentage for SME panel
//  * @param count - Individual count
//  * @param totalSmes - Total SME count (can be undefined)
//  * @returns Percentage value
//  */
// getSmePercentage(count: number, totalSmes: number | undefined): number {
//   if (!totalSmes || totalSmes === 0) {
//     return 0;
//   }
//   return Math.round((count / totalSmes) * 100);
// }

//   refreshData(): void {
//     this.loadAllData();
//   }
// }

// import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { Chart, ChartConfiguration, registerables } from 'chart.js';
// import { 
//   AdminDashboardService, 
//   OverviewStats, 
//   UserAnalytics, 
//   CoursePerformance, 
//   EnrollmentTracking,
//   ModuleInsights,
//   SmePanel,
//   LobInsights,
//   RecentActivities
// } from '../../../services/admin-dashboard.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin-dashboard',
//   imports: [CommonModule],
//   standalone: true,
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.css']
// })
// export class AdminDashboardComponent implements OnInit, AfterViewInit {
  
//   // ViewChild references for charts
//   @ViewChild('userTrendChart', { static: false }) userTrendChart!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('roleDistributionChart', { static: false }) roleDistributionChart!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('progressDistributionChart', { static: false }) progressDistributionChart!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('completionTrendsChart', { static: false }) completionTrendsChart!: ElementRef<HTMLCanvasElement>;

//   // Chart instances
//   private userTrendChartInstance: Chart | null = null;
//   private roleDistributionChartInstance: Chart | null = null;
//   private progressDistributionChartInstance: Chart | null = null;
//   private completionTrendsChartInstance: Chart | null = null;

//   // Data properties
//   overviewStats: OverviewStats | null = null;
//   userAnalytics: UserAnalytics | null = null;
//   coursePerformance: CoursePerformance | null = null;
//   enrollmentTracking: EnrollmentTracking | null = null;
//   moduleInsights: ModuleInsights | null = null;
//   smePanel: SmePanel | null = null;
//   lobInsights: LobInsights | null = null;
//   recentActivities: RecentActivities | null = null;

//   // Loading states
//   isLoading = {
//     overview: false,
//     userAnalytics: false,
//     coursePerformance: false,
//     enrollmentTracking: false,
//     moduleInsights: false,
//     smePanel: false,
//     lobInsights: false,
//     recentActivities: false
//   };

//   // Active tab for navigation
//   activeTab = 'overview';

//   constructor(private dashboardService: AdminDashboardService) {
//     // Register Chart.js components
//     Chart.register(...registerables);
//   }


  
//   ngOnInit(): void {
//     this.loadAllData();
  
//   }


//   // loadUserAnalytics() {
//   //   this.dashboardService.getUserAnalytics().subscribe(
//   //     (data: UserAnalytics) => {
//   //       console.log('User Analytics:', data);
//   //       this.renderUserRegistrationChart(data.userTrend);
//   //       this.renderRoleDistributionChart(data.roleDistribution);
//   //     },
//   //     (error: any) => {
//   //       console.error('Error fetching user analytics:', error);
//   //     }
//   //   );
//   // }

//   renderUserRegistrationChart(userTrend: { month: string; count: number }[]) {
//     const ctx = document.getElementById('userRegistrationChart') as HTMLCanvasElement;
//     if (!ctx) return;

//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: userTrend.map(x => x.month),
//         datasets: [{
//           label: 'Registrations',
//           data: userTrend.map(x => x.count),
//           borderColor: 'rgba(102, 126, 234, 1)',
//           backgroundColor: 'rgba(102, 126, 234, 0.3)',
//           fill: true,
//           tension: 0.4
//         }]
//       }
//     });
//   }

//   renderRoleDistributionChart(roleDistribution: { role: string; count: number }[]) {
//     const ctx = document.getElementById('roleDistributionChart') as HTMLCanvasElement;
//     if (!ctx) return;

//     new Chart(ctx, {
//       type: 'pie',
//       data: {
//         labels: roleDistribution.map(x => x.role),
//         datasets: [{
//           data: roleDistribution.map(x => x.count),
//           backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8']
//         }]
//       }
//     });
//   }

//   ngAfterViewInit(): void {
//     // Initialize charts after view is ready
//     setTimeout(() => {
//       this.initializeCharts();
//     }, 100);
//   }

//   loadAllData(): void {
//     this.loadOverviewStats();
//     this.loadUserAnalytics();
//     this.loadCoursePerformance();
//     this.loadEnrollmentTracking();
//     this.loadModuleInsights();
//     this.loadSmePanel();
//     this.loadLobInsights();
//     this.loadRecentActivities();
//   }

//   loadOverviewStats(): void {
//     this.isLoading.overview = true;
//     this.dashboardService.getOverviewStats().subscribe({
//       next: (data) => {
//         this.overviewStats = data;
//         this.isLoading.overview = false;
//       },
//       error: (error) => {
//         console.error('Error loading overview stats:', error);
//         this.isLoading.overview = false;
//       }
//     });
//   }

//   loadUserAnalytics(): void {
//     this.isLoading.userAnalytics = true;
//     console.log('Starting to load user analytics...');
    
//     this.dashboardService.getUserAnalytics().subscribe({
//       next: (data) => {
//         console.log('Raw API response:', data);
//         this.userAnalytics = data;
//         this.isLoading.userAnalytics = false;
        
//         // Update charts after data is loaded
//         setTimeout(() => {
//           this.updateUserCharts();
//         }, 100);
//       },
//       error: (error) => {
//         console.error('Error loading user analytics:', error);
//         this.isLoading.userAnalytics = false;
//       }
//     });
//   }

//   loadCoursePerformance(): void {
//     this.isLoading.coursePerformance = true;
//     this.dashboardService.getCoursePerformance().subscribe({
//       next: (data) => {
//         this.coursePerformance = data;
//         this.isLoading.coursePerformance = false;
        
//         // Update completion trends chart
//         setTimeout(() => {
//           this.updateCompletionTrendsChart();
//         }, 100);
//       },
//       error: (error) => {
//         console.error('Error loading course performance:', error);
//         this.isLoading.coursePerformance = false;
//       }
//     });
//   }

//   loadEnrollmentTracking(): void {
//     this.isLoading.enrollmentTracking = true;
//     this.dashboardService.getEnrollmentTracking().subscribe({
//       next: (data) => {
//         this.enrollmentTracking = data;
//         this.isLoading.enrollmentTracking = false;
        
//         // Update progress distribution chart
//         setTimeout(() => {
//           this.updateProgressDistributionChart();
//         }, 100);
//       },
//       error: (error) => {
//         console.error('Error loading enrollment tracking:', error);
//         this.isLoading.enrollmentTracking = false;
//       }
//     });
//   }

//   loadModuleInsights(): void {
//     this.isLoading.moduleInsights = true;
//     this.dashboardService.getModuleInsights().subscribe({
//       next: (data) => {
//         this.moduleInsights = data;
//         this.isLoading.moduleInsights = false;
//       },
//       error: (error) => {
//         console.error('Error loading module insights:', error);
//         this.isLoading.moduleInsights = false;
//       }
//     });
//   }

//   loadSmePanel(): void {
//     this.isLoading.smePanel = true;
//     this.dashboardService.getSmePanel().subscribe({
//       next: (data) => {
//         this.smePanel = data;
//         this.isLoading.smePanel = false;
//       },
//       error: (error) => {
//         console.error('Error loading SME panel:', error);
//         this.isLoading.smePanel = false;
//       }
//     });
//   }

//   loadLobInsights(): void {
//     this.isLoading.lobInsights = true;
//     this.dashboardService.getLobInsights().subscribe({
//       next: (data) => {
//         this.lobInsights = data;
//         this.isLoading.lobInsights = false;
//       },
//       error: (error) => {
//         console.error('Error loading LOB insights:', error);
//         this.isLoading.lobInsights = false;
//       }
//     });
//   }

//   loadRecentActivities(): void {
//     this.isLoading.recentActivities = true;
//     this.dashboardService.getRecentActivities().subscribe({
//       next: (data) => {
//         this.recentActivities = data;
//         this.isLoading.recentActivities = false;
//       },
//       error: (error) => {
//         console.error('Error loading recent activities:', error);
//         this.isLoading.recentActivities = false;
//       }
//     });
//   }

//   // Chart initialization methods
//   initializeCharts(): void {
//     this.initializeUserTrendChart();
//     this.initializeRoleDistributionChart();
//     this.initializeProgressDistributionChart();
//     this.initializeCompletionTrendsChart();
//   }

//   initializeUserTrendChart(): void {
//     if (this.userTrendChart?.nativeElement) {
//       const ctx = this.userTrendChart.nativeElement.getContext('2d');
//       if (ctx) {
//         this.userTrendChartInstance = new Chart(ctx, {
//           type: 'line',
//           data: {
//             labels: [],
//             datasets: [{
//               label: 'User Registrations',
//               data: [],
//               borderColor: 'rgb(75, 192, 192)',
//               backgroundColor: 'rgba(75, 192, 192, 0.1)',
//               tension: 0.4,
//               fill: true
//             }]
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//               title: {
//                 display: true,
//                 text: 'Monthly User Registration Trend'
//               },
//               legend: {
//                 display: true,
//                 position: 'top'
//               }
//             },
//             scales: {
//               y: {
//                 beginAtZero: true,
//                 ticks: {
//                   stepSize: 1
//                 }
//               }
//             }
//           }
//         });
//       }
//     }
//   }

//   initializeRoleDistributionChart(): void {
//     if (this.roleDistributionChart?.nativeElement) {
//       const ctx = this.roleDistributionChart.nativeElement.getContext('2d');
//       if (ctx) {
//         this.roleDistributionChartInstance = new Chart(ctx, {
//           type: 'doughnut',
//           data: {
//             labels: [],
//             datasets: [{
//               data: [],
//               backgroundColor: [
//                 '#FF6384',
//                 '#36A2EB',
//                 '#FFCE56',
//                 '#4BC0C0',
//                 '#9966FF',
//                 '#FF9F40'
//               ],
//               borderWidth: 2,
//               borderColor: '#fff'
//             }]
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//               title: {
//                 display: true,
//                 text: 'User Role Distribution'
//               },
//               legend: {
//                 display: true,
//                 position: 'bottom'
//               }
//             }
//           }
//         });
//       }
//     }
//   }

//   initializeProgressDistributionChart(): void {
//     if (this.progressDistributionChart?.nativeElement) {
//       const ctx = this.progressDistributionChart.nativeElement.getContext('2d');
//       if (ctx) {
//         this.progressDistributionChartInstance = new Chart(ctx, {
//           type: 'pie',
//           data: {
//             labels: [],
//             datasets: [{
//               data: [],
//               backgroundColor: [
//                 '#FF6384',
//                 '#36A2EB',
//                 '#FFCE56',
//                 '#4BC0C0',
//                 '#9966FF',
//                 '#FF9F40',
//                 '#FF6B6B',
//                 '#4ECDC4'
//               ],
//               borderWidth: 2,
//               borderColor: '#fff'
//             }]
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//               title: {
//                 display: true,
//                 text: 'Enrollment Progress Distribution'
//               },
//               legend: {
//                 display: true,
//                 position: 'bottom'
//               }
//             }
//           }
//         });
//       }
//     }
//   }

//   initializeCompletionTrendsChart(): void {
//     if (this.completionTrendsChart?.nativeElement) {
//       const ctx = this.completionTrendsChart.nativeElement.getContext('2d');
//       if (ctx) {
//         this.completionTrendsChartInstance = new Chart(ctx, {
//           type: 'bar',
//           data: {
//             labels: [],
//             datasets: [{
//               label: 'Course Completions',
//               data: [],
//               backgroundColor: 'rgba(54, 162, 235, 0.8)',
//               borderColor: 'rgba(54, 162, 235, 1)',
//               borderWidth: 1
//             }]
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//               title: {
//                 display: true,
//                 text: 'Monthly Course Completion Trends'
//               },
//               legend: {
//                 display: true,
//                 position: 'top'
//               }
//             },
//             scales: {
//               y: {
//                 beginAtZero: true,
//                 ticks: {
//                   stepSize: 1
//                 }
//               }
//             }
//           }
//         });
//       }
//     }
//   }

//   // Chart update methods
//   updateUserCharts(): void {
//     this.updateUserTrendChart();
//     this.updateRoleDistributionChart();
//   }

//   updateUserTrendChart(): void {
//     if (this.userTrendChartInstance && this.userAnalytics?.userTrend) {
//       const trendData = this.getUserTrendData();
//       this.userTrendChartInstance.data.labels = trendData.labels;
//       this.userTrendChartInstance.data.datasets[0].data = trendData.data;
//       this.userTrendChartInstance.update();
//     }
//   }

//   updateRoleDistributionChart(): void {
//     if (this.roleDistributionChartInstance && this.userAnalytics?.roleDistribution) {
//       const roleData = this.getRoleDistributionData();
//       this.roleDistributionChartInstance.data.labels = roleData.labels;
//       this.roleDistributionChartInstance.data.datasets[0].data = roleData.data;
//       this.roleDistributionChartInstance.update();
//     }
//   }

//   updateProgressDistributionChart(): void {
//     if (this.progressDistributionChartInstance && this.enrollmentTracking?.progressBuckets) {
//       const progressData = this.getProgressBucketsData();
//       this.progressDistributionChartInstance.data.labels = progressData.labels;
//       this.progressDistributionChartInstance.data.datasets[0].data = progressData.data;
//       this.progressDistributionChartInstance.update();
//     }
//   }

//   updateCompletionTrendsChart(): void {
//     if (this.completionTrendsChartInstance && this.coursePerformance?.completionTrends) {
//       const completionData = this.getCompletionTrendsData();
//       this.completionTrendsChartInstance.data.labels = completionData.labels;
//       this.completionTrendsChartInstance.data.datasets[0].data = completionData.data;
//       this.completionTrendsChartInstance.update();
//     }
//   }

//   // Tab navigation with chart updates
//   setActiveTab(tab: string): void {
//     this.activeTab = tab;
    
//     // Update charts when switching to relevant tabs
//     setTimeout(() => {
//       switch (tab) {
//         case 'users':
//           if (this.userAnalytics) {
//             this.updateUserCharts();
//           }
//           break;
//         case 'courses':
//           if (this.coursePerformance) {
//             this.updateCompletionTrendsChart();
//           }
//           break;
//         case 'enrollments':
//           if (this.enrollmentTracking) {
//             this.updateProgressDistributionChart();
//           }
//           break;
//       }
//     }, 100);
//   }

//   // Helper methods for data processing
//   getProgressBucketsData() {
//     if (!this.enrollmentTracking?.progressBuckets) return { labels: [], data: [] };
    
//     const buckets = this.enrollmentTracking.progressBuckets;
//     return {
//       labels: Object.keys(buckets),
//       data: Object.values(buckets)
//     };
//   }

//   getUserTrendData() {
//     if (!this.userAnalytics?.userTrend) return { labels: [], data: [] };
    
//     return {
//       labels: this.userAnalytics.userTrend.map(item => item.month),
//       data: this.userAnalytics.userTrend.map(item => item.count)
//     };
//   }

//   getRoleDistributionData() {
//     if (!this.userAnalytics?.roleDistribution) return { labels: [], data: [] };
    
//     return {
//       labels: this.userAnalytics.roleDistribution.map(item => item.role),
//       data: this.userAnalytics.roleDistribution.map(item => item.count)
//     };
//   }

//   getPopularCoursesData() {
//     if (!this.coursePerformance?.popularCourses) return { labels: [], enrollments: [], completions: [] };
    
//     return {
//       labels: this.coursePerformance.popularCourses.map(course => course.courseName),
//       enrollments: this.coursePerformance.popularCourses.map(course => course.enrollments),
//       completions: this.coursePerformance.popularCourses.map(course => course.completions)
//     };
//   }

//   getCompletionTrendsData() {
//     if (!this.coursePerformance?.completionTrends) return { labels: [], data: [] };
    
//     return {
//       labels: this.coursePerformance.completionTrends.map(item => item.month),
//       data: this.coursePerformance.completionTrends.map(item => item.completions)
//     };
//   }

//   // Debug method
//   debugUserAnalytics(): void {
//     console.log('=== USER ANALYTICS DEBUG ===');
//     console.log('userAnalytics object:', this.userAnalytics);
//     console.log('userAnalytics type:', typeof this.userAnalytics);
//     console.log('userAnalytics null?', this.userAnalytics === null);
//     console.log('userAnalytics undefined?', this.userAnalytics === undefined);
    
//     if (this.userAnalytics) {
//       console.log('lobDistribution:', this.userAnalytics.lobDistribution);
//       console.log('lobDistribution length:', this.userAnalytics.lobDistribution?.length);
//       console.log('genderDistribution:', this.userAnalytics.genderDistribution);
//       console.log('genderDistribution length:', this.userAnalytics.genderDistribution?.length);
//       console.log('roleDistribution:', this.userAnalytics.roleDistribution);
//       console.log('userTrend:', this.userAnalytics.userTrend);
//     }
//     console.log('activeTab:', this.activeTab);
//     console.log('=== END DEBUG ===');
//   }

//   // Utility methods
//   formatDuration(minutes: number): string {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
//   }

//   formatDate(dateString: string): string {
//     return new Date(dateString).toLocaleDateString();
//   }

//   getStatusBadgeClass(status: string): string {
//     switch (status.toLowerCase()) {
//       case 'completed':
//         return 'badge-success';
//       case 'in progress':
//         return 'badge-warning';
//       case 'submitted':
//         return 'badge-info';
//       case 'graded':
//         return 'badge-success';
//       default:
//         return 'badge-secondary';
//     }
//   }

//   /**
//    * Calculate percentage for LOB insights
//    */
//   getPercentage(count: number, lobDistribution: { lob: string; count: number }[] | undefined): number {
//     if (!lobDistribution || lobDistribution.length === 0) {
//       return 0;
//     }
    
//     const total = lobDistribution.reduce((sum, item) => sum + item.count, 0);
    
//     if (total === 0) {
//       return 0;
//     }
    
//     return Math.round((count / total) * 100);
//   }

//   /**
//    * Format number to display with proper decimal places
//    */
//   formatNumber(value: number): string {
//     if (value === null || value === undefined) {
//       return '0';
//     }
    
//     if (value % 1 === 0) {
//       return value.toString();
//     }
    
//     return value.toFixed(1);
//   }

//   /**
//    * Calculate percentage for SME panel
//    */
//   getSmePercentage(count: number, totalSmes: number | undefined): number {
//     if (!totalSmes || totalSmes === 0) {
//       return 0;
//     }
//     return Math.round((count / totalSmes) * 100);
//   }

//   refreshData(): void {
//     this.loadAllData();
//   }

//   // Cleanup method
//   ngOnDestroy(): void {
//     // Destroy chart instances to prevent memory leaks
//     if (this.userTrendChartInstance) {
//       this.userTrendChartInstance.destroy();
//     }
//     if (this.roleDistributionChartInstance) {
//       this.roleDistributionChartInstance.destroy();
//     }
//     if (this.progressDistributionChartInstance) {
//       this.progressDistributionChartInstance.destroy();
//     }
//     if (this.completionTrendsChartInstance) {
//       this.completionTrendsChartInstance.destroy();
//     }
//   }
// }


import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { 
  AdminDashboardService, 
  OverviewStats, 
  UserAnalytics, 
  CoursePerformance, 
  EnrollmentTracking,
  ModuleInsights,
  SmePanel,
  LobInsights,
  RecentActivities
} from '../../../services/admin-dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // ViewChild references for charts
  @ViewChild('userTrendChart', { static: false }) userTrendChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('roleDistributionChart', { static: false }) roleDistributionChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('progressDistributionChart', { static: false }) progressDistributionChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('completionTrendsChart', { static: false }) completionTrendsChart!: ElementRef<HTMLCanvasElement>;

  // Chart instances
  private userTrendChartInstance: Chart | null = null;
  private roleDistributionChartInstance: Chart | null = null;
  private progressDistributionChartInstance: Chart | null = null;
  private completionTrendsChartInstance: Chart | null = null;

  // Data properties
  overviewStats: OverviewStats | null = null;
  userAnalytics: UserAnalytics | null = null;
  coursePerformance: CoursePerformance | null = null;
  enrollmentTracking: EnrollmentTracking | null = null;
  moduleInsights: ModuleInsights | null = null;
  smePanel: SmePanel | null = null;
  lobInsights: LobInsights | null = null;
  recentActivities: RecentActivities | null = null;

  // Loading states
  isLoading = {
    overview: false,
    userAnalytics: false,
    coursePerformance: false,
    enrollmentTracking: false,
    moduleInsights: false,
    smePanel: false,
    lobInsights: false,
    recentActivities: false
  };

  // Active tab for navigation
  activeTab = 'overview';
  private viewInitialized = false;

  constructor(private dashboardService: AdminDashboardService) {
    // Register Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    console.log('View initialized');
    
    // Initialize charts after view is ready
    setTimeout(() => {
      this.initializeAllCharts();
    }, 100);
  }

  loadAllData(): void {
    this.loadOverviewStats();
    this.loadUserAnalytics();
    this.loadCoursePerformance();
    this.loadEnrollmentTracking();
    this.loadModuleInsights();
    this.loadSmePanel();
    this.loadLobInsights();
    this.loadRecentActivities();
  }

  loadUserAnalytics(): void {
    this.isLoading.userAnalytics = true;
    console.log('Loading user analytics...');
    
    this.dashboardService.getUserAnalytics().subscribe({
      next: (data) => {
        console.log('User analytics loaded:', data);
        this.userAnalytics = data;
        this.isLoading.userAnalytics = false;
        
        // Update charts if view is initialized and we're on users tab
        if (this.viewInitialized) {
          setTimeout(() => {
            if (this.activeTab === 'users') {
              this.updateUserCharts();
            }
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error loading user analytics:', error);
        this.isLoading.userAnalytics = false;
      }
    });
  }

  loadOverviewStats(): void {
    this.isLoading.overview = true;
    this.dashboardService.getOverviewStats().subscribe({
      next: (data) => {
        this.overviewStats = data;
        this.isLoading.overview = false;
      },
      error: (error) => {
        console.error('Error loading overview stats:', error);
        this.isLoading.overview = false;
      }
    });
  }

  loadCoursePerformance(): void {
    this.isLoading.coursePerformance = true;
    this.dashboardService.getCoursePerformance().subscribe({
      next: (data) => {
        this.coursePerformance = data;
        this.isLoading.coursePerformance = false;
        
        if (this.viewInitialized && this.activeTab === 'courses') {
          setTimeout(() => {
            this.updateCompletionTrendsChart();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error loading course performance:', error);
        this.isLoading.coursePerformance = false;
      }
    });
  }

  loadEnrollmentTracking(): void {
    this.isLoading.enrollmentTracking = true;
    this.dashboardService.getEnrollmentTracking().subscribe({
      next: (data) => {
        this.enrollmentTracking = data;
        this.isLoading.enrollmentTracking = false;
        
        if (this.viewInitialized && this.activeTab === 'enrollments') {
          setTimeout(() => {
            this.updateProgressDistributionChart();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error loading enrollment tracking:', error);
        this.isLoading.enrollmentTracking = false;
      }
    });
  }

  loadModuleInsights(): void {
    this.isLoading.moduleInsights = true;
    this.dashboardService.getModuleInsights().subscribe({
      next: (data) => {
        this.moduleInsights = data;
        this.isLoading.moduleInsights = false;
      },
      error: (error) => {
        console.error('Error loading module insights:', error);
        this.isLoading.moduleInsights = false;
      }
    });
  }

  loadSmePanel(): void {
    this.isLoading.smePanel = true;
    this.dashboardService.getSmePanel().subscribe({
      next: (data) => {
        this.smePanel = data;
        this.isLoading.smePanel = false;
      },
      error: (error) => {
        console.error('Error loading SME panel:', error);
        this.isLoading.smePanel = false;
      }
    });
  }

  loadLobInsights(): void {
    this.isLoading.lobInsights = true;
    this.dashboardService.getLobInsights().subscribe({
      next: (data) => {
        this.lobInsights = data;
        this.isLoading.lobInsights = false;
      },
      error: (error) => {
        console.error('Error loading LOB insights:', error);
        this.isLoading.lobInsights = false;
      }
    });
  }

  loadRecentActivities(): void {
    this.isLoading.recentActivities = true;
    this.dashboardService.getRecentActivities().subscribe({
      next: (data) => {
        this.recentActivities = data;
        this.isLoading.recentActivities = false;
      },
      error: (error) => {
        console.error('Error loading recent activities:', error);
        this.isLoading.recentActivities = false;
      }
    });
  }

  // Chart initialization methods
  initializeAllCharts(): void {
    console.log('Initializing all charts...');
    this.initializeUserTrendChart();
    this.initializeRoleDistributionChart();
    this.initializeProgressDistributionChart();
    this.initializeCompletionTrendsChart();
  }

  initializeUserTrendChart(): void {
    console.log('Initializing user trend chart...');
    console.log('Canvas element:', this.userTrendChart?.nativeElement);
    
    if (this.userTrendChart?.nativeElement) {
      const ctx = this.userTrendChart.nativeElement.getContext('2d');
      if (ctx) {
        // Destroy existing chart if it exists
        if (this.userTrendChartInstance) {
          this.userTrendChartInstance.destroy();
        }

        this.userTrendChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'User Registrations',
              data: [],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Monthly User Registration Trend'
              },
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
        console.log('User trend chart created:', this.userTrendChartInstance);
      }
    } else {
      console.log('User trend chart canvas not found');
    }
  }

  initializeRoleDistributionChart(): void {
    console.log('Initializing role distribution chart...');
    console.log('Canvas element:', this.roleDistributionChart?.nativeElement);
    
    if (this.roleDistributionChart?.nativeElement) {
      const ctx = this.roleDistributionChart.nativeElement.getContext('2d');
      if (ctx) {
        // Destroy existing chart if it exists
        if (this.roleDistributionChartInstance) {
          this.roleDistributionChartInstance.destroy();
        }

        this.roleDistributionChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40'
              ],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'User Role Distribution'
              },
              legend: {
                display: true,
                position: 'bottom'
              }
            }
          }
        });
        console.log('Role distribution chart created:', this.roleDistributionChartInstance);
      }
    } else {
      console.log('Role distribution chart canvas not found');
    }
  }

  initializeProgressDistributionChart(): void {
    if (this.progressDistributionChart?.nativeElement) {
      const ctx = this.progressDistributionChart.nativeElement.getContext('2d');
      if (ctx) {
        if (this.progressDistributionChartInstance) {
          this.progressDistributionChartInstance.destroy();
        }

        this.progressDistributionChartInstance = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6B6B',
                '#4ECDC4'
              ],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Enrollment Progress Distribution'
              },
              legend: {
                display: true,
                position: 'bottom'
              }
            }
          }
        });
      }
    }
  }

  initializeCompletionTrendsChart(): void {
    if (this.completionTrendsChart?.nativeElement) {
      const ctx = this.completionTrendsChart.nativeElement.getContext('2d');
      if (ctx) {
        if (this.completionTrendsChartInstance) {
          this.completionTrendsChartInstance.destroy();
        }

        this.completionTrendsChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [],
            datasets: [{
              label: 'Course Completions',
              data: [],
              backgroundColor: 'rgba(54, 162, 235, 0.8)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Monthly Course Completion Trends'
              },
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }
    }
  }

  // Chart update methods
  updateUserCharts(): void {
    console.log('Updating user charts...');
    console.log('User analytics data:', this.userAnalytics);
    this.updateUserTrendChart();
    this.updateRoleDistributionChart();
  }

  updateUserTrendChart(): void {
    console.log('Updating user trend chart...');
    console.log('Chart instance:', this.userTrendChartInstance);
    console.log('User trend data:', this.userAnalytics?.userTrend);
    
    if (this.userTrendChartInstance && this.userAnalytics?.userTrend) {
      const trendData = this.getUserTrendData();
      console.log('Processed trend data:', trendData);
      
      this.userTrendChartInstance.data.labels = trendData.labels;
      this.userTrendChartInstance.data.datasets[0].data = trendData.data;
      this.userTrendChartInstance.update();
      console.log('User trend chart updated');
    } else {
      console.log('Cannot update user trend chart - missing chart instance or data');
    }
  }

  updateRoleDistributionChart(): void {
    console.log('Updating role distribution chart...');
    console.log('Chart instance:', this.roleDistributionChartInstance);
    console.log('Role distribution data:', this.userAnalytics?.roleDistribution);
    
    if (this.roleDistributionChartInstance && this.userAnalytics?.roleDistribution) {
      const roleData = this.getRoleDistributionData();
      console.log('Processed role data:', roleData);
      
      this.roleDistributionChartInstance.data.labels = roleData.labels;
      this.roleDistributionChartInstance.data.datasets[0].data = roleData.data;
      this.roleDistributionChartInstance.update();
      console.log('Role distribution chart updated');
    } else {
      console.log('Cannot update role distribution chart - missing chart instance or data');
    }
  }

  updateProgressDistributionChart(): void {
    if (this.progressDistributionChartInstance && this.enrollmentTracking?.progressBuckets) {
      const progressData = this.getProgressBucketsData();
      this.progressDistributionChartInstance.data.labels = progressData.labels;
      this.progressDistributionChartInstance.data.datasets[0].data = progressData.data;
      this.progressDistributionChartInstance.update();
    }
  }

  updateCompletionTrendsChart(): void {
    if (this.completionTrendsChartInstance && this.coursePerformance?.completionTrends) {
      const completionData = this.getCompletionTrendsData();
      this.completionTrendsChartInstance.data.labels = completionData.labels;
      this.completionTrendsChartInstance.data.datasets[0].data = completionData.data;
      this.completionTrendsChartInstance.update();
    }
  }

  // Tab navigation with chart updates
  setActiveTab(tab: string): void {
    console.log('Setting active tab:', tab);
    this.activeTab = tab;
    
    // Ensure charts are initialized and updated when switching tabs
    setTimeout(() => {
      switch (tab) {
        case 'users':
          console.log('Switching to users tab');
          this.initializeUserTrendChart();
          this.initializeRoleDistributionChart();
          if (this.userAnalytics) {
            setTimeout(() => this.updateUserCharts(), 100);
          }
          break;
        case 'courses':
          this.initializeCompletionTrendsChart();
          if (this.coursePerformance) {
            setTimeout(() => this.updateCompletionTrendsChart(), 100);
          }
          break;
        case 'enrollments':
          this.initializeProgressDistributionChart();
          if (this.enrollmentTracking) {
            setTimeout(() => this.updateProgressDistributionChart(), 100);
          }
          break;
      }
    }, 100);
  }

  // Helper methods for data processing
  getProgressBucketsData() {
    if (!this.enrollmentTracking?.progressBuckets) return { labels: [], data: [] };
    
    const buckets = this.enrollmentTracking.progressBuckets;
    return {
      labels: Object.keys(buckets),
      data: Object.values(buckets)
    };
  }

  getUserTrendData() {
    if (!this.userAnalytics?.userTrend) return { labels: [], data: [] };
    
    return {
      labels: this.userAnalytics.userTrend.map(item => item.month),
      data: this.userAnalytics.userTrend.map(item => item.count)
    };
  }

  getRoleDistributionData() {
    if (!this.userAnalytics?.roleDistribution) return { labels: [], data: [] };
    
    return {
      labels: this.userAnalytics.roleDistribution.map(item => item.role),
      data: this.userAnalytics.roleDistribution.map(item => item.count)
    };
  }

  getPopularCoursesData() {
    if (!this.coursePerformance?.popularCourses) return { labels: [], enrollments: [], completions: [] };
    
    return {
      labels: this.coursePerformance.popularCourses.map(course => course.courseName),
      enrollments: this.coursePerformance.popularCourses.map(course => course.enrollments),
      completions: this.coursePerformance.popularCourses.map(course => course.completions)
    };
  }

  getCompletionTrendsData() {
    if (!this.coursePerformance?.completionTrends) return { labels: [], data: [] };
    
    return {
      labels: this.coursePerformance.completionTrends.map(item => item.month),
      data: this.coursePerformance.completionTrends.map(item => item.completions)
    };
  }

  // Debug method
  debugUserAnalytics(): void {
    console.log('=== USER ANALYTICS DEBUG ===');
    console.log('userAnalytics object:', this.userAnalytics);
    console.log('userAnalytics type:', typeof this.userAnalytics);
    console.log('userAnalytics null?', this.userAnalytics === null);
    console.log('userAnalytics undefined?', this.userAnalytics === undefined);
    
    if (this.userAnalytics) {
      console.log('lobDistribution:', this.userAnalytics.lobDistribution);
      console.log('lobDistribution length:', this.userAnalytics.lobDistribution?.length);
      console.log('genderDistribution:', this.userAnalytics.genderDistribution);
      console.log('genderDistribution length:', this.userAnalytics.genderDistribution?.length);
      console.log('roleDistribution:', this.userAnalytics.roleDistribution);
      console.log('userTrend:', this.userAnalytics.userTrend);
    }
    console.log('activeTab:', this.activeTab);
    console.log('viewInitialized:', this.viewInitialized);
    console.log('=== END DEBUG ===');
  }

  // Utility methods
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge-success';
      case 'in progress':
        return 'badge-warning';
      case 'submitted':
        return 'badge-info';
      case 'graded':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  }

  getPercentage(count: number, lobDistribution: { lob: string; count: number }[] | undefined): number {
    if (!lobDistribution || lobDistribution.length === 0) {
      return 0;
    }
    
    const total = lobDistribution.reduce((sum, item) => sum + item.count, 0);
    
    if (total === 0) {
      return 0;
    }
    
    return Math.round((count / total) * 100);
  }

  formatNumber(value: number): string {
    if (value === null || value === undefined) {
      return '0';
    }
    
    if (value % 1 === 0) {
      return value.toString();
    }
    
    return value.toFixed(1);
  }

  getSmePercentage(count: number, totalSmes: number | undefined): number {
    if (!totalSmes || totalSmes === 0) {
      return 0;
    }
    return Math.round((count / totalSmes) * 100);
  }

  refreshData(): void {
    this.loadAllData();
  }

  // Cleanup method
  ngOnDestroy(): void {
    // Destroy chart instances to prevent memory leaks
    if (this.userTrendChartInstance) {
      this.userTrendChartInstance.destroy();
    }
    if (this.roleDistributionChartInstance) {
      this.roleDistributionChartInstance.destroy();
    }
    if (this.progressDistributionChartInstance) {
      this.progressDistributionChartInstance.destroy();
    }
    if (this.completionTrendsChartInstance) {
      this.completionTrendsChartInstance.destroy();
    }
  }
}