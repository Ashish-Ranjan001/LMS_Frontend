import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/Tokenservice/token.service';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <h1>Access Denied</h1>
        <p>You don't have permission to access this resource.</p>
        <button (click)="goBack()" class="btn btn-primary">Go Back</button>
        <button (click)="goHome()" class="btn btn-secondary">Go Home</button>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }
    .unauthorized-content {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .btn {
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
  `]
})
export class UnauthorizedComponent {
  
  constructor(
    private router: Router,
    private authService: TokenService
  ) {}

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    if (this.authService.isSuperAdmin()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}