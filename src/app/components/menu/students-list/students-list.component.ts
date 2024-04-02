import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Student } from '../../../models/student.model';
import { StudentsListService } from '../../../services/students-list.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
})
export class StudentsListComponent implements OnInit, OnDestroy {
  studentsListChangedSubscription!: Subscription;
  studentsList: Student[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentsListService: StudentsListService
  ) {}

  ngOnInit(): void {
    this.studentsList = this.studentsListService.studentsList;
    this.studentsListChangedSubscription =
      this.studentsListService.studentsListChanged$.subscribe({
        next: (studentsList: Student[]) => {
          this.studentsList = studentsList;
        },
        error: (error) => console.log(error),
      });
  }

  onNavigateAddStudent(): void {
    this.router.navigate(['add_student'], {
      relativeTo: this.route,
    });
  }

  ngOnDestroy(): void {
    this.studentsListChangedSubscription.unsubscribe();
  }
}
