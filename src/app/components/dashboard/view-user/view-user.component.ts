import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserServiceService } from '../../../services/User/user-service.service';

// User interface based on the API response
export interface User {
  id: string;
  name: string;
  email: string;
  phone: number;
  lobId: string;
  lobName: string;
  designation: string;
  level: string;
  gender: string;
  subLob: string;
  collegeName: string;
  location: string;
  specialization: string;
  collegeLocation: string;
  offerReleaseSpoc: string;
  doj: string;
  trf: string;
  expectanceDate: string;
  collegeTier: string;
  qualification: string;
  status: boolean;
  joinerStatus: string;
  revokes: number;
  uploader: string;
  isTerm: number;
  roleId: number;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  userList: User[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  loading: boolean = false;
  error: string | null = null;
  
  constructor(private router: Router) { }
  userService: any = inject(UserServiceService);

  ngOnInit(): void {
    this.fetchUsers();
  }

  /**
   * Fetch users from the API
   */
  fetchUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.viewUsers().subscribe({
      next: (data: any) => {
        console.log('Users data:', data);
        this.userList = data.data || data; // Handle different response structures
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching users:', err);
        this.error = 'Failed to load users. Please try again later.';
        this.loading = false;
      }
    });
  }

  /**
   * Filter users based on search term
   */
  get filteredUsers(): User[] {
    if (!this.searchTerm.trim()) {
      return this.userList;
    }
    
    const searchLower = this.searchTerm.toLowerCase().trim();
    return this.userList.filter(user => 
      user.name.toLowerCase().includes(searchLower) || 
      user.email.toLowerCase().includes(searchLower) ||
      user.phone.toString().includes(searchLower) ||
      user.lobName.toLowerCase().includes(searchLower) ||
      user.roleName.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Get paginated users for current page
   */
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  /**
   * Calculate total pages
   */
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  /**
   * Handle search term change
   */
  onSearchChange(): void {
    // Reset to first page when search term changes
    this.currentPage = 1;
  }

  /**
   * Navigate to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Navigate to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /**
   * Navigate to first page
   */
  firstPage(): void {
    this.currentPage = 1;
  }

  /**
   * Navigate to last page
   */
  lastPage(): void {
    this.currentPage = this.totalPages;
  }

  /**
   * Handle edit user action
   * Currently logs the user ID as requested (no edit API available yet)
   */
  editUser(userId: string): void {
    console.log('Edit user clicked for ID:', userId);
    
    // Uncomment and modify the line below when edit route is ready
     this.router.navigate([`/dashboard/user/edit/${userId}`]);
    
    // // Optional: Show a temporary message to user
    // alert(`Edit functionality for user ID: ${userId} will be available soon!`);
  }

  /**
   * Get status display text
   */
  getStatusText(status: boolean): string {
    return status ? 'Active' : 'Inactive';
  }

  /**
   * Get CSS class for status badge
   */
  getStatusClass(status: boolean): string {
    return status ? 'active' : 'inactive';
  }

  /**
   * Format phone number for display
   */
  formatPhone(phone: number): string {
    if (!phone) return 'N/A';
    
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return `+91 ${phoneStr.slice(0, 5)} ${phoneStr.slice(5)}`;
    }
    return phoneStr;
  }

  /**
   * Get start index for pagination info
   */
  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  /**
   * Get end index for pagination info
   */
  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredUsers.length);
  }

  /**
   * Refresh user data
   */
  refreshUsers(): void {
    this.fetchUsers();
  }
}