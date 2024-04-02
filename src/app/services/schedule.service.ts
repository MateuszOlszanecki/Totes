import { Injectable } from '@angular/core';
import { Lesson } from '../models/lesson.model';
import { Subject, Subscription } from 'rxjs';
import { DataStorageService } from './data-storage.service';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private _schedule: Lesson[] = [];
  scheduleChanged$ = new Subject<Lesson[]>();

  private _showPastLessons = false;

  triggerGetNextLesson$ = new Subject<void>();

  constructor(private dataStorageService: DataStorageService) {}

  get schedule(): Lesson[] {
    return this._schedule;
  }

  set schedule(schedule: Lesson[]) {
    this._schedule = schedule;
  }

  get showPastLessons(): boolean {
    return this._showPastLessons;
  }

  set showPastLessons(showPastLessons: boolean) {
    this._showPastLessons = showPastLessons;
    this.scheduleChanged$.next(this.getFilteredSchedule());
  }

  getLesson(id: string): Lesson | undefined {
    return this.schedule.find((lesson) => lesson.id === id);
  }

  getLessonIndex(id: string): number {
    return this.schedule.findIndex((lesson) => lesson.id === id);
  }

  pushLesson(lesson: Lesson): void {
    this.schedule.push(lesson);
  }

  replaceLesson(lesson: Lesson): void {
    if (lesson.id) {
      const index = this.getLessonIndex(lesson.id);
      this.schedule[index] = lesson;
    }
  }

  removeLesson(lessonId: string): void {
    this.schedule = this.schedule.filter((l) => l.id !== lessonId);
  }

  formatDateTodayToLocalISOString(): string {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const adjustedDate = new Date(today.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split('T')[0];
  }

  sortLessonsByDateAndTime(): void {
    this.schedule.sort((a, b) => {
      const dateTimeA = `${a.date}T${a.time}`;
      const dateTimeB = `${b.date}T${b.time}`;

      const dateA = new Date(dateTimeA);
      const dateB = new Date(dateTimeB);

      return dateA.getTime() - dateB.getTime();
    });
  }

  getNextLesson(): Lesson | null {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);

    for (const lesson of this.schedule) {
      const lessonStart = new Date(lesson.date + 'T' + lesson.time);
      const lessonEnd = new Date(lesson.date + 'T' + lesson.calculateEndTime());

      if (lessonEnd < lessonStart) {
        lessonEnd.setDate(lessonEnd.getDate() + 1);
      }
      if (lessonEnd > now) {
        return lesson;
      }
    }
    return null;
  }

  getFilteredSchedule(): Lesson[] {
    if (this.showPastLessons) {
      return this.schedule;
    } else {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return this.schedule.filter((lesson) => {
        const lessonDate = new Date(lesson.date);
        return lessonDate >= now;
      });
    }
  }

  studentHasLessons(studentId: string): boolean {
    return this.schedule.some((lesson) => lesson.studentId === studentId);
  }

  isTimeSlotAvailable(newLesson: Lesson, excludingLessonId?: string): boolean {
    const newStart = new Date(`${newLesson.date}T${newLesson.time}`);
    const newEnd = new Date(newStart);
    newEnd.setHours(newEnd.getHours() + parseInt(newLesson.durationHours));
    newEnd.setMinutes(
      newEnd.getMinutes() + parseInt(newLesson.durationMinutes)
    );

    if (newEnd < newStart) {
      newEnd.setDate(newEnd.getDate() + 1);
    }

    return !this.schedule.some((lesson) => {
      if (excludingLessonId && lesson.id === excludingLessonId) {
        return false;
      }
      const existingStart = new Date(`${lesson.date}T${lesson.time}`);
      const existingEnd = new Date(existingStart);
      existingEnd.setHours(
        existingEnd.getHours() + parseInt(lesson.durationHours)
      );
      existingEnd.setMinutes(
        existingEnd.getMinutes() + parseInt(lesson.durationMinutes)
      );

      if (existingEnd < existingStart) {
        existingEnd.setDate(existingEnd.getDate() + 1);
      }

      return newStart < existingEnd && existingStart < newEnd;
    });
  }

  postLessonToDatabase(uid: string, lesson: Lesson): Promise<void> {
    if (!this.isTimeSlotAvailable(lesson)) {
      return Promise.reject(new Error('date-occupied'));
    }

    return this.dataStorageService
      .postLesson(uid, lesson)
      .then((responseData) => {
        if (responseData.key) {
          lesson.setId(responseData.key);
          this.pushLesson(lesson);
          this.nextScheduleChanged();
        }
      });
  }

  getScheduleFromDatabase(uid: string): Subscription {
    return this.dataStorageService.getSchedule(uid).subscribe({
      next: (schedule) => {
        this.schedule = schedule;
        this.nextScheduleChanged();
      },
      error: (error) => console.log(error),
    });
  }

  updateLessonInDatabase(
    uid: string,
    lessonId: string,
    lesson: Lesson
  ): Promise<void> {
    if (!this.isTimeSlotAvailable(lesson, lessonId)) {
      return Promise.reject(new Error('date-occupied'));
    }

    return this.dataStorageService
      .updateLesson(uid, lessonId, lesson)
      .then(() => {
        lesson.setId(lessonId);
        this.replaceLesson(lesson);
        this.nextScheduleChanged();
      });
  }

  deleteLessonFromDatabase(uid: string, lessonId: string): Promise<void> {
    return this.dataStorageService.deleteLesson(uid, lessonId).then(() => {
      this.removeLesson(lessonId);
      this.nextScheduleChanged();
    });
  }

  nextScheduleChanged(): void {
    this.sortLessonsByDateAndTime();
    this.scheduleChanged$.next(this.schedule);
  }

  nextTriggerGetNextLesson(): void {
    this.triggerGetNextLesson$.next();
  }
}
