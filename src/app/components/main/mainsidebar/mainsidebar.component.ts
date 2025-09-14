import { Component, Input, OnInit, OnDestroy, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserLearningService, CategoryWithCoursesDto } from '../../../services/user-learning.service';

@Component({
  selector: 'app-mainsidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mainsidebar.component.html',
  styleUrls: ['./mainsidebar.component.css']
})
export class MainsidebarComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  @Output() categorySelected = new EventEmitter<CategoryWithCoursesDto>();
  @Output() sidebarToggled = new EventEmitter<boolean>();

  // Component state
  categories: CategoryWithCoursesDto[] = [];
  selectedCategoryId: string | null = null;
  userId: string | null = null;
  isLoading = false;
  error: string | null = null;
  isMobile = false;

  private destroy$ = new Subject<void>();

  constructor(
    private userLearningService: UserLearningService,
    private router: Router
  ) {
    this.userId = this.getDecodedUserId();
    this.checkMobileView();
  }

  ngOnInit(): void {
    if (this.userId) {
      this.loadCategories();
    } else {
      this.error = 'User not authenticated';
      console.error('No valid user ID found');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkMobileView();
  }

  /**
   * Check if the current view is mobile
   */
  private checkMobileView(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile && this.collapsed) {
      this.collapsed = false;
      this.sidebarToggled.emit(this.collapsed);
    }
  }

  /**
   * Decode JWT token to extract user ID
   */
  private getDecodedUserId(): string | null {
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

      return userId || null;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }

  /**
   * Load categories from the API
   */
  loadCategories(): void {
    if (!this.userId) {
      this.error = 'User ID is required to load categories';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.userLearningService.getAllCategories(this.userId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (categories) => {
          this.categories = categories || [];
          console.log('Categories loaded successfully:', this.categories);
          
          // Auto-select first category if available and none is selected
          if (this.categories.length > 0 && !this.selectedCategoryId) {
            this.selectCategory(this.categories[0]);
          }
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.error = 'Failed to load categories. Please try again.';
          this.categories = [];
        }
      });
  }

  /**
   * Select a category
   */
  selectCategory(category: CategoryWithCoursesDto): void {
    if (this.selectedCategoryId === category.id) {
      return; // Already selected
    }

    this.selectedCategoryId = category.id;
    this.categorySelected.emit(category);
    
    console.log('Category selected:', category);
    
    // Close sidebar on mobile after selection
    if (this.isMobile) {
      this.closeSidebar();
    }
    
    // Optional: Navigate to category-specific route
    // this.router.navigate(['/category', category.id]);
  }

  /**
   * Toggle sidebar visibility
   */
  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.sidebarToggled.emit(this.collapsed);
  }

  /**
   * Close sidebar (mainly for mobile)
   */
  closeSidebar(): void {
    if (this.isMobile) {
      this.collapsed = true;
      this.sidebarToggled.emit(this.collapsed);
    }
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: any): void {
    // Set a default placeholder image
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yMCAzMkMxNi42ODYzIDMyIDEzLjUwNTQgMzAuNjgzOSAxMS4xNzE2IDI4LjM1MDJDOC44Mzc4NSAyNi4wMTY0IDcuNTIxNzMgMjIuODM1NSA3LjUyMTczIDIwQzguNTIxNzMgMTYuNjY0NSA5LjgzNzg1IDEzLjQ4MzYgMTEuMTcxNiAxMS4xNDk4QzEzLjUwNTQgOC44MTYwNyAxNi42ODYzIDcuNSAyMCA3LjVDMjMuMzEzNyA3LjUgMjYuNDk0NiA4LjgxNjA3IDI4LjgyODQgMTEuMTQ5OEMzMS4xNjIyIDEzLjQ4MzYgMzIuNDc4MyAxNi42NjQ1IDMyLjQ3ODMgMjBDMzIuNDc4MyAyMy4zMzU1IDMxLjE2MjIgMjYuNTE2NCAyOC44Mjg0IDI4Ljg1MDJDMJY2LjQ5NDYgMzEuMTgzOSAyMy4zMTM3IDMyLjUgMjAgMzJaTTIwIDlDMTcuMzQ3OCA5IDE0LjgwNDMgMTAuMDUzNiAxMi45Mjg5IDExLjkyOTFDMTEuMDUzNiAxMy44MDQzIDEwIDI2LjM0NzggMTAgMjBDMTAgMjMuNjUyMiAxMS4wNTM2IDI2LjE5NTcgMTIuOTI4OSAyOC4wNzExQzE0LjgwNDMgMjkuOTQ2NCAxNy4zNDc4IDMxIDIwIDMxQzIzLjY1MjIgMzEgMjYuMTk1NyAyOS45NDY0IDI4LjA3MTEgMjguMDcxMUMyOS45NDY0IDI2LjE5NTcgMzEgMjMuNjUyMiAzMSAyMEMzMSAxNi4zNDc4IDI5Ljk0NjQgMTMuODA0MyAyOC4wNzExIDExLjkyOTFDMjYuMTk1NyAxMC4wNTM2IDIzLjY1MjIgOSAyMCA5WiIgZmlsbD0iIzZDNzU3RCIvPgo8cGF0aCBkPSJNMjAgMjJDMjEuMTA0NiAyMiAyMiAyMS4xMDQ2IDIyIDIwQzIyIDE4Ljg5NTQgMjEuMTA0NiAxOCAyMCAxOEMxOC44OTU0IDE4IDE4IDE4Ljg5NTQgMTggMjBDMTggMjEuMTA0NiAxOC44OTU0IDIyIDIwIDIyWiIgZmlsbD0iIzZDNzU3RCIvPgo8L3N2Zz4K';
  }

  /**
   * TrackBy function for ngFor optimization
   */
  trackByCategory(index: number, category: CategoryWithCoursesDto): string {
    return category.id;
  }

  /**
   * Get category display name (capitalize first letter)
   */
  getCategoryDisplayName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  /**
   * Check if a category has courses
   */
  hasCourses(category: CategoryWithCoursesDto): boolean {
    return category.courseCount > 0;
  }

  /**
   * Format course count text
   */
  getCourseCountText(count: number): string {
    return count === 1 ? '1 course' : `${count} courses`;
  }

  /**
   * Refresh categories (public method for external use)
   */
  refresh(): void {
    this.loadCategories();
  }

  /**
   * Get selected category
   */
  getSelectedCategory(): CategoryWithCoursesDto | null {
    return this.categories.find(cat => cat.id === this.selectedCategoryId) || null;
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.selectedCategoryId = null;
  }
}