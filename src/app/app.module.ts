import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './shared/app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { LoadingButtonComponent } from './shared/components/loading-button/loading-button.component';
import { LessonTileComponent } from './shared/components/lesson-tile/lesson-tile.component';
import { ShowDateTileComponent } from './shared/components/show-date-tile/show-date-tile.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MenuComponent } from './components/menu/menu.component';
import { StudentsListComponent } from './components/menu/students-list/students-list.component';
import { StudentInfoComponent } from './components/menu/students-list/student-info/student-info.component';
import { EditStudentComponent } from './components/menu/students-list/edit-student/edit-student.component';
import { ProfileComponent } from './components/menu/profile/profile.component';
import { ScheduleComponent } from './components/menu/schedule/schedule.component';
import { LessonInfoComponent } from './components/menu/schedule/lesson-info/lesson-info.component';
import { EditLessonComponent } from './components/menu/schedule/edit-lesson/edit-lesson.component';
import { EditProfileComponent } from './components/menu/profile/edit-profile/edit-profile.component';
import { DeleteProfileComponent } from './components/menu/profile/delete-profile/delete-profile.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { StudentTileComponent } from './components/menu/students-list/student-tile/student-tile.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MenuComponent,
    StudentsListComponent,
    StudentInfoComponent,
    EditStudentComponent,
    ProfileComponent,
    ScheduleComponent,
    LessonInfoComponent,
    EditLessonComponent,
    LoadingComponent,
    EditProfileComponent,
    DeleteProfileComponent,
    ResetPasswordComponent,
    StudentTileComponent,
    LoadingButtonComponent,
    LessonTileComponent,
    ShowDateTileComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
