import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    // private http: HttpClient,
    // private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const credentials = this.loginForm.value;

    // API Implementation (commented out as requested)
    /*
    this.http.post<any>('your-api-endpoint/login', credentials)
      .subscribe({
        next: (response) => {
          // Store token in localStorage
          localStorage.setItem('token', response.token);
          // Navigate to dashboard or home page
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error.message || 'Login failed. Please try again.';
          console.error('Login error:', error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    */

    // Temporary code for demonstration (without API)
    setTimeout(() => {
      console.log('Login credentials:', credentials);
      this.isSubmitting = false;
      // Simulate successful login for demo purposes
      alert('Login successful! (This is just a simulation)');
    }, 1000);
  }
}