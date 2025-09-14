

 
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserLearningService, CourseDetailDto, ModuleDto } from '../../../services/user-learning.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModuleServicesService } from '../../../services/Module/module-services.service';
 
@Component({
  selector: 'app-course-detail',
  imports: [CommonModule],
  templateUrl: './courses-details.component.html',
  styleUrl: './courses-details.component.css'
})
export class CoursesDetailComponent implements OnInit, OnDestroy {
  courseDetail: CourseDetailDto | null = null;
  courseId: string = '';
  loading = true;
  error = '';
  userId = '';
  selectedModule: ModuleDto | null = null;
  showVideoPlayer = false;
  showDocumentViewer = false;
  sanitizedVideoUrl: SafeResourceUrl | null = null;
  sanitizedDocumentUrl: SafeResourceUrl | null = null;
 
  // Using inject() function for dependency injection
  private userLearningService = inject(UserLearningService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private moduleservice=inject(ModuleServicesService)
 
  constructor() {
    // TODO: Get userId from your authentication service
    this.userId = localStorage.getItem('userId') || 'user-id-placeholder';
   
  }
 
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseId = params['courseId'];
      this.loadCourseDetail();
    });
  }
 
  ngOnDestroy(): void {
    // Clean up any resources if needed
  }
 
  loadCourseDetail(): void {
    this.loading = true;
    this.error = '';
    this.userLearningService.getCourseDetail(this.courseId, this.userId).subscribe({
      next: (courseDetail) => {
        this.courseDetail = courseDetail;
        this.loading = false;
        // Sort modules by order
        if (this.courseDetail?.modules) {
          this.courseDetail.modules.sort((a, b) => a.order - b.order);
        }
      },
      error: (error) => {
        this.error = 'Failed to load course details';
        this.loading = false;
        console.error('Error loading course detail:', error);
      }
    });
  }
 
  selectModule(module: ModuleDto): void {
    this.selectedModule = module;
    console.log('Module selected:', module);
   this.router.navigate([`video/${module.moduleId}`])
 
    this.showVideoPlayer = false;
    this.showDocumentViewer = false;
    this.sanitizedVideoUrl = null;
    this.sanitizedDocumentUrl = null;
  }
 
  playVideo(module: ModuleDto): void {
    if (!module.videoUrl) {
      console.error('No video URL available');
      return;
    }
 
    this.selectedModule = module;
    this.showVideoPlayer = true;
    this.showDocumentViewer = false;
   
    // Sanitize the video URL
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(module.videoUrl);
    this.sanitizedDocumentUrl = null;
   
    this.markModuleAsCompleted(module);
  }
 
  viewDocument(module: ModuleDto): void {
    if (!module.documentPath) {
      console.error('No document URL available');
      return;
    }
 
    this.selectedModule = module;
    this.showDocumentViewer = true;
    this.showVideoPlayer = false;
   
    // Sanitize the document URL
    this.sanitizedDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(module.documentPath);
    this.sanitizedVideoUrl = null;
   
    this.markModuleAsCompleted(module);
  }
 
  markModuleAsCompleted(module: ModuleDto): void {
    if (!module.isCompleted) {
      const progressData = {
        userId: this.userId,
        courseId: this.courseId,
        moduleId: module.moduleId
      };
 
      this.userLearningService.updateModuleProgress(progressData).subscribe({
        next: (response) => {
          module.isCompleted = true;
          this.updateCourseProgress();
        },
        error: (error) => {
          console.error('Error updating module progress:', error);
        }
      });
    }
  }
 
  updateCourseProgress(): void {
    if (this.courseDetail?.modules) {
      const completedModules = this.courseDetail.modules.filter(m => m.isCompleted).length;
      const totalModules = this.courseDetail.modules.length;
      this.courseDetail.progress = Math.round((completedModules / totalModules) * 100);
     
      if (this.courseDetail.progress === 100) {
        this.courseDetail.isCompleted = true;
      }
    }
  }
 
  downloadAssignment(): void {
    if (this.courseDetail) {
      this.userLearningService.downloadAssignment(this.userId, this.courseId).subscribe({
        next: (response) => {
          this.courseDetail!.assignmentDownloaded = true;
          console.log('Assignment download status updated');
        },
        error: (error) => {
          console.error('Error downloading assignment:', error);
        }
      });
    }
  }
 
  getModuleIcon(module: ModuleDto): string {
    if (module.videoUrl && module.documentPath) {
      return 'fas fa-play-circle';
    } else if (module.videoUrl) {
      return 'fas fa-play-circle';
    } else if (module.documentPath) {
      return 'fas fa-file-pdf';
    }
    return 'fas fa-book';
  }
 
  formatDuration(minutes: number): string {
    if (!minutes || minutes < 60) {
      return `${minutes || 0} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }
 
  getProgressClass(progress: number): string {
    if (progress === 0) return 'bg-secondary';
    if (progress < 50) return 'bg-warning';
    if (progress < 100) return 'bg-info';
    return 'bg-success';
  }
 
  getCompletedModulesCount(): number {
    if (!this.courseDetail || !this.courseDetail.modules) return 0;
    return this.courseDetail.modules.filter(m => m.isCompleted).length;
  }
 
  getPendingModulesCount(): number {
    if (!this.courseDetail || !this.courseDetail.modules) return 0;
    return this.courseDetail.modules.filter(m => !m.isCompleted).length;
  }
 
  getTotalModulesCount(): number {
    if (!this.courseDetail || !this.courseDetail.modules) return 0;
    return this.courseDetail.modules.length;
  }
 
  // Helper method to get safe image URL
  getSafeImageUrl(url: string | undefined): string {
    if (!url) {
      // Use placeholder service instead of local asset
      return 'https://via.placeholder.com/400x200/e9ecef/6c757d?text=Course+Image';
    }
   
    // If it's a relative URL, make it absolute
    if (url.startsWith('/') || url.startsWith('./')) {
      return url;
    }
   
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
   
    // If it's a relative path without leading slash, add one
    return `/${url}`;
  }
 
  // Helper method to check if video URL is valid
  isValidVideoUrl(url: string | undefined): boolean {
    if (!url) return false;
   
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const lowerUrl = url.toLowerCase();
   
    return videoExtensions.some(ext => lowerUrl.includes(ext)) ||
           lowerUrl.includes('video') ||
           lowerUrl.includes('youtube') ||
           lowerUrl.includes('vimeo');
  }
 
  // Helper method to check if document URL is valid
  isValidDocumentUrl(url: string | undefined): boolean {
    if (!url) return false;
   
    const docExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
    const lowerUrl = url.toLowerCase();
   
    return docExtensions.some(ext => lowerUrl.includes(ext)) ||
           lowerUrl.includes('document') ||
           lowerUrl.includes('docs.google');
  }
 
  // Error handling methods
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement && !imgElement.dataset['fallbackAttempted']) {
      // Mark that we've attempted fallback to prevent infinite loop
      imgElement.dataset['fallbackAttempted'] = 'true';
     
      // Try a different fallback approach
      // Option 1: Use a placeholder service
      imgElement.src = 'https://via.placeholder.com/400x200/e9ecef/6c757d?text=Course+Image';
     
      // Option 2: Use a base64 placeholder (uncomment if you prefer this)
      // imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRTlFQ0VGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2Qzc1N0QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+Q291cnNlIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
    }
  }
 
  onVideoError(event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    const iframeElement = videoElement.nextElementSibling as HTMLIFrameElement;
    const fallbackElement = iframeElement?.nextElementSibling as HTMLElement;
   
    if (videoElement) {
      videoElement.style.display = 'none';
    }
    if (iframeElement) {
      iframeElement.style.display = 'block';
    }
   
    // If iframe also fails, show fallback
    setTimeout(() => {
      if (iframeElement && !this.isIframeLoaded(iframeElement)) {
        iframeElement.style.display = 'none';
        if (fallbackElement) {
          fallbackElement.style.display = 'block';
        }
      }
    }, 3000);
  }
 
  onDocumentError(event: Event): void {
    const iframeElement = event.target as HTMLIFrameElement;
    const fallbackElement = iframeElement.nextElementSibling as HTMLElement;
   
    if (iframeElement) {
      iframeElement.style.display = 'none';
    }
    if (fallbackElement) {
      fallbackElement.style.display = 'block';
    }
  }
 
  private isIframeLoaded(iframe: HTMLIFrameElement): boolean {
    try {
      return iframe.contentDocument !== null;
    } catch (e) {
      return false;
    }
  }
 
  goBack(): void {
    this.router.navigate(['/categories']);
  }
 
  retryLoadCourse(): void {
    this.loadCourseDetail();
  }
 
  closeVideoPlayer(): void {
    this.showVideoPlayer = false;
    this.sanitizedVideoUrl = null;
  }
 
  closeDocumentViewer(): void {
    this.showDocumentViewer = false;
    this.sanitizedDocumentUrl = null;
  }
}
 