import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,MdbCollapseModule,RouterModule],
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent {
  pageTitle = 'Evalueserve'; // Default title

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle(event.url);
      }
    });
  }

  updateTitle(url: string) {
    if (url.includes('user-login')) {
      this.pageTitle = 'User Login';
    } else if (url.includes('admin-login')) {
      this.pageTitle = 'Admin Login';
    } else {
      this.pageTitle = 'Evalueserve';
    }
  }
}