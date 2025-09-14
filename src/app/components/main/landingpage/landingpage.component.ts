// import { CommonModule } from '@angular/common';
// import { Component, inject } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-landingpage',
//   imports: [CommonModule],
//   templateUrl: './landingpage.component.html',
//   styleUrl: './landingpage.component.css'
// })
// export class LandingpageComponent {
//   userCardHovered = false
//   adminCardHovered = false

//   router:any=inject(Router)

//   onUserCardHover(isHovered: boolean) {
//     this.userCardHovered = isHovered
//   }

//   onAdminCardHover(isHovered: boolean) {
//     this.adminCardHovered = isHovered
//   }

//   signInAsUser() {
//     console.log("Signing in as User")
//    this.router.navigate(['/login'])
//   }

//   signInAsAdmin() {
//     console.log("Signing in as Admin")
//     // Add your admin sign-in logic here
//     this.router.navigate(['/login'])
//   }

  
// }


import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
 
@Component({
  selector: 'app-landingpage',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,MdbCollapseModule,RouterModule],
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent {
  loginForm: FormGroup;
  userCardHovered = false
 adminCardHovered = false
 
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }
 
   onUserCardHover(isHovered: boolean) {
    this.userCardHovered = isHovered
  }

  onAdminCardHover(isHovered: boolean) {
    this.adminCardHovered = isHovered
  }

  signInAsUser() {
    console.log("Signing in as User")
   this.router.navigate(['/login'])
  }

  signInAsAdmin() {
    console.log("Signing in as Admin")
    // Add your admin sign-in logic here
    this.router.navigate(['/login'])
  }
  onLogin() {
    const loginData = this.loginForm.value;
 
    this.http.post<{ token: string }>('/api/login', loginData).subscribe({
      next: (response) => {
        // localStorage.setItem('authToken', response.token);  // Save JWT token
        this.router.navigate(['/categories']);  // Redirect after login
      },
      error: () => {
        alert("Login failed! Please check your credentials.");
      }
    });
}
}