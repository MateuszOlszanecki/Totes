import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Student } from '../../../../models/student.model';
import { StudentsListService } from '../../../../services/students-list.service';
import { ScheduleService } from '../../../../services/schedule.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
})
export class StudentInfoComponent implements OnInit, OnDestroy {
  paramsSubscription!: Subscription;
  studentsListChangedSubscription!: Subscription;
  student!: Student;

  deleting = false;
  deletingButtonPressed = false;

  constructor(
    private studentsListService: StudentsListService,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe({
      next: (params: Params) => {
        let studentId = params['student_id'];
        let student = this.studentsListService.getStudent(studentId);
        if (student) {
          this.student = student;
        } else {
          this.studentsListChangedSubscription =
            this.studentsListService.studentsListChanged$.subscribe({
              next: () => {
                let student = this.studentsListService.getStudent(studentId);
                if (student) {
                  this.student = student;
                }
              },
              error: (error) => console.log(error),
            });
        }
      },
      error: (error) => console.log(error),
    });
  }

  onNavigateEditStudent(): void {
    this.router.navigate(['../../edit_student', this.student.id], {
      relativeTo: this.route,
    });
  }

  onDeleteStudent(): void {
    if (this.deletingButtonPressed && this.student.id) {
      this.deleting = true;
      if (!this.scheduleService.studentHasLessons(this.student.id)) {
        this.studentsListService
          .deleteStudentFromDatabase(this.authService.uid, this.student.id)
          .then(() => {
            this.location.back();
            this.deleting = false;
            this.deletingButtonPressed = false;
          })
          .catch((error) => {
            console.log(error);
            this.deleting = false;
            this.deletingButtonPressed = false;
          });
      } else {
        alert('Ten uczeń ma dodane zajęcia i nie może zostać usunięty.');
        this.deleting = false;
        this.deletingButtonPressed = false;
      }
    } else {
      this.deletingButtonPressed = true;
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    if (this.studentsListChangedSubscription) {
      this.studentsListChangedSubscription.unsubscribe();
    }
  }
}
