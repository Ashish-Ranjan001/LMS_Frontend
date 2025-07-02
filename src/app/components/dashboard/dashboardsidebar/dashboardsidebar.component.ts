
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboardsidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './dashboardsidebar.component.html',
  styleUrls: ['./dashboardsidebar.component.css']
})
export class DashboardsidebarComponent implements OnInit {
  @Input() collapsed = false;

  // User information
  userRoleId: number = 0;
  userName: string = '';
  userEmail: string = '';
  userAvatar: string = '';
  isSuperAdmin: boolean = false;

  // controls for expanding sub-menus
  businessOpen = true;
  smeOpen = false;
  usersOpen = false;
  taOpen = false;
  adminOpen = false;
  courseOpen = false;
  assignmentOpen = false; 
  reportsOpen = false;

  ngOnInit() {
    this.getDecodedUserData();
    this.setInitialMenuStates();
  }

  // Method to decode JWT token and extract user data including role ID
  getDecodedUserData() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
       
        this.userRoleId = 0;
        this.isSuperAdmin = false;
        return null;
      }

      const decodedToken: any = jwtDecode(token);
    

      // Extract user information
      this.userName = decodedToken.Name || this.userName;
      this.userEmail = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || this.userEmail;
      const gender = decodedToken.Gender;
      this.userAvatar = gender === 'Male' ? 'male.svg' : 'female.jpg';

      // Try multiple possible role property names
      let roleValue = decodedToken.RoleId || 
                     decodedToken.roleId || 
                     decodedToken.role_id || 
                     decodedToken.Role || 
                     decodedToken.role ||
                     decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                     decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'] ||
                     0;

      
      // Convert to number if it's a string
      if (typeof roleValue === 'string') {
        this.userRoleId = parseInt(roleValue, 10);
      } else {
        this.userRoleId = roleValue || 0;
      }

      // Extract IsSuperAdmin property
      const superAdminValue = decodedToken.IsSuperAdmin || decodedToken.isSuperAdmin || decodedToken.is_super_admin || "False";
      this.isSuperAdmin = superAdminValue === "True" || superAdminValue === true;

 
      
      return decodedToken;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      this.userRoleId = 0;
      this.isSuperAdmin = false;
      return null;
    }
  }

  // Method to check if user should see a specific menu item
  shouldShowMenuItem(menuItem: string): boolean {

    
    // Assignment section should NOT be visible to users with role ID 2
    if (menuItem === 'assignment') {
      const shouldShow = this.userRoleId !== 2;
   
      return shouldShow;
    }
    
    // Admin section should only be visible if user is SuperAdmin
    if (menuItem === 'admin') {
      const shouldShow = this.isSuperAdmin;
      
      return shouldShow;
    }
    
    // All other menu items are visible to everyone

    return true;
  }

  // Set initial menu states based on user role
  setInitialMenuStates() {
    if (this.userRoleId === 3) {
      // For role ID 3, open Assignment section by default (since they can see everything)
      this.assignmentOpen = true;
      this.businessOpen = false;
    }
  }

  toggleBusiness() { 
    this.businessOpen = !this.businessOpen; 
  }
  
  toggleSME() { 
    this.smeOpen = !this.smeOpen; 
  }
  
  toggleUsers() { 
    this.usersOpen = !this.usersOpen; 
  }
  
  toggleTA() { 
    this.taOpen = !this.taOpen; 
  }
  
  toggleAdmin() { 
    this.adminOpen = !this.adminOpen; 
  }
  
  toggleCourse() { 
    this.courseOpen = !this.courseOpen; 
  }
  
  toggleUser() { 
    this.usersOpen = !this.usersOpen; 
  }
  
  toggleAssignment() { 
    this.assignmentOpen = !this.assignmentOpen; 
  }
  
  toggleReports() { 
    this.reportsOpen = !this.reportsOpen; 
  }
}