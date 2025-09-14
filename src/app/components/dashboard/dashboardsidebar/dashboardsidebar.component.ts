import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface NavChild {
  to: string;
  label: string;
}
interface NavSection {
  key: string;
  icon: string;
  label: string;
  children: NavChild[];
  permission?: () => boolean;
}

@Component({
  selector: 'app-dashboardsidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './dashboardsidebar.component.html',
  styleUrls: ['./dashboardsidebar.component.css']
})
export class DashboardsidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  userRoleId = 0;
  userName = '';
  userEmail = '';
  userAvatar = '';
  isSuperAdmin = false;

  openSections: { [key: string]: boolean } = {};

  // For hover/expand
  tempExpanded = false;

  navConfig: NavSection[] = [
    {
      key: 'reports',
      icon: 'bi-bar-chart-line',
      label: 'Reports',
      children: [
        { to: '/dashboard/reports/generate', label: 'Generate Report' }
      ],
      permission: () => this.userRoleId !== 0
    },
    {
      key: 'business',
      icon: 'bi-briefcase',
      label: 'Line of Business',
      children: [
        { to: '/dashboard/lob/add', label: 'Add LoB' },
        { to: '/dashboard/lob/view', label: 'View LoB' }
      ]
    },
    {
      key: 'sme',
      icon: 'bi-person-badge',
      label: 'SME',
      children: [
        { to: '/dashboard/sme/add', label: 'Add SME' },
        { to: '/dashboard/sme/view', label: 'View SME' }
      ]
    },
    {
      key: 'courses',
      icon: 'bi-journal-bookmark',
      label: 'Courses',
      children: [
        { to: '/dashboard/course/addCategory', label: 'Add Category' },
        { to: '/dashboard/course/viewCategory', label: 'View Category' },
        { to: '/dashboard/course/addcourse', label: 'Add Course' },
        { to: '/dashboard/course/viewcourse', label: 'View Course' }
      ]
    },
    {
      key: 'user',
      icon: 'bi-person-circle',
      label: 'User',
      children: [
        { to: '/dashboard/user/add', label: 'Add User' },
        { to: '/dashboard/user/view', label: 'View User' }
      ]
    },
    {
      key: 'ta',
      icon: 'bi-person-workspace',
      label: 'TA',
      children: [
        { to: '/dashboard/ta/add', label: 'Add TA' },
        { to: '/dashboard/ta/view', label: 'View TA' }
      ]
    },
    {
      key: 'admin',
      icon: 'bi-shield-lock',
      label: 'Admin',
      children: [
        { to: '/dashboard/admin/add', label: 'Add Admin' },
        { to: '/dashboard/admin/view', label: 'View Admin' }
      ],
      permission: () => this.isSuperAdmin
    },
    {
      key: 'assignment',
      icon: 'bi-pencil-square',
      label: 'Assignment',
      children: [
        { to: '/dashboard/assignment/add', label: 'Add Assignment' },
        { to: '/dashboard/assignment/view', label: 'View Assignment' }
      ],
      permission: () => this.userRoleId !== 2
    }
  ];

  ngOnInit() {
    this.getDecodedUserData();
    this.setInitialMenuStates();
  }

  getDecodedUserData() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;
      const decodedToken: any = jwtDecode(token);
      this.userName = decodedToken.Name || this.userName;
      this.userEmail = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || this.userEmail;
      const gender = decodedToken.Gender;
      this.userAvatar = (gender && gender.toLowerCase() === 'male') ? 'male.svg' : 'female.jpg';
      let roleValue = decodedToken.RoleId ||
                      decodedToken.roleId ||
                      decodedToken.role_id ||
                      decodedToken.Role ||
                      decodedToken.role ||
                      decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                      decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'] ||
                      0;
      this.userRoleId = typeof roleValue === 'string' ? parseInt(roleValue, 10) : roleValue || 0;
      const superAdminValue = decodedToken.IsSuperAdmin || decodedToken.isSuperAdmin || decodedToken.is_super_admin || 'False';
      this.isSuperAdmin = superAdminValue === 'True' || superAdminValue === true;
      return decodedToken;
    } catch (error) {
      this.userRoleId = 0;
      this.isSuperAdmin = false;
      return null;
    }
  }

  shouldShowMenuItem(menuItem: string): boolean {
    const config = this.navConfig.find(item => item.key === menuItem);
    if (config && config.permission) return config.permission();
    return true;
  }

  setInitialMenuStates() {
    if (this.userRoleId === 3) {
      this.openSections['assignment'] = true;
    } else {
      this.openSections['business'] = true;
    }
  }

  toggleSection(key: string) {
    if (this.collapsed && !this.tempExpanded) return;
    this.openSections[key] = !this.openSections[key];
  }

  // Hover expand/collapse logic
  onSidebarMouseEnter() {
    if (this.collapsed && !this.tempExpanded) {
      this.tempExpanded = true;
      this.collapsedChange.emit(false);
    }
  }
  onSidebarMouseLeave() {
    if (this.tempExpanded) {
      this.tempExpanded = false;
      this.collapsedChange.emit(true);
    }
  }
}