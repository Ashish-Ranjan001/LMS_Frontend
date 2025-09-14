// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
// import { TokenService } from "../services/Tokenservice/token.service";
// import { Observable } from "rxjs";
// import { Injectable } from "@angular/core";

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminGuard implements CanActivate {
  
//   constructor(
//     private tokenService: TokenService,
//     private router: Router
//   ) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> | Promise<boolean> | boolean {
    
//     if (!this.tokenService.isAuthenticated()) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     if (this.tokenService.isSuperAdmin()) {
//       return true;
//     }

//     // Redirect to home if not admin
//     this.router.navigate(['/home']);
//     return false;
//   }
// }




// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/Tokenservice/token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService:TokenService ,
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