// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { UserreportService } from '../../../services/Report/userreport.service';

// @Component({
//   selector: 'app-downlaod-report',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './downlaod-report.component.html',
//   styleUrl: './downlaod-report.component.css'
// })
// export class DownlaodReportComponent {
//   userEmail: string = '';
//   userReport: any = null;
//   isLoading: boolean = false;
//   errorMessage: string = '';
//   currentDate: string = new Date().toLocaleDateString();

//   constructor(private userReportService: UserreportService) {}

//   generateReport() {
//     if (!this.userEmail || !this.isValidEmail(this.userEmail)) {
//       this.errorMessage = 'Please enter a valid email address';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';
//     this.userReport = null;

//     this.userReportService.getUserAnalyticsByEmail(this.userEmail).subscribe({
//       next: (data) => {
//         this.userReport = data;
//         this.isLoading = false;
//       },
//       error: (error) => {
//         this.errorMessage = error.status === 404 ? 'User not found with this email' : 'Failed to fetch report. Please try again.';
//         this.isLoading = false;
//       }
//     });
//   }

//   downloadReport() {
//     if (!this.userReport) return;

//     const reportContent = this.generateReportContent();
//     const blob = new Blob([reportContent], { type: 'text/html' });
//     const url = window.URL.createObjectURL(blob);
    
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `user-report-${this.userEmail.replace('@', '-at-')}.html`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   }

//   private generateReportContent(): string {
//     const currentDate = new Date().toLocaleDateString();
//     return `
// <!DOCTYPE html>
// <html>
// <head>
//     <title>User Analytics Report</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
//         .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; }
//         .section { margin: 15px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
//         .metric { display: flex; justify-content: space-between; margin: 8px 0; }
//         .metric-label { font-weight: bold; }
//         .metric-value { color: #007bff; }
//         .progress-bar { width: 100%; height: 20px; background-color: #f0f0f0; border-radius: 10px; overflow: hidden; }
//         .progress-fill { height: 100%; background-color: #28a745; transition: width 0.3s; }
//         .status-active { color: #28a745; font-weight: bold; }
//         .status-inactive { color: #dc3545; font-weight: bold; }
//     </style>
// </head>
// <body>
//     <div class="header">
//         <h1>User Analytics Report</h1>
//         <p>Generated on: ${currentDate}</p>
//         <p>Email: ${this.userReport.email || this.userEmail}</p>
//     </div>
    
//     <div class="section">
//         <h3>User Information</h3>
//         <div class="metric">
//             <span class="metric-label">User ID:</span>
//             <span class="metric-value">${this.userReport.userId || 'N/A'}</span>
//         </div>
//         <div class="metric">
//             <span class="metric-label">Name:</span>
//             <span class="metric-value">${this.userReport.userName || 'N/A'}</span>
//         </div>
//         <div class="metric">
//             <span class="metric-label">Email:</span>
//             <span class="metric-value">${this.userReport.email || this.userEmail}</span>
//         </div>
//         <div class="metric">
//             <span class="metric-label">LOB:</span>
//             <span class="metric-value">${this.userReport.lobName || 'N/A'}</span>
//         </div>
//         <div class="metric">
//             <span class="metric-label">Status:</span>
//             <span class="${this.userReport.status ? 'status-active' : 'status-inactive'}">${this.userReport.status ? 'Active' : 'Inactive'}</span>
//         </div>
//     </div>
    
//     <div class="section">
//         <h3>Course Analytics</h3>
//         <div class="metric">
//             <span class="metric-label">Total Courses:</span>
//             <span class="metric-value">${this.userReport.totalCourses || 0}</span>
//         </div>
//         <div class="metric">
//             <span class="metric-label">Completed Courses:</span>
//             <span class="metric-value">${this.userReport.completedCourses || 0}</span>
//         </div>
//         <div class="metric">
//             <span class="metric-label">Course Completion Rate:</span>
//             <span class="metric-value">${this.userReport.courseCompletionRate || 0}%</span>
//         </div>
//         <div class="progress-bar">
//             <div class="progress-fill" style="width: ${this.userReport.courseCompletionRate || 0}%"></div>
//         </div>
//         <div class="metric">
//             <span class="metric-label">Overall Progress:</span>
//             <span class="metric-value">${this.userReport.overallProgressPercentage || 0}%</span>
//         </div>
//         <div class="progress-bar">
//             <div class="progress-fill" style="width: ${this.userReport.overallProgressPercentage || 0}%"></div>
//         </div>
//     </div>
    
//     <div class="section">
//         <h3>Learning Statistics</h3>
//         <div class="metric">
//             <span class="metric-label">Total Learning Hours:</span>
//             <span class="metric-value">${this.userReport.totalLearningHours || 0} hours</span>
//         </div>
//         <div class="metric">
//             <span class="metric-label">Total Quizzes Taken:</span>
//             <span class="metric-value">${this.userReport.totalQuizzesTaken || 0}</span>
//         </div>
//         <div class="metric">
//             <span class="metric-label">Average Quiz Score:</span>
//             <span class="metric-value">${this.userReport.averageQuizScore || 0}%</span>
//         </div>
//     </div>
    
//     <div class="section">
//         <h3>Activity Timeline</h3>
//         <div class="metric">
//             <span class="metric-label">Enrollment Date:</span>
//             <span class="metric-value">${this.userReport.enrollmentDate ? new Date(this.userReport.enrollmentDate).toLocaleDateString() : 'N/A'}</span>
//         </div>
//         <div class="metric">
//             <span class="metric-label">Last Login:</span>
//             <span class="metric-value">${this.userReport.lastLoginDate ? new Date(this.userReport.lastLoginDate).toLocaleDateString() : 'N/A'}</span>
//         </div>
//     </div>
// </body>
// </html>`;
//   }

//   private isValidEmail(email: string): boolean {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   }

//   clearReport() {
//     this.userReport = null;
//     this.userEmail = '';
//     this.errorMessage = '';
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserreportService } from '../../../services/Report/userreport.service';

@Component({
  selector: 'app-downlaod-report',
  imports: [CommonModule, FormsModule],
  templateUrl: './downlaod-report.component.html',
  styleUrl: './downlaod-report.component.css'
})
export class DownlaodReportComponent {
  userEmail: string = '';
  userReport: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  currentDate: string = new Date().toLocaleDateString();

  constructor(private userReportService: UserreportService) {}

  generateReport() {
    if (!this.userEmail || !this.isValidEmail(this.userEmail)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.userReport = null;

    this.userReportService.getUserAnalyticsByEmail(this.userEmail).subscribe({
      next: (data) => {
        this.userReport = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.status === 404 ? 'User not found with this email' : 'Failed to fetch report. Please try again.';
        this.isLoading = false;
      }
    });
  }

  Math = Math;

  downloadReport() {
    if (!this.userReport) return;

    const reportContent = this.generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-report-${this.userEmail.replace('@', '-at-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private generateReportContent(): string {
    const currentDate = new Date().toLocaleDateString();
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Comprehensive User Analytics Report</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
        .header { text-align: center; border-bottom: 3px solid #007bff; padding-bottom: 15px; margin-bottom: 30px; }
        .header h1 { color: #007bff; margin-bottom: 10px; }
        .section { margin: 25px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; }
        .section h3 { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px; margin-bottom: 15px; }
        .metric { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .metric:last-child { border-bottom: none; }
        .metric-label { font-weight: bold; color: #555; }
        .metric-value { color: #007bff; font-weight: 500; }
        .progress-bar { width: 100%; height: 25px; background-color: #e9ecef; border-radius: 12px; overflow: hidden; margin: 10px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #28a745, #20c997); transition: width 0.3s; }
        .course-list { margin-top: 15px; }
        .course-item { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #007bff; }
        .course-name { font-weight: bold; color: #333; margin-bottom: 5px; }
        .course-details { font-size: 0.9em; color: #666; }
        .status-completed { color: #28a745; font-weight: bold; }
        .status-not-started { color: #ffc107; font-weight: bold; }
        .status-in-progress { color: #17a2b8; font-weight: bold; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
        .highlight-box { background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 10px 0; border-left: 4px solid #2196f3; }
        .assignment-item { background: white; padding: 12px; margin: 8px 0; border-radius: 4px; border-left: 3px solid #ff9800; }
        .improvement-area { background: #fff3cd; padding: 10px; border-radius: 4px; margin: 5px 0; border-left: 3px solid #ffc107; }
        .achievement { background: #d4edda; padding: 10px; border-radius: 4px; margin: 5px 0; border-left: 3px solid #28a745; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Comprehensive User Analytics Report</h1>
        <p><strong>Generated on:</strong> ${currentDate}</p>
        <p><strong>User:</strong> ${this.userReport.name || 'N/A'} (${this.userReport.email || this.userEmail})</p>
    </div>
    
    <div class="section">
        <h3>👤 User Information</h3>
        <div class="grid-2">
            <div>
                <div class="metric"><span class="metric-label">User ID:</span><span class="metric-value">${this.userReport.userId || 'N/A'}</span></div>
                <div class="metric"><span class="metric-label">Name:</span><span class="metric-value">${this.userReport.name || 'N/A'}</span></div>
                <div class="metric"><span class="metric-label">Email:</span><span class="metric-value">${this.userReport.email || this.userEmail}</span></div>
                <div class="metric"><span class="metric-label">Designation:</span><span class="metric-value">${this.userReport.designation || 'N/A'}</span></div>
            </div>
            <div>
                <div class="metric"><span class="metric-label">Level:</span><span class="metric-value">${this.userReport.level || 'N/A'}</span></div>
                <div class="metric"><span class="metric-label">LOB:</span><span class="metric-value">${this.userReport.lobName || 'N/A'}</span></div>
                <div class="metric"><span class="metric-label">Sub LOB:</span><span class="metric-value">${this.userReport.subLob || 'N/A'}</span></div>
                <div class="metric"><span class="metric-label">Join Date:</span><span class="metric-value">${this.userReport.joinDate ? new Date(this.userReport.joinDate).toLocaleDateString() : 'N/A'}</span></div>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h3>📚 Course Analytics</h3>
        <div class="grid-3">
            <div class="highlight-box">
                <strong>Total Available:</strong> ${this.userReport.totalCoursesAvailable || 0}
            </div>
            <div class="highlight-box">
                <strong>Enrolled:</strong> ${this.userReport.totalCoursesEnrolled || 0}
            </div>
            <div class="highlight-box">
                <strong>Completed:</strong> ${this.userReport.completedCourses || 0}
            </div>
        </div>
        <div class="metric"><span class="metric-label">In Progress:</span><span class="metric-value">${this.userReport.inProgressCourses || 0}</span></div>
        <div class="metric"><span class="metric-label">Not Started:</span><span class="metric-value">${this.userReport.notStartedCourses || 0}</span></div>
        <div class="metric"><span class="metric-label">Completion Rate:</span><span class="metric-value">${this.userReport.courseCompletionRate || 0}%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${this.userReport.courseCompletionRate || 0}%"></div></div>
        <div class="metric"><span class="metric-label">Overall Progress:</span><span class="metric-value">${this.userReport.overallProgressPercentage || 0}%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${this.userReport.overallProgressPercentage || 0}%"></div></div>
        
        <div class="grid-3" style="margin-top: 15px;">
            <div class="highlight-box"><strong>Courses >80%:</strong> ${this.userReport.coursesAbove80Percent || 0}</div>
            <div class="highlight-box"><strong>Courses >50%:</strong> ${this.userReport.coursesAbove50Percent || 0}</div>
            <div class="highlight-box"><strong>Courses <25%:</strong> ${this.userReport.coursesBelow25Percent || 0}</div>
        </div>
    </div>
    
    <div class="section">
        <h3>⏱️ Learning Time Analytics</h3>
        <div class="metric"><span class="metric-label">Total Watch Time:</span><span class="metric-value">${this.userReport.formattedWatchTime || '0h 0m 0s'}</span></div>
        <div class="metric"><span class="metric-label">Total Watch Hours:</span><span class="metric-value">${this.userReport.totalWatchHours || 0}h</span></div>
        <div class="metric"><span class="metric-label">Total Watch Minutes:</span><span class="metric-value">${this.userReport.totalWatchMinutes || 0}m</span></div>
        <div class="metric"><span class="metric-label">Total Watch Seconds:</span><span class="metric-value">${this.userReport.totalWatchSeconds || 0}s</span></div>
        <div class="metric"><span class="metric-label">Avg Time Per Course:</span><span class="metric-value">${Math.floor((this.userReport.averageWatchTimePerCourse || 0) / 60)}m ${(this.userReport.averageWatchTimePerCourse || 0) % 60}s</span></div>
        <div class="metric"><span class="metric-label">Preferred Learning Time:</span><span class="metric-value">${this.userReport.preferredLearningTime || 'N/A'}</span></div>
    </div>
    
    <div class="section">
        <h3>🎯 Quiz Performance</h3>
        <div class="metric"><span class="metric-label">Quizzes Attempted:</span><span class="metric-value">${this.userReport.totalQuizzesAttempted || 0}</span></div>
        <div class="metric"><span class="metric-label">Quizzes Completed:</span><span class="metric-value">${this.userReport.quizzesCompleted || 0}</span></div>
        <div class="metric"><span class="metric-label">Quizzes In Progress:</span><span class="metric-value">${this.userReport.quizzesInProgress || 0}</span></div>
        <div class="metric"><span class="metric-label">Average Score:</span><span class="metric-value">${this.userReport.averageQuizScore || 0}%</span></div>
        <div class="metric"><span class="metric-label">Highest Score:</span><span class="metric-value">${this.userReport.highestQuizScore || 0}%</span></div>
        <div class="metric"><span class="metric-label">Lowest Score:</span><span class="metric-value">${this.userReport.lowestQuizScore || 0}%</span></div>
    </div>
    
    <div class="section">
        <h3>📝 Assignment Status</h3>
        <div class="metric"><span class="metric-label">Total Assignments:</span><span class="metric-value">${this.userReport.totalAssignments || 0}</span></div>
        <div class="metric"><span class="metric-label">Submitted:</span><span class="metric-value">${this.userReport.assignmentsSubmitted || 0}</span></div>
        <div class="metric"><span class="metric-label">Graded:</span><span class="metric-value">${this.userReport.assignmentsGraded || 0}</span></div>
        <div class="metric"><span class="metric-label">Pending:</span><span class="metric-value">${this.userReport.pendingAssignments || 0}</span></div>
        <div class="metric"><span class="metric-label">Submission Rate:</span><span class="metric-value">${this.userReport.assignmentSubmissionRate || 0}%</span></div>
        
        ${this.userReport.assignmentStatuses && this.userReport.assignmentStatuses.length > 0 ? `
        <h4>Assignment Details:</h4>
        ${this.userReport.assignmentStatuses.map((assignment: any) => `
        <div class="assignment-item">
            <div class="course-name">${assignment.courseName}</div>
            <div class="course-details">
                Status: <span class="status-${assignment.status?.toLowerCase().replace(' ', '-')}">${assignment.status}</span><br>
                Remarks: ${assignment.remarks || 'No remarks'}<br>
                ${assignment.submissionDate ? `Submitted: ${new Date(assignment.submissionDate).toLocaleDateString()}` : ''}
            </div>
        </div>
        `).join('')}
        ` : ''}
    </div>
    
    <div class="section">
        <h3>📖 Module Progress</h3>
        <div class="metric"><span class="metric-label">Video Modules Watched:</span><span class="metric-value">${this.userReport.videoModulesWatched || 0}</span></div>
        <div class="metric"><span class="metric-label">Document Modules Read:</span><span class="metric-value">${this.userReport.documentModulesRead || 0}</span></div>
        <div class="metric"><span class="metric-label">Total Modules Accessed:</span><span class="metric-value">${this.userReport.totalModulesAccessed || 0}</span></div>
        <div class="metric"><span class="metric-label">Favorited Courses:</span><span class="metric-value">${this.userReport.favoritedCourses || 0}</span></div>
        <div class="metric"><span class="metric-label">Saved Courses:</span><span class="metric-value">${this.userReport.savedCourses || 0}</span></div>
    </div>
    
    <div class="section">
        <h3>📊 Activity & Engagement</h3>
        <div class="metric"><span class="metric-label">Last Active:</span><span class="metric-value">${this.userReport.lastActiveDate ? new Date(this.userReport.lastActiveDate).toLocaleDateString() : 'N/A'}</span></div>
        <div class="metric"><span class="metric-label">Days Active (Last 30):</span><span class="metric-value">${this.userReport.daysActiveLast30Days || 0}</span></div>
        <div class="metric"><span class="metric-label">Learning Streak:</span><span class="metric-value">${this.userReport.learningStreak || 'N/A'}</span></div>
        <div class="metric"><span class="metric-label">Last Completed Course:</span><span class="metric-value">${this.userReport.lastCompletedCourse || 'N/A'}</span></div>
        <div class="metric"><span class="metric-label">Last Completion Date:</span><span class="metric-value">${this.userReport.lastCourseCompletionDate ? new Date(this.userReport.lastCourseCompletionDate).toLocaleDateString() : 'N/A'}</span></div>
        <div class="metric"><span class="metric-label">Total Badges:</span><span class="metric-value">${this.userReport.totalBadgesEarned || 0}</span></div>
    </div>
    
    <div class="section">
        <h3>🎓 Enrolled Courses</h3>
        ${this.userReport.enrolledCourses && this.userReport.enrolledCourses.length > 0 ? `
        <div class="course-list">
            ${this.userReport.enrolledCourses.map((course: any) => `
            <div class="course-item">
                <div class="course-name">${course.courseName}</div>
                <div class="course-details">
                    Progress: ${course.progressPercentage}% | 
                    Status: <span class="status-${course.status?.toLowerCase().replace(' ', '-')}">${course.status}</span> | 
                    Watch Time: ${Math.floor(course.watchTimeSeconds / 60)}m ${course.watchTimeSeconds % 60}s<br>
                    Enrolled: ${new Date(course.enrollmentDate).toLocaleDateString()}
                    ${course.completionDate ? ` | Completed: ${new Date(course.completionDate).toLocaleDateString()}` : ''}
                </div>
                <div class="progress-bar" style="height: 15px; margin-top: 8px;">
                    <div class="progress-fill" style="width: ${course.progressPercentage}%"></div>
                </div>
            </div>
            `).join('')}
        </div>
        ` : '<p>No enrolled courses found.</p>'}
    </div>
    
    <div class="section">
        <h3>📈 Performance Insights</h3>
        ${this.userReport.areasForImprovement && this.userReport.areasForImprovement.length > 0 ? `
        <h4>Areas for Improvement:</h4>
        ${this.userReport.areasForImprovement.map((area: string) => `<div class="improvement-area">• ${area}</div>`).join('')}
        ` : ''}
        
        ${this.userReport.recentAchievements && this.userReport.recentAchievements.length > 0 ? `
        <h4>Recent Achievements:</h4>
        ${this.userReport.recentAchievements.map((achievement: string) => `<div class="achievement">🏆 ${achievement}</div>`).join('')}
        ` : ''}
    </div>
</body>
</html>`;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  clearReport() {
    this.userReport = null;
    this.userEmail = '';
    this.errorMessage = '';
  }
}