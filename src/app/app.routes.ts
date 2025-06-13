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
import { LandingpageComponent} from './components/main/landingpage/landingpage.component';
import { EditTaComponent } from './components/dashboard/edit-ta/edit-ta.component';
import { ViewVideoComponent } from './components/main/view-video/view-video.component';
import { CategoriesComponent } from './components/main/categories/categories.component';
import { CoursesComponent } from './components/main/courses/courses.component';
import {  CourseModuleViewComponent } from './components/main/courses-details/courses-details.component';
import { ModuleviewerComponent } from './components/main/moduleviewer/moduleviewer.component';
import { LearningpageComponent } from './components/main/learningpage/learningpage.component';
import { UpdateUserComponent } from './components/main/userupdate/userupdate.component';




export const routes: Routes = [
    {path: '', component:LandingpageComponent},
    // {path:'user-login',component:LoginComponent},
    // {path:'admin-login',component:LoginComponent},
    {path:'login',component:LoginComponent},
    {path:'home',component:HomeComponent},
    { path: 'categories', component: CategoriesComponent },
    { path: 'courses/:categoryId', component: CoursesComponent },
    { path: 'course-detail/:courseId', component: CourseModuleViewComponent },
    {path: 'video/:id', component: ViewVideoComponent},
    {path: 'ashish/:id' , component: ModuleviewerComponent},
    {path:'learningpage', component:LearningpageComponent},
    {path:'userupdate', component:UpdateUserComponent},
    {path:'module', component:CourseModuleViewComponent },

  

    { path: 'dashboard',component:DashboardhomeComponent , children: [
        { path: 'lob/add', component: AddLobComponent },
        {path: 'lob/view', component:ViewLobComponent },
        { path: 'sme/add', component: AddSmeComponent },
        {path: 'sme/view', component:ViewSmeComponent },
        {path: 'course/addCategory',component:AddCategoryComponent },
        {path: 'course/viewCategory',component:ViewCategoryComponent },
        {path: 'course/addcourse',component:CourseCreatorComponent },
        {path: 'course/viewcourse',component:ViewCourseComponent },
        { path: 'lob/edit/:id', component: EditLobComponent },
        {path : 'sme/edit/:id',component:EditSmeComponent},
        {path: 'category/edit/:id', component: EditCategoryComponent},
        {path: 'user/add', component: UserComponent},
        {path: 'user/view', component: ViewUserComponent},
        {path: 'ta/add', component: AddTaComponent},
        {path: 'ta/view', component: ViewTaComponent},
        {path: 'admin/view', component: ViewAdminComponent},
        {path: 'admin/add', component: AddAdminComponent},
        {path: 'course/edit/:id', component: EditCourseComponent},
        {path: 'module/add/:id', component:AddModuleComponent},
       // {path: 'module/edit/:id', component:EditModuleComponent}
        {path:'module/view/:id', component:ViewModuleComponent},
        {path:'module/edit/:id', component:EditModuleComponent},
       { path: 'ta/edit/:id', component: EditTaComponent },
       
     ] }
];
