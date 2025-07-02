
import { Component, type OnInit } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { jwtDecode } from "jwt-decode"

import { UserLearningService , CoursesByCategoryDto } from "../../../services/user-learning.service"
import { SaveFavoriteCourseServiceService , toggleFavorite , toggleSave} from "../../../services/SaveFavoriteCourse/save-favorite-course-service.service"

interface CourseWithImageStatusByCategory extends CoursesByCategoryDto {
  imageLoadError?: boolean
  isCompleted: boolean
  progress?: number
}

@Component({
  selector: "app-courses",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./courses.component.html",
  styleUrls: ["./courses.component.css"],
})
export class CoursesComponent implements OnInit {
  courses: CourseWithImageStatusByCategory[] = []
  filteredCourses: CourseWithImageStatusByCategory[] = []
  categoryId = ""
  categoryName = ""
  loading = true
  error = ""
  userId = ""
  selectedFilter = "all"
  viewMode: "grid" | "list" = "grid"

  private readonly BASE_URL = "https://localhost:7264"

  constructor(
    private userLearningService: UserLearningService,
    private route: ActivatedRoute,
    private router: Router,
    private saveFavoriteCourseService: SaveFavoriteCourseServiceService
  ) {
    this.userId = this.getDecodedUserId()
  }

  getDecodedUserId() {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        console.error("No auth token found in localStorage.")
        return null
      }

      const decodedToken: any = jwtDecode(token)
      const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub
      return userId
    } catch (error) {
      console.error("Error decoding JWT:", error)
      return null
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.categoryId = atob(params["categoryId"])
    })

    this.route.queryParams.subscribe((params) => {
      this.categoryName = params["categoryName"] || "Courses"
    })

    if (this.categoryId) {
      this.loadCourses()
    }
  }

  loadCourses(): void {
    if (!this.categoryId) {
      this.error = "Category ID is required"
      this.loading = false
      return
    }

    this.loading = true
    this.error = ""

    this.userLearningService.getCoursesByCategory(this.categoryId, this.userId).subscribe({
      next: (courses: CoursesByCategoryDto[]) => {
        this.courses = courses.map(
          (course) =>
            ({
              ...course,
              isCompleted: course.completionPercentage === 100,
              progress: course.completionPercentage,
              imageLoadError: false,
            }) as CourseWithImageStatusByCategory,
        )
        this.filteredCourses = [...this.courses]
        this.loading = false
        console.log("Courses loaded successfully:", courses)
      },
      error: (error) => {
        this.error = "Failed to load courses. Please try again."
        this.loading = false
        console.error("Error loading courses:", error)
      },
    })
  }

  // New Toggle Save Method
  toggleSave(course: CourseWithImageStatusByCategory, event: Event): void {
    event.stopPropagation();
  
    const newIsSaved = !course.isSaved;
  
    const payload: toggleSave = {
      UserId: this.userId,
      CourseId: course.courseId,
      IsFavorited: course.isFavorited || false, // Keep current favorite status
      IsSaved: newIsSaved
    };
  
    this.saveFavoriteCourseService.toggleSave(payload).subscribe({
      next: () => {
        course.isSaved = newIsSaved;
      },
      error: (err) => {
        console.error('Failed to save course:', err);
        course.isSaved = !newIsSaved; // Revert UI
      }
    });
  }

  // New Toggle Favorite Method
  toggleFavorite(course: CourseWithImageStatusByCategory, event: Event): void {
    event.stopPropagation();
  
    const newIsFavorited = !course.isFavorited;
  
    const payload: toggleFavorite = {
      UserId: this.userId,
      CourseId: course.courseId,
      IsFavorited: newIsFavorited,
      IsSaved: course.isSaved || false // Optional: retain current saved status
    };
  
    this.saveFavoriteCourseService.toggleFavorite(payload).subscribe({
      next: () => {
        course.isFavorited = newIsFavorited;
        if (newIsFavorited) {
          course.favoriteCount += 1;
        } else {
          course.favoriteCount = Math.max(course.favoriteCount - 1, 0);
        }
      },
      error: (err) => {
        console.error('Failed to favorite course:', err);
        course.isFavorited = !newIsFavorited; // Revert UI
        if (newIsFavorited) {
          course.favoriteCount = Math.max(course.favoriteCount - 1, 0);
        } else {
          course.favoriteCount += 1;
        }
      }
    });
  }

  getCourseImageUrl(course: CourseWithImageStatusByCategory): string {
    if (course.imagePath) {
      return `${this.BASE_URL}${course.imagePath}`
    }
    return this.getDefaultImageDataUrl()
  }

  private getDefaultImageDataUrl(): string {
    const svg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grad1)"/>
                  <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="600">
                    Course Preview
                  </text>
                  <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="14">
                    Image Coming Soon
                  </text>
                </svg>`
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  onImageError(event: Event, course: CourseWithImageStatusByCategory): void {
    const target = event.target as HTMLImageElement
    console.error("Course image failed to load:", {
      courseId: course.courseId,
      courseName: course.courseName,
      attemptedUrl: target.src,
      originalImagePath: course.imagePath,
      course: course,
    })
    course.imageLoadError = true
  }

  onImageLoad(event: Event, course: CourseWithImageStatusByCategory): void {
    const target = event.target as HTMLImageElement
    // console.log("Course image loaded successfully:", {
    //   courseId: course.courseId,
    //   courseName: course.courseName,
    //   imageUrl: target.src,
    // })
    course.imageLoadError = false
  }

  viewCourseDetail(courseId: string): void {
    // console.log("Navigating to course detail:", courseId)
    this.router.navigate([`/module/${btoa(courseId)}`])
  }

  enrollInCourse(course: CourseWithImageStatusByCategory, event: Event): void {
    event.stopPropagation()

    const enrollData = {
      userId: this.userId,
      courseId: course.courseId,
    }

    this.userLearningService.enrollInCourse(enrollData).subscribe({
      next: (response) => {
        course.isEnrolled = true
        course.progress = 0
        // console.log("Enrolled successfully:", response)

        // Update filtered courses if needed
        this.applyFilter()
      },
      error: (error) => {
        // console.error("Error enrolling in course:", error)
        // You could add a toast notification here
      },
    })
  }

  getProgressClass(progress: number): string {
    if (progress === 0) return "low"
    if (progress < 30) return "low"
    if (progress < 70) return "medium"
    if (progress < 100) return "high"
    return "complete"
  }

  getButtonText(course: CourseWithImageStatusByCategory): string {
    if (course.isCompleted) return "Completed"
    if (course.isEnrolled) return "Continue Learning"
    return "Start Course"
  }

  getButtonClass(course: CourseWithImageStatusByCategory): string {
    if (course.isCompleted) return "success"
    if (course.isEnrolled) return "primary"
    return "primary"
  }

  trackByCourse(index: number, course: CourseWithImageStatusByCategory): string {
    return course.courseId
  }

  // Existing methods continue...
  getEnrolledCount(): number {
    return this.courses.filter((course) => course.isEnrolled).length
  }

  getCompletedCount(): number {
    return this.courses.filter((course) => course.isCompleted).length
  }

  getDifficultyLevel(course: CourseWithImageStatusByCategory): string {
    const duration = course.durationInMinutes || 0
    if (duration < 60) return "Beginner"
    if (duration < 180) return "Intermediate"
    return "Advanced"
  }

  onFilterChange(): void {
    this.applyFilter()
  }

  private applyFilter(): void {
    switch (this.selectedFilter) {
      case "enrolled":
        this.filteredCourses = this.courses.filter((course) => course.isEnrolled && !course.isCompleted)
        break
      case "available":
        this.filteredCourses = this.courses.filter((course) => !course.isEnrolled)
        break
      case "completed":
        this.filteredCourses = this.courses.filter((course) => course.isCompleted)
        break
      default:
        this.filteredCourses = [...this.courses]
    }
  }

  getFilteredCourses(): CourseWithImageStatusByCategory[] {
    return this.filteredCourses
  }

  setViewMode(mode: "grid" | "list"): void {
    this.viewMode = mode
  }

  resetFilters(): void {
    this.selectedFilter = "all"
    this.applyFilter()
  }

  getCardAnimationDelay(index: number): string {
    return `${index * 100}ms`
  }

  onCardHover(course: CourseWithImageStatusByCategory): void {
    // You can add additional hover effects here if needed
  }

  onCardLeave(course: CourseWithImageStatusByCategory): void {
    // You can add additional hover leave effects here if needed
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
  }

  getProgressWidth(progress: number): number {
    return Math.min(Math.max(progress || 0, 0), 100)
  }

  isNewCourse(course: CourseWithImageStatusByCategory): boolean {
    return false
  }

  getFeaturedBadge(course: CourseWithImageStatusByCategory): string | null {
    return null
  }

  getAriaLabel(course: CourseWithImageStatusByCategory): string {
    let label = `Course: ${course.courseName}`
    if (course.isCompleted) {
      label += ", Completed"
    } else if (course.isEnrolled) {
      label += `, Enrolled, ${course.progress || 0}% complete`
    } else {
      label += ", Available to enroll"
    }
    return label
  }

  getButtonAriaLabel(course: CourseWithImageStatusByCategory): string {
    if (course.isCompleted) return `Course ${course.courseName} is completed`
    if (course.isEnrolled) return `Continue learning ${course.courseName}`
    return `Start course ${course.courseName}`
  }

  retryLoadCourses(): void {
    this.loadCourses()
  }

  handleImageLoadError(course: CourseWithImageStatusByCategory): void {
    console.warn(`Failed to load image for course: ${course.courseName}`)
  }

  shouldShowProgress(course: CourseWithImageStatusByCategory): boolean {
    return course.isEnrolled && !course.isCompleted
  }

  shouldShowRating(course: CourseWithImageStatusByCategory): boolean {
    return course.isCompleted
  }

  searchCourses(query: string): void {
    if (!query) {
      this.applyFilter()
      return
    }

    const filtered = this.courses.filter(
      (course) =>
        course.courseName.toLowerCase().includes(query.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(query.toLowerCase())) ||
        (course.author && course.author.toLowerCase().includes(query.toLowerCase())),
    )

    this.filteredCourses = filtered
  }

  sortCourses(sortBy: "name" | "duration" | "progress"): void {
    this.filteredCourses.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.courseName.localeCompare(b.courseName)
        case "duration":
          return (a.durationInMinutes || 0) - (b.durationInMinutes || 0)
        case "progress":
          return (b.progress || 0) - (a.progress || 0)
        default:
          return 0
      }
    })
  }
}
