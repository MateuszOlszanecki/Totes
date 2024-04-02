import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
  Scroll,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Lesson } from '../../models/lesson.model';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { StudentsListService } from '../../services/students-list.service';
import { ScheduleService } from '../../services/schedule.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit, OnDestroy {
  routerEventsSubscription!: Subscription;
  authSubscription!: Subscription;
  showMenu = false;
  contentLoading = true;

  user!: User;
  userChangedSubscription!: Subscription;

  nextLesson!: Lesson | null;
  triggerGetNextLessonSubscription!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
    private studentsListService: StudentsListService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.routerEventsSubscription = this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationStart) {
          if (event.url === '/menu') {
            this.showMenu = true;
          } else {
            this.showMenu = false;
          }
        } else if (event instanceof Scroll) {
          if (event.routerEvent.url === '/menu') {
            this.showMenu = true;
          } else {
            this.showMenu = false;
          }
        }
      },
      error: (error) => console.log(error),
    });

    this.userChangedSubscription = this.profileService.userChanged$.subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (error) => console.log(error),
    });
    this.authSubscription = this.authService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.authService.uid = user.uid;

          this.profileService.getUserFromDatabase(this.authService.uid);
          this.studentsListService.getStudentsListFromDatabase(
            this.authService.uid
          );
          this.scheduleService
            .getScheduleFromDatabase(this.authService.uid)
            .add(() => {
              this.nextLesson = this.scheduleService.getNextLesson();
              this.contentLoading = false;
            });
          this.triggerGetNextLessonSubscription =
            this.scheduleService.triggerGetNextLesson$.subscribe(() => {
              this.nextLesson = this.scheduleService.getNextLesson();
            });
        }
      },
      error: (error) => console.log(error),
    });

    setTimeout(() => {
      if (this.contentLoading && !navigator.onLine) {
        alert('Nie można załadować danych, brak dostępu do internetu.');
      }
    }, 3000);
  }

  onNavigateSchedule(): void {
    this.router.navigate(['schedule'], { relativeTo: this.route });
  }

  onNavigateStudentsList(): void {
    this.router.navigate(['students_list'], { relativeTo: this.route });
  }

  onNavigateProfile(): void {
    this.router.navigate(['profile'], { relativeTo: this.route });
  }

  onLogout(): void {
    this.authService.signOut().then(() => this.router.navigate(['login']));
  }

  ngOnDestroy(): void {
    this.routerEventsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.userChangedSubscription.unsubscribe();
    this.triggerGetNextLessonSubscription.unsubscribe();
  }
}
