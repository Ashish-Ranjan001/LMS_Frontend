import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaServiceService } from '../../../services/tas/ta-service.service';

interface Ta {
  taId: number;
  adminId: number;
  name: string;
  email: string;
  phone: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-view-ta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-ta.component.html',
  styleUrls: ['./view-ta.component.css']
})
export class ViewTaComponent implements OnInit {
  tas: Ta[] = [];
  searchTerm: string = '';
  filteredTas: Ta[] = [];
  paginatedTas: Ta[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  pages: number[] = []; // ✅ Added for pagination

  constructor(private taService: TaServiceService, private router: Router) {}

  ngOnInit(): void {
    this.loadTas();
  }

  loadTas(): void {
    this.isLoading = true;
    this.error = null;

    this.taService.viewTas().subscribe({
      next: (response: Ta[]) => {
        console.log('API Response:', response);
        this.tas = response;
        this.filteredTas = [...this.tas]; // Sync filtered list
        this.calculateTotalPages();
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching TAs:', error);
        this.error = 'Failed to load TA data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  search(): void {
    this.filteredTas = this.searchTerm.trim()
      ? this.tas.filter(ta =>
          ta.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          ta.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      : [...this.tas];

    this.currentPage = 1;
    this.calculateTotalPages();
    this.updatePagination();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredTas.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1); // ✅ Populate pages
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedTas = this.filteredTas.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  goToFirstPage(): void { this.goToPage(1); }
  goToLastPage(): void { this.goToPage(this.totalPages); }
  goToPreviousPage(): void { this.goToPage(this.currentPage - 1); }
  goToNextPage(): void { this.goToPage(this.currentPage + 1); }

  editTa(taId: number): void { this.router.navigate(['/dashboard/ta/edit', taId]); }
  changePassword(taId: number): void {
  this.router.navigate(['/dashboard/changePassword', taId]); // ✅ Correct navigation
}

  getStatusClass(status: boolean): string { return status ? 'active' : 'inactive'; }
  getStatusText(status: boolean): string { return status ? 'Active' : 'Inactive'; }
}