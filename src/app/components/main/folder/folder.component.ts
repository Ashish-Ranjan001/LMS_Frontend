// import { Component, type OnInit } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { trigger, state, style, transition, animate } from "@angular/animations"
// import { DashboardServicesService } from '../../../services/homedashboard/dashboard-services.service';
// import { jwtDecode } from 'jwt-decode';

// interface FolderCard {
//   id: number
//   title: string
//   value: string
//   subtitle: string
//   icon: string
//   gradient: string
//   textColor: string
//   percentage?: string
//   percentageColor?: string
// }

// interface CategoryStats {
//   categoryName: string;
//   totalCourses: number;
//   enrolledCourses: number;
//   completedCourses: number;
//   inProgressCourses: number;
// }

// @Component({
//   selector: "app-folder",
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: "./folder.component.html",
//   styleUrls: ["./folder.component.css"],
//   animations: [
//     trigger("folderState", [
//       state("closed", style({ transform: "translateY(0) scale(0.7)" })),
//       state("open", style({ transform: "translateY(-4px) scale(0.7)" })),
//       transition("closed <=> open", animate("400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)")),
//     ]),
//     trigger("paperState", [
//       state(
//         "closed",
//         style({
//           transform: "translate(-50%, 10%)",
//           opacity: 1,
//         }),
//       ),
//       state(
//         "open1",
//         style({
//           transform: "translate(-140%, -80%) rotateZ(-20deg)",
//           opacity: 1,
//         }),
//       ),
//       state(
//         "open2",
//         style({
//           transform: "translate(20%, -80%) rotateZ(20deg)",
//           opacity: 1,
//         }),
//       ),
//       state(
//         "open3",
//         style({
//           transform: "translate(-50%, -120%) rotateZ(5deg)",
//           opacity: 1,
//         }),
//       ),
//       transition("closed => open1", animate("500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)")),
//       transition("closed => open2", animate("500ms 100ms cubic-bezier(0.68, -0.55, 0.265, 1.55)")),
//       transition("closed => open3", animate("500ms 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)")),
//       transition("open1 => closed", animate("400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)")),
//       transition("open2 => closed", animate("400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)")),
//       transition("open3 => closed", animate("400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)")),
//     ]),
//   ],
// })
// export class FolderComponent implements OnInit {
//   isOpen = false
//   folderColor = "#5227FF"
//   folderBackColor = "#4A1FE7"

//   // Dynamic data properties
//   userId: string | null = null;
//   isLoading = true;
//   error: string | null = null;
  
//   // Data from API
//   totalCategories = 0;
//   totalInProgress = 0;
//   totalCompleted = 0;
//   previousTotalCategories = 0;
//   previousInProgress = 0;
//   previousCompleted = 0;

//   cards: FolderCard[] = []

//   paperOffsets: { x: number; y: number }[] = [
//     { x: 0, y: 0 },
//     { x: 0, y: 0 },
//     { x: 0, y: 0 },
//   ]

//   constructor(private dashboardService: DashboardServicesService) {}

//   ngOnInit(): void {
//     this.userId = this.getDecodedUserId();
//     if (this.userId) {
//       this.loadCategoryStats();
//     } else {
//       this.error = 'Unable to retrieve user ID from token';
//       this.isLoading = false;
//       this.setDefaultCards();
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

//   loadCategoryStats(): void {
//     if (!this.userId) return;

//     this.isLoading = true;
    
//     this.dashboardService.getStatsForHomeBanner(this.userId).subscribe({
//       next: (data: any) => {
//         console.log('Category stats received for folder:', data);
//         this.processCategoryStats(data);
//         this.isLoading = false;
//         this.error = null;
//       },
//       error: (error: any) => {
//         console.error('Error loading category stats:', error);
//         this.error = 'Failed to load category statistics';
//         this.isLoading = false;
//         this.setDefaultCards();
//       }
//     });
//   }

//   processCategoryStats(categoryStats: CategoryStats[]): void {
//     // Store previous values for percentage calculation
//     this.previousTotalCategories = this.totalCategories;
//     this.previousInProgress = this.totalInProgress;
//     this.previousCompleted = this.totalCompleted;

//     // Reset totals
//     this.totalCategories = 0;
//     this.totalInProgress = 0;
//     this.totalCompleted = 0;

//     // Count unique categories and aggregate courses
//     const uniqueCategories = new Set<string>();
    
//     categoryStats.forEach((category: CategoryStats) => {
//       if (category.categoryName) {
//         uniqueCategories.add(category.categoryName);
//       }
//       this.totalInProgress += category.inProgressCourses || 0;
//       this.totalCompleted += category.completedCourses || 0;
//     });

//     this.totalCategories = uniqueCategories.size;

//     // Calculate percentage changes
//     const categoriesPercentage = this.calculatePercentageChange(this.previousTotalCategories, this.totalCategories);
//     const inProgressPercentage = this.calculatePercentageChange(this.previousInProgress, this.totalInProgress);
//     const completedPercentage = this.calculatePercentageChange(this.previousCompleted, this.totalCompleted);

//     // Create cards with dynamic data
//     this.cards = [
//       {
//         id: 1,
//         title: "Total Categories",
//         value: this.totalCategories.toString(),
//         subtitle: "Available Categories",
//         icon: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
//         gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         textColor: "#ffffff",
//         percentage: categoriesPercentage.display,
//         percentageColor: categoriesPercentage.isPositive ? "#a7f3d0" : "#fca5a5",
//       },
//       {
//         id: 2,
//         title: "Ongoing Courses",
//         value: this.totalInProgress.toString(),
//         subtitle: "In Progress",
//         icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
//         gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//         textColor: "#ffffff",
//         percentage: inProgressPercentage.display,
//         percentageColor: inProgressPercentage.isPositive ? "#fde68a" : "#fca5a5",
//       },
//       {
//         id: 3,
//         title: "Completed Courses",
//         value: this.totalCompleted > 99 ? "99+" : this.totalCompleted.toString(),
//         subtitle: "Finished",
//         icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
//         gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
//         textColor: "#1f2937",
//         percentage: completedPercentage.display,
//         percentageColor: completedPercentage.isPositive ? "#34d399" : "#ef4444",
//       },
//     ];
//   }

//   calculatePercentageChange(previousValue: number, currentValue: number): { display: string, isPositive: boolean } {
//     // If no previous data (first load), show no percentage
//     if (previousValue === 0 && this.previousTotalCategories === 0) {
//       return { display: '', isPositive: true };
//     }

//     // If previous value was 0 but current has value
//     if (previousValue === 0 && currentValue > 0) {
//       return { display: '+100%', isPositive: true };
//     }

//     // Calculate percentage change
//     const change = ((currentValue - previousValue) / previousValue) * 100;
//     const rounded = Math.round(Math.abs(change));
    
//     if (change > 0) {
//       return { display: `+${rounded}%`, isPositive: true };
//     } else if (change < 0) {
//       return { display: `-${rounded}%`, isPositive: false };
//     } else {
//       return { display: '0%', isPositive: true };
//     }
//   }

//   setDefaultCards(): void {
//     this.cards = [
//       {
//         id: 1,
//         title: "Total Categories",
//         value: "0",
//         subtitle: "Available Categories",
//         icon: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
//         gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         textColor: "#ffffff",
//         percentage: "",
//         percentageColor: "#a7f3d0",
//       },
//       {
//         id: 2,
//         title: "Ongoing Courses",
//         value: "0",
//         subtitle: "In Progress",
//         icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
//         gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//         textColor: "#ffffff",
//         percentage: "",
//         percentageColor: "#fde68a",
//       },
//       {
//         id: 3,
//         title: "Completed Courses",
//         value: "0",
//         subtitle: "Finished",
//         icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
//         gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
//         textColor: "#1f2937",
//         percentage: "",
//         percentageColor: "#34d399",
//       },
//     ];
//   }

//   toggleFolder(): void {
//     this.isOpen = !this.isOpen
//     if (!this.isOpen) {
//       this.resetPaperOffsets()
//     }
//   }

//   onPaperMouseMove(event: MouseEvent, index: number): void {
//     if (!this.isOpen) return

//     const target = event.currentTarget as HTMLElement
//     const rect = target.getBoundingClientRect()
//     const centerX = rect.left + rect.width / 2
//     const centerY = rect.top + rect.height / 2

//     // Reduced magnet effect to prevent folder separation
//     const offsetX = (event.clientX - centerX) * 0.08
//     const offsetY = (event.clientY - centerY) * 0.08

//     this.paperOffsets[index] = { x: offsetX, y: offsetY }
//   }

//   onPaperMouseLeave(index: number): void {
//     // Smooth return to original position
//     this.paperOffsets[index] = { x: 0, y: 0 }
//   }

//   resetPaperOffsets(): void {
//     this.paperOffsets = [
//       { x: 0, y: 0 },
//       { x: 0, y: 0 },
//       { x: 0, y: 0 },
//     ]
//   }

//   getPaperState(index: number): string {
//     if (!this.isOpen) return "closed"
//     return `open${index + 1}`
//   }

//   getPaperStyle(index: number): any {
//     if (!this.isOpen) return {}
//     return {
//       "--magnet-x": `${this.paperOffsets[index].x}px`,
//       "--magnet-y": `${this.paperOffsets[index].y}px`,
//     }
//   }

//   darkenColor(hex: string, percent: number): string {
//     let color = hex.startsWith("#") ? hex.slice(1) : hex
//     if (color.length === 3) {
//       color = color
//         .split("")
//         .map((c) => c + c)
//         .join("")
//     }
//     const num = Number.parseInt(color, 16)
//     let r = (num >> 16) & 0xff
//     let g = (num >> 8) & 0xff
//     let b = num & 0xff
//     r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))))
//     g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))))
//     b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))))
//     return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
//   }

//   handleCardClick(index: number): void {
//     if (this.isLoading) return;
    
//     switch (index) {
//         case 0:
//             this.alertCard1();
//             break;
//         case 1:
//             this.alertCard2();
//             break;
//         case 2:
//             this.alertCard3();
//             break;
//         default:
//             break;
//     }
//   }

//   alertCard1(): void {
//     alert(`Total Categories: ${this.totalCategories}\nClick to view all categories!`);
//   }

//   alertCard2(): void {
//     alert(`Ongoing Courses: ${this.totalInProgress}\nClick to view your ongoing courses!`);
//   }

//   alertCard3(): void {
//     alert(`Completed Courses: ${this.totalCompleted}\nClick to view your completed courses!`);
//   }

//   refreshData(): void {
//     if (this.userId) {
//       this.loadCategoryStats();
//     }
//   }
// }



import { Component, type OnInit, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { trigger, state, style, transition, animate } from "@angular/animations"
import { DashboardServicesService } from '../../../services/homedashboard/dashboard-services.service';
import { jwtDecode } from 'jwt-decode';

interface FolderCard {
  id: number
  title: string
  value: string
  subtitle: string
  icon: string
  gradient: string
  textColor: string
  percentage?: string
  percentageColor?: string
}

interface CategoryStats {
  categoryName: string;
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
}

@Component({
  selector: "app-folder",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./folder.component.html",
  styleUrls: ["./folder.component.css"],
  animations: [
    trigger("folderState", [
      state("closed", style({ transform: "translateY(0) scale(0.7)" })),
      state("open", style({ transform: "translateY(-4px) scale(0.7)" })),
      transition("closed <=> open", animate("400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)")),
    ]),
    trigger("paperState", [
      state(
        "closed",
        style({
          transform: "translate(-50%, 10%)",
          opacity: 1,
        }),
      ),
      state(
        "open1",
        style({
          transform: "translate(-140%, -80%) rotateZ(-20deg)",
          opacity: 1,
        }),
      ),
      state(
        "open2",
        style({
          transform: "translate(20%, -80%) rotateZ(20deg)",
          opacity: 1,
        }),
      ),
      state(
        "open3",
        style({
          transform: "translate(-50%, -120%) rotateZ(5deg)",
          opacity: 1,
        }),
      ),
      transition("closed => open1", animate("500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)")),
      transition("closed => open2", animate("500ms 100ms cubic-bezier(0.68, -0.55, 0.265, 1.55)")),
      transition("closed => open3", animate("500ms 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)")),
      transition("open1 => closed", animate("400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)")),
      transition("open2 => closed", animate("400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)")),
      transition("open3 => closed", animate("400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)")),
    ]),
  ],
})
export class FolderComponent implements OnInit, OnDestroy {
  isOpen = false
  folderColor = "#5227FF"
  folderBackColor = "#4A1FE7"

  // Dynamic data properties
  userId: string | null = null;
  isLoading = true;
  error: string | null = null;

  // Data from API
  totalCategories = 0;
  totalInProgress = 0;
  totalCompleted = 0;
  previousTotalCategories = 0;
  previousInProgress = 0;
  previousCompleted = 0;

  cards: FolderCard[] = []

  paperOffsets: { x: number; y: number }[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]

  private sessionStorageKey: string = '';

  constructor(private dashboardService: DashboardServicesService) {}

  ngOnInit(): void {
    this.userId = this.getDecodedUserId();
    if (this.userId) {
      this.sessionStorageKey = `folderStats_${this.userId}`;
      // Check session storage first
      const cached = sessionStorage.getItem(this.sessionStorageKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          this.processCategoryStats(parsed);
          this.isLoading = false;
          this.error = null;
        } catch (e) {
          // If corrupted, fallback to API
          this.loadCategoryStats();
        }
      } else {
        this.loadCategoryStats();
      }
      window.addEventListener('storage', this.handleStorageChange);
    } else {
      this.error = 'Unable to retrieve user ID from token';
      this.isLoading = false;
      this.setDefaultCards();
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
      console.log("=== DECODED TOKEN ===", decodedToken);

      const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
      console.log("=== EXTRACTED USER ID ===", userId);
      return userId ? String(userId) : null;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }

  loadCategoryStats(): void {
    if (!this.userId) return;

    this.isLoading = true;

    this.dashboardService.getStatsForHomeBanner(this.userId).subscribe({
      next: (data: any) => {
        // Cache to session storage
        sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(data));
        this.processCategoryStats(data);
        this.isLoading = false;
        this.error = null;
      },
      error: (error: any) => {
        console.error('Error loading category stats:', error);
        this.error = 'Failed to load category statistics';
        this.isLoading = false;
        this.setDefaultCards();
      }
    });
  }

  processCategoryStats(categoryStats: CategoryStats[]): void {
    // Store previous values for percentage calculation
    this.previousTotalCategories = this.totalCategories;
    this.previousInProgress = this.totalInProgress;
    this.previousCompleted = this.totalCompleted;

    // Reset totals
    this.totalCategories = 0;
    this.totalInProgress = 0;
    this.totalCompleted = 0;

    // Count unique categories and aggregate courses
    const uniqueCategories = new Set<string>();

    categoryStats.forEach((category: CategoryStats) => {
      if (category.categoryName) {
        uniqueCategories.add(category.categoryName);
      }
      this.totalInProgress += category.inProgressCourses || 0;
      this.totalCompleted += category.completedCourses || 0;
    });

    this.totalCategories = uniqueCategories.size;

    // Calculate percentage changes
    const categoriesPercentage = this.calculatePercentageChange(this.previousTotalCategories, this.totalCategories);
    const inProgressPercentage = this.calculatePercentageChange(this.previousInProgress, this.totalInProgress);
    const completedPercentage = this.calculatePercentageChange(this.previousCompleted, this.totalCompleted);

    // Create cards with dynamic data
    this.cards = [
      {
        id: 1,
        title: "Total Categories",
        value: this.totalCategories.toString(),
        subtitle: "Available Categories",
        icon: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        textColor: "#ffffff",
        percentage: categoriesPercentage.display,
        percentageColor: categoriesPercentage.isPositive ? "#a7f3d0" : "#fca5a5",
      },
      {
        id: 2,
        title: "Ongoing Courses",
        value: this.totalInProgress.toString(),
        subtitle: "In Progress",
        icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        textColor: "#ffffff",
        percentage: inProgressPercentage.display,
        percentageColor: inProgressPercentage.isPositive ? "#fde68a" : "#fca5a5",
      },
      {
        id: 3,
        title: "Completed Courses",
        value: this.totalCompleted > 99 ? "99+" : this.totalCompleted.toString(),
        subtitle: "Finished",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        textColor: "#1f2937",
        percentage: completedPercentage.display,
        percentageColor: completedPercentage.isPositive ? "#34d399" : "#ef4444",
      },
    ];
  }

  calculatePercentageChange(previousValue: number, currentValue: number): { display: string, isPositive: boolean } {
    // If no previous data (first load), show no percentage
    if (previousValue === 0 && this.previousTotalCategories === 0) {
      return { display: '', isPositive: true };
    }

    // If previous value was 0 but current has value
    if (previousValue === 0 && currentValue > 0) {
      return { display: '+100%', isPositive: true };
    }

    // Calculate percentage change
    const change = ((currentValue - previousValue) / previousValue) * 100;
    const rounded = Math.round(Math.abs(change));

    if (change > 0) {
      return { display: `+${rounded}%`, isPositive: true };
    } else if (change < 0) {
      return { display: `-${rounded}%`, isPositive: false };
    } else {
      return { display: '0%', isPositive: true };
    }
  }

  setDefaultCards(): void {
    this.cards = [
      {
        id: 1,
        title: "Total Categories",
        value: "0",
        subtitle: "Available Categories",
        icon: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        textColor: "#ffffff",
        percentage: "",
        percentageColor: "#a7f3d0",
      },
      {
        id: 2,
        title: "Ongoing Courses",
        value: "0",
        subtitle: "In Progress",
        icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        textColor: "#ffffff",
        percentage: "",
        percentageColor: "#fde68a",
      },
      {
        id: 3,
        title: "Completed Courses",
        value: "0",
        subtitle: "Finished",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        textColor: "#1f2937",
        percentage: "",
        percentageColor: "#34d399",
      },
    ];
  }

  toggleFolder(): void {
    this.isOpen = !this.isOpen
    if (!this.isOpen) {
      this.resetPaperOffsets()
    }
  }

  onPaperMouseMove(event: MouseEvent, index: number): void {
    if (!this.isOpen) return

    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Reduced magnet effect to prevent folder separation
    const offsetX = (event.clientX - centerX) * 0.08
    const offsetY = (event.clientY - centerY) * 0.08

    this.paperOffsets[index] = { x: offsetX, y: offsetY }
  }

  onPaperMouseLeave(index: number): void {
    // Smooth return to original position
    this.paperOffsets[index] = { x: 0, y: 0 }
  }

  resetPaperOffsets(): void {
    this.paperOffsets = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]
  }

  getPaperState(index: number): string {
    if (!this.isOpen) return "closed"
    return `open${index + 1}`
  }

  getPaperStyle(index: number): any {
    if (!this.isOpen) return {}
    return {
      "--magnet-x": `${this.paperOffsets[index].x}px`,
      "--magnet-y": `${this.paperOffsets[index].y}px`,
    }
  }

  darkenColor(hex: string, percent: number): string {
    let color = hex.startsWith("#") ? hex.slice(1) : hex
    if (color.length === 3) {
      color = color
        .split("")
        .map((c) => c + c)
        .join("")
    }
    const num = Number.parseInt(color, 16)
    let r = (num >> 16) & 0xff
    let g = (num >> 8) & 0xff
    let b = num & 0xff
    r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))))
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))))
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))))
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  }

  handleCardClick(index: number): void {
    if (this.isLoading) return;

    switch (index) {
      case 0:
        this.alertCard1();
        break;
      case 1:
        this.alertCard2();
        break;
      case 2:
        this.alertCard3();
        break;
      default:
        break;
    }
  }

  alertCard1(): void {
    alert(`Total Categories: ${this.totalCategories}\nClick to view all categories!`);
  }

  alertCard2(): void {
    alert(`Ongoing Courses: ${this.totalInProgress}\nClick to view your ongoing courses!`);
  }

  alertCard3(): void {
    alert(`Completed Courses: ${this.totalCompleted}\nClick to view your completed courses!`);
  }

  refreshData(): void {
    if (this.userId) {
      // Clear cache and fetch again
      sessionStorage.removeItem(this.sessionStorageKey);
      this.loadCategoryStats();
    }
  }
}