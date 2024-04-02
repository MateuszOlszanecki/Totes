import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { EmailVerifiedGuard } from './email-verified.guard';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { MenuComponent } from '../components/menu/menu.component';
import { ProfileComponent } from '../components/menu/profile/profile.component';
import { EditProfileComponent } from '../components/menu/profile/edit-profile/edit-profile.component';
import { DeleteProfileComponent } from '../components/menu/profile/delete-profile/delete-profile.component';
import { StudentsListComponent } from '../components/menu/students-list/students-list.component';
import { EditStudentComponent } from '../components/menu/students-list/edit-student/edit-student.component';
import { StudentInfoComponent } from '../components/menu/students-list/student-info/student-info.component';
import { ScheduleComponent } from '../components/menu/schedule/schedule.component';
import { EditLessonComponent } from '../components/menu/schedule/edit-lesson/edit-lesson.component';
import { LessonInfoComponent } from '../components/menu/schedule/lesson-info/lesson-info.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset_password', component: ResetPasswordComponent },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthGuard, EmailVerifiedGuard],
    children: [
      //profile paths
      {
        path: 'profile',
        component: ProfileComponent,
      },
      { path: 'profile/edit', component: EditProfileComponent },
      { path: 'profile/delete', component: DeleteProfileComponent },
      //students list paths
      { path: 'students_list', component: StudentsListComponent },
      { path: 'students_list/add_student', component: EditStudentComponent },
      {
        path: 'students_list/edit_student/:student_id',
        component: EditStudentComponent,
      },
      {
        path: 'students_list/student_info/:student_id',
        component: StudentInfoComponent,
      },
      //schedule paths
      { path: 'schedule', component: ScheduleComponent },
      { path: 'schedule/add_lesson', component: EditLessonComponent },
      {
        path: 'schedule/edit_lesson/:lesson_id',
        component: EditLessonComponent,
      },
      {
        path: 'schedule/lesson_info/:lesson_id',
        component: LessonInfoComponent,
      },
    ],
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
