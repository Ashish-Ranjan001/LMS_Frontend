import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
  type OnInit,
  type OnDestroy,
  ViewChild,
  type ElementRef,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import  { Router } from "@angular/router"
import { trigger, state, style, transition, animate } from "@angular/animations"

import { Subject, takeUntil, debounceTime, distinctUntilChanged } from "rxjs"
import { CourseServicesService } from "../../../services/courses/course-services.service"

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

@Component({
  selector: "app-dashheader",
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: "./dashheader.component.html",
  styleUrl: "./dashheader.component.css",
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
export class DashheaderComponent implements OnInit, OnDestroy {
  @ViewChild("searchInput") searchInput!: ElementRef

  // Input properties
  @Input() userName = "John Doe"
  @Input() userEmail = "john.doe@example.com"
  @Input() userAvatar: string | undefined
  @Input() lobid: string | undefined
  @Input() isSidebarOpen = false

  // Output events
  @Output() menuToggle = new EventEmitter<void>()
  @Output() searchSubmit = new EventEmitter<string>()
  @Output() profileClick = new EventEmitter<void>()
  @Output() accountSettingsClick = new EventEmitter<void>()
  @Output() changePasswordClick = new EventEmitter<void>()
  @Output() logoutClick = new EventEmitter<void>()
  @Output() myLearningClick = new EventEmitter<void>()

  // Component state
  searchQuery = ""
  isProfileDropdownOpen = false

  // Search functionality
  isSearchActive = false
  showSearchResults = false
  isSearchLoading = false
  searchResults: Course[] = []
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
    private courseService:CourseServicesService ,
  ) {}

  ngOnInit(): void {
    this.startTypewriterEffect()
    this.setupSearchDebounce()
    this.loadCourses()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()

    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval)
    }
  }

  /**
   * Setup search debounce to avoid too many API calls
   */
  private setupSearchDebounce(): void {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((query) => {
      console.log("Debounced search query:", query)
      this.performSearch(query)
    })
  }

  /**
   * Load courses from API
   */
  private loadCourses(): void {
    if (!this.lobid) {
      console.warn("LOB ID not provided, using mock data for testing")
      this.setMockData()
      return
    }

    console.log("Loading courses for LOB ID:", this.lobid)
    this.courseService
      .getCourseWithCategoriesLob(this.lobid)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse) => {
          console.log("API Response:", response)
          this.allCourses = response.data || []
          this.allCourses = this.allCourses.map((course) => ({
            ...course,
            category_name: course.category_name || "Database",
          }))
          console.log("Courses loaded:", this.allCourses.length, this.allCourses)
        },
        error: (error) => {
          console.error("Error loading courses:", error)
          this.setMockData()
        },
      })
  }

  /**
   * Set mock data for testing
   */
  private setMockData(): void {
    this.allCourses = [
      {
        course_id: "COURSE-SQL-001",
        course_name: "SQL Fundamentals",
        status: true,
        category_id: "CAT-DATABASE-001",
        category_name: "Database",
        lob_id: "LOB-ITC-001",
      },
      {
        course_id: "COURSE-MONGO-002",
        course_name: "MongoDB Basics",
        status: true,
        category_id: "CAT-DATABASE-001",
        category_name: "Database",
        lob_id: "LOB-ITC-001",
      },
      {
        course_id: "COURSE-MYSQL-003",
        course_name: "MySQL Advanced",
        status: true,
        category_id: "CAT-DATABASE-001",
        category_name: "Database",
        lob_id: "LOB-ITC-001",
      },
      {
        course_id: "COURSE-JS-004",
        course_name: "JavaScript Essentials",
        status: true,
        category_id: "CAT-PROGRAMMING-002",
        category_name: "Programming",
        lob_id: "LOB-ITC-001",
      },
      {
        course_id: "COURSE-REACT-005",
        course_name: "React Development",
        status: true,
        category_id: "CAT-PROGRAMMING-002",
        category_name: "Programming",
        lob_id: "LOB-ITC-001",
      },
    ]
    console.log("Mock data set:", this.allCourses)
  }

  /**
   * Improved typewriter effect
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
  onSearchInput(): void {
    console.log("Search input changed:", this.searchQuery)

    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.isSearchLoading = true
      this.showSearchResults = true
      this.searchSubject.next(this.searchQuery.trim())
    } else {
      this.clearSearchResults()
    }
  }

  onSearchFocus(): void {
    console.log("Search focused")
    this.isSearchActive = true
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.showSearchResults = true
      if (this.searchResults.length === 0) {
        this.onSearchInput()
      }
    }
  }

  onSearchBlur(): void {
    console.log("Search blurred")
    setTimeout(() => {
      this.isSearchActive = false
    }, 200)
  }

  private performSearch(query: string): void {
    console.log("Performing search for:", query)
    console.log("All courses available:", this.allCourses)
    console.log("Selected filter:", this.selectedFilter)

    if (!query || query.length < 1) {
      this.clearSearchResults()
      return
    }

    const searchTerm = query.toLowerCase()
    let filteredResults: Course[] = []

    if (this.selectedFilter.value === "course") {
      filteredResults = this.allCourses.filter((course) => {
        const matches = course.course_name.toLowerCase().includes(searchTerm)
        console.log(`Course "${course.course_name}" matches "${searchTerm}":`, matches)
        return matches
      })
      console.log("Course search results:", filteredResults)
    } else if (this.selectedFilter.value === "category") {
      const uniqueCategories = new Map<string, Course>()

      this.allCourses
        .filter((course) => {
          const categoryName = course.category_name || "Database"
          const matches = categoryName.toLowerCase().includes(searchTerm)
          console.log(`Category "${categoryName}" matches "${searchTerm}":`, matches)
          return matches
        })
        .forEach((course) => {
          if (!uniqueCategories.has(course.category_id)) {
            uniqueCategories.set(course.category_id, course)
          }
        })

      filteredResults = Array.from(uniqueCategories.values())
      console.log("Category search results:", filteredResults)
    }

    // Sort results by relevance
    filteredResults.sort((a, b) => {
      const aName = this.selectedFilter.value === "course" ? a.course_name : a.category_name || "Database"
      const bName = this.selectedFilter.value === "course" ? b.course_name : b.category_name || "Database"

      const aExact = aName.toLowerCase() === searchTerm
      const bExact = bName.toLowerCase() === searchTerm

      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1

      return aName.localeCompare(bName)
    })

    this.searchResults = filteredResults.slice(0, 10)
    this.isSearchLoading = false
    this.showSearchResults = true

    console.log("Final search results:", this.searchResults)
    console.log("Show search results:", this.showSearchResults)
  }

  clearSearch(): void {
    console.log("Clearing search")
    this.searchQuery = ""
    this.clearSearchResults()
    if (this.searchInput) {
      this.searchInput.nativeElement.focus()
    }
  }

  private clearSearchResults(): void {
    console.log("Clearing search results")
    this.searchResults = []
    this.showSearchResults = false
    this.isSearchLoading = false
  }

  closeSearchResults(): void {
    console.log("Closing search results")
    this.showSearchResults = false
  }

  // Filter functionality
  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen
    console.log("Filter dropdown toggled:", this.isFilterDropdownOpen)
  }

  selectFilter(filter: FilterOption): void {
    console.log("Filter selected:", filter)
    this.selectedFilter = filter
    this.isFilterDropdownOpen = false

    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.onSearchInput()
    }
  }

  // Search result click handler
  onSearchResultClick(result: Course): void {
    console.log("Search result clicked:", result)
    this.closeSearchResults()

    const userId = this.getUserId()

    let alertMessage = ""
    if (this.selectedFilter.value === "course") {
      alertMessage =
        `🎓 Course Selected!\n\n` +
        `📚 Course Name: ${result.course_name}\n` +
        `🆔 Course ID: ${result.course_id}\n` +
        `📂 Category: ${result.category_name || "Database"}\n` +
        `🏷️ Category ID: ${result.category_id}\n` +
        `👤 User ID: ${userId}\n` +
        `✅ Status: ${result.status ? "Active" : "Inactive"}`
    } else {
      const courseCount = this.getCourseCountByCategory(result.category_id)
      alertMessage =
        `📂 Category Selected!\n\n` +
        `🏷️ Category Name: ${result.category_name || "Database"}\n` +
        `🆔 Category ID: ${result.category_id}\n` +
        `📚 Total Courses: ${courseCount}\n` +
        `👤 User ID: ${userId}`
    }

    alert(alertMessage)
    this.clearSearch()
  }

  private getUserId(): string {
    try {
      const userInfo = localStorage.getItem("userInfo")
      if (userInfo) {
        const parsed = JSON.parse(userInfo)
        return parsed.id || parsed.userId || "USER_ID_NOT_FOUND"
      }

      const authToken = localStorage.getItem("authToken")
      if (authToken) {
        return "USER_ID_FROM_TOKEN"
      }

      return "USER_ID_NOT_FOUND"
    } catch (error) {
      console.error("Error getting user ID:", error)
      return "USER_ID_ERROR"
    }
  }

  // Utility methods for search results
  getCourseCountByCategory(categoryId: string): number {
    return this.allCourses.filter((course) => course.category_id === categoryId).length
  }

  trackByResultId(index: number, result: Course): string {
    return this.selectedFilter.value === "course" ? result.course_id : result.category_id
  }

  navigateToHome(): void {
    this.router.navigate(["dashboard"])
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

  // Menu toggle for sidebar
  onMenuToggle(): void {
    this.menuToggle.emit()
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
    console.log("Search form submitted:", this.searchQuery)
    if (this.searchQuery && this.searchQuery.trim()) {
      this.searchSubmit.emit(this.searchQuery.trim())
      if (this.searchResults.length > 0) {
        this.onSearchResultClick(this.searchResults[0])
      }
    }
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
    console.log(`Account Settings clicked for user: ${this.userName}`)
    this.closeDropdown()
    this.accountSettingsClick.emit()
    this.showMessage("Account Settings", `Opening account settings for ${this.userName}`)
    this.router.navigate(["/updateuser"])
  }

  onChangePassword(): void {
    console.log(`Change Password clicked for user: ${this.userName}`)
    this.closeDropdown()
    this.changePasswordClick.emit()
    this.showMessage("Change Password", `Opening change password for ${this.userName}`)
  }

  onLogout(): void {
    console.log(`Logout clicked for user: ${this.userName}`)
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