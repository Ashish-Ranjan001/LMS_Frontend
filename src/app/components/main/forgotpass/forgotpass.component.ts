import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
 
@Component({
  selector: 'app-forgotpass',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './forgotpass.component.html',
  styleUrl: './forgotpass.component.css'
})
export class ForgotpassComponent implements OnInit {
  smeId: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  emailInvalid: boolean = false;
  passwordMismatch: boolean = false;
 
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}
 
  ngOnInit(): void {
    this.smeId = this.route.snapshot.paramMap.get('id') || '';
  }
 
  updatePassword(): void {
    this.emailInvalid = !this.email?.includes('@');
    this.passwordMismatch = this.newPassword !== this.confirmPassword;
 
    if (this.emailInvalid || this.passwordMismatch) {
      return;
    }
 
    const payload = {
      email: this.email,
      password: this.newPassword
    };
 
    this.http.put(`https://localhost:7264/api/users`, payload).subscribe({
      next: () => {
        alert('Password updated successfully!');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Error updating password:', err);
        alert('Failed to update password. Please try again.');
      }
    });
  }
}