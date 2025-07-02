// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/Tokenservice/token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('No token found, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    try {
      // Check if token is expired
      const decodedToken = this.tokenService.getDecodedToken();
      if (!decodedToken.userId) {
        console.log('Invalid token, redirecting to login');
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
      return false;
    }
  }
}