// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminDashboardService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OverviewStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  completionRate: number;
  activeUsers: number;
}

export interface UserAnalytics {
  userTrend: { month: string; count: number }[];
  roleDistribution: { role: string; count: number }[];
  lobDistribution: { lob: string; count: number }[];
  genderDistribution: { gender: string; count: number }[];
}

export interface CoursePerformance {
  popularCourses: {
    courseId: string;
    courseName: string;
    enrollments: number;
    completions: number;
    completionRate: number;
  }[];
  categoryPerformance: {
    category: string;
    courseCount: number;
    totalEnrollments: number;
  }[];
  completionTrends: { month: string; completions: number }[];
}

export interface EnrollmentTracking {
  progressBuckets: { [key: string]: number };
  quizStats: {
    status: string;
    count: number;
    averageScore: number;
  }[];
  assignmentStats: {
    status: string;
    count: number;
  }[];
  totalEnrollments: number;
}

export interface ModuleInsights {
  modulesPerCourse: {
    courseId: string;
    courseName: string;
    moduleCount: number;
    totalDuration: number;
  }[];
  moduleCompletionStats: {
    courseId: string;
    videoModulesRead: number;
    docModulesRead: number;
  }[];
  avgWatchTime: {
    courseId: string;
    avgWatchedSeconds: number;
    avgCourseDuration: number;
  }[];
}

export interface SmePanel {
  smeData: {
    smeId: string;
    name: string;
    email: string;
    phone: number;
    coursesAssigned: number;
    coursesUnderReview: number;
    lastActivity: string;
    totalEnrollments: number;
  }[];
  workloadDistribution: {
    range: string;
    count: number;
  }[];
  totalSmes: number;
  avgCoursesPerSme: number;
}

export interface LobInsights {
  lobData: {
    lobId: string;
    lobName: string;
    description: string;
    userCount: number;
    courseCount: number;
    totalEnrollments: number;
    completedEnrollments: number;
    avgCompletionRate: number;
  }[];
  lobEngagement: {
    lobName: string;
    month: string;
    enrollments: number;
  }[];
  totalLobs: number;
}

export interface RecentActivities {
  recentEnrollments: {
    userName: string;
    courseName: string;
    enrolledAt: string;
    progress: number;
  }[];
  recentCompletions: {
    userName: string;
    courseName: string;
    completedAt: string;
  }[];
}



@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiBaseUrl = 'https://localhost:7264';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Add authorization header if required
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }


  
  getOverviewStats(): Observable<OverviewStats> {
    const url = `${this.apiBaseUrl}/api/AdminDashboard/overview`;
    return this.http.get<OverviewStats>(url, { headers: this.getHeaders() });
  }

  getUserAnalytics(): Observable<UserAnalytics> {
    const url = `${this.apiBaseUrl}/api/AdminDashboard/user-analytics`;
    return this.http.get<UserAnalytics>(url, { headers: this.getHeaders() });
  }

  getCoursePerformance(): Observable<CoursePerformance> {
    const url = `${this.apiBaseUrl}/api/AdminDashboard/course-performance`;
    return this.http.get<CoursePerformance>(url, { headers: this.getHeaders() });
  }

  getEnrollmentTracking(): Observable<EnrollmentTracking> {
    const url = `${this.apiBaseUrl}/api/AdminDashboard/enrollment-tracking`;
    return this.http.get<EnrollmentTracking>(url, { headers: this.getHeaders() });
  }

  getModuleInsights(): Observable<ModuleInsights> {
    const url = `${this.apiBaseUrl}/api/AdminDashboard/module-insights`;
    return this.http.get<ModuleInsights>(url, { headers: this.getHeaders() });
  }

  getSmePanel(): Observable<SmePanel> {
    const url = `${this.apiBaseUrl}/api/AdminDashboard/sme-panel`;
    return this.http.get<SmePanel>(url, { headers: this.getHeaders() });
  }

  getLobInsights(): Observable<LobInsights> {
    const url = `${this.apiBaseUrl}/api/AdminDashboard/lob-insights`;
    return this.http.get<LobInsights>(url, { headers: this.getHeaders() });
  }

  getRecentActivities(): Observable<RecentActivities> {
    const url = `${this.apiBaseUrl}/api/AdminDashboard/recent-activities`;
    return this.http.get<RecentActivities>(url, { headers: this.getHeaders() });
  }

  
}