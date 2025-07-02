import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
   OnInit,
   OnDestroy,
  ViewChild,
   ElementRef,
   ChangeDetectorRef,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { Router } from "@angular/router"
import { trigger, state, style, transition, animate } from "@angular/animations"
import  { CourseServicesService } from "../../../services/courses/course-services.service"
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from "rxjs"
import { Subscription } from 'rxjs';
import { NotificationService } from "../../../services/Notifications/notification.service"

interface Course {
  course_id: string
  course_name: string
  status: boolean
  category_id: string
  category_name?: string
  lob_id: string
}

interface ApiResponse {
  data: Course[]
  msg: string
}

interface FilterOption {
  value: "course" | "category"
  label: string
  icon: string
  placeholder: string
}

interface CourseData {
  course_id: string
  course_name: string
  category_id: string
  status: boolean
}

interface CategoryData {
  category_id: string
  category_name: string
  status: boolean
}

@Component({
  selector: "app-mainheader",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./mainheader.component.html",
  styleUrl: "./mainheader.component.css",
  animations: [
    trigger("slideDown", [
      state("in", style({ opacity: 1, transform: "translateY(0) scale(1)" })),
      transition("void => *", [
        style({ opacity: 0, transform: "translateY(-10px) scale(0.95)" }),
        animate("300ms cubic-bezier(0.4, 0, 0.2, 1)"),
      ]),
      transition("* => void", [
        animate("200ms ease-in", style({ opacity: 0, transform: "translateY(-10px) scale(0.95)" })),
      ]),
    ]),
  ],
})
export class MainheaderComponent implements OnInit, OnDestroy {
  @ViewChild("searchInput") searchInput!: ElementRef

  // Input properties
  @Input() userName = "John Doe"
  @Input() userEmail = "john.doe@example.com"
  @Input() userAvatar: string | undefined
  @Input() lobid: string | undefined
  @Input() userId:string='';

  // Output events
  @Output() searchSubmit = new EventEmitter<string>()
  @Output() profileClick = new EventEmitter<void>()
  @Output() accountSettingsClick = new EventEmitter<void>()
  @Output() changePasswordClick = new EventEmitter<void>()
  @Output() logoutClick = new EventEmitter<void>()
  @Output() myLearningClick = new EventEmitter<void>()

  notifications: any[] = [];
  showDropdown: boolean = false;
  private connectionSub!: Subscription;


  // Search data arrays
  courseData: CourseData[] = []
  categoryData: CategoryData[] = []

  // Component state
  searchQuery = ""
  isProfileDropdownOpen = false

  // Search functionality
  isSearchActive = false
  showSearchResults = false
  isSearchLoading = false
  searchResults: any[] = []
  allCourses: Course[] = []
  isFilterDropdownOpen = false

  // Filter options
  filterOptions: FilterOption[] = [
    { value: "course", label: "Course", icon: "fas fa-book", placeholder: "courses" },
    { value: "category", label: "Category", icon: "fas fa-th-large", placeholder: "categories" },
  ]
  selectedFilter: FilterOption = this.filterOptions[0]

  // Typewriter effect properties
  displayText = ""
  fullText = "Learning Portal"
  typewriterSpeed = 100
  private typewriterInterval: any
  private currentIndex = 0
  private isErasing = false
  private eraseSpeed = 50
  private pauseDuration = 3000

  // RxJS subjects
  private destroy$ = new Subject<void>()
  private searchSubject = new Subject<string>()

  constructor(
    private router: Router,
    private courseService: CourseServicesService,
    private cdr: ChangeDetectorRef,
    private notificationService:NotificationService,
  ) {}

  ngOnInit(): void {
    this.startTypewriterEffect()
    this.setupSearchDebounce()
    this.loadCourses()
    this.notificationService.startConnection(this.userId);

    this.loadUnreadNotifications();

    // Listen to real-time messages
    this.notificationService['hubConnection'].on('ReceiveNotification', (notification: any) => {
      this.notifications.unshift(notification); // Add to top
    });
  }

  loadUnreadNotifications() {
    this.notificationService.getUnread(this.userId).subscribe((data) => {
      this.notifications = data;
    });
  }
  
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  markNotificationAsRead(id: number, index: number): void {
    this.notificationService.markAsRead(id).subscribe(() => {
      this.notifications.splice(index, 1);
    });
  }

  get unreadCount(): number {
    return this.notifications.length;
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval)
    }
    this.notificationService['hubConnection'].off('ReceiveNotification');
  }

  /**
   * Setup search debounce to avoid too many API calls
   */
  private setupSearchDebounce(): void {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((query) => {
      this.performSearch(query)
    })
  }

  /**
   * Load courses from API and populate search arrays
   */
  private loadCourses(): void {
    // Set default LOB ID for testing if not provided
    const testLobId = this.lobid || "LOB-ITC-20250610-072022-97863C"

    // Load from API
    this.courseService
      .getCourseWithCategoriesLob(testLobId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse) => {
          if (response && response.data && Array.isArray(response.data)) {
            this.allCourses = response.data
            this.processCourseData(response.data)
          }
        },
        error: (error) => {
          console.error("Error loading courses from API:", error)
        },
      })
  }

  /**
   * Process API course data into courseData and categoryData arrays
   */
  private processCourseData(courses: Course[]): void {
    const courseMap = new Map<string, CourseData>()
    const categoryMap = new Map<string, CategoryData>()

    courses.forEach((course) => {
      // Add to courseData
      if (course.course_id && course.course_name) {
        courseMap.set(course.course_id, {
          course_id: course.course_id,
          course_name: course.course_name,
          category_id: course.category_id,
          status: course.status,
        })
      }

      // Add to categoryData
      if (course.category_id && course.category_name) {
        categoryMap.set(course.category_id, {
          category_id: course.category_id,
          category_name: course.category_name,
          status: course.status,
        })
      }
    })

    this.courseData = Array.from(courseMap.values())
    this.categoryData = Array.from(categoryMap.values())

    // Force change detection
    this.cdr.detectChanges()
  }

  /**
   * Typewriter effect
   */
  startTypewriterEffect(): void {
    this.typewriterInterval = setInterval(() => {
      if (!this.isErasing && this.currentIndex < this.fullText.length) {
        this.displayText += this.fullText.charAt(this.currentIndex)
        this.currentIndex++
        if (this.currentIndex >= this.fullText.length) {
          clearInterval(this.typewriterInterval)
          setTimeout(() => {
            this.isErasing = true
            this.typewriterInterval = setInterval(this.typewriterCallback.bind(this), this.eraseSpeed)
          }, this.pauseDuration)
        }
      } else if (this.isErasing && this.displayText.length > 0) {
        this.displayText = this.displayText.substring(0, this.displayText.length - 1)
        if (this.displayText.length === 0) {
          this.isErasing = false
          this.currentIndex = 0
          clearInterval(this.typewriterInterval)
          setTimeout(() => {
            this.typewriterInterval = setInterval(this.typewriterCallback.bind(this), this.typewriterSpeed)
          }, 500)
        }
      }
    }, this.typewriterSpeed)
  }

  private typewriterCallback(): void {
    if (!this.isErasing && this.currentIndex < this.fullText.length) {
      this.displayText += this.fullText.charAt(this.currentIndex)
      this.currentIndex++
      if (this.currentIndex >= this.fullText.length) {
        clearInterval(this.typewriterInterval)
        setTimeout(() => {
          this.isErasing = true
          this.typewriterInterval = setInterval(this.typewriterCallback.bind(this), this.eraseSpeed)
        }, this.pauseDuration)
      }
    } else if (this.isErasing && this.displayText.length > 0) {
      this.displayText = this.displayText.substring(0, this.displayText.length - 1)
      if (this.displayText.length === 0) {
        this.isErasing = false
        this.currentIndex = 0
        clearInterval(this.typewriterInterval)
        setTimeout(() => {
          this.typewriterInterval = setInterval(this.typewriterCallback.bind(this), this.typewriterSpeed)
        }, 500)
      }
    }
  }

  // Search functionality methods
  onSearchInput(value: string): void {
    this.searchQuery = value

    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.isSearchLoading = true
      this.showSearchResults = true
      this.searchSubject.next(this.searchQuery.trim())
    } else {
      this.clearSearchResults()
    }
  }

  onSearchFocus(): void {
    this.isSearchActive = true
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.showSearchResults = true
      if (this.searchResults.length === 0) {
        this.onSearchInput(this.searchQuery)
      }
    }
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.isSearchActive = false
    }, 200)
  }

  /**
   * Perform search based on selected filter and search query
   */
  private performSearch(query: string): void {
    console.log("🎯 === PERFORMING SEARCH ===")
    console.log("🔍 Query:", query)
    console.log("🏷️ Filter:", this.selectedFilter.value)
    console.log("📚 Available courseData:", this.courseData.length, "items")
    console.log("📂 Available categoryData:", this.categoryData.length, "items")

    if (!query || query.length < 1) {
      console.log("❌ Empty query, clearing results")
      this.clearSearchResults()
      return
    }

    const searchTerm = query.toLowerCase().trim()
    console.log("🔤 Search term (lowercase):", searchTerm)

    // Clear previous results
    this.searchResults = []

    if (this.selectedFilter.value === "course") {
      console.log("📚 Searching in courses...")
      console.log("📚 Course data to search:", this.courseData)

      // Search in courseData array
      const filteredCourses = this.courseData.filter((course) => {
        const matches = course.course_name.toLowerCase().includes(searchTerm)
        console.log(`  📖 "${course.course_name}" matches "${searchTerm}": ${matches}`)
        return matches
      })

      console.log("✅ Filtered courses:", filteredCourses)

      // Create search results with proper structure
      this.searchResults = filteredCourses.map((course) => {
        const result = {
          course_id: course.course_id,
          course_name: course.course_name,
          category_id: course.category_id,
          status: course.status,
        }
        console.log("🎯 Creating course result:", result)
        return result
      })
    } else if (this.selectedFilter.value === "category") {
      console.log("📂 Searching in categories...")
      console.log("📂 Category data to search:", this.categoryData)

      // Search in categoryData array
      const filteredCategories = this.categoryData.filter((category) => {
        const matches = category.category_name.toLowerCase().includes(searchTerm)
        console.log(`  📁 "${category.category_name}" matches "${searchTerm}": ${matches}`)
        return matches
      })

      console.log("✅ Filtered categories:", filteredCategories)

      // Create search results with proper structure
      this.searchResults = filteredCategories.map((category) => {
        const result = {
          category_id: category.category_id,
          category_name: category.category_name,
          status: category.status,
        }
        console.log("🎯 Creating category result:", result)
        return result
      })
    }

    // Sort results by relevance (exact matches first)
    if (this.searchResults.length > 0) {
      this.searchResults.sort((a, b) => {
        const aName = this.selectedFilter.value === "course" ? a.course_name : a.category_name
        const bName = this.selectedFilter.value === "course" ? b.course_name : b.category_name

        const aExact = aName.toLowerCase() === searchTerm
        const bExact = bName.toLowerCase() === searchTerm

        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        return aName.localeCompare(bName)
      })
    }

    console.log("🔄 Setting search state:")
    console.log("  ⏳ isSearchLoading: false")
    console.log("  👁️ showSearchResults: true")
    console.log("  📊 searchResults.length:", this.searchResults.length)
    console.log("  📊 Final searchResults:", this.searchResults)

    this.isSearchLoading = false
    this.showSearchResults = true

    // Force change detection to ensure UI updates
    this.cdr.detectChanges()

    console.log("🏁 === SEARCH COMPLETE ===")
  }

  clearSearch(): void {
    this.searchQuery = ""
    this.clearSearchResults()
    if (this.searchInput) {
      this.searchInput.nativeElement.focus()
    }
  }

  private clearSearchResults(): void {
    this.searchResults = []
    this.showSearchResults = false
    this.isSearchLoading = false
    this.cdr.detectChanges()
  }

  closeSearchResults(): void {
    this.showSearchResults = false
    this.cdr.detectChanges()
  }

  // Filter functionality
  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen
  }

  selectFilter(filter: FilterOption): void {
    this.selectedFilter = filter
    this.isFilterDropdownOpen = false
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.onSearchInput(this.searchQuery)
    }
  }

  /**
   * Handle search result click and show alert
   */
  onSearchResultClick(result: any): void {
    this.closeSearchResults()

    if (this.selectedFilter.value === "course") {
      alert(`✅ Course Selected!\n\n📚 Course Name: ${result.course_name}\n🆔 Course ID: ${result.course_id}`)
    } else {
      alert(`📂 Category Selected!\n\n📂 Category Name: ${result.category_name}\n🆔 Category ID: ${result.category_id}`)
    }

    this.clearSearch()
  }

  // Utility methods for search results
  getCourseCountByCategory(categoryId: string): number {
    return this.courseData.filter((course) => course.category_id === categoryId).length
  }

  getCategoryNameById(categoryId: string): string {
    const category = this.categoryData.find((cat) => cat.category_id === categoryId)
    return category ? category.category_name : "Unknown Category"
  }

  trackByResultId(index: number, result: any): string {
    return this.selectedFilter.value === "course" ? result.course_id : result.category_id
  }

  navigateToHome(): void {
    this.router.navigate(["/home"])
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement
    const profileContainer = target.closest(".profile-container")
    if (!profileContainer && this.isProfileDropdownOpen) {
      this.closeDropdown()
    }

    const filterContainer = target.closest(".search-filter-dropdown")
    if (!filterContainer && this.isFilterDropdownOpen) {
      this.isFilterDropdownOpen = false
    }

    const searchContainer = target.closest(".search-container")
    const searchResultsDropdown = target.closest(".search-results-dropdown")
    if (!searchContainer && !searchResultsDropdown && this.showSearchResults) {
      this.closeSearchResults()
    }
  }

  @HostListener("document:keydown.escape", ["$event"])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isProfileDropdownOpen) {
      this.closeDropdown()
    }
    if (this.isFilterDropdownOpen) {
      this.isFilterDropdownOpen = false
    }
    if (this.showSearchResults) {
      this.closeSearchResults()
    }
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen
    if (this.isProfileDropdownOpen) {
      setTimeout(() => {
        this.profileClick.emit()
      }, 100)
    }
  }

  closeDropdown(): void {
    this.isProfileDropdownOpen = false
  }

  handleSearchSubmit(event: Event): void {
    event.preventDefault()
    if (this.searchQuery && this.searchQuery.trim()) {
      this.searchSubmit.emit(this.searchQuery.trim())
      if (this.searchResults.length > 0) {
        this.onSearchResultClick(this.searchResults[0])
      }
    }
  }

  onMyLearningClick(): void {
    this.myLearningClick.emit()
    this.router.navigate(["/mylearning"])
  }

  onProfileClick(): void {
    this.profileClick.emit()
  }

  getUserInitial(): string {
    if (!this.userName || this.userName.trim() === "") {
      return "U"
    }
    return this.userName.charAt(0).toUpperCase()
  }

  onAccountSettings(): void {
    this.closeDropdown()
    this.accountSettingsClick.emit()
    this.showMessage("Account Settings", `Opening account settings for ${this.userName}`)
    this.router.navigate(["/updateuser"])
  }

  onChangePassword(): void {
    this.closeDropdown()
    this.changePasswordClick.emit()
    this.showMessage("Change Password", `Opening change password for ${this.userName}`)
  }

  onLogout(): void {
    this.closeDropdown()
    try {
      localStorage.removeItem("authToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userInfo")
      localStorage.removeItem("userPermissions")
      sessionStorage.clear()
      this.logoutClick.emit()
      this.showMessage("Logout", `${this.userName} has been logged out successfully`)
      setTimeout(() => {
        this.router
          .navigate(["/login"])
          .then(() => {
            window.location.reload()
          })
          .catch((error) => {
            console.error("Navigation to login failed:", error)
            window.location.href = "/login"
          })
      }, 1000)
    } catch (error) {
      console.error("Error during logout:", error)
      this.router.navigate(["/login"])
    }
  }

  private showMessage(title: string, message: string): void {
    console.log(`${title}: ${message}`)
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken")
  }

  getAuthToken(): string | null {
    return localStorage.getItem("authToken")
  }

  private navigateWithDelay(route: string, delay = 300): void {
    this.closeDropdown()
    setTimeout(() => {
      this.router.navigate([route])
    }, delay)
  }
}
