import { Component, OnInit } from "@angular/core"
import { DashheaderComponent } from "../dashheader/dashheader.component"
import { DashboardsidebarComponent } from "../dashboardsidebar/dashboardsidebar.component"
import { RouterModule, RouterOutlet } from "@angular/router"
import { DashFooterComponent } from "../dash-footer/dash-footer.component"
import { TokenService } from "../../../services/Tokenservice/token.service"
import { jwtDecode } from "jwt-decode"

@Component({
  selector: "app-dashboardhome",
  imports: [DashheaderComponent, DashboardsidebarComponent, RouterOutlet, DashFooterComponent, RouterModule],
  templateUrl: "./dashboardhome.component.html",
  styleUrl: "./dashboardhome.component.css",
})
export class DashboardhomeComponent implements OnInit{
  isSidebarOpen = true

  // User data - you can get these from your auth service or user service
  userName = "John Doe"
  userEmail = "john.doe@example.com"
  userAvatar = "/assets/avatar.png"
  lobid = "LOB-ITC-001" // Your LOB ID

  ngOnInit(): void {
    this.getDecodedUserId();
    
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

      this.userAvatar = gender.toLowerCase() === 'male' ? 'male.svg' : 'female.jpg';
      this.lobid = decodedToken.LobId;

      const userId = decodedToken.UserId || decodedToken.nameid || decodedToken.sub;
      console.log("=== EXTRACTED USER ID ===", userId);
      return userId;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }
  // Menu toggle handler
  onMenuToggle(): void {
    this.isSidebarOpen = !this.isSidebarOpen
  }

  // Search handler
  onSearchSubmit(query: string): void {
    console.log("Search submitted:", query)
    // Handle search functionality
  }

  // Profile handlers
  onProfileClick(): void {
    console.log("Profile clicked")
  }

  onAccountSettingsClick(): void {
    console.log("Account settings clicked")
    // Navigate to account settings or handle the action
  }

  onChangePasswordClick(): void {
    console.log("Change password clicked")
    // Navigate to change password or handle the action
  }

  onLogoutClick(): void {
    console.log("Logout clicked")
    // Handle logout functionality
  }

  onMyLearningClick(): void {
    console.log("My Learning clicked")
    // Navigate to my learning page
  }
}
