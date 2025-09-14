import { Component, Input, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-footer.component.html',
  styleUrls: ['./dash-footer.component.css']
})
export class DashFooterComponent implements OnInit {
  /** Sidebar state input */
  @Input() isSidebarOpen = true;

  /** Scroll direction hiding */
  footerHidden = false;
  lastScrollY = 0;

  /** Animated year */
  animatedYear = '';
  private fullYear = new Date().getFullYear().toString();
  private yearIndex = 0;

  ngOnInit() {
    this.animateYear();
  }

  animateYear() {
    this.animatedYear = '';
    this.yearIndex = 0;
    const type = () => {
      if (this.yearIndex < this.fullYear.length) {
        this.animatedYear += this.fullYear[this.yearIndex++];
        setTimeout(type, 120);
      }
    };
    type();
  }

  @HostListener('window:scroll')
  onScroll() {
    const currY = window.scrollY || window.pageYOffset;
    if (currY > this.lastScrollY && currY > 80) {
      this.footerHidden = true;
    } else {
      this.footerHidden = false;
    }
    this.lastScrollY = currY;
  }
}