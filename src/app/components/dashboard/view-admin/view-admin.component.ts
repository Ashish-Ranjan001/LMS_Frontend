import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AdminserviceService } from '../../../services/Admin/adminservice.service';
import { Router } from '@angular/router';

interface Admin {
  adminId: string;
  userId: string;
  userName: string;
  email: string;
  phone: number;
  smeId: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-view-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './view-admin.component.html',
  styleUrls: ['./view-admin.component.css']
})
export class ViewAdminComponent implements OnInit {
  // Admin data from backend
  admins: Admin[] = [];
  
  // Filtered admins (based on search)
  filteredAdmins: Admin[] = [];
  
  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  
  // Search functionality
  searchControl = new FormControl('');
  
  // Loading state
  isLoading: boolean = true;
  
  constructor(private adminService: AdminserviceService,private router: Router) {}
  
  ngOnInit(): void {
    this.loadAdmins();
    
    // Set up search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.search(searchTerm || '');
      });
  }
  
  loadAdmins(): void {
    this.isLoading = true;
    this.adminService.getAdmins().subscribe({
      next: (response:any) => {
        if (response && response.data) {
          this.admins = response.data;
          this.filteredAdmins = [...this.admins];
          this.calculateTotalPages();
        }
        this.isLoading = false;
      },
      error: (error:any) => {
        console.error('Error loading admins:', error);
        this.isLoading = false;
      }
    });
  }
  
  search(term: string): void {
    if (!term.trim()) {
      this.filteredAdmins = [...this.admins];
    } else {
      const lowerCaseTerm = term.toLowerCase();
      this.filteredAdmins = this.admins.filter(admin => 
        admin.userName.toLowerCase().includes(lowerCaseTerm) ||
        admin.email.toLowerCase().includes(lowerCaseTerm) ||
        admin.phone.toString().includes(term)
      );
    }
    
    this.currentPage = 1; // Reset to first page when searching
    this.calculateTotalPages();
  }
  
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredAdmins.length / this.itemsPerPage);
  }
  
  getCurrentPageItems(): Admin[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAdmins.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  goToFirstPage(): void {
    this.currentPage = 1;
  }
  
  goToLastPage(): void {
    this.currentPage = this.totalPages;
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  // Generate page numbers array for pagination display
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  // Get status display text
  getStatusText(status: boolean): string {
    return status ? 'Active' : 'Inactive';
  }
  
  editAdmin(admin: Admin): void {
    // Assuming your Admin interface has an 'id' property
    const adminId = admin.adminId; // or admin.adminId, depending on your interface
    this.router.navigate(['/dashboard/admin/edit', adminId]);
}
}