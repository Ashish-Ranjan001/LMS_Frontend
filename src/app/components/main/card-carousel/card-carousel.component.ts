

// import { Component, type OnInit, type OnDestroy, signal, computed, effect } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { DashboardServicesService } from '../../../services/homedashboard/dashboard-services.service';
// import { jwtDecode } from 'jwt-decode';
// import { Router } from "@angular/router";

// interface CourseCard {
//   id: number
//   title: string
//   count: number
//   icon: string
//   color: string
//   bgGradient: string
//   graphColor: string
//   shadowColor: string
// }

// interface CategoryStats {
//   categoryName: string;
//   totalCourses: number;
//   enrolledCourses: number;
//   completedCourses: number;
//   inProgressCourses: number;
// }

// @Component({
//   selector: "app-card-carousel",
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: "./card-carousel.component.html",
//   styleUrls: ["./card-carousel.component.css"],
// })
// export class CardCarouselComponent implements OnInit, OnDestroy {
//   public currentIndex = signal(0)
//   private intervalId: any
//   private animationTimeouts: any[] = []
//   public progressWidth = signal(0)
  
//   // Dynamic data properties
//   userId: string | null = null;
//   isLoading = signal(true);
//   error = signal<string | null>(null);
  
//   // Totals from API
//   totalCompleted = 0;
//   totalInProgress = 0;
//   totalEnrolled = 0;
//   totalCourses = 0;

//   cards: CourseCard[] = []

//   currentCard = computed(() => this.cards[this.currentIndex()])
//   animatedCount = signal(0)
//   isTransitioning = signal(false)

//   constructor(private dashboardService: DashboardServicesService , private router:Router) {
//     // Progress bar effect
//     effect(() => {
//       if (!this.isTransitioning()) {
//         this.startProgressBar()
//       }
//     })
//   }

//   ngOnInit() {
//     this.userId = this.getDecodedUserId();
//     if (this.userId) {
//       this.loadCourseStats();
//     } else {
//       this.error.set('Unable to retrieve user ID from token');
//       this.isLoading.set(false);
//       this.setDefaultCards();
//       this.initializeCarousel();
//     }
//   }

//   ngOnDestroy() {
//     if (this.intervalId) {
//       clearInterval(this.intervalId)
//     }
//     this.animationTimeouts.forEach((timeout) => clearTimeout(timeout))
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

//     this.isLoading.set(true);
    
//     // Note: Based on your comment, the service now accepts string userId
//     this.dashboardService.getStatsForHomeBanner(this.userId).subscribe({
//       next: (data: any) => {
//         console.log('Course stats received for carousel:', data);
//         this.processCategoryStats(data);
//         this.isLoading.set(false);
//         this.error.set(null);
//         this.initializeCarousel();
//       },
//       error: (error: any) => {
//         console.error('Error loading course stats:', error);
//         this.error.set('Failed to load course statistics');
//         this.isLoading.set(false);
//         this.setDefaultCards();
//         this.initializeCarousel();
//       }
//     });
//   }

//   processCategoryStats(categoryStats: CategoryStats[]): void {
//     // Reset totals
//     this.totalCompleted = 0;
//     this.totalInProgress = 0;
//     this.totalEnrolled = 0;
//     this.totalCourses = 0;

//     // Calculate totals from all categories
//     categoryStats.forEach((category: CategoryStats) => {
//       this.totalCourses += category.totalCourses || 0;
//       this.totalEnrolled += category.enrolledCourses || 0;
//       this.totalInProgress += category.inProgressCourses || 0;
//       this.totalCompleted += category.completedCourses || 0;
//     });

//     // Calculate saved courses (you might want to adjust this logic based on your business rules)
//     const savedCourses = Math.max(0, this.totalEnrolled - this.totalInProgress - this.totalCompleted);

//     // Create cards with dynamic data
//     this.cards = [
//       {
//         id: 1,
//         title: "Completed Courses",
//         count: this.totalCompleted,
//         icon: "🎯",
//         color: "#667eea",
//         bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         graphColor: "#667eea",
//         shadowColor: "rgba(102, 126, 234, 0.3)",
//       },
//       {
//         id: 2,
//         title: "Ongoing Courses",
//         count: this.totalInProgress,
//         icon: "🚀",
//         color: "#f093fb",
//         bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//         graphColor: "#f093fb",
//         shadowColor: "rgba(240, 147, 251, 0.3)",
//       },
//       {
//         id: 3,
//         title: "Total Enrolled",
//         count: this.totalEnrolled,
//         icon: "💎",
//         color: "#4facfe",
//         bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
//         graphColor: "#4facfe",
//         shadowColor: "rgba(79, 172, 254, 0.3)",
//       },
//       {
//         id: 4,
//         title: "All Courses",
//         count: this.totalCourses,
//         icon: "⭐",
//         color: "#43e97b",
//         bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
//         graphColor: "#43e97b",
//         shadowColor: "rgba(67, 233, 123, 0.3)",
//       },
//     ];
//   }

//   setDefaultCards(): void {
//     // Set default cards when API fails or no user ID
//     this.cards = [
//       {
//         id: 1,
//         title: "Completed Courses",
//         count: 0,
//         icon: "🎯",
//         color: "#667eea",
//         bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         graphColor: "#667eea",
//         shadowColor: "rgba(102, 126, 234, 0.3)",
//       },
//       {
//         id: 2,
//         title: "Ongoing Courses",
//         count: 0,
//         icon: "🚀",
//         color: "#f093fb",
//         bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//         graphColor: "#f093fb",
//         shadowColor: "rgba(240, 147, 251, 0.3)",
//       },
//       {
//         id: 3,
//         title: "Total Enrolled",
//         count: 0,
//         icon: "💎",
//         color: "#4facfe",
//         bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
//         graphColor: "#4facfe",
//         shadowColor: "rgba(79, 172, 254, 0.3)",
//       },
//       {
//         id: 4,
//         title: "All Courses",
//         count: 0,
//         icon: "⭐",
//         color: "#43e97b",
//         bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
//         graphColor: "#43e97b",
//         shadowColor: "rgba(67, 233, 123, 0.3)",
//       },
//     ];
//   }

//   initializeCarousel(): void {
//     if (this.cards.length > 0) {
//       this.startCarousel();
//       this.animateCount();
//       this.startProgressBar();
//     }
//   }

//   handleDashboardClick(): void {
//     this.router.navigate(['/categories']);
//   }

//   startProgressBar() {
//     // Reset progress
//     this.progressWidth.set(0)

//     // Animate progress over 5 seconds
//     const startTime = Date.now()
//     const duration = 5000 // Exactly 5 seconds

//     const updateProgress = () => {
//       const elapsed = Date.now() - startTime
//       const progress = Math.min((elapsed / duration) * 100, 100)
//       this.progressWidth.set(progress)

//       if (progress < 100) {
//         requestAnimationFrame(updateProgress)
//       }
//     }

//     requestAnimationFrame(updateProgress)
//   }

//   startCarousel() {
//     if (this.intervalId) {
//       clearInterval(this.intervalId)
//     }

//     this.intervalId = setInterval(() => {
//       this.nextCard()
//     }, 8000) // Exactly 5 seconds
//   }

//   nextCard() {
//     if (this.cards.length === 0) return;
    
//     this.isTransitioning.set(true)
//     setTimeout(() => {
//       this.currentIndex.set((this.currentIndex() + 1) % this.cards.length)
//       this.animateCount()
//       this.isTransitioning.set(false)
//     }, 300)
//   }

//   previousCard() {
//     if (this.cards.length === 0) return;
    
//     this.isTransitioning.set(true)
//     setTimeout(() => {
//       this.currentIndex.set(this.currentIndex() === 0 ? this.cards.length - 1 : this.currentIndex() - 1)
//       this.animateCount()
//       this.isTransitioning.set(false)
//     }, 300)
//   }

//   selectCard(index: number) {
//     if (index === this.currentIndex() || this.cards.length === 0) return

//     this.isTransitioning.set(true)
//     setTimeout(() => {
//       this.currentIndex.set(index)
//       this.animateCount()
//       this.isTransitioning.set(false)
//     }, 300)

//     // Reset carousel timer
//     if (this.intervalId) {
//       clearInterval(this.intervalId)
//       this.startCarousel()
//     }
//   }

//   private animateCount() {
//     if (this.cards.length === 0) return;
  
//     const current = this.currentCard();
//     if (!current) return;
  
//     this.animatedCount.set(0);
//     const targetCount = current.count;
//     const duration = 1000;
//     const steps = 20;
//     let currentStep = 0;
  
//     this.animationTimeouts.forEach((timeout) => clearTimeout(timeout));
//     this.animationTimeouts = [];
  
//     const animate = () => {
//       if (currentStep < steps) {
//         const progress = currentStep / steps;
//         const easedProgress = this.easeOutCubic(progress);
//         this.animatedCount.set(Math.floor(targetCount * easedProgress));
//         currentStep++;
//         const timeout = setTimeout(animate, duration / steps);
//         this.animationTimeouts.push(timeout);
//       } else {
//         this.animatedCount.set(targetCount);
//       }
//     };
  
//     animate();
//   }
  

//   // private animateCount() {
//   //   if (this.cards.length === 0) return;
    
//   //   this.animatedCount.set(0)
//   //   const targetCount = this.currentCard().count
//   //   const duration = 1000 // Faster animation (1 second)
//   //   const steps = 20 // Fewer steps for faster animation
//   //   const increment = targetCount / steps
//   //   let currentStep = 0

//   //   // Clear existing timeouts
//   //   this.animationTimeouts.forEach((timeout) => clearTimeout(timeout))
//   //   this.animationTimeouts = []

//   //   const animate = () => {
//   //     if (currentStep < steps) {
//   //       // Cubic easing for smoother animation
//   //       const progress = currentStep / steps
//   //       const easedProgress = this.easeOutCubic(progress)
//   //       this.animatedCount.set(Math.floor(targetCount * easedProgress))
//   //       currentStep++
//   //       const timeout = setTimeout(animate, duration / steps)
//   //       this.animationTimeouts.push(timeout)
//   //     } else {
//   //       this.animatedCount.set(targetCount)
//   //     }
//   //   }

//   //   // Start animation immediately
//   //   animate()
//   // }

//   // Cubic easing function for smoother animation
//   private easeOutCubic(x: number): number {
//     return 1 - Math.pow(1 - x, 3)
//   }

//   getGraphPoints(): string {
//     const width = 100
//     const height = 35
//     const points = 12
//     let pathData = ""

//     // Create a more dynamic graph based on the current card index
//     const cardIndex = this.currentIndex()
//     const seed = cardIndex * 0.25 // Different seed for each card

//     for (let i = 0; i <= points; i++) {
//       const x = (i / points) * width
//       const progress = i / points

//       // Create a more interesting curve with multiple sine waves
//       const wave1 = Math.sin((progress + seed) * Math.PI * 2) * 0.3
//       const wave2 = Math.sin((progress + seed) * Math.PI * 4) * 0.15
//       const baseHeight = 0.7 - wave1 - wave2

//       // Adjust y position based on progress to create an upward trend
//       const trendFactor = 0.3 * (1 - progress)
//       const y = height - (baseHeight + trendFactor) * height

//       pathData += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
//     }

//     return pathData
//   }

//   refreshData(): void {
//     if (this.userId) {
//       this.loadCourseStats();
//     }
//   }
// }


import { Component, type OnInit, type OnDestroy, signal, computed, effect } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DashboardServicesService } from '../../../services/homedashboard/dashboard-services.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from "@angular/router";

interface CourseCard {
  id: number
  title: string
  count: number
  icon: string
  color: string
  bgGradient: string
  graphColor: string
  shadowColor: string
}

interface CategoryStats {
  categoryName: string;
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
}

@Component({
  selector: "app-card-carousel",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./card-carousel.component.html",
  styleUrls: ["./card-carousel.component.css"],
})
export class CardCarouselComponent implements OnInit, OnDestroy {
  public currentIndex = signal(0)
  private intervalId: any
  private animationTimeouts: any[] = []
  public progressWidth = signal(0)
  
  // Dynamic data properties
  userId: string | null = null;
  isLoading = signal(true);
  error = signal<string | null>(null);
  
  // Totals from API
  totalCompleted = 0;
  totalInProgress = 0;
  totalEnrolled = 0;
  totalCourses = 0;

  cards: CourseCard[] = []

  // FIX: Add null safety to currentCard computed
  currentCard = computed(() => {
    if (!this.cards || this.cards.length === 0) {
      return this.getDefaultCard();
    }
    const index = this.currentIndex();
    return this.cards[index] || this.getDefaultCard();
  })

  animatedCount = signal(0)
  isTransitioning = signal(false)

  private sessionStorageKey: string = '';

  constructor(private dashboardService: DashboardServicesService , private router:Router) {
    // Initialize with default cards to prevent undefined errors
    this.setDefaultCards();
    
    // Progress bar effect
    effect(() => {
      if (!this.isTransitioning()) {
        this.startProgressBar()
      }
    })
  }

  ngOnInit() {
    this.userId = this.getDecodedUserId();
    if (this.userId) {
      this.sessionStorageKey = `cardCarouselStats_${this.userId}`;
      // Check session storage first
      const cached = sessionStorage.getItem(this.sessionStorageKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          this.processCategoryStats(parsed);
          this.isLoading.set(false);
          this.error.set(null);
          this.initializeCarousel();
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
      this.error.set('Unable to retrieve user ID from token');
      this.isLoading.set(false);
      this.setDefaultCards();
      this.initializeCarousel();
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.animationTimeouts.forEach((timeout) => clearTimeout(timeout))
    window.removeEventListener('storage', this.handleStorageChange);
  }


  // FIX: Add method to return default card when cards array is empty
  private getDefaultCard(): CourseCard {
    return {
      id: 1,
      title: "Loading...",
      count: 0,
      icon: "🎯",
      color: "#667eea",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      graphColor: "#667eea",
      shadowColor: "rgba(102, 126, 234, 0.3)",
    };
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
      console.log("=== DECODED TOKEN ===", decodedToken);

      const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
      console.log("=== EXTRACTED USER ID ===", userId);
      return userId ? String(userId) : null;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }

  loadCourseStats(): void {
    if (!this.userId) return;

    this.isLoading.set(true);
    
    this.dashboardService.getStatsForHomeBanner(this.userId).subscribe({
      next: (data: any) => {
        // Cache to session storage
        sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(data));
        this.processCategoryStats(data);
        this.isLoading.set(false);
        this.error.set(null);
        this.initializeCarousel();
      },
      error: (error: any) => {
        console.error('Error loading course stats:', error);
        this.error.set('Failed to load course statistics');
        this.isLoading.set(false);
        this.setDefaultCards();
        this.initializeCarousel();
      }
    });
  }

  processCategoryStats(categoryStats: CategoryStats[]): void {
    // Reset totals
    this.totalCompleted = 0;
    this.totalInProgress = 0;
    this.totalEnrolled = 0;
    this.totalCourses = 0;

    // Calculate totals from all categories
    categoryStats.forEach((category: CategoryStats) => {
      this.totalCourses += category.totalCourses || 0;
      this.totalEnrolled += category.enrolledCourses || 0;
      this.totalInProgress += category.inProgressCourses || 0;
      this.totalCompleted += category.completedCourses || 0;
    });

    // Calculate saved courses (you might want to adjust this logic based on your business rules)
    const savedCourses = Math.max(0, this.totalEnrolled - this.totalInProgress - this.totalCompleted);

    // Create cards with dynamic data
    this.cards = [
      {
        id: 1,
        title: "Completed Courses",
        count: this.totalCompleted,
        icon: "🎯",
        color: "#667eea",
        bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        graphColor: "#667eea",
        shadowColor: "rgba(102, 126, 234, 0.3)",
      },
      {
        id: 2,
        title: "Ongoing Courses",
        count: this.totalInProgress,
        icon: "🚀",
        color: "#f093fb",
        bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        graphColor: "#f093fb",
        shadowColor: "rgba(240, 147, 251, 0.3)",
      },
      {
        id: 3,
        title: "Total Enrolled",
        count: this.totalEnrolled,
        icon: "💎",
        color: "#4facfe",
        bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        graphColor: "#4facfe",
        shadowColor: "rgba(79, 172, 254, 0.3)",
      },
      {
        id: 4,
        title: "All Courses",
        count: this.totalCourses,
        icon: "⭐",
        color: "#43e97b",
        bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        graphColor: "#43e97b",
        shadowColor: "rgba(67, 233, 123, 0.3)",
      },
    ];
  }

  setDefaultCards(): void {
    // Set default cards when API fails or no user ID
    this.cards = [
      {
        id: 1,
        title: "Completed Courses",
        count: 0,
        icon: "🎯",
        color: "#667eea",
        bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        graphColor: "#667eea",
        shadowColor: "rgba(102, 126, 234, 0.3)",
      },
      {
        id: 2,
        title: "Ongoing Courses",
        count: 0,
        icon: "🚀",
        color: "#f093fb",
        bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        graphColor: "#f093fb",
        shadowColor: "rgba(240, 147, 251, 0.3)",
      },
      {
        id: 3,
        title: "Total Enrolled",
        count: 0,
        icon: "💎",
        color: "#4facfe",
        bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        graphColor: "#4facfe",
        shadowColor: "rgba(79, 172, 254, 0.3)",
      },
      {
        id: 4,
        title: "All Courses",
        count: 0,
        icon: "⭐",
        color: "#43e97b",
        bgGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        graphColor: "#43e97b",
        shadowColor: "rgba(67, 233, 123, 0.3)",
      },
    ];
  }

  initializeCarousel(): void {
    if (this.cards.length > 0) {
      this.startCarousel();
      this.animateCount();
      this.startProgressBar();
    }
  }

  handleDashboardClick(): void {
    this.router.navigate(['/categories']);
  }

  startProgressBar() {
    // Reset progress
    this.progressWidth.set(0)

    // Animate progress over 5 seconds
    const startTime = Date.now()
    const duration = 5000 // Exactly 5 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / duration) * 100, 100)
      this.progressWidth.set(progress)

      if (progress < 100) {
        requestAnimationFrame(updateProgress)
      }
    }

    requestAnimationFrame(updateProgress)
  }

  startCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }

    this.intervalId = setInterval(() => {
      this.nextCard()
    }, 8000) // Exactly 5 seconds
  }

  nextCard() {
    if (this.cards.length === 0) return;
    
    this.isTransitioning.set(true)
    setTimeout(() => {
      this.currentIndex.set((this.currentIndex() + 1) % this.cards.length)
      this.animateCount()
      this.isTransitioning.set(false)
    }, 300)
  }

  previousCard() {
    if (this.cards.length === 0) return;
    
    this.isTransitioning.set(true)
    setTimeout(() => {
      this.currentIndex.set(this.currentIndex() === 0 ? this.cards.length - 1 : this.currentIndex() - 1)
      this.animateCount()
      this.isTransitioning.set(false)
    }, 300)
  }

  selectCard(index: number) {
    if (index === this.currentIndex() || this.cards.length === 0) return

    this.isTransitioning.set(true)
    setTimeout(() => {
      this.currentIndex.set(index)
      this.animateCount()
      this.isTransitioning.set(false)
    }, 300)

    // Reset carousel timer
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.startCarousel()
    }
  }

  private animateCount() {
    if (this.cards.length === 0) return;
  
    const current = this.currentCard();
    if (!current) return;
  
    this.animatedCount.set(0);
    const targetCount = current.count;
    const duration = 1000;
    const steps = 20;
    let currentStep = 0;
  
    this.animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.animationTimeouts = [];
  
    const animate = () => {
      if (currentStep < steps) {
        const progress = currentStep / steps;
        const easedProgress = this.easeOutCubic(progress);
        this.animatedCount.set(Math.floor(targetCount * easedProgress));
        currentStep++;
        const timeout = setTimeout(animate, duration / steps);
        this.animationTimeouts.push(timeout);
      } else {
        this.animatedCount.set(targetCount);
      }
    };
  
    animate();
  }

  private easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3)
  }

  getGraphPoints(): string {
    const width = 100
    const height = 35
    const points = 12
    let pathData = ""

    // Create a more dynamic graph based on the current card index
    const cardIndex = this.currentIndex()
    const seed = cardIndex * 0.25 // Different seed for each card

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width
      const progress = i / points

      // Create a more interesting curve with multiple sine waves
      const wave1 = Math.sin((progress + seed) * Math.PI * 2) * 0.3
      const wave2 = Math.sin((progress + seed) * Math.PI * 4) * 0.15
      const baseHeight = 0.7 - wave1 - wave2

      // Adjust y position based on progress to create an upward trend
      const trendFactor = 0.3 * (1 - progress)
      const y = height - (baseHeight + trendFactor) * height

      pathData += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
    }

    return pathData
  }

  refreshData(): void {
    if (this.userId) {
      // Clear cache and fetch again
      sessionStorage.removeItem(this.sessionStorageKey);
      this.loadCourseStats();
    }
  }
}