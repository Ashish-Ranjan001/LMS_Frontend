// login-redirect.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // User is already logged in, redirect based on role
      try {
        const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
        const roleId = parseInt(decodedToken.RoleId);
        
        if (roleId > 1) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
        return false;
      } catch (error) {
        // Invalid token, allow access to login
        localStorage.removeItem('authToken');
        return true;
      }
    }
    
    return true; // Allow access to login page
  }
}