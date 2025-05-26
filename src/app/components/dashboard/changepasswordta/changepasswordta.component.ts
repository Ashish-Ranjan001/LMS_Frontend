import { Component, OnInit } from '@angular/core';
import { TaServiceService } from '../../../services/tas/ta-service.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-changepasswordta',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './changepasswordta.component.html',
  styleUrl: './changepasswordta.component.css',
})
export class ChangepasswordtaComponent implements OnInit {
  changePasswordForm!: FormGroup;

  constructor(private taService: TaServiceService, private fb: FormBuilder,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchUserEmail();
  }

  initForm(): void {
    this.changePasswordForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  fetchUserEmail(): void {
  const taId = this.route.snapshot.paramMap.get('id'); // ✅ Fetch TA ID from URL
  if (taId) {
    this.taService.getTaById(+taId).subscribe((ta) => {
      this.changePasswordForm.patchValue({ email: ta.email }); // ✅ Autofill email
    });
  }
}
  onChangePassword(): void {
  if (this.changePasswordForm.valid) {
    const newPassword = this.changePasswordForm.get('newPassword')?.value; // ✅ Get password correctly
    const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match"); // ✅ Proper validation
      return;
    }

    const taId = this.route.snapshot.paramMap.get('id'); // ✅ Fetch TA ID dynamically
    if (taId) {
      this.taService.changePassword(+taId, newPassword).subscribe({
        next: () => alert('Password changed successfully'),
        error: () => alert('Error changing password'),
      });
    }
  }
}
}