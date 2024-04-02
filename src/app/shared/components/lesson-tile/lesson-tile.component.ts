import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from '../../../models/lesson.model';
import { Student } from '../../../models/student.model';
import { StudentsListService } from '../../../services/students-list.service';
import { Subscription, interval } from 'rxjs';
import { ScheduleService } from '../../../services/schedule.service';

@Component({
  selector: 'app-lesson-tile',
  templateUrl: './lesson-tile.component.html',
})
export class LessonTileComponent implements OnInit, OnDestroy {
  @Input() lesson!: Lesson;
  @Input() showDate = false;
  student!: Student;
  endTime!: string;

  timeSubscription!: Subscription;
  timeUntilNextLessonStart!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentsListService: StudentsListService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    let student = this.studentsListService.getStudent(this.lesson.studentId);
    if (student) {
      this.student = student;
      this.endTime = this.lesson.calculateEndTime();
    }
    if (this.showDate) {
      this.timeUntilNextLessonStart = this.lesson.timeUntilNextLessonStart();
      this.timeSubscription = interval(100).subscribe(() => {
        this.timeUntilNextLessonStart = this.lesson.timeUntilNextLessonStart();
        this.scheduleService.nextTriggerGetNextLesson();
      });
    }
  }

  onNavigateLessonInfo(): void {
    if (this.router.url === '/menu/schedule') {
      this.router.navigate(['lesson_info', this.lesson.id], {
        relativeTo: this.route,
      });
    } else if (this.router.url === '/menu') {
      this.router.navigate(['schedule/lesson_info', this.lesson.id], {
        relativeTo: this.route,
      });
    }
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
}
