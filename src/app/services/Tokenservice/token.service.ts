// import { Injectable } from '@angular/core';
// import { jwtDecode } from 'jwt-decode';

// @Injectable({
//   providedIn: 'root'
// })
// export class TokenService {
//   userName = 'John Doe';
//   userEmail = 'john.doe@example.com';
//   userAvatar = '/assets/avatar.png';
//   userId: string ="";
//   lobid?: string;


//   constructor() { 
//     this.userId = this.getDecodedUserId();
    
//   }

//   getDecodedUserId() {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.error("No auth token found in localStorage.");
//         return null;
//       }

//       const decodedToken: any = jwtDecode(token);
//       console.log("=== DECODED TOKEN ===", decodedToken);

//       this.userName = decodedToken.Name || this.userName;
//       this.userEmail = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || this.userEmail;
//       const gender = decodedToken.Gender;

//       this.userAvatar = gender === 'Male' ? 'male.svg' : 'female.jpg';
//       this.lobid = decodedToken.LobId || this.lobid;
//       const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
//       console.log("=== EXTRACTED USER ID ===", userId);
//       return userId;
//     } catch (error) {
//       console.error("Error decoding JWT:", error);
//       return "";
//     }
//   }
//   getDecodedToken(){
//       return{
//         userId: this.userId,
//         userName: this.userName,
//         userEmail: this.userEmail,
//         userAvatar: this.userAvatar,
//         lobid:this.lobid,
//       }
//     }
//   }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// token.service.ts (Updated)
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({ 
  providedIn: 'root' 
})
export class TokenService {
  userName = 'John Doe';
  userEmail = 'john.doe@example.com';
  userAvatar = '/assets/avatar.png';
  userId: string = "";
  lobid?: string;
  roleId: number = 1;

  constructor() {
    this.userId = this.getDecodedUserId();
  }

  getDecodedUserId() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found in localStorage.");
        return "";
      }

      const decodedToken: any = jwtDecode(token);
      console.log("=== DECODED TOKEN ===", decodedToken);

      this.userName = decodedToken.Name || this.userName;
      this.userEmail = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || this.userEmail;
      this.roleId = parseInt(decodedToken.RoleId) || 1;
      
      const gender = decodedToken.Gender;
      this.userAvatar = gender === 'Male' ? 'male.svg' : 'female.jpg';
      this.lobid = decodedToken.LobId || this.lobid;

      const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
      console.log("=== EXTRACTED USER ID ===", userId);
      return userId;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return "";
    }
  }

  getDecodedToken() {
    return {
      userId: this.userId,
      userName: this.userName,
      userEmail: this.userEmail,
      userAvatar: this.userAvatar,
      lobid: this.lobid,
      roleId: this.roleId
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("authToken");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error checking token validity:", error);
      localStorage.removeItem("authToken");
      return false;
    }
  }

  hasAdminPrivileges(): boolean {
    return this.roleId > 1;
  }

  logout(): void {
    localStorage.removeItem("authToken");
    this.userId = "";
    this.userName = 'John Doe';
    this.userEmail = 'john.doe@example.com';
    this.userAvatar = '/assets/avatar.png';
    this.lobid = undefined;
    this.roleId = 1;
  }
}




  /////////////////////////////////////////////////////////////////////////////////////////////////

// import { Injectable } from '@angular/core';
// import { jwtDecode } from 'jwt-decode';

// interface DecodedToken {
//   Gender: string;
//   IsSuperAdmin: string;
//   Name: string;
//   RoleId: string;
//   Status: string;
//   UserId: string;
//   aud: string;
//   exp: number;
//   'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
//   'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
//   'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
//   iss: string;
//   sub: string;
//   nameid?: string;
//   LobId?: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class TokenService {
//   userName = 'John Doe';
//   userEmail = 'john.doe@example.com';
//   userAvatar = '/assets/avatar.png';

//   userId: string ="";
//   lobid:string="";

//   constructor() { 
//     this.userId = this.getDecodedUserId() || "";
//   }

//   // Your existing method - enhanced with better error handling
//   getDecodedUserId(): string | null {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.error("No auth token found in localStorage.");
//         return null;
//       }

//       const decodedToken: DecodedToken = jwtDecode(token);
//       console.log("=== DECODED TOKEN ===", decodedToken);

//       // Update user info
//       this.userName = decodedToken.Name || this.userName;
//       this.userEmail = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || this.userEmail;


//       this.lobid = decodedToken.LobId || this.lobid;

//       const gender = decodedToken.Gender;
//       this.userAvatar = gender === 'Male' ? 'male.svg' : 'female.jpg';

//       const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
//       console.log("=== EXTRACTED USER ID ===", userId);
//       return userId;
//     } catch (error) {
//       console.error("Error decoding JWT:", error);
//       return null;
//     }
//   }

//   // Your existing method - enhanced
//   getDecodedToken() {
//     return {
//       userId: this.userId,
//       userName: this.userName,
//       userEmail: this.userEmail,
//       userAvatar: this.userAvatar,
//       lobid:this.lobid,
//     }
//   }

//   // NEW METHODS FOR AUTHENTICATION GUARDS

//   // Check if user is authenticated
//   isAuthenticated(): boolean {
//     try {
//       const token = this.getToken();
//       if (!token) {
//         return false;
//       }

//       const decodedToken = this.getFullDecodedToken();
//       if (!decodedToken) {
//         return false;

//       }

//       // Check if token is expired
//       const currentTime = Math.floor(Date.now() / 1000);
//       return decodedToken.exp > currentTime;
//     } catch (error) {
//       console.error('Error checking authentication:', error);
//       return false;
//     }
//   }

//   // Check if user is super admin
//   isSuperAdmin(): boolean {
//     try {
//       const decodedToken = this.getFullDecodedToken();
//       return decodedToken?.IsSuperAdmin === 'True';
//     } catch (error) {
//       console.error('Error checking admin status:', error);
//       return false;
//     }
//   }

//   // Check if user has specific role
//   hasRole(role: string): boolean {
//     try {
//       const decodedToken = this.getFullDecodedToken();
//       const userRole = decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
//       return userRole === role;
//     } catch (error) {
//       console.error('Error checking role:', error);
//       return false;
//     }
//   }

//   // Check if user has any of the specified roles
//   hasAnyRole(roles: string[]): boolean {
//     return roles.some(role => this.hasRole(role));
//   }

//   // Get current user information (enhanced version)
//   getCurrentUser(): any {
//     try {
//       const decodedToken = this.getFullDecodedToken();
//       if (!decodedToken) return null;

//       return {
//         userId: this.userId,
//         name: this.userName,
//         email: this.userEmail,
//         avatar: this.userAvatar,
//         gender: decodedToken.Gender,
//         isSuperAdmin: decodedToken.IsSuperAdmin === 'True',
//         role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
//         roleId: decodedToken.RoleId,
//         status: decodedToken.Status
//       };
//     } catch (error) {
//       console.error('Error getting current user:', error);
//       return null;
//     }
//   }

//   // Get raw token from localStorage
//   getToken(): string | null {
//     return localStorage.getItem("authToken");
//   }

//   // Get full decoded token (private method for internal use)
//   private getFullDecodedToken(): DecodedToken | null {
//     try {
//       const token = this.getToken();
//       if (!token) return null;
      
//       return jwtDecode<DecodedToken>(token);
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return null;
//     }
//   }

//   // Set auth token
//   // setToken(token: string): void {
//   //   localStorage.setItem(this.AUTH_TOKEN_KEY, token);
//   //   // Update user info when token is set
//   //   this.userId = this.getDecodedUserId() || "";
//   // }

//   // Remove auth token
//   // removeToken(): void {
//   //   localStorage.removeItem(this.AUTH_TOKEN_KEY);
//   //   localStorage.removeItem(this.REDIRECT_URL_KEY);
//   //   // Reset user info
//   //   this.userId = "";
//   //   this.userName = 'John Doe';
//   //   this.userEmail = 'john.doe@example.com';
//   //   this.userAvatar = '/assets/avatar.png';
//   // }

//   // Set redirect URL for post-login navigation
//   // setRedirectUrl(url: string): void {
//   //   localStorage.setItem(this.REDIRECT_URL_KEY, url);
//   // }

//   // Get and clear redirect URL
//   // getAndClearRedirectUrl(): string | null {
//   //   const url = localStorage.getItem(this.REDIRECT_URL_KEY);
//   //   localStorage.removeItem(this.REDIRECT_URL_KEY);
//   //   return url;
//   // }

//   // Logout method
//   // logout(): void {
//   //   this.removeToken();
//   // }

//   // Check if token is about to expire (within 5 minutes)
//   isTokenExpiringSoon(): boolean {
//     try {
//       const decodedToken = this.getFullDecodedToken();
//       if (!decodedToken) return true;

//       const currentTime = Math.floor(Date.now() / 1000);
//       const fiveMinutesFromNow = currentTime + (5 * 60);
      
//       return decodedToken.exp <= fiveMinutesFromNow;
//     } catch (error) {
//       console.error('Error checking token expiration:', error);
//       return true;
//     }
//   }

//   // Get user role
//   getUserRole(): string | null {
//     try {
//       const decodedToken = this.getFullDecodedToken();
//       return decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
//     } catch (error) {
//       console.error('Error getting user role:', error);
//       return null;
//     }
//   }

//   // Get user status
//   getUserStatus(): string | null {
//     try {
//       const decodedToken = this.getFullDecodedToken();
//       return decodedToken?.Status || null;
//     } catch (error) {
//       console.error('Error getting user status:', error);
//       return null;
//     }
//   }

//   // Check if user account is active
//   isUserActive(): boolean {
//     try {
//       const status = this.getUserStatus();
//       return status === 'True' || status === 'Active';
//     } catch (error) {
//       console.error('Error checking user status:', error);
//       return false;
//     }
//   }
// }





// // // auth.guard.ts - Enhanced with navigation prevention
// // import { Injectable } from '@angular/core';
// // import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// // import { Observable } from 'rxjs';
// // import { TokenService } from '../services/token.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthGuard implements CanActivate {
  
// //   constructor(
// //     private tokenService: TokenService,
// //     private router: Router
// //   ) {}

// //   canActivate(
// //     route: ActivatedRouteSnapshot,
// //     state: RouterStateSnapshot
// //   ): Observable<boolean> | Promise<boolean> | boolean {
    
// //     // Check if user is authenticated and account is active
// //     if (this.tokenService.isAuthenticated() && this.tokenService.isUserActive()) {
// //       return true;
// //     }
    
// //     // If not authenticated, save the attempted URL and redirect to login
// //     console.log('AuthGuard: User not authenticated, redirecting to login');
// //     this.tokenService.setRedirectUrl(state.url);
// //     this.router.navigate(['/login']);
// //     return false;
// //   }
// // }

// // // admin.guard.ts - Enhanced with role checking using TokenService
// // import { Injectable } from '@angular/core';
// // import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route, UrlSegment } from '@angular/router';
// // import { Observable } from 'rxjs';
// // import { TokenService } from '../services/token.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AdminGuard implements CanActivate, CanLoad {
  
// //   constructor(
// //     private tokenService: TokenService,
// //     private router: Router
// //   ) {}

// //   canActivate(
// //     route: ActivatedRouteSnapshot,
// //     state: RouterStateSnapshot
// //   ): Observable<boolean> | Promise<boolean> | boolean {
// //     return this.checkAdminAccess(state.url);
// //   }

// //   canLoad(
// //     route: Route,
// //     segments: UrlSegment[]
// //   ): Observable<boolean> | Promise<boolean> | boolean {
// //     const url = '/' + segments.map(s => s.path).join('/');
// //     return this.checkAdminAccess(url);
// //   }

// //   private checkAdminAccess(attemptedUrl?: string): boolean {
// //     // First check if user is authenticated
// //     if (!this.tokenService.isAuthenticated()) {
// //       console.log('AdminGuard: User not authenticated, redirecting to login');
// //       if (attemptedUrl) {
// //         this.tokenService.setRedirectUrl(attemptedUrl);
// //       }
// //       this.router.navigate(['/login']);
// //       return false;
// //     }

// //     // Check if user account is active
// //     if (!this.tokenService.isUserActive()) {
// //       console.log('AdminGuard: User account is not active');
// //       this.router.navigate(['/unauthorized']);
// //       return false;
// //     }

// //     // Then check if user has super admin privileges
// //     if (!this.tokenService.isSuperAdmin()) {
// //       console.log('AdminGuard: User not authorized for admin access, redirecting to unauthorized');
// //       this.router.navigate(['/unauthorized']);
// //       return false;
// //     }

// //     return true;
// //   }
// // }

// // // guest.guard.ts - Prevent authenticated users from accessing login
// // import { Injectable } from '@angular/core';
// // import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// // import { Observable } from 'rxjs';
// // import { TokenService } from '../services/token.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class GuestGuard implements CanActivate {
  
// //   constructor(
// //     private tokenService: TokenService,
// //     private router: Router
// //   ) {}

// //   canActivate(
// //     route: ActivatedRouteSnapshot,
// //     state: RouterStateSnapshot
// //   ): Observable<boolean> | Promise<boolean> | boolean {
    
// //     // If user is authenticated, redirect based on role
// //     if (this.tokenService.isAuthenticated() && this.tokenService.isUserActive()) {
// //       if (this.tokenService.isSuperAdmin()) {
// //         console.log('GuestGuard: Admin user already authenticated, redirecting to dashboard');
// //         this.router.navigate(['/dashboard']);
// //       } else {
// //         console.log('GuestGuard: User already authenticated, redirecting to home');
// //         this.router.navigate(['/home']);
// //       }
// //       return false;
// //     }
    
// //     // If not authenticated, allow access to login
// //     return true;
// //   }
// // }

// // // Enhanced AuthService with proper role checking
// // import { Injectable } from '@angular/core';
// // import { BehaviorSubject, Observable } from 'rxjs';
// // import { Router } from '@angular/router';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthService {
// //   private currentUserSubject = new BehaviorSubject<any>(null);
// //   public currentUser$ = this.currentUserSubject.asObservable();

// //   constructor(private router: Router) {
// //     // Initialize user from localStorage on service creation
// //     const savedUser = localStorage.getItem('currentUser');
// //     if (savedUser) {
// //       this.currentUserSubject.next(JSON.parse(savedUser));
// //     }
// //   }

// //   // Check if user is authenticated
// //   isAuthenticated(): boolean {
// //     const user = this.getCurrentUser();
// //     const token = this.getToken();
    
// //     // Check if user exists, has token, and token is not expired
// //     return !!(user && token && !this.isTokenExpired(token));
// //   }

// //   // Check if current user is admin
// //   isAdmin(): boolean {
// //     const user = this.getCurrentUser();
// //     return user && (user.role === 'SuperAdmin' || user.role === 'Admin');
// //   }

// //   // Get current user
// //   getCurrentUser(): any {
// //     return this.currentUserSubject.value;
// //   }

// //   // Get token
// //   getToken(): string | null {
// //     return localStorage.getItem('authToken');
// //   }

// //   // Check if token is expired
// //   private isTokenExpired(token: string): boolean {
// //     try {
// //       const payload = JSON.parse(atob(token.split('.')[1]));
// //       const expiry = payload.exp * 1000; // Convert to milliseconds
// //       return Date.now() > expiry;
// //     } catch (error) {
// //       return true; // If token can't be parsed, consider it expired
// //     }
// //   }

// //   // Login method
// //   login(credentials: any): Observable<any> {
// //     // Your login logic here
// //     // After successful login:
// //     return new Observable(observer => {
// //       // Simulate API call
// //       // Replace this with your actual login API call
      
// //       // On successful login:
// //       const userData = {
// //         id: 1,
// //         username: credentials.username,
// //         role: credentials.role, // Make sure role is set correctly
// //         token: 'your-jwt-token'
// //       };
      
// //       // Store user data
// //       localStorage.setItem('currentUser', JSON.stringify(userData));
// //       localStorage.setItem('authToken', userData.token);
      
// //       // Update subject
// //       this.currentUserSubject.next(userData);
      
// //       observer.next(userData);
// //       observer.complete();
// //     });
// //   }

// //   // Logout method
// //   logout(): void {
// //     // Clear localStorage
// //     localStorage.removeItem('currentUser');
// //     localStorage.removeItem('authToken');
    
// //     // Clear subject
// //     this.currentUserSubject.next(null);
    
// //     // Redirect to login
// //     this.router.navigate(['/login']);
// //   }

// //   // Force logout if token expires
// //   forceLogout(): void {
// //     console.log('Session expired, forcing logout');
// //     this.logout();
// //   }
// // }

// // // Navigation Prevention Service - Works with TokenService
// // import { Injectable } from '@angular/core';
// // import { Router, NavigationEnd, NavigationStart } from '@angular/router';
// // import { TokenService } from './token.service';
// // import { filter } from 'rxjs/operators';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class NavigationGuardService {
  
// //   constructor(
// //     private router: Router,
// //     private tokenService: TokenService
// //   ) {
// //     this.initializeNavigationGuard();
// //   }

// //   private initializeNavigationGuard(): void {
// //     // Monitor navigation attempts and validate before allowing
// //     this.router.events.pipe(
// //       filter(event => event instanceof NavigationStart)
// //     ).subscribe((event: NavigationStart) => {
// //       this.validateNavigationAttempt(event.url);
// //     });

// //     // Also monitor completed navigation for additional security
// //     this.router.events.pipe(
// //       filter(event => event instanceof NavigationEnd)
// //     ).subscribe((event: NavigationEnd) => {
// //       this.validateCurrentRoute(event.url);
// //     });
// //   }

// //   private validateNavigationAttempt(url: string): void {
// //     const isAuthenticated = this.tokenService.isAuthenticated();
// //     const isSuperAdmin = this.tokenService.isSuperAdmin();
// //     const isUserActive = this.tokenService.isUserActive();

// //     // Block navigation to protected routes if not authenticated
// //     if (!isAuthenticated && this.isProtectedRoute(url)) {
// //       console.log('Blocking navigation to protected route:', url);
// //       this.tokenService.setRedirectUrl(url);
// //       this.router.navigate(['/login']);
// //       return;
// //     }

// //     // Block admin routes for non-admin users
// //     if (url.includes('/dashboard') && isAuthenticated && (!isSuperAdmin || !isUserActive)) {
// //       console.log('Blocking admin route access for non-admin user:', url);
// //       this.router.navigate(['/unauthorized']);
// //       return;
// //     }

// //     // Block regular user routes for non-authenticated users
// //     if (this.isUserRoute(url) && !isAuthenticated) {
// //       console.log('Blocking user route access for unauthenticated user:', url);
// //       this.router.navigate(['/login']);
// //       return;
// //     }
// //   }

// //   private validateCurrentRoute(url: string): void {
// //     const isAuthenticated = this.tokenService.isAuthenticated();
// //     const isSuperAdmin = this.tokenService.isSuperAdmin();
// //     const isUserActive = this.tokenService.isUserActive();

// //     // If somehow user reached an unauthorized route, redirect them
// //     if (url.includes('/dashboard') && (!isAuthenticated || !isSuperAdmin || !isUserActive)) {
// //       console.log('User found on unauthorized admin route, redirecting');
// //       this.router.navigate(['/unauthorized']);
// //       return;
// //     }

// //     if (this.isUserRoute(url) && !isAuthenticated) {
// //       console.log('Unauthenticated user found on protected route, redirecting');
// //       this.router.navigate(['/login']);
// //       return;
// //     }

// //     // Check for token expiration
// //     if (isAuthenticated && this.tokenService.isTokenExpiringSoon()) {
// //       console.log('Token expiring soon, consider refreshing or warning user');
// //       // You can implement token refresh logic here
// //     }
// //   }

// //   private isProtectedRoute(url: string): boolean {
// //     const protectedRoutes = [
// //       '/home',
// //       '/dashboard',
// //       '/categories',
// //       '/courses',
// //       '/course-detail',
// //       '/video',
// //       '/updateuser',
// //       '/mylearning',
// //       '/module'
// //     ];

// //     return protectedRoutes.some(route => url.includes(route));
// //   }

// //   private isUserRoute(url: string): boolean {
// //     const userRoutes = [
// //       '/home',
// //       '/categories',
// //       '/courses',
// //       '/course-detail',
// //       '/video',
// //       '/updateuser',
// //       '/mylearning',
// //       '/module'
// //     ];

// //     return userRoutes.some(route => url.includes(route));
// //   }

// //   // Method to force logout if token is invalid
// //   public validateTokenAndLogout(): void {
// //     if (!this.tokenService.isAuthenticated()) {
// //       console.log('Invalid token detected, forcing logout');
// //       this.tokenService.logout();
// //       this.router.navigate(['/login']);
// //     }
// //   }
// // }

// // // app.component.ts - Initialize navigation guard with TokenService
// // import { Component, OnInit, OnDestroy } from '@angular/core';
// // import { NavigationGuardService } from './services/navigation-guard.service';
// // import { TokenService } from './services/token.service';
// // import { Router } from '@angular/router';

// // @Component({
// //   selector: 'app-root',
// //   templateUrl: './app.component.html',
// //   styleUrls: ['./app.component.css']
// // })
// // export class AppComponent implements OnInit, OnDestroy {
// //   private tokenCheckInterval: any;
  
// //   constructor(
// //     private navigationGuard: NavigationGuardService,
// //     private tokenService: TokenService,
// //     private router: Router
// //   ) {}

// //   ngOnInit() {
// //     // Initialize navigation guard (it starts monitoring automatically)
// //     console.log('Navigation guard initialized');

// //     // Check for expired tokens every 30 seconds
// //     this.tokenCheckInterval = setInterval(() => {
// //       if (this.tokenService.isAuthenticated() && !this.tokenService.isUserActive()) {
// //         console.log('User account is no longer active, logging out');
// //         this.forceLogout();
// //       } else if (!this.tokenService.isAuthenticated() && this.isOnProtectedRoute()) {
// //         console.log('Token expired while on protected route, redirecting to login');
// //         this.forceLogout();
// //       }
// //     }, 30000); // Check every 30 seconds

// //     // Handle browser back/forward button navigation
// //     window.addEventListener('popstate', () => {
// //       setTimeout(() => {
// //         this.navigationGuard.validateTokenAndLogout();
// //       }, 100);
// //     });
// //   }

// //   ngOnDestroy() {
// //     if (this.tokenCheckInterval) {
// //       clearInterval(this.tokenCheckInterval);
// //     }
// //   }

// //   private isOnProtectedRoute(): boolean {
// //     const currentUrl = this.router.url;
// //     const protectedRoutes = ['/home', '/dashboard', '/categories', '/courses', '/course-detail', '/video', '/updateuser', '/mylearning', '/module'];
// //     return protectedRoutes.some(route => currentUrl.includes(route));
// //   }

// //   private forceLogout(): void {
// //     this.tokenService.logout();
// //     this.router.navigate(['/login']);
// //   }
// // }

// // // ADDITIONAL: Role-based Guard for future use
// // import { Injectable } from '@angular/core';
// // import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// // import { TokenService } from '../services/token.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class RoleGuard implements CanActivate {
  
// //   constructor(
// //     private tokenService: TokenService,
// //     private router: Router
// //   ) {}

// //   canActivate(
// //     route: ActivatedRouteSnapshot,
// //     state: RouterStateSnapshot
// //   ): boolean {
// //     // Check if user is authenticated
// //     if (!this.tokenService.isAuthenticated() || !this.tokenService.isUserActive()) {
// //       this.tokenService.setRedirectUrl(state.url);
// //       this.router.navigate(['/login']);
// //       return false;
// //     }

// //     // Get required roles from route data
// //     const requiredRoles = route.data['roles'] as string[];
// //     if (!requiredRoles || requiredRoles.length === 0) {
// //       return true; // No specific roles required
// //     }

// //     // Check if user has any of the required roles
// //     const userRole = this.tokenService.getUserRole();
// //     const isSuperAdmin = this.tokenService.isSuperAdmin();
    
// //     // Super admin has access to everything
// //     if (isSuperAdmin) {
// //       return true;
// //     }

// //     // Check if user has required role
// //     if (userRole && requiredRoles.includes(userRole)) {
// //       return true;
// //     }

// //     // Access denied
// //     console.log(`RoleGuard: Access denied. User role: ${userRole}, Required roles: ${requiredRoles.join(', ')}`);
// //     this.router.navigate(['/unauthorized']);
// //     return false;
// //   }
// // }

// // // DEBUGGING: Add this service to help debug authentication issues
// // import { Injectable } from '@angular/core';
// // import { TokenService } from './token.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthDebugService {
  
// //   constructor(private tokenService: TokenService) {}

// //   // Call this method to debug authentication issues
// //   debugAuthState(): void {
// //     console.log('=== AUTH DEBUG INFO ===');
// //     console.log('Is Authenticated:', this.tokenService.isAuthenticated());
// //     console.log('Is Super Admin:', this.tokenService.isSuperAdmin());
// //     console.log('Is User Active:', this.tokenService.isUserActive());
// //     console.log('User Role:', this.tokenService.getUserRole());
// //     console.log('Token Expiring Soon:', this.tokenService.isTokenExpiringSoon());
// //     console.log('Current User:', this.tokenService.getCurrentUser());
// //     console.log('Raw Token:', this.tokenService.getToken() ? 'Present' : 'Missing');
// //     console.log('======================');
// //   }

// //   // Add this to any component where you're having issues:
// //   // constructor(private authDebug: AuthDebugService) {}
// //   // ngOnInit() { this.authDebug.debugAuthState(); }
// // }