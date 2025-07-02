// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { Routes } from '@angular/router';

// import { HomeComponent } from './components/main/home/home.component';
// import { DashboardhomeComponent } from './components/dashboard/dashboardhome/dashboardhome.component';
// import { AddLobComponent } from './components/dashboard/add-lob/add-lob.component';
// import { ViewLobComponent } from './components/dashboard/view-lob/view-lob.component';
// import { AddSmeComponent } from './components/dashboard/add-sme/add-sme.component';
// import { ViewSmeComponent } from './components/dashboard/view-sme/view-sme.component';
// import { AddCategoryComponent } from './components/dashboard/add-category/add-category.component';
// import { ViewCategoryComponent } from './components/dashboard/view-category/view-category.component';
// import { AddCourseComponent } from './components/dashboard/add-course/add-course.component';
// import { CourseCreatorComponent } from './components/dashboard/course-creator/course-creator.component';
// import { ViewCourseComponent } from './components/dashboard/view-course/view-course.component';
// import { EditLobComponent } from './components/dashboard/edit-lob/edit-lob.component';
// import { EditSmeComponent } from './components/dashboard/edit-sme/edit-sme.component';
// import { EditCategoryComponent } from './components/dashboard/edit-category/edit-category.component';
// import { UserComponent } from './components/dashboard/user/user.component';
// import { AddTaComponent } from './components/dashboard/add-ta/add-ta.component';
// import { ViewTaComponent } from './components/dashboard/view-ta/view-ta.component';
// import { ViewAdminComponent } from './components/dashboard/view-admin/view-admin.component';
// import { AddAdminComponent } from './components/dashboard/add-admin/add-admin.component';
// import { LoginComponent } from './components/main/login/login.component';

// import { ViewUserComponent } from './components/dashboard/view-user/view-user.component';

// import { EditCourseComponent } from './components/dashboard/edit-course/edit-course.component';
// import { AddModuleComponent } from './components/dashboard/add-module/add-module.component';
// import { EditModuleComponent } from './components/dashboard/edit-module/edit-module.component';
// import { ViewModuleComponent } from './components/dashboard/view-module/view-module.component';
// import { LandingpageComponent} from './components/main/landingpage/landingpage.component';
// import { EditTaComponent } from './components/dashboard/edit-ta/edit-ta.component';
// import { ViewVideoComponent } from './components/main/view-video/view-video.component';
// import { CategoriesComponent } from './components/main/categories/categories.component';
// import { CoursesComponent } from './components/main/courses/courses.component';
// import {  CoursesDetailComponent } from './components/main/courses-details/courses-details.component';
// import { UpdateUserComponent } from './components/main/update-user/update-user.component';
// import { LearningpageComponent } from './components/main/learningpage/learningpage.component';
// import { CoursemodulevideocomponentComponent } from './components/main/coursemodulevideocomponent/coursemodulevideocomponent.component';
// import { ViewAssignmentComponent } from './components/dashboard/view-assignment/view-assignment.component';
// import { AddAssignmentComponent } from './components/dashboard/add-assignment/add-assignment.component';
// import { DownlaodReportComponent } from './components/dashboard/downlaod-report/downlaod-report.component';
// import { EditAdminComponent } from './components/dashboard/edit-admin/edit-admin.component';
// import { ForgotpassComponent } from './components/main/forgotpass/forgotpass.component';

// // import { DashboardComponent } from './components/main/dashboard/dashboard.component';

// // routes guards
// // import { AuthGuard } from '../app/guards/auth.guard.ts.guard';
// // import { AdminGuard } from '../app/guards/admin.guard.ts.guard';
// // import { GuestGuard } from '../app/guards/guest.guard.ts.guard';
// // import { RoleGuard } from '../app/guards/role.guard.ts.guard';



// export const routes: Routes = [
//     {path: '', component:LandingpageComponent},
//     // {path:'user-login',component:LoginComponent},
//     // {path:'admin-login',component:LoginComponent},
//     {path:'login',component:LoginComponent},
//     // {path:'dash',component:DashboardComponent},
//     {path:'home',component:HomeComponent},
//     { path: 'categories', component: CategoriesComponent },
//     { path: 'courses/:categoryId', component: CoursesComponent },
//     { path: 'course-detail/:courseId', component: CoursesDetailComponent },
//     {path: 'video/:id', component: ViewVideoComponent},
//     {path: 'updateuser', component: UpdateUserComponent},
//     {path: 'mylearning', component: LearningpageComponent},
//     {path:'module/:courseId',component:CoursemodulevideocomponentComponent },
//     {path:'forgot-password',component:ForgotpassComponent},
    

//     { path: 'dashboard',component:DashboardhomeComponent , children: [
//         { path: 'lob/add', component: AddLobComponent },
//         {path: 'lob/view', component:ViewLobComponent },
//         { path: 'sme/add', component: AddSmeComponent },
//         {path: 'sme/view', component:ViewSmeComponent },
//         {path: 'course/addCategory',component:AddCategoryComponent },
//         {path: 'course/viewCategory',component:ViewCategoryComponent },
//         {path: 'course/addcourse',component:CourseCreatorComponent },
//         {path: 'course/viewcourse',component:ViewCourseComponent },
//         { path: 'lob/edit/:id', component: EditLobComponent },
//         {path : 'sme/edit/:id',component:EditSmeComponent},
//         {path: 'category/edit/:id', component: EditCategoryComponent},
//         {path: 'user/add', component: UserComponent},
//         {path: 'user/view', component: ViewUserComponent},
//         {path: 'ta/add', component: AddTaComponent},
//         {path: 'ta/view', component: ViewTaComponent},
//         {path: 'admin/view', component: ViewAdminComponent},
//         {path: 'admin/add', component: AddAdminComponent},
//         {path: 'course/edit/:id', component: EditCourseComponent},
//         {path: 'module/add/:id', component:AddModuleComponent},
//        // {path: 'module/edit/:id', component:EditModuleComponent}
//         {path:'module/view/:id', component:ViewModuleComponent},
//         {path:'module/edit/:id', component:EditModuleComponent},
//        {path: 'ta/edit/:id', component: EditTaComponent },
//        {path: 'assignment/view', component:ViewAssignmentComponent},
//        {path: 'assignment/add', component:AddAssignmentComponent},
//        {path: 'reports/generate', component:DownlaodReportComponent},
//        {path: 'user/edit/:id', component:UpdateUserComponent},
//        {path: 'admin/edit/:id', component:EditAdminComponent},
       
//      ] }
//     ];








    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // app.routes.ts (Updated with Guards)
import { Routes } from '@angular/router';
import { HomeComponent } from './components/main/home/home.component';
import { DashboardhomeComponent } from './components/dashboard/dashboardhome/dashboardhome.component';
import { AddLobComponent } from './components/dashboard/add-lob/add-lob.component';
import { ViewLobComponent } from './components/dashboard/view-lob/view-lob.component';
import { AddSmeComponent } from './components/dashboard/add-sme/add-sme.component';
import { ViewSmeComponent } from './components/dashboard/view-sme/view-sme.component';
import { AddCategoryComponent } from './components/dashboard/add-category/add-category.component';
import { ViewCategoryComponent } from './components/dashboard/view-category/view-category.component';
import { AddCourseComponent } from './components/dashboard/add-course/add-course.component';
import { CourseCreatorComponent } from './components/dashboard/course-creator/course-creator.component';
import { ViewCourseComponent } from './components/dashboard/view-course/view-course.component';
import { EditLobComponent } from './components/dashboard/edit-lob/edit-lob.component';
import { EditSmeComponent } from './components/dashboard/edit-sme/edit-sme.component';
import { EditCategoryComponent } from './components/dashboard/edit-category/edit-category.component';
import { UserComponent } from './components/dashboard/user/user.component';
import { AddTaComponent } from './components/dashboard/add-ta/add-ta.component';
import { ViewTaComponent } from './components/dashboard/view-ta/view-ta.component';
import { ViewAdminComponent } from './components/dashboard/view-admin/view-admin.component';
import { AddAdminComponent } from './components/dashboard/add-admin/add-admin.component';
import { LoginComponent } from './components/main/login/login.component';
import { ViewUserComponent } from './components/dashboard/view-user/view-user.component';
import { EditCourseComponent } from './components/dashboard/edit-course/edit-course.component';
import { AddModuleComponent } from './components/dashboard/add-module/add-module.component';
import { EditModuleComponent } from './components/dashboard/edit-module/edit-module.component';
import { ViewModuleComponent } from './components/dashboard/view-module/view-module.component';
import { LandingpageComponent } from './components/main/landingpage/landingpage.component';
import { EditTaComponent } from './components/dashboard/edit-ta/edit-ta.component';
import { ViewVideoComponent } from './components/main/view-video/view-video.component';
import { CategoriesComponent } from './components/main/categories/categories.component';
import { CoursesComponent } from './components/main/courses/courses.component';
import { CoursesDetailComponent } from './components/main/courses-details/courses-details.component';
import { UpdateUserComponent } from './components/main/update-user/update-user.component';
import { LearningpageComponent } from './components/main/learningpage/learningpage.component';
import { CoursemodulevideocomponentComponent } from './components/main/coursemodulevideocomponent/coursemodulevideocomponent.component';
import { ViewAssignmentComponent } from './components/dashboard/view-assignment/view-assignment.component';
import { AddAssignmentComponent } from './components/dashboard/add-assignment/add-assignment.component';
import { DownlaodReportComponent } from './components/dashboard/downlaod-report/downlaod-report.component';
import { EditAdminComponent } from './components/dashboard/edit-admin/edit-admin.component';
import { ForgotpassComponent } from './components/main/forgotpass/forgotpass.component';

// Import Guards
import { AuthGuard } from './guards/admin.guard.ts.guard';
import { RoleGuard } from './guards/role.guard.ts.guard';
import { LoginRedirectGuard } from './guards/login-redirect.guard';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    // Public routes
    { path: '', component: LandingpageComponent },
    { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [LoginRedirectGuard] // Redirect if already logged in
    },
    { path: 'forgot-password', component: ForgotpassComponent },

    // Protected routes that require authentication
    { 
        path: 'home', 
        component: HomeComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'categories', 
        component: CategoriesComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'courses/:categoryId', 
        component: CoursesComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'course-detail/:courseId', 
        component: CoursesDetailComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'video/:id', 
        component: ViewVideoComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'updateuser', 
        component: UpdateUserComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'mylearning', 
        component: LearningpageComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'module/:courseId', 
        component: CoursemodulevideocomponentComponent, 
        canActivate: [AuthGuard] 
    },

    // Dashboard routes - require authentication AND admin role
    { 
        path: 'dashboard', 
        component: DashboardhomeComponent,
        canActivate: [AuthGuard, RoleGuard], // Both auth and role guards
        children: [
            { 
                path: 'lob/add', 
                component: AddLobComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'lob/view', 
                component: ViewLobComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'sme/add', 
                component: AddSmeComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'sme/view', 
                component: ViewSmeComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'course/addCategory', 
                component: AddCategoryComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'course/viewCategory', 
                component: ViewCategoryComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'course/addcourse', 
                component: CourseCreatorComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'course/viewcourse', 
                component: ViewCourseComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'lob/edit/:id', 
                component: EditLobComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'sme/edit/:id', 
                component: EditSmeComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'category/edit/:id', 
                component: EditCategoryComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'user/add', 
                component: UserComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'user/view', 
                component: ViewUserComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'ta/add', 
                component: AddTaComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'ta/view', 
                component: ViewTaComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'admin/view', 
                component: ViewAdminComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'admin/add', 
                component: AddAdminComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'course/edit/:id', 
                component: EditCourseComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'module/add/:id', 
                component: AddModuleComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'module/view/:id', 
                component: ViewModuleComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'module/edit/:id', 
                component: EditModuleComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'ta/edit/:id', 
                component: EditTaComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'assignment/view', 
                component: ViewAssignmentComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'assignment/add', 
                component: AddAssignmentComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'reports/generate', 
                component: DownlaodReportComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'user/edit/:id', 
                component: UpdateUserComponent,
                canActivate: [RoleGuard]
            },
            { 
                path: 'admin/edit/:id', 
                component: EditAdminComponent,
                canActivate: [RoleGuard]
            },
            {
                path:'',
                component:AdminDashboardComponent,
                canActivate: [RoleGuard]
            }
        ]
    },

    // Wildcard route - redirect to landing page
    { path: '**', redirectTo: '' }
];