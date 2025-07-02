// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const roleId = parseInt(decodedToken.RoleId);
      
      console.log('User Role ID:', roleId);

      // Check if user has admin privileges (RoleId > 1)
      // RoleId 1 = User, RoleId > 1 = Admin/SME/TA
      if (roleId > 1) {
        return true; // Allow access to dashboard
      } else {
        console.log('Insufficient privileges, redirecting to home');
        this.router.navigate(['/home']);
        return false;
      }
    } catch (error) {
      console.error('Error checking role:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}