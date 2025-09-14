// // 

// import { Component, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';

// import { RecaptchaModule } from 'ng-recaptcha';
// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, RecaptchaModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   isSubmitting = false;
//   showPassword = false;
//   errorMessage = '';
//   loginSuccess = false;
//   captchaToken: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     @Inject(Router) private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       rememberMe: [false]
//     });
//   }

//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }

//   onCaptchaResolved(token: string | null): void {
//     this.captchaToken = token;
//   }

//   onSubmit() {
//     if (this.loginForm.invalid || !this.captchaToken) {
//       console.log('=== LOGIN FORM INVALID or CAPTCHA missing ===');
//       this.loginForm.markAllAsTouched();
//       if (!this.captchaToken) {
//         this.errorMessage = 'Please complete the CAPTCHA verification.';
//       }
//       return;
//     }

//     this.isSubmitting = true;

//     const credentials = {
//       email: this.loginForm.get('email')?.value,
//       password: this.loginForm.get('password')?.value,
//       recaptchaToken: this.captchaToken
//     };

//     this.http.post<{ token: string }>('https://localhost:7264/api/Login/login', credentials).subscribe({
//       next: (response) => {
//         console.log('=== LOGIN RESPONSE ===', response);
//         localStorage.setItem('authToken', response.token);

//         try {
//           const decodedToken: any = this.decodeJWT(response.token);
//           const roleId =
//             decodedToken.roleid || decodedToken.role_id || decodedToken.RoleId ||
//             decodedToken.role || decodedToken.Role || decodedToken.roleID || decodedToken.ROLE_ID;

//           this.loginSuccess = true;
//           setTimeout(() => {
//             if (roleId === 1 || roleId === '1') {
//               this.router.navigate(['/home']);
//             } else {
//               this.router.navigate(['/dashboard']);
//             }
//           }, 1000);
//         } catch (error) {
//           console.error('=== TOKEN DECODING ERROR ===', error);
//           this.router.navigate(['/dashboard']);
//         }

//         this.isSubmitting = false;
//       },
//       error: (error) => {
//         console.log('=== LOGIN ERROR ===', error);
//         this.isSubmitting = false;
//         this.errorMessage = error.error?.msg || 'Invalid credentials. Please try again.';
//       }
//     });
//   }

//   private decodeJWT(token: string): any {
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(
//         atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
//       );
//       return JSON.parse(jsonPayload);
//     } catch (error) {
//       console.error('Error decoding JWT manually:', error);
//       throw error;
//     }
//   }
// }

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, RecaptchaModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  totpForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  errorMessage = '';
  loginSuccess = false;
  captchaToken: string | null = null;
  
  // 2FA related properties
  showTotpForm = false;
  tempToken = '';
  totpSubmitting = false;
  totpCountdown = 300; // 5 minutes in seconds
  countdownInterval: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(Router) private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    this.totpForm = this.fb.group({
      totpCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onCaptchaResolved(token: string | null): void {
    this.captchaToken = token;
  }

  onSubmit() {
    if (this.loginForm.invalid || !this.captchaToken) {
      console.log('=== LOGIN FORM INVALID or CAPTCHA missing ===');
      this.loginForm.markAllAsTouched();
      if (!this.captchaToken) {
        this.errorMessage = 'Please complete the CAPTCHA verification.';
      }
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const credentials = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      recaptchaToken: this.captchaToken
    };

    this.http.post<any>('https://localhost:7264/api/Login/login', credentials).subscribe({
      next: (response) => {
        console.log('=== LOGIN RESPONSE ===', response);
        
        if (response.requiresTwoFactor) {
          // Show 2FA form
          this.tempToken = response.tempToken;
          this.showTotpForm = true;
          this.startCountdown();
          this.errorMessage = '';
        } else {
          // Regular login success
          localStorage.setItem('authToken', response.Token);
          this.handleLoginSuccess(response.Token);
        }

        this.isSubmitting = false;
      },
      error: (error) => {
        console.log('=== LOGIN ERROR ===', error);
        this.isSubmitting = false;
        this.errorMessage = error.error?.msg || 'Invalid credentials. Please try again.';
      }
    });
  }

  // onTotpSubmit() {
  //   if (this.totpForm.invalid) {
  //     this.totpForm.markAllAsTouched();
  //     return;
  //   }

  //   this.totpSubmitting = true;
  //   this.errorMessage = '';

  //   const totpData = {
  //     tempToken: this.tempToken,
  //     totpCode: this.totpForm.get('totpCode')?.value
  //   };

  //   this.http.post<any>('https://localhost:7264/api/Login/verify-totp', totpData).subscribe({
  //     next: (response) => {
  //       console.log('=== TOTP VERIFICATION RESPONSE ===', response);
        
  //       if (response.err === 0) {
  //         localStorage.setItem('authToken', response.Token);
  //         this.handleLoginSuccess(response.Token);
  //         this.clearCountdown();
  //       } else {
  //         this.errorMessage = response.msg || 'Invalid authentication code.';
  //       }

  //       this.totpSubmitting = false;
  //     },
  //     error: (error) => {
  //       console.log('=== TOTP VERIFICATION ERROR ===', error);
  //       this.totpSubmitting = false;
  //       this.errorMessage = error.error?.msg || 'Invalid authentication code. Please try again.';
  //     }
  //   });
  // }

  onTotpSubmit() {
    if (this.totpForm.invalid) {
      this.totpForm.markAllAsTouched();
      return;
    }
  
    this.totpSubmitting = true;
    this.errorMessage = '';
  
    const totpData = {
      tempToken: this.tempToken,
      totpCode: this.totpForm.get('totpCode')?.value
    };
  
    this.http.post<any>('https://localhost:7264/api/Login/verify-totp', totpData).subscribe({
      next: (response) => {
        console.log('=== TOTP VERIFICATION RESPONSE ===', response);
        
        if (response.err === 0) {
          // Fix: Use lowercase 'token' instead of 'Token'
          const authToken = response.token; // Changed from response.Token
          
          if (authToken) {
            localStorage.setItem('authToken', authToken);
            this.handleLoginSuccess(authToken);
            this.clearCountdown();
          } else {
            console.error('Token not found in response');
            this.errorMessage = 'Authentication failed. Please try again.';
          }
        } else {
          this.errorMessage = response.msg || 'Invalid authentication code.';
        }
  
        this.totpSubmitting = false;
      },
      error: (error) => {
        console.log('=== TOTP VERIFICATION ERROR ===', error);
        this.totpSubmitting = false;
        this.errorMessage = error.error?.msg || 'Invalid authentication code. Please try again.';
      }
    });
  }

  // private handleLoginSuccess(token: string) {
  //   try {
  //     const decodedToken: any = this.decodeJWT(token);
  //     const roleId =
  //       decodedToken.roleid || decodedToken.role_id || decodedToken.RoleId ||
  //       decodedToken.role || decodedToken.Role || decodedToken.roleID || decodedToken.ROLE_ID;

  //     this.loginSuccess = true;
  //     setTimeout(() => {
  //       if (roleId === 1 || roleId === '1') {
  //         this.router.navigate(['/home']);
  //       } else {
  //         this.router.navigate(['/dashboard']);
  //       }
  //     }, 1000);
  //   } catch (error) {
  //     console.error('=== TOKEN DECODING ERROR ===', error);
  //     this.router.navigate(['/dashboard']);
  //   }
  // }

  private handleLoginSuccess(token: string) {
    try {
      // Add validation for token
      if (!token || typeof token !== 'string') {
        console.error('Invalid token provided to handleLoginSuccess');
        this.router.navigate(['/dashboard']);
        return;
      }
  
      console.log('Decoding token:', token);
      const decodedToken: any = this.decodeJWT(token);
      
      // Check multiple possible role field names (case-insensitive)
      const roleId = 
        decodedToken.RoleId || decodedToken.roleId || decodedToken.role_id || 
        decodedToken.roleid || decodedToken.role || decodedToken.Role || 
        decodedToken.roleID || decodedToken.ROLE_ID;
  
      console.log('Decoded token:', decodedToken);
      console.log('Role ID found:', roleId);
  
      this.loginSuccess = true;
      setTimeout(() => {
        if (roleId === 1 || roleId === '1') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }, 1000);
    } catch (error) {
      console.error('=== TOKEN DECODING ERROR ===', error);
      this.router.navigate(['/login']);
    }
  }

  private startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.totpCountdown--;
      if (this.totpCountdown <= 0) {
        this.clearCountdown();
        this.backToLogin();
      }
    }, 1000);
  }

  private clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  backToLogin() {
    this.showTotpForm = false;
    this.tempToken = '';
    this.totpForm.reset();
    this.totpCountdown = 300;
    this.clearCountdown();
    this.errorMessage = '';
  }

  formatCountdown(): string {
    const minutes = Math.floor(this.totpCountdown / 60);
    const seconds = this.totpCountdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Format TOTP input (add space every 3 digits)
  onTotpInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 6) {
      value = value.substring(0, 6);
    }
    event.target.value = value;
    this.totpForm.get('totpCode')?.setValue(value);
  }

  // private decodeJWT(token: string): any {
  //   try {
  //     const base64Url = token.split('.')[1];
  //     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //     const jsonPayload = decodeURIComponent(
  //       atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  //     );
  //     return JSON.parse(jsonPayload);
  //   } catch (error) {
  //     console.error('Error decoding JWT manually:', error);
  //     throw error;
  //   }
  // }

  private decodeJWT(token: string): any {
    try {
      // Add validation
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token: token is null, undefined, or not a string');
      }
  
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format: token should have 3 parts');
      }
  
      const base64Url = parts[1];
      if (!base64Url) {
        throw new Error('Invalid JWT: payload part is missing');
      }
  
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Add padding if needed
      const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4);
      
      const jsonPayload = decodeURIComponent(
        atob(paddedBase64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT manually:', error);
      throw error;
    }
  }
  ngOnDestroy() {
    this.clearCountdown();
  }
}