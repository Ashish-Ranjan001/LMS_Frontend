
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LobServicesService } from '../../../services/lobs/lob-services.service';
import { UserServiceService } from '../../../services/User/user-service.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;

  // LOB list for the dropdown
  lobList: any[] = [];
  loadingData: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private lobService: LobServicesService,
    private userService: UserServiceService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadLobs();
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      Name: ['', [Validators.required, Validators.maxLength(255)]],
      Email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      Password: ['', [Validators.required, Validators.maxLength(255)]],
      Phone: ['', [Validators.required]],
      LobId: ['', [Validators.required]],
      Designation: ['', [Validators.required, Validators.maxLength(255)]],
      Level: ['', [Validators.required, Validators.maxLength(255)]],
      Gender: ['', [Validators.required, Validators.maxLength(200)]],
      SubLob: ['', [Validators.required, Validators.maxLength(200)]],
      CollegeName: ['', [Validators.required, Validators.maxLength(200)]],
      Location: ['', [Validators.required, Validators.maxLength(200)]],
      Specialization: ['', [Validators.required, Validators.maxLength(200)]],
      CollegeLocation: ['', [Validators.required, Validators.maxLength(200)]],
      OfferReleaseSpoc: ['', [Validators.required, Validators.maxLength(200)]],
      Doj: ['', [Validators.required]],
      Trf: ['', [Validators.required, Validators.maxLength(200)]],
      ExpectanceDate: ['', [Validators.required]],
      CollegeTier: ['', [Validators.required, Validators.maxLength(200)]],
      Qualification: ['', [Validators.required, Validators.maxLength(250)]],
      JoinerStatus: ['', [Validators.required, Validators.maxLength(200)]],
      Uploader: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  loadLobs(): void {
    this.loadingData = true;

    this.lobService.viewLobs().subscribe({
      next: (response: any) => {
        console.log('LOBs received:', response.data);
        
        if (Array.isArray(response.data)) {
          this.lobList = response.data;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.lobList = response.data;
        } else {
          console.error('Unexpected LOB response format:', response);
          this.lobList = [];
          this.errorMessage = 'Failed to load LOB data. Please refresh the page.';
        }
        
        console.log('LOB List after processing:', this.lobList);
        this.loadingData = false;
      },
      error: (error: any) => {
        console.error('Error loading LOBs:', error);
        this.lobList = [];
        this.errorMessage = 'Failed to load LOB data. Please refresh the page.';
        this.loadingData = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
      
      // Convert the phone number string to a number
      const formData = {
        ...this.userForm.value,
        Phone: Number(this.userForm.value.Phone),
        LobId: this.userForm.value.LobId
      };
      
      console.log('Formatted data for submission:', formData);
      
      // Here you would call your service to save the user
      this.saveUser(formData);
    } else {
      // Mark all form controls as touched to trigger validation messages
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Method to reset form
  resetForm(): void {
    this.userForm.reset();
  }

  // Save user method
  saveUser(userData: any): void {
    // Get selected LOB name for display purpose
    const selectedLobId = userData.LobId;
    const selectedLob = this.lobList.find(lob => lob.lobId === selectedLobId);
    const lobName = selectedLob ? selectedLob.lobName : 'Unknown LOB';

    console.log('Selected LOB:', {id: selectedLobId, name: lobName});

 
    this.userService.addUser(userData).subscribe({
      next: (response) => {
        console.log('User created successfully', response);
        alert('User created successfully!');
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        alert('Error creating user. Please try again.');
      }
    });

   
   
  }
}