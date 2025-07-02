


// import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DashboardServicesService } from '../../../services/homedashboard/dashboard-services.service';
// import { jwtDecode } from 'jwt-decode';

// interface CategoryData {
//   categoryName: string;
//   totalCourses: number;
//   enrolledCourses: number;
//   completedCourses: number;
//   inProgressCourses: number;
// }

// interface ChartDataset {
//   label: string;
//   data: number[];
//   color: string;
//   fillColor: string;
// }

// interface TooltipData {
//   show: boolean;
//   x: number;
//   y: number;
//   category: string;
//   data: { label: string; value: number; color: string }[];
// }

// @Component({
//   selector: 'app-hero-banner',
//   templateUrl: './hero-banner.component.html',
//   styleUrls: ['./hero-banner.component.css'],
//   standalone: true,
//   imports: [CommonModule]
// })
// export class HeroBannerComponent implements OnInit, OnDestroy {
//   @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
//   @Output() action = new EventEmitter<any>();

//   // Dynamic data from API
//   categoryData: CategoryData[] = [];
//   userId: string = '';
//   isLoading = true;
//   error: string | null = null;

//   datasets: ChartDataset[] = [
//     {
//       label: 'Completed Courses',
//       data: [],
//       color: '#3b82f6',
//       fillColor: 'rgba(59, 130, 246, 0.2)'
//     },
//     {
//       label: 'In Progress Courses',
//       data: [],
//       color: '#10b981',
//       fillColor: 'rgba(16, 185, 129, 0.2)'
//     }
//   ];

//   selectedPeriod = 'Categories';
//   tooltip: TooltipData = {
//     show: false,
//     x: 0,
//     y: 0,
//     category: '',
//     data: []
//   };

//   private canvas!: HTMLCanvasElement;
//   private ctx!: CanvasRenderingContext2D;
//   private animationId!: number;
//   private isAnimating = false;

//   constructor(private dashboardService: DashboardServicesService) {}

//   ngOnInit(): void {
//     this.userId = this.getDecodedUserId();
//     if (this.userId) {
//       this.loadCategoryStats();
//     } else {
//       this.error = 'Unable to retrieve user ID from token';
//       this.isLoading = false;
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.animationId) {
//       cancelAnimationFrame(this.animationId);
//     }
//   }

//   getDecodedUserId(): string{
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.error("No auth token found in localStorage.");
//         return '';
//       }

//       const decodedToken: any = jwtDecode(token);
//       console.log("=== DECODED TOKEN ===", decodedToken);

//       const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
//       console.log("=== EXTRACTED USER ID ===", userId);
//       return userId ;
//     } catch (error) {
//       console.error("Error decoding JWT:", error);
//       return '';
//     }
//   }

//   loadCategoryStats(): void {
//     if (!this.userId) return;

//     this.isLoading = true;
//     this.dashboardService.getStatsForHomeBanner(this.userId).subscribe({
//       next: (data: CategoryData[]) => {
//         console.log('Category stats received:', data);
//         this.categoryData = data;
//         this.prepareData();
//         this.initializeChart();
//         this.isLoading = false;
//         this.error = null;
//       },
//       error: (error:any) => {
//         console.error('Error loading category stats:', error);
//         this.error = 'Failed to load category statistics';
//         this.isLoading = false;
//         // Initialize with empty data to show empty chart
//         this.categoryData = [];
//         this.prepareData();
//         this.initializeChart();
//       }
//     });
//   }

//   prepareData(): void {
//     if (this.categoryData && this.categoryData.length > 0) {
//       this.datasets[0].data = this.categoryData.map(cat => cat.completedCourses || 0);
//       this.datasets[1].data = this.categoryData.map(cat => cat.inProgressCourses || 0);
//     } else {
//       this.datasets[0].data = [];
//       this.datasets[1].data = [];
//     }
//   }

//   initializeChart(): void {
//     if (!this.chartCanvas) {
//       console.error('Chart canvas not found');
//       return;
//     }

//     this.canvas = this.chartCanvas.nativeElement;
//     this.ctx = this.canvas.getContext('2d')!;
    
//     this.resizeCanvas();
    
//     this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
//     this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    
//     if (this.categoryData.length > 0) {
//       this.animateChart();
//     } else {
//       this.drawEmptyState();
//     }
//   }

//   drawEmptyState(): void {
//     const { width, height } = this.canvas;
//     this.ctx.clearRect(0, 0, width, height);
    
//     this.ctx.fillStyle = '#64748b';
//     this.ctx.font = '16px Inter, system-ui, sans-serif';
//     this.ctx.textAlign = 'center';
//     this.ctx.fillText('No data available', width / 2, height / 2);
//   }

//   resizeCanvas(): void {
//     const container = this.canvas.parentElement!;
//     const rect = container.getBoundingClientRect();
    
//     this.canvas.width = rect.width;
//     this.canvas.height = rect.height;
//   }

//   animateChart(): void {
//     let progress = 0;
//     const duration = 2000; // 2 seconds
//     const startTime = Date.now();

//     const animate = () => {
//       const elapsed = Date.now() - startTime;
//       progress = Math.min(elapsed / duration, 1);
      
//       // Easing function
//       const easedProgress = 1 - Math.pow(1 - progress, 3);
      
//       this.drawChart(easedProgress);
      
//       if (progress < 1) {
//         this.animationId = requestAnimationFrame(animate);
//       } else {
//         this.isAnimating = false;
//       }
//     };

//     this.isAnimating = true;
//     animate();
//   }

//   drawChart(animationProgress: number = 1): void {
//     if (this.categoryData.length === 0) {
//       this.drawEmptyState();
//       return;
//     }

//     const { width, height } = this.canvas;
//     const padding = { top: 30, right: 40, bottom: 50, left: 60 };
//     const chartWidth = width - padding.left - padding.right;
//     const chartHeight = height - padding.top - padding.bottom;

//     this.ctx.clearRect(0, 0, width, height);

//     const maxValue = Math.max(...this.datasets.flatMap(dataset => dataset.data), 1); // Prevent division by zero
//     const scale = chartHeight / maxValue;

//     this.drawGrid(padding, chartWidth, chartHeight, maxValue);

//     this.datasets.forEach((dataset, index) => {
//       if (dataset.data.length > 0) {
//         this.drawAreaChart(dataset, padding, chartWidth, chartHeight, scale, animationProgress);
//       }
//     });

//     this.drawAxes(padding, chartWidth, chartHeight, maxValue);
//   }

//   drawGrid(padding: any, chartWidth: number, chartHeight: number, maxValue: number): void {
//     this.ctx.strokeStyle = '#f1f5f9';
//     this.ctx.lineWidth = 1;

//     // Horizontal grid lines
//     for (let i = 0; i <= 5; i++) {
//       const y = padding.top + (chartHeight / 5) * i;
//       this.ctx.beginPath();
//       this.ctx.moveTo(padding.left, y);
//       this.ctx.lineTo(padding.left + chartWidth, y);
//       this.ctx.stroke();
//     }

//     // Vertical grid lines
//     if (this.categoryData.length > 1) {
//       const stepX = chartWidth / (this.categoryData.length - 1);
//       for (let i = 0; i < this.categoryData.length; i++) {
//         const x = padding.left + stepX * i;
//         this.ctx.strokeStyle = '#f8fafc';
//         this.ctx.beginPath();
//         this.ctx.moveTo(x, padding.top);
//         this.ctx.lineTo(x, padding.top + chartHeight);
//         this.ctx.stroke();
//       }
//     }
//   }

//   drawAreaChart(dataset: ChartDataset, padding: any, chartWidth: number, chartHeight: number, scale: number, animationProgress: number): void {
//     const points: { x: number; y: number }[] = [];
//     const stepX = this.categoryData.length > 1 ? chartWidth / (this.categoryData.length - 1) : chartWidth;

//     // Calculate points with animation
//     dataset.data.forEach((value: number, i: number) => {
//       const animatedValue = value * animationProgress;
//       const x = padding.left + stepX * i;
//       const y = padding.top + chartHeight - (animatedValue * scale);
//       points.push({ x, y });
//     });

//     if (points.length === 0) return;

//     // Create smooth curve points
//     const smoothPoints = this.createSmoothCurve(points);

//     // Draw filled area
//     this.ctx.fillStyle = dataset.fillColor;
//     this.ctx.beginPath();
//     this.ctx.moveTo(smoothPoints[0].x, padding.top + chartHeight);
    
//     for (let i = 0; i < smoothPoints.length - 1; i += 3) {
//       const cp1 = smoothPoints[i + 1];
//       const cp2 = smoothPoints[i + 2];
//       const end = smoothPoints[i + 3] || smoothPoints[smoothPoints.length - 1];
//       this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
//     }
    
//     this.ctx.lineTo(smoothPoints[smoothPoints.length - 1].x, padding.top + chartHeight);
//     this.ctx.closePath();
//     this.ctx.fill();

//     // Draw line
//     this.ctx.strokeStyle = dataset.color;
//     this.ctx.lineWidth = 2;
//     this.ctx.beginPath();
//     this.ctx.moveTo(smoothPoints[0].x, smoothPoints[0].y);
    
//     for (let i = 0; i < smoothPoints.length - 1; i += 3) {
//       const cp1 = smoothPoints[i + 1];
//       const cp2 = smoothPoints[i + 2];
//       const end = smoothPoints[i + 3] || smoothPoints[smoothPoints.length - 1];
//       this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
//     }
//     this.ctx.stroke();

//     // Draw data points
//     points.forEach((point, i) => {
//       this.ctx.fillStyle = '#ffffff';
//       this.ctx.strokeStyle = dataset.color;
//       this.ctx.lineWidth = 2;
//       this.ctx.beginPath();
//       this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
//       this.ctx.fill();
//       this.ctx.stroke();
//     });
//   }

//   createSmoothCurve(points: { x: number; y: number }[]): { x: number; y: number }[] {
//     if (points.length < 3) return points;

//     const smoothPoints: { x: number; y: number }[] = [];
//     smoothPoints.push(points[0]);

//     for (let i = 0; i < points.length - 1; i++) {
//       const current = points[i];
//       const next = points[i + 1];
      
//       const cp1 = {
//         x: current.x + (next.x - current.x) * 0.3,
//         y: current.y
//       };
      
//       const cp2 = {
//         x: next.x - (next.x - current.x) * 0.3,
//         y: next.y
//       };

//       smoothPoints.push(cp1, cp2, next);
//     }

//     return smoothPoints;
//   }

//   drawAxes(padding: any, chartWidth: number, chartHeight: number, maxValue: number): void {
//     this.ctx.fillStyle = '#64748b';
//     this.ctx.font = '12px Inter, system-ui, sans-serif';

//     // Y-axis labels
//     for (let i = 0; i <= 5; i++) {
//       const value = Math.round((maxValue / 5) * (5 - i));
//       const y = padding.top + (chartHeight / 5) * i;
//       this.ctx.textAlign = 'right';
//       this.ctx.fillText(`${value}`, padding.left - 10, y + 4);
//     }

//     // X-axis labels
//     if (this.categoryData.length > 0) {
//       const stepX = this.categoryData.length > 1 ? chartWidth / (this.categoryData.length - 1) : chartWidth;
//       this.categoryData.forEach((category, i) => {
//         const x = padding.left + stepX * i;
//         this.ctx.textAlign = 'center';
//         // Truncate long category names
//         const displayName = category.categoryName.length > 10 
//           ? category.categoryName.substring(0, 8) + '...' 
//           : category.categoryName;
//         this.ctx.fillText(displayName, x, padding.top + chartHeight + 25);
//       });
//     }
//   }

//   onMouseMove(event: MouseEvent): void {
//     if (this.isAnimating || this.categoryData.length === 0) return;

//     const rect = this.canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     const padding = { top: 30, right: 40, bottom: 50, left: 60 };
//     const chartWidth = this.canvas.width - padding.left - padding.right;
//     const stepX = this.categoryData.length > 1 ? chartWidth / (this.categoryData.length - 1) : chartWidth;

//     const categoryIndex = Math.round((x - padding.left) / stepX);
    
//     if (categoryIndex >= 0 && categoryIndex < this.categoryData.length) {
//       const category = this.categoryData[categoryIndex];
//       const data = [
//         {
//           label: 'Completed Courses',
//           value: category.completedCourses,
//           color: this.datasets[0].color
//         },
//         {
//           label: 'In Progress Courses',
//           value: category.inProgressCourses,
//           color: this.datasets[1].color
//         },
//         {
//           label: 'Total Courses',
//           value: category.totalCourses,
//           color: '#6366f1'
//         },
//         {
//           label: 'Enrolled Courses',
//           value: category.enrolledCourses,
//           color: '#f59e0b'
//         }
//       ];

//       this.tooltip = {
//         show: true,
//         x: event.clientX - rect.left,
//         y: event.clientY - rect.top,
//         category: category.categoryName,
//         data
//       };
//     }
//   }

//   onMouseLeave(): void {
//     this.tooltip.show = false;
//   }

//   onPeriodChange(period: string): void {
//     this.selectedPeriod = period;
//     this.action.emit({ type: 'periodChange', period });
//   }

//   refreshData(): void {
//     if (this.userId) {
//       this.loadCategoryStats();
//     }
//   }
// }


import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardServicesService } from '../../../services/homedashboard/dashboard-services.service';
import { jwtDecode } from 'jwt-decode';

interface CategoryData {
  categoryName: string;
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
}

interface ChartDataset {
  label: string;
  data: number[];
  color: string;
  fillColor: string;
}

interface TooltipData {
  show: boolean;
  x: number;
  y: number;
  category: string;
  data: { label: string; value: number; color: string }[];
}

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeroBannerComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Output() action = new EventEmitter<any>();

  // Dynamic data from API
  categoryData: CategoryData[] = [];
  userId: string = '';
  isLoading = true;
  error: string | null = null;

  // Session storage key
  private sessionStorageKey: string = '';

  datasets: ChartDataset[] = [
    {
      label: 'Completed Courses',
      data: [],
      color: '#3b82f6',
      fillColor: 'rgba(59, 130, 246, 0.2)'
    },
    {
      label: 'In Progress Courses',
      data: [],
      color: '#10b981',
      fillColor: 'rgba(16, 185, 129, 0.2)'
    }
  ];

  selectedPeriod = 'Categories';
  tooltip: TooltipData = {
    show: false,
    x: 0,
    y: 0,
    category: '',
    data: []
  };

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private isAnimating = false;

  constructor(private dashboardService: DashboardServicesService) {}

  ngOnInit(): void {
    this.userId = this.getDecodedUserId();
    if (this.userId) {
      this.sessionStorageKey = `heroBannerStats_${this.userId}`;
      // Check session storage for cached data
      const cached = sessionStorage.getItem(this.sessionStorageKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          this.categoryData = parsed;
          this.prepareData();
          this.initializeChart();
          this.isLoading = false;
          this.error = null;
        } catch (e) {
          this.loadCategoryStats();
        }
      } else {
        this.loadCategoryStats();
      }
      // Listen for logout event (storage event)
      window.addEventListener('storage', this.handleStorageChange);
    } else {
      this.error = 'Unable to retrieve user ID from token';
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
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

  getDecodedUserId(): string{
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found in localStorage.");
        return '';
      }

      const decodedToken: any = jwtDecode(token);
      console.log("=== DECODED TOKEN ===", decodedToken);

      const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
      console.log("=== EXTRACTED USER ID ===", userId);
      return userId ;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return '';
    }
  }

  loadCategoryStats(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.dashboardService.getStatsForHomeBanner(this.userId).subscribe({
      next: (data: CategoryData[]) => {
        // Cache to session storage
        sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(data));
        this.categoryData = data;
        this.prepareData();
        this.initializeChart();
        this.isLoading = false;
        this.error = null;
      },
      error: (error:any) => {
        console.error('Error loading category stats:', error);
        this.error = 'Failed to load category statistics';
        this.isLoading = false;
        // Initialize with empty data to show empty chart
        this.categoryData = [];
        this.prepareData();
        this.initializeChart();
      }
    });
  }

  prepareData(): void {
    console.log('=== PREPARING DATA ===');
    console.log('Category data:', this.categoryData);
    
    if (this.categoryData && this.categoryData.length > 0) {
      // Map completed courses
      this.datasets[0].data = this.categoryData.map(cat => {
        const value = cat.completedCourses || 0;
        console.log(`${cat.categoryName} - Completed: ${value}`);
        return value;
      });
      
      // Map in-progress courses
      this.datasets[1].data = this.categoryData.map(cat => {
        const value = cat.inProgressCourses || 0;
        console.log(`${cat.categoryName} - In Progress: ${value}`);
        return value;
      });
    } else {
      console.log('No category data available, setting empty arrays');
      this.datasets[0].data = [];
      this.datasets[1].data = [];
    }
    
    console.log('Final datasets:', this.datasets);
    console.log('=== DATA PREPARATION COMPLETE ===');
  }
  initializeChart(): void {
    if (!this.chartCanvas) {
      console.error('Chart canvas not found');
      return;
    }

    this.canvas = this.chartCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    this.resizeCanvas();
    
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    
    if (this.categoryData.length > 0) {
      this.animateChart();
    } else {
      this.drawEmptyState();
    }
  }

  drawEmptyState(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = '16px Inter, system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('No data available', width / 2, height / 2);
  }

  resizeCanvas(): void {
    const container = this.canvas.parentElement!;
    const rect = container.getBoundingClientRect();
    
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  animateChart(): void {
    let progress = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      this.drawChart(easedProgress);
      
      if (progress < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
      }
    };

    this.isAnimating = true;
    animate();
  }

  drawChart(animationProgress: number = 1): void {
    if (this.categoryData.length === 0) {
      this.drawEmptyState();
      return;
    }

    const { width, height } = this.canvas;
    const padding = { top: 30, right: 40, bottom: 50, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    this.ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(...this.datasets.flatMap(dataset => dataset.data), 1); // Prevent division by zero
    const scale = chartHeight / maxValue;

    this.drawGrid(padding, chartWidth, chartHeight, maxValue);

    this.datasets.forEach((dataset, index) => {
      if (dataset.data.length > 0) {
        this.drawAreaChart(dataset, padding, chartWidth, chartHeight, scale, animationProgress);
      }
    });

    this.drawAxes(padding, chartWidth, chartHeight, maxValue);
  }

  drawGrid(padding: any, chartWidth: number, chartHeight: number, maxValue: number): void {
    this.ctx.strokeStyle = '#f1f5f9';
    this.ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(padding.left, y);
      this.ctx.lineTo(padding.left + chartWidth, y);
      this.ctx.stroke();
    }

    // Vertical grid lines
    if (this.categoryData.length > 1) {
      const stepX = chartWidth / (this.categoryData.length - 1);
      for (let i = 0; i < this.categoryData.length; i++) {
        const x = padding.left + stepX * i;
        this.ctx.strokeStyle = '#f8fafc';
        this.ctx.beginPath();
        this.ctx.moveTo(x, padding.top);
        this.ctx.lineTo(x, padding.top + chartHeight);
        this.ctx.stroke();
      }
    }
  }

  // drawAreaChart(dataset: ChartDataset, padding: any, chartWidth: number, chartHeight: number, scale: number, animationProgress: number): void {
  //   const points: { x: number; y: number }[] = [];
  //   const stepX = this.categoryData.length > 1 ? chartWidth / (this.categoryData.length - 1) : chartWidth;

  //   // Calculate points with animation
  //   dataset.data.forEach((value: number, i: number) => {
  //     const animatedValue = value * animationProgress;
  //     const x = padding.left + stepX * i;
  //     const y = padding.top + chartHeight - (animatedValue * scale);
  //     points.push({ x, y });
  //   });

  //   if (points.length === 0) return;

  //   // Create smooth curve points
  //   const smoothPoints = this.createSmoothCurve(points);

  //   // Draw filled area
  //   this.ctx.fillStyle = dataset.fillColor;
  //   this.ctx.beginPath();
  //   this.ctx.moveTo(smoothPoints[0].x, padding.top + chartHeight);
    
  //   for (let i = 0; i < smoothPoints.length - 1; i += 3) {
  //     const cp1 = smoothPoints[i + 1];
  //     const cp2 = smoothPoints[i + 2];
  //     const end = smoothPoints[i + 3] || smoothPoints[smoothPoints.length - 1];
  //     this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
  //   }
    
  //   this.ctx.lineTo(smoothPoints[smoothPoints.length - 1].x, padding.top + chartHeight);
  //   this.ctx.closePath();
  //   this.ctx.fill();

  //   // Draw line
  //   this.ctx.strokeStyle = dataset.color;
  //   this.ctx.lineWidth = 2;
  //   this.ctx.beginPath();
  //   this.ctx.moveTo(smoothPoints[0].x, smoothPoints[0].y);
    
  //   for (let i = 0; i < smoothPoints.length - 1; i += 3) {
  //     const cp1 = smoothPoints[i + 1];
  //     const cp2 = smoothPoints[i + 2];
  //     const end = smoothPoints[i + 3] || smoothPoints[smoothPoints.length - 1];
  //     this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
  //   }
  //   this.ctx.stroke();

  //   // Draw data points
  //   points.forEach((point, i) => {
  //     this.ctx.fillStyle = '#ffffff';
  //     this.ctx.strokeStyle = dataset.color;
  //     this.ctx.lineWidth = 2;
  //     this.ctx.beginPath();
  //     this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
  //     this.ctx.fill();
  //     this.ctx.stroke();
  //   });
  // }

  drawAreaChart(dataset: ChartDataset, padding: any, chartWidth: number, chartHeight: number, scale: number, animationProgress: number): void {
    const points: { x: number; y: number }[] = [];
    const stepX = this.categoryData.length > 1 ? chartWidth / (this.categoryData.length - 1) : chartWidth / 2;
  
    // Calculate points with animation and validation
    dataset.data.forEach((value: number, i: number) => {
      // Validate the value
      if (typeof value !== 'number' || isNaN(value)) {
        console.warn(`Invalid data value at index ${i}:`, value);
        value = 0; // Default to 0 for invalid values
      }
      
      const animatedValue = value * animationProgress;
      const x = padding.left + stepX * i;
      const y = padding.top + chartHeight - (animatedValue * scale);
      
      // Validate calculated coordinates
      if (isNaN(x) || isNaN(y)) {
        console.warn(`Invalid coordinates calculated for index ${i}:`, { x, y, value, animatedValue });
        return; // Skip this point
      }
      
      points.push({ x, y });
    });
  
    if (points.length === 0) {
      console.warn('No valid points to draw');
      return;
    }
  
    // Create smooth curve points
    const smoothPoints = this.createSmoothCurve(points);
    
    // Additional safety check
    if (!smoothPoints || smoothPoints.length === 0) {
      console.warn('No smooth points generated, falling back to original points');
      // Fall back to drawing straight lines
      this.drawStraightLineChart(dataset, points, padding, chartHeight);
      return;
    }
  
    // Draw filled area
    this.ctx.fillStyle = dataset.fillColor;
    this.ctx.beginPath();
    
    // Ensure first point exists
    if (smoothPoints[0] && typeof smoothPoints[0].x === 'number' && typeof smoothPoints[0].y === 'number') {
      this.ctx.moveTo(smoothPoints[0].x, padding.top + chartHeight);
      
      for (let i = 0; i < smoothPoints.length - 1; i += 3) {
        const cp1 = smoothPoints[i + 1];
        const cp2 = smoothPoints[i + 2];
        const end = smoothPoints[i + 3] || smoothPoints[smoothPoints.length - 1];
        
        // Validate control points
        if (cp1 && cp2 && end && 
            typeof cp1.x === 'number' && typeof cp1.y === 'number' &&
            typeof cp2.x === 'number' && typeof cp2.y === 'number' &&
            typeof end.x === 'number' && typeof end.y === 'number') {
          this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
        }
      }
      
      this.ctx.lineTo(smoothPoints[smoothPoints.length - 1].x, padding.top + chartHeight);
      this.ctx.closePath();
      this.ctx.fill();
  
      // Draw line
      this.ctx.strokeStyle = dataset.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(smoothPoints[0].x, smoothPoints[0].y);
      
      for (let i = 0; i < smoothPoints.length - 1; i += 3) {
        const cp1 = smoothPoints[i + 1];
        const cp2 = smoothPoints[i + 2];
        const end = smoothPoints[i + 3] || smoothPoints[smoothPoints.length - 1];
        
        if (cp1 && cp2 && end && 
            typeof cp1.x === 'number' && typeof cp1.y === 'number' &&
            typeof cp2.x === 'number' && typeof cp2.y === 'number' &&
            typeof end.x === 'number' && typeof end.y === 'number') {
          this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
        }
      }
      this.ctx.stroke();
    }
  
    // Draw data points
    points.forEach((point, i) => {
      if (point && typeof point.x === 'number' && typeof point.y === 'number') {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = dataset.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
      }
    });
  }
  
  // Fallback method for straight line drawing
  private drawStraightLineChart(dataset: ChartDataset, points: { x: number; y: number }[], padding: any, chartHeight: number): void {
    if (points.length === 0) return;
  
    // Draw filled area
    this.ctx.fillStyle = dataset.fillColor;
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, padding.top + chartHeight);
    
    points.forEach(point => {
      this.ctx.lineTo(point.x, point.y);
    });
    
    this.ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
    this.ctx.closePath();
    this.ctx.fill();
  
    // Draw line
    this.ctx.strokeStyle = dataset.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    
    points.forEach(point => {
      this.ctx.lineTo(point.x, point.y);
    });
    
    this.ctx.stroke();
  }

  createSmoothCurve(points: { x: number; y: number }[]): { x: number; y: number }[] {
    // Add validation for empty or invalid points
    if (!points || points.length === 0) {
      return [];
    }
    
    // If only one point, return it
    if (points.length === 1) {
      return points;
    }
    
    // If only two points, return them as is
    if (points.length === 2) {
      return points;
    }
  
    const smoothPoints: { x: number; y: number }[] = [];
    
    // Ensure first point exists and is valid
    if (points[0] && typeof points[0].x === 'number' && typeof points[0].y === 'number') {
      smoothPoints.push(points[0]);
    } else {
      console.error('Invalid first point:', points[0]);
      return points; // Return original points if first point is invalid
    }
  
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Validate current and next points
      if (!current || !next || 
          typeof current.x !== 'number' || typeof current.y !== 'number' ||
          typeof next.x !== 'number' || typeof next.y !== 'number') {
        console.error('Invalid points at index', i, current, next);
        continue;
      }
      
      const cp1 = {
        x: current.x + (next.x - current.x) * 0.3,
        y: current.y
      };
      
      const cp2 = {
        x: next.x - (next.x - current.x) * 0.3,
        y: next.y
      };
  
      smoothPoints.push(cp1, cp2, next);
    }
  
    return smoothPoints;
  }

  // createSmoothCurve(points: { x: number; y: number }[]): { x: number; y: number }[] {
  //   if (points.length < 3) return points;

  //   const smoothPoints: { x: number; y: number }[] = [];
  //   smoothPoints.push(points[0]);

  //   for (let i = 0; i < points.length - 1; i++) {
  //     const current = points[i];
  //     const next = points[i + 1];
      
  //     const cp1 = {
  //       x: current.x + (next.x - current.x) * 0.3,
  //       y: current.y
  //     };
      
  //     const cp2 = {
  //       x: next.x - (next.x - current.x) * 0.3,
  //       y: next.y
  //     };

  //     smoothPoints.push(cp1, cp2, next);
  //   }

  //   return smoothPoints;
  // }

  drawAxes(padding: any, chartWidth: number, chartHeight: number, maxValue: number): void {
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = '12px Inter, system-ui, sans-serif';

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxValue / 5) * (5 - i));
      const y = padding.top + (chartHeight / 5) * i;
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`${value}`, padding.left - 10, y + 4);
    }

    // X-axis labels
    if (this.categoryData.length > 0) {
      const stepX = this.categoryData.length > 1 ? chartWidth / (this.categoryData.length - 1) : chartWidth;
      this.categoryData.forEach((category, i) => {
        const x = padding.left + stepX * i;
        this.ctx.textAlign = 'center';
        // Truncate long category names
        const displayName = category.categoryName.length > 10 
          ? category.categoryName.substring(0, 8) + '...' 
          : category.categoryName;
        this.ctx.fillText(displayName, x, padding.top + chartHeight + 25);
      });
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isAnimating || this.categoryData.length === 0) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const padding = { top: 30, right: 40, bottom: 50, left: 60 };
    const chartWidth = this.canvas.width - padding.left - padding.right;
    const stepX = this.categoryData.length > 1 ? chartWidth / (this.categoryData.length - 1) : chartWidth;

    const categoryIndex = Math.round((x - padding.left) / stepX);
    
    if (categoryIndex >= 0 && categoryIndex < this.categoryData.length) {
      const category = this.categoryData[categoryIndex];
      const data = [
        {
          label: 'Completed Courses',
          value: category.completedCourses,
          color: this.datasets[0].color
        },
        {
          label: 'In Progress Courses',
          value: category.inProgressCourses,
          color: this.datasets[1].color
        },
        {
          label: 'Total Courses',
          value: category.totalCourses,
          color: '#6366f1'
        },
        {
          label: 'Enrolled Courses',
          value: category.enrolledCourses,
          color: '#f59e0b'
        }
      ];

      this.tooltip = {
        show: true,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        category: category.categoryName,
        data
      };
    }
  }

  onMouseLeave(): void {
    this.tooltip.show = false;
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    this.action.emit({ type: 'periodChange', period });
  }

  refreshData(): void {
    if (this.userId) {
      // Clear cache and fetch again
      sessionStorage.removeItem(this.sessionStorageKey);
      this.loadCategoryStats();
    }
  }
}