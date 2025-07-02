import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLearningService, CategoryWithCoursesDto } from "../../../services/user-learning.service";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MainheaderComponent } from '../mainheader/mainheader.component';
import { MainfooterComponent } from '../mainfooter/mainfooter.component';
import { TokenService } from '../../../services/Tokenservice/token.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, MainheaderComponent, MainfooterComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: CategoryWithCoursesDto[] = [];
  loading = true;
  error = '';
  viewMode: 'grid' | 'list' = 'grid';
  particles = Array(8).fill(0); // For floating particles

  user = {
    userId: '',
    userName: '',
    userEmail: '',
    userAvatar: '',
    lobid: undefined as string | undefined,
    roleId: 0
  };

  constructor(
    private userLearningService: UserLearningService,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.user = tokenService.getDecodedToken();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';
    
    this.userLearningService.getAllCategories(this.user.userId).subscribe({
      next: (categories) => {
        console.log('Raw categories data:', categories);
        
        if (Array.isArray(categories)) {
          this.categories = categories;
        } else {
          console.warn('Unexpected categories data structure:', categories);
          this.categories = [];
        }
        
        this.loading = false;
        console.log('Processed categories:', this.categories);
      },
      error: (error) => {
        this.error = 'Failed to load categories. Please try again.';
        this.loading = false;
        console.error('Error loading categories:', error);
      }
    });
  }

  getCategoryImageStyle(category: CategoryWithCoursesDto): string {
    if (category.imagePath) {
      return `url('${category.imagePath}')`;
    }
    return this.getDefaultGradient(category.name);
  }

  getDefaultGradient(categoryName: string): string {
    const gradients = [
      'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
      'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
      'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
    ];
    
    const index = categoryName.length % gradients.length;
    return gradients[index];
  }

  onImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    event.target.style.display = 'none';
    const container = event.target.parentElement;
    if (container) {
      const icon = container.querySelector('.category-icon');
      if (icon) {
        (icon as HTMLElement).style.display = 'flex';
      }
    }
  }

  onImageLoad(event: any): void {
    console.log('Image loaded successfully:', event.target.src);
  }

  viewCategoryCourses(categoryId: string, categoryName: string): void {
    console.log('Navigating to courses for category:', categoryId, categoryName);
    if (categoryId) {
      this.router.navigate(['/courses', btoa(categoryId)], { 
        queryParams: { categoryName: categoryName } 
      });
    } else {
      console.error('Category ID is missing');
    }
  }

  trackByCategory(index: number, category: CategoryWithCoursesDto): string {
    return category.id || index.toString();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  getTotalCourses(): number {
    return this.categories.reduce((total, category) => {
      return total + (category.courseCount || 0);
    }, 0);
  }
}