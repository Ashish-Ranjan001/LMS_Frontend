import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  HostListener,
  Renderer2,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { trigger, state, style, transition, animate, keyframes } from "@angular/animations"
import { DashboardServicesService } from '../../../services/homedashboard/dashboard-services.service'
import { jwtDecode } from 'jwt-decode'
import { Route, Router } from "@angular/router"

interface SavedCourse {
  id: string
  title: string
  category: string
  categoryColor: string
  categoryBg: string
  image: string
  progress: number
  lastAccessed: string
  instructor: string
  description?: string
  durationInMinutes?: number
  durationInHours?: number
  isEnrolled?: boolean
  smeName?: string
  isFavorited?: boolean
  isSaved?: boolean
  favoriteCount?: number
  watchedMinutes?: number
  remainingMinutes?: number
  totalDurationInMinutes?: number
  moduleCount?: number
}

@Component({
  selector: "app-home-saved-course",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home-saved-course.component.html",
  styleUrls: ["./home-saved-course.component.css"],
  animations: [
    trigger("cardHover", [
      state("normal", style({ transform: "scale(1)" })),
      state("hovered", style({ transform: "scale(1.05)" })),
      transition("normal <=> hovered", animate("250ms cubic-bezier(0.4, 0, 0.2, 1)")),
    ]),
    trigger("cardClick", [
      transition("* => *", [
        animate(
          "300ms",
          keyframes([style({ transform: "scale(0.95)", offset: 0.3 }), style({ transform: "scale(1)", offset: 1.0 })]),
        ),
      ]),
    ]),
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(10px)" }),
        animate("400ms cubic-bezier(0.4, 0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
  ],
})
export class HomeSavedCourseComponent implements OnInit, OnDestroy, AfterViewInit {
  savedCourses: SavedCourse[] = []
  isLoading = true
  error: string | null = null

  // 3D Gallery properties
  isScreenSizeSm = false
  cylinderWidth = 1200
  faceCount = 0
  faceWidth = 0
  radius = 0
  currentRotation = 0
  autoplayInterval: any
  isDragging = false
  startX = 0
  currentX = 0
  dragFactor = 0.3
  rotationSpeed = 0.5
  isAutoRotating = true

  // Animation states
  hoveredCard: string | null = null
  clickedCard: string | null = null
  autoplay = true
  pauseOnHover = true

  // Animation frame for rotation
  animationFrameId: number | null = null

  @ViewChildren("galleryTrack") galleryTrackRef!: QueryList<ElementRef>

  constructor(
    private renderer: Renderer2,
    private dashboardService: DashboardServicesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSavedCourses()
    this.calculateDimensions()
  }

  ngAfterViewInit(): void {
    this.startRotationAnimation()
  }

  ngOnDestroy(): void {
    this.stopRotationAnimation()
  }

  getDecodedUserId() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found in localStorage.");
        return null;
      }

      const decodedToken: any = jwtDecode(token);
      console.log("=== DECODED TOKEN ===", decodedToken);

      const gender = decodedToken.Gender;
      // this.userAvatar = gender === 'Male' ? 'male.svg' : 'female.jpg';

      const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
      console.log("=== EXTRACTED USER ID ===", userId);
      return userId;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }

  loadSavedCourses(): void {
    const userId = this.getDecodedUserId();
    
    if (!userId) {
      this.error = "Unable to get user ID";
      this.isLoading = false;
      return;
    }

    this.dashboardService.getSavedCourses(userId).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        this.savedCourses = this.mapApiResponseToSavedCourses(response);
        this.faceCount = this.savedCourses.length;
        this.calculateDimensions();
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading saved courses:", error);
        this.error = "Failed to load saved courses";
        this.isLoading = false;
      }
    });
  }

  mapApiResponseToSavedCourses(apiResponse: any[]): SavedCourse[] {
    return apiResponse.map((course: any) => ({
      id: course.courseId,
      title: course.courseName,
      category: course.categoryName || 'General',
      categoryColor: "#065f46", // Green color as requested
      categoryBg: "#d1fae5", // Light green background
      image: course.imagePath ? `https://localhost:7264/${course.imagePath}` : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D/140x90',
      progress: course.completionPercentage || 0,
      lastAccessed: "Today", // Fixed as "Today" as requested
      instructor: course.author || 'Unknown',
      description: course.description,
      durationInMinutes: course.durationInMinutes,
      durationInHours: course.durationInHours,
      isEnrolled: course.isEnrolled,
      smeName: course.smeName,
      isFavorited: course.isFavorited,
      isSaved: course.isSaved,
      favoriteCount: course.favoriteCount,
      watchedMinutes: course.watchedMinutes,
      remainingMinutes: course.remainingMinutes,
      totalDurationInMinutes: course.totalDurationInMinutes,
      moduleCount: course.moduleCount
    }));
  }

  @HostListener("window:resize", ["$event"])
  onResize(): void {
    this.calculateDimensions()
  }

  calculateDimensions(): void {
    this.isScreenSizeSm = window.innerWidth <= 768
    this.cylinderWidth = this.isScreenSizeSm ? 700 : 1200
    if (this.faceCount > 0) {
      this.faceWidth = (this.cylinderWidth / this.faceCount) * 1.2
      this.radius = this.cylinderWidth / (2 * Math.PI)
    }
  }

  startRotationAnimation(): void {
    if (this.autoplay && !this.animationFrameId) {
      const animate = () => {
        if (this.isAutoRotating && !this.isDragging) {
          this.currentRotation -= this.rotationSpeed
          if (this.galleryTrackRef && this.galleryTrackRef.first) {
            this.renderer.setStyle(
              this.galleryTrackRef.first.nativeElement,
              "transform",
              `rotateY(${this.currentRotation}deg)`,
            )
          }
        }
        this.animationFrameId = requestAnimationFrame(animate)
      }
      this.animationFrameId = requestAnimationFrame(animate)
    }
  }

  stopRotationAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  onMouseEnter(): void {
    if (this.pauseOnHover) {
      this.isAutoRotating = false
    }
  }

  onMouseLeave(): void {
    if (this.pauseOnHover) {
      this.isAutoRotating = true
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true
    this.startX = event.clientX
    this.isAutoRotating = false
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.currentX = event.clientX
      const deltaX = this.currentX - this.startX
      this.currentRotation += deltaX * this.dragFactor
      this.startX = this.currentX
    }
  }

  onMouseUp(): void {
    this.isDragging = false
    if (this.autoplay) {
      this.isAutoRotating = true
    }
  }

  onCardHover(courseId: string): void {
    this.hoveredCard = courseId
  }

  onCardLeave(): void {
    this.hoveredCard = null
  }

  onCardClick(course: SavedCourse): void {
    this.clickedCard = course.id
    setTimeout(() => {
      this.clickedCard = null
    }, 300)

    // Show alert when card is clicked
    alert(`You clicked on "${course.title}" course`)

    this.router.navigate(['module/', btoa(course.id)])
    // Log the click event
    console.log("Course clicked:", course)
  }

  onSeeAll(): void {
    console.log("See All clicked")
  }

  onContinueCourse(courseId: string, event: Event): void {
    event.stopPropagation() // Prevent card click event
    this.router.navigate(['module/', btoa(courseId)])
    console.log("Continue course clicked for course:", courseId)
  }

  getCardTransform(index: number): string {
    if (this.faceCount === 0) return 'rotateY(0deg) translateZ(0px)'
    const rotateY = (360 / this.faceCount) * index
    return `rotateY(${rotateY}deg) translateZ(${this.radius}px)`
  }

  getGalleryTransform(): string {
    return `rotateY(${this.currentRotation}deg)`
  }

  getCardZIndex(index: number): number {
    if (this.faceCount === 0) return 1000
    // Calculate which card is most front-facing based on current rotation
    const cardAngle = (360 / this.faceCount) * index
    const currentAngle = this.currentRotation % 360
    const angleDiff = Math.abs((cardAngle - currentAngle) % 360)

    // Cards facing front get higher z-index
    return 1000 - Math.round(angleDiff)
  }

  getProgressColor(progress: number): string {
    if (progress < 30) return "#ef4444"
    if (progress < 70) return "#f59e0b"
    return "#10b981"
  }
}