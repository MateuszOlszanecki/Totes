import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScheduleService } from '../../../services/schedule.service';
import { Lesson } from '../../../models/lesson.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent implements OnInit, OnDestroy {
  scheduleChangedSubscription!: Subscription;
  schedule!: Lesson[];

  showPastLessons!: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.showPastLessons = this.scheduleService.showPastLessons;
    this.schedule = this.scheduleService.getFilteredSchedule();
    this.scheduleChangedSubscription =
      this.scheduleService.scheduleChanged$.subscribe({
        next: (schedule) => {
          this.schedule = schedule;
        },
        error: (error) => console.log(error),
      });
  }

  isFirstLessonOfDay(index: number): boolean {
    if (index === 0) return true;
    const prevLessonDate = new Date(this.schedule[index - 1].date);
    prevLessonDate.setHours(0, 0, 0, 0);
    const currentLessonDate = new Date(this.schedule[index].date);
    currentLessonDate.setHours(0, 0, 0, 0);
    return prevLessonDate < currentLessonDate;
  }

  onTogglePastLessons(): void {
    this.showPastLessons = !this.showPastLessons;
    this.scheduleService.showPastLessons = this.showPastLessons;
  }

  onNavigateAddLesson(): void {
    this.router.navigate(['add_lesson'], {
      relativeTo: this.route,
    });
  }

  ngOnDestroy(): void {
    this.scheduleChangedSubscription.unsubscribe();
  }
}
