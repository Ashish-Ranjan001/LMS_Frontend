import { Component, OnInit } from "@angular/core";
import { DashheaderComponent } from "../dashheader/dashheader.component";
import { DashboardsidebarComponent } from "../dashboardsidebar/dashboardsidebar.component";
import { RouterModule, RouterOutlet } from "@angular/router";
import { DashFooterComponent } from "../dash-footer/dash-footer.component";
import { jwtDecode } from "jwt-decode";

@Component({
  selector: "app-dashboardhome",
  imports: [DashheaderComponent, DashboardsidebarComponent, RouterOutlet, DashFooterComponent, RouterModule],
  templateUrl: "./dashboardhome.component.html",
  styleUrl: "./dashboardhome.component.css",
  standalone: true,
})
export class DashboardhomeComponent implements OnInit {
  isSidebarOpen = false;
  userName = "John Doe";
  userEmail = "john.doe@example.com";
  userAvatar = "/assets/avatar.png";
  lobid = "LOB-ITC-001";

  ngOnInit(): void {
    this.getDecodedUserId();
  }

  getDecodedUserId() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return null;
      const decodedToken: any = jwtDecode(token);
      this.userName = decodedToken.Name || this.userName;
      this.userEmail = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || this.userEmail;
      const gender = decodedToken.Gender;
      this.userAvatar = gender && gender.toLowerCase() === 'male' ? 'male.svg' : 'female.jpg';
      this.lobid = decodedToken.LobId || this.lobid;
      return decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
    } catch (error) {
      return null;
    }
  }

  // Manual Menu Toggle (button)
  onMenuToggle(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Sidebar hover/collapse communication
  onSidebarCollapsedChange(collapsed: boolean): void {
    this.isSidebarOpen = !collapsed;
  }

  // Other (profile, search, etc.) handlers as before...
}