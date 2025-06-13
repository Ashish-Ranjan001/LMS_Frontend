// templateUrl: './userupdate.component.html',
// styleUrl: './userupdate.component.css'

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../../../services/User/user-service.service';
import { CommonModule } from '@angular/common';


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
  selector: 'app-update-user',
  imports: [ReactiveFormsModule],
  templateUrl: './userupdate.component.html',
 styleUrl: './userupdate.component.css'
})


export class UpdateUserComponent implements OnInit {
  updateUserForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  userId: string = '';
  userData: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.updateUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      lobId: ['', Validators.required],
      designation: ['', Validators.required],
      level: ['', Validators.required],
      gender: ['', Validators.required],
      subLob: ['', Validators.required],
      collegeName: ['', Validators.required],
      location: ['', Validators.required],
      specialization: ['', Validators.required],
      collegeLocation: ['', Validators.required],
      offerReleaseSpoc: ['', Validators.required],
      doj: ['', Validators.required],
      trf: ['', Validators.required],
      expectanceDate: ['', Validators.required],
      collegeTier: ['', Validators.required],
      qualification: ['', Validators.required],
      joinerStatus: ['', Validators.required],
      revokes: [0, [Validators.required, Validators.min(0)]],
      uploader: ['', Validators.required],
      isTerm: [0, Validators.required],
      roleId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUserIdFromLocalStorage();
    if (this.userId) {
      this.loadUserData();
    } else {
      this.error = 'No user ID found in local storage';
    }
  }

  getUserIdFromLocalStorage(): void {
    this.userId = localStorage.getItem('userId') || '';
  }

  loadUserData(): void {
    this.loading = true;
    this.error = '';

    this.userService.getUserById(this.userId).subscribe({
      next: (response: User) => {
        this.userData = response;
        this.populateForm(response);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load user data';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  populateForm(user: User): void {
    this.updateUserForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      lobId: user.lobId,
      designation: user.designation,
      level: user.level,
      gender: user.gender,
      subLob: user.subLob,
      collegeName: user.collegeName,
      location: user.location,
      specialization: user.specialization,
      collegeLocation: user.collegeLocation,
      offerReleaseSpoc: user.offerReleaseSpoc,
      doj: this.formatDateForInput(user.doj),
      trf: user.trf,
      expectanceDate: this.formatDateForInput(user.expectanceDate),
      collegeTier: user.collegeTier,
      qualification: user.qualification,
      joinerStatus: user.joinerStatus,
      revokes: user.revokes,
      uploader: user.uploader,
      isTerm: user.isTerm,
      roleId: user.roleId
    });
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.updateUserForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formData = this.updateUserForm.value;
      
      this.userService.updateUser(this.userId, formData).subscribe({
        next: (response) => {
          this.success = 'User profile updated successfully!';
          this.loading = false;
          // Optionally redirect after successful update
          setTimeout(() => {
            this.router.navigate(['/users']);
          }, 2000);
        },
        error: (error) => {
          this.error = 'Failed to update user profile';
          this.loading = false;
          console.error('Error updating user:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.updateUserForm.controls).forEach(key => {
      const control = this.updateUserForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.updateUserForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.updateUserForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['pattern']) return 'Please enter a valid phone number';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['min']) return `${fieldName} must be greater than or equal to ${field.errors['min'].min}`;
    }
    return '';
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}