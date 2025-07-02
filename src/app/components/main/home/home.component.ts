

import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import { Subject } from 'rxjs';
import { MainfooterComponent } from '../mainfooter/mainfooter.component';
import { MainheaderComponent } from '../mainheader/mainheader.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoriteCoursesComponent } from '../favorite-courses/favorite-courses.component';
import { HeroBannerComponent } from '../hero-banner/hero-banner.component';

import { CardCarouselComponent } from '../card-carousel/card-carousel.component';
import { HomeCategoriesComponent } from '../home-categories/home-categories.component';
import { HomeSavedCourseComponent } from "../home-saved-course/home-saved-course.component";
import { FolderComponent } from '../folder/folder.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    MainfooterComponent,
    MainheaderComponent,
    CalendarComponent,
    ProgressBarComponent,
    CommonModule,
    FormsModule,
    CardCarouselComponent,
    HeroBannerComponent,
    FavoriteCoursesComponent,
    // HomeCategoriesComponent
    // Add new component imports here when available:
    // CategoriesComponent,
    // PieChartComponent,
    // SavedCoursesComponent
    
    HomeSavedCourseComponent, FolderComponent
],
  
})
export class HomeComponent implements OnInit, OnDestroy {
  // User data
  userName = 'John Doe';
  userEmail = 'john.doe@example.com';
  userAvatar = '/assets/avatar.png';
  userId: string ="";
lobid:string='';
  // Component lifecycle
  private destroy$ = new Subject<void>();

  // Mobile breakpoint
  private mobileBreakpoint = 768;
  private tabletBreakpoint = 1024;
  isMobile = false;
  isTablet = false;

  constructor() {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.userId = this.getDecodedUserId();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width <= this.mobileBreakpoint;
    this.isTablet = width > this.mobileBreakpoint && width <= this.tabletBreakpoint;
  }

  private initializeComponent(): void {
    this.loadUserData();
    this.setupSubscriptions();
  }

  private loadUserData(): void {
    // User data loading logic here if needed
  }

  private setupSubscriptions(): void {
    // Reactive subscriptions logic here
  }

  getDecodedUserId() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found in localStorage.");
        return null;
      }

      const decodedToken: any = jwtDecode(token);
      console.log("=== DECODED TOKEN ===", decodedToken);

      this.userName = decodedToken.Name || this.userName;
      this.userEmail = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || this.userEmail;
      const gender = decodedToken.Gender;

      this.userAvatar = gender === 'Male' ? 'male.svg' : 'female.jpg';
      this.lobid = decodedToken.LobId;

      const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
      console.log("=== EXTRACTED USER ID ===", userId);
      return userId;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }

  onHeroBannerAction(action: any): void {
    console.log('Hero banner action:', action);
  }

  onCarouselItemSelected(item: any): void {
    console.log('Carousel item selected:', item);
  }

  onCourseSelected(course: any): void {
    console.log('Course selected:', course);
  }

  onProgressUpdate(progress: any): void {
    console.log('Progress updated:', progress);
  }


  onCalendarEventSelected(event: any): void {
    console.log('Calendar event selected:', event);
  }

  // onCategorySelected(category: any): void {
  //   console.log('Category selected:', category);
  // }
// In your parent component
// onCategorySelected(category: any): void {
//   console.log('Category selected:', category);
//   // Handle the selected category here
// }
  onSavedCourseSelected(course: any): void {
    console.log('Saved course selected:', course);
  }

  onPieChartDataSelected(data: any): void {
    console.log('Pie chart data selected:', data);
  }

  // In your parent component


  getCurrentBreakpoint(): string {
    const width = window.innerWidth;
    if (width <= 480) return 'xs';
    if (width <= 768) return 'sm';
    if (width <= 1024) return 'md';
    if (width <= 1440) return 'lg';
    return 'xl';
  }

  get isMobileView(): boolean {
    return this.isMobile;
  }

  get isTabletView(): boolean {
    return this.isTablet;
  }
}