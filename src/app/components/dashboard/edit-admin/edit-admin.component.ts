import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AdminserviceService } from '../../../services/Admin/adminservice.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  styleUrls: ['./edit-admin.component.css']
})
export class EditAdminComponent implements OnInit {
  adminForm: FormGroup;
  adminId!: string; // Keep as string type
  isLoading = true;
  isSaving = false;
  adminData: any = null;

  constructor(
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private adminService: AdminserviceService, 
    private router: Router
  ) {
    // Initialize form with boolean false instead of empty string
    this.adminForm = this.fb.group({
      status: [false] // Boolean initialization
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Remove parseInt - keep as string
        this.adminId = id;
        console.log('Admin ID from route:', this.adminId);
        this.loadAdminStatus();
      } else {
        console.error('No admin ID found in route parameters');
      }
    });
  }

  loadAdminStatus() {
    this.isLoading = true;
    
    console.log('Loading admin with ID:', this.adminId);
    
    this.adminService.getAdminById(this.adminId).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.adminData = response.data;
          
          // Access status from response.data.status
          const statusFromApi = response.data.status;
          
          this.adminForm.patchValue({ 
            status: statusFromApi // This will be true or false from API
          });
          
          console.log('Loaded Admin Status from backend:', statusFromApi);
          console.log('Form control value after patch:', this.adminForm.get('status')?.value);
          console.log('Full Admin Data:', this.adminData);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Admin:', error);
        console.error('Failed to load admin with ID:', this.adminId);
        this.isLoading = false;
      }
    });
  }

  toggleActiveStatus(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    console.log('Toggle clicked, new value:', checked);
    
    // Use setValue for single control update
    this.adminForm.get('status')?.setValue(checked);
    
    // Add logging to track state changes
    console.log('Form status after toggle:', this.adminForm.get('status')?.value);
  }

  // Method to disable/enable form during operations
  private setFormDisabledState(disabled: boolean) {
    if (disabled) {
      this.adminForm.get('status')?.disable();
    } else {
      this.adminForm.get('status')?.enable();
    }
  }

  onSave() {
    if (!this.isSaving) {
      this.isSaving = true;
      
      // Disable form during save operation
      this.setFormDisabledState(true);
      
      console.log('Saving admin with ID:', this.adminId);
      console.log('Saving with current toggle state:', this.adminForm.get('status')?.value);
      
      // Prepare the request data with current status
      const requestData = { 
        status: this.adminForm.get('status')?.value 
      };
      
      this.adminService.updateAdmin(this.adminId, requestData).subscribe({
        next: (response) => {
          console.log('Admin Status Updated Successfully:', response);
          this.isSaving = false;
          // Re-enable form before navigation
          this.setFormDisabledState(false);
          this.router.navigate(['/dashboard/admin/view']);
        },
        error: (error) => {
          console.error('Error updating Admin:', error);
          console.error('Failed to update admin with ID:', this.adminId);
          this.isSaving = false;
          // Re-enable form on error
          this.setFormDisabledState(false);
        }
      });
    }
  }

  onCancel() {
    console.log('Edit cancelled');
    this.router.navigate(['/dashboard/admin/view']);
  }

  get currentStatus() {
    // Add null safety check
    return this.adminForm.get('status')?.value ?? false;
  }
}