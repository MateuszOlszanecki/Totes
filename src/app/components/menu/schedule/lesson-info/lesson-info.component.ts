import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Student } from '../../../../models/student.model';
import { Lesson } from '../../../../models/lesson.model';
import { ScheduleService } from '../../../../services/schedule.service';
import { StudentsListService } from '../../../../services/students-list.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-lesson-info',
  templateUrl: './lesson-info.component.html',
})
export class LessonInfoComponent implements OnInit, OnDestroy {
  paramsSubscription!: Subscription;
  scheduleChangedSubscription!: Subscription;
  lesson!: Lesson;
  student!: Student;

  deleting = false;
  deletingButtonPressed = false;

  constructor(
    private scheduleService: ScheduleService,
    private studentsListService: StudentsListService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe({
      next: (params: Params) => {
        let lessonId = params['lesson_id'];
        let lesson = this.scheduleService.getLesson(lessonId);
        if (lesson) {
          this.lesson = lesson;
          let student = this.studentsListService.getStudent(
            this.lesson.studentId
          );
          if (student) {
            this.student = student;
          }
        } else {
          this.scheduleChangedSubscription =
            this.scheduleService.scheduleChanged$.subscribe({
              next: () => {
                let lesson = this.scheduleService.getLesson(lessonId);
                if (lesson) {
                  this.lesson = lesson;
                  let student = this.studentsListService.getStudent(
                    this.lesson.studentId
                  );
                  if (student) {
                    this.student = student;
                  }
                }
              },
              error: (error) => console.log(error),
            });
        }
      },
      error: (error) => console.log(error),
    });
  }

  onNavigateStudentInfo(): void {
    this.router.navigate(
      ['../../../students_list/student_info/', this.student.id],
      {
        relativeTo: this.route,
      }
    );
  }

  onNavigateEditLesson(): void {
    this.router.navigate(['../../edit_lesson', this.lesson.id], {
      relativeTo: this.route,
    });
  }

  onDeleteLesson(): void {
    if (this.deletingButtonPressed && this.lesson.id) {
      this.deleting = true;
      this.scheduleService
        .deleteLessonFromDatabase(this.authService.uid, this.lesson.id)
        .then(() => {
          this.location.back();
          this.deleting = false;
          this.deletingButtonPressed = false;
          this.scheduleService.nextTriggerGetNextLesson();
        })
        .catch((error) => {
          console.log(error);
          this.deleting = false;
          this.deletingButtonPressed = false;
        });
    } else {
      this.deletingButtonPressed = true;
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    if (this.scheduleChangedSubscription) {
      this.scheduleChangedSubscription.unsubscribe();
    }
  }
}
