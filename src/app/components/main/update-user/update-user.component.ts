import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, finalize, catchError, of } from 'rxjs';
import { TokenService } from '../../../services/Tokenservice/token.service';
import { UserServiceService } from '../../../services/User/user-service.service';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | number;
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
  isSuperAdmin: boolean;
}

export interface ApiResponse {
  data: UserProfile;
  msg: string;
}

interface MousePosition {
  x: number;
  y: number;
}

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  userProfile: UserProfile | null = null;
  isLoading = true;
  isSubmitting = false;
  isCardHovered = false;
  
  // Card interaction properties
  isDragging = false;
  cardTransform = '';
  private startMousePos: MousePosition = { x: 0, y: 0 };
  private currentMousePos: MousePosition = { x: 0, y: 0 };
  private cardElement: HTMLElement | null = null;
  private animationFrameId: number | null = null;
  
  private destroy$ = new Subject<void>();

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private userService: UserServiceService
  ) {
    this.profileForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.setupFormValueChanges();
    this.initializeCardInteraction();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupCardInteraction();
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: ['', [
        Validators.required, 
        Validators.pattern(/^[\+]?[0-9\s\-()]{10,}$/),
        Validators.minLength(10),
        Validators.maxLength(15)
      ]],
      gender: ['', Validators.required]
    });
  }

  private loadUserProfile(): void {
    this.isLoading = true;
    
    // Get user ID from token
    const userId = this.tokenService.getDecodedUserId();
    
    if (!userId) {
      console.error('No user ID found');
      this.isLoading = false;
      this.showError('Unable to load user profile. Please login again.');
      return;
    }

    // Fetch user profile from API
    this.userService.getUserById(userId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading user profile:', error);
          this.showError('Failed to load user profile. Please try again.');
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: ApiResponse | null) => {
        if (response && response.data) {
          this.userProfile = response.data;
          this.populateForm();
          console.log('User profile loaded successfully:', this.userProfile);
        }
      });
  }

  private populateForm(): void {
    if (this.userProfile) {
      this.profileForm.patchValue({
        name: this.userProfile.name || '',
        email: this.userProfile.email || '',
        phone: this.userProfile.phone?.toString() || '',
        gender: this.userProfile.gender?.toLowerCase() || ''
      });
    }
  }

  private setupFormValueChanges(): void {
    this.profileForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(formValue => {
        if (this.userProfile) {
          // Update the display values in real-time
          this.userProfile = {
            ...this.userProfile,
            name: formValue.name || this.userProfile.name,
            email: formValue.email || this.userProfile.email,
            phone: formValue.phone || this.userProfile.phone,
            gender: formValue.gender || this.userProfile.gender
          };
        }
      });
  }

  // Card Interaction Methods
  private initializeCardInteraction(): void {
    // Initialize card interaction after view init
    setTimeout(() => {
      this.cardElement = document.querySelector('.id-card') as HTMLElement;
    }, 100);
  }

  private cleanupCardInteraction(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  startDrag(event: MouseEvent): void {
    if (this.isLoading) return;
    
    event.preventDefault();
    this.isDragging = true;
    this.startMousePos = { x: event.clientX, y: event.clientY };
    this.currentMousePos = { x: event.clientX, y: event.clientY };
    
    // Add global mouse event listeners
    document.addEventListener('mousemove', this.onGlobalMouseMove.bind(this));
    document.addEventListener('mouseup', this.onGlobalMouseUp.bind(this));
    
    // Start animation loop
    this.updateCardTransform();
  }

  onDrag(event: MouseEvent): void {
    if (!this.isDragging) return;
    
    event.preventDefault();
    this.currentMousePos = { x: event.clientX, y: event.clientY };
  }

  endDrag(): void {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    
    // Remove global event listeners
    document.removeEventListener('mousemove', this.onGlobalMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onGlobalMouseUp.bind(this));
    
    // Reset card transform with smooth transition
    this.resetCardTransform();
  }

  private onGlobalMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.currentMousePos = { x: event.clientX, y: event.clientY };
    }
  }

  private onGlobalMouseUp(): void {
    this.endDrag();
  }

  private updateCardTransform(): void {
    if (!this.isDragging) return;
    
    const deltaX = this.currentMousePos.x - this.startMousePos.x;
    const deltaY = this.currentMousePos.y - this.startMousePos.y;
    
    // Calculate rotation based on mouse movement
    const rotateX = Math.max(-15, Math.min(15, deltaY * 0.1));
    const rotateY = Math.max(-15, Math.min(15, deltaX * 0.1));
    const translateX = deltaX * 0.3;
    const translateY = deltaY * 0.3;
    
    // Apply transform with shake effect
    const shakeX = Math.sin(Date.now() * 0.01) * 2;
    const shakeY = Math.cos(Date.now() * 0.01) * 2;
    
    this.cardTransform = `
      translate3d(${translateX + shakeX}px, ${translateY + shakeY}px, 0)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;
    
    // Continue animation
    this.animationFrameId = requestAnimationFrame(() => this.updateCardTransform());
  }

  private resetCardTransform(): void {
    // Smooth transition back to original position
    this.cardTransform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)';
    
    // Clear any pending animation frames
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    // Reset card position on window resize
    if (!this.isDragging) {
      this.resetCardTransform();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = this.profileForm.value;
      console.log('Form submitted with data:', formData);
      
      // Get user ID for update
      const userId = this.tokenService.getDecodedUserId();
      
      if (!userId) {
        this.isSubmitting = false;
        this.showError('Unable to update profile. Please login again.');
        return;
      }

      // Call update API
      this.userService.updateUser(userId, formData)
        .pipe(
          takeUntil(this.destroy$),
          catchError(error => {
            console.error('Error updating profile:', error);
            this.showError('Failed to update profile. Please try again.');
            return of(null);
          }),
          finalize(() => {
            this.isSubmitting = false;
          })
        )
        .subscribe((response: any) => {
          if (response) {
            this.showSuccess('Profile updated successfully!');
            
            // Update the user profile with new values
            if (this.userProfile) {
              this.userProfile = {
                ...this.userProfile,
                ...formData,
                updatedAt: new Date().toISOString()
              };
            }
          }
        });
    } else {
      this.markFormGroupTouched();
      this.showError('Please fill in all required fields correctly.');
    }
  }

  onChangePassword(): void {
    // Implement change password functionality
    console.log('Change password clicked');
    this.showInfo('Change password functionality will be implemented soon.');
  }

  onCardHover(isHovered: boolean): void {
    this.isCardHovered = isHovered;
    
    if (!this.isDragging) {
      if (isHovered) {
        // Subtle hover effect
        this.cardTransform = 'translate3d(0, -8px, 0) rotateX(3deg) rotateY(3deg) scale(1.02)';
      } else {
        // Reset to normal
        this.cardTransform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)';
      }
    }
  }

  // Form Validation Helper Methods
  markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return field ? field.valid && (field.dirty || field.touched) : false;
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && (field.dirty || field.touched)) {
      const errors = field.errors;
      
      if (errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (errors['email']) {
        return 'Please enter a valid email address';
      }
      if (errors['pattern']) {
        return 'Please enter a valid phone number';
      }
      if (errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
      }
      if (errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'name': 'Full Name',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'gender': 'Gender'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Avatar Methods
  getAvatarImage(): string {
    if (!this.userProfile) {
      return this.getMaleAvatarSvg(); // Default avatar while loading
    }
    
    switch(this.userProfile.gender?.toLowerCase()) {
      case 'female':
        return this.getFemaleAvatarSvg();
      case 'male':
      default:
        return this.getMaleAvatarSvg();
    }
  }

  private getMaleAvatarSvg(): string {
  //   return `data:image/svg+xml;base64,${btoa(`
  //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  //       <circle cx="50" cy="35" r="15" fill="#fdbcb4"/>
  //       <circle cx="50" cy="75" r="25" fill="#4a90e2"/>
  //       <rect x="40" y="60" width="20" height="30" fill="#4a90e2"/>
  //       <circle cx="42" cy="32" r="1" fill="#333"/>
  //       <circle cx="58" cy="32" r="1" fill="#333"/>
  //       <path d="M45 38 Q50 42 55 38" stroke="#333" stroke-width="1" fill="none"/>
  //       <path d="M35 25 Q50 15 65 25" stroke="#8b4513" stroke-width="3" fill="none"/>
  //     </svg>
  //   `)
  // }`;
  return "male.svg"
  }

  private getFemaleAvatarSvg(): string {
   return "female.jpg"
  }

  // Notification Methods
  private showSuccess(message: string): void {
    // Implement your notification service here
    console.log(`✅ Success: ${message}`);
    // You can replace this with a proper toast/notification service
    alert(`✅ Success: ${message}`);
  }

  private showError(message: string): void {
    // Implement your notification service here
    console.error(`❌ Error: ${message}`);
    alert(`❌ Error: ${message}`);
  }

  private showInfo(message: string): void {
    // Implement your notification service here
    console.log(`ℹ️ Info: ${message}`);
    alert(`ℹ️ Info: ${message}`);
  }

  // Utility Methods
  formatPhoneNumber(phone: string | number): string {
    const phoneStr = phone?.toString() || '';
    if (phoneStr.length === 10) {
      return `+91 ${phoneStr}`;
    }
    return phoneStr;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusBadgeClass(status: string): string {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'bg-success';
      case 'inactive':
        return 'bg-danger';
      case 'pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  // Development Helper Methods (Remove in production)
  logUserProfile(): void {
    console.log('Current User Profile:', this.userProfile);
  }

  logFormValue(): void {
    console.log('Current Form Value:', this.profileForm.value);
  }

  logFormStatus(): void {
    console.log('Form Valid:', this.profileForm.valid);
    console.log('Form Errors:', this.getFormErrors());
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}