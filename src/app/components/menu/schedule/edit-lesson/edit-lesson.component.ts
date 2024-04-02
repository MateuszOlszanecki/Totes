import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Lesson } from '../../../../models/lesson.model';
import { Student } from '../../../../models/student.model';
import { ScheduleService } from '../../../../services/schedule.service';
import { StudentsListService } from '../../../../services/students-list.service';
import { AuthService } from '../../../../services/auth.service';
import { CustomValidators } from '../../../../shared/custom-validators';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
})
export class EditLessonComponent implements OnInit, OnDestroy {
  hours = Array.from({ length: 9 }, (_, i) => `${i}`);
  minutes = Array.from({ length: 12 }, (_, i) => {
    const value = i * 5;
    return value < 10 ? `0${value}` : `${value}`;
  });

  minDate!: string;

  editMode!: boolean;
  lesson!: Lesson;
  paramsSubscription!: Subscription;
  scheduleChangedSubscription!: Subscription;
  studentsListChangedSubscription!: Subscription;

  lessonForm!: FormGroup;
  submittingForm = false;

  studentsList!: Student[];

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private studentsListService: StudentsListService,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.minDate = this.scheduleService.formatDateTodayToLocalISOString();
    this.studentsList = this.studentsListService.studentsList;
    this.studentsListChangedSubscription =
      this.studentsListService.studentsListChanged$.subscribe({
        next: (studentsList: Student[]) => {
          this.studentsList = studentsList;
        },
        error: (error) => console.log(error),
      });
    this.paramsSubscription = this.route.params.subscribe({
      next: (params: Params) => {
        let lessonId = params['lesson_id'];
        this.editMode = params['lesson_id'] != null;
        if (this.editMode) {
          let lesson = this.scheduleService.getLesson(lessonId);
          if (lesson) {
            this.lesson = lesson;
            this.initForm();
          } else {
            this.scheduleChangedSubscription =
              this.scheduleService.scheduleChanged$.subscribe({
                next: () => {
                  let lesson = this.scheduleService.getLesson(lessonId);
                  if (lesson) {
                    this.lesson = lesson;
                    this.initForm();
                  }
                },
                error: (error) => console.log(error),
              });
          }
        } else {
          this.initForm();
        }
      },
      error: (error) => console.log(error),
    });
  }

  initForm(): void {
    let studentId = '';
    let date = '';
    let time = '';
    let durationHours = '1';
    let durationMinutes = '00';
    let note = '';

    if (this.editMode && this.lesson) {
      studentId = this.lesson.studentId;
      date = this.lesson.date;
      time = this.lesson.time;
      durationHours = this.lesson.durationHours;
      durationMinutes = this.lesson.durationMinutes;
      note = this.lesson.note;
    }

    this.lessonForm = new FormGroup(
      {
        studentId: new FormControl(studentId, [Validators.required]),
        date: new FormControl(date, [
          Validators.required,
          CustomValidators.minDateToday(),
        ]),
        time: new FormControl(time, [Validators.required]),
        durationHours: new FormControl(durationHours, [Validators.required]),
        durationMinutes: new FormControl(durationMinutes, [
          Validators.required,
        ]),
        note: new FormControl(note),
      },
      { validators: CustomValidators.durationValidator }
    );
  }

  onSubmit(): void {
    const studentId = this.lessonForm.value.studentId;
    const date = this.lessonForm.value.date;
    const time = this.lessonForm.value.time;
    const durationHours = this.lessonForm.value.durationHours;
    const durationMinutes = this.lessonForm.value.durationMinutes;
    const note = this.lessonForm.value.note;

    let lesson = new Lesson(
      studentId,
      date,
      time,
      durationHours,
      durationMinutes,
      note
    );

    this.submittingForm = true;
    if (this.editMode && this.lesson.id) {
      this.scheduleService
        .updateLessonInDatabase(this.authService.uid, this.lesson.id, lesson)
        .then(() => {
          this.location.back();
          this.submittingForm = false;
          this.scheduleService.nextTriggerGetNextLesson();
        })
        .catch((error) => {
          if (error.message === 'date-occupied') {
            alert('W tym czasie są już zaplanowane inne zajęcia.');
          } else if (error.code === 'PERMISSION_DENIED') {
            alert('Wszystkie pola oprócz notatki nie mogą pozostać puste.');
          }
          this.submittingForm = false;
        });
    } else {
      this.scheduleService
        .postLessonToDatabase(this.authService.uid, lesson)
        .then(() => {
          this.location.back();
          this.submittingForm = false;
          this.scheduleService.nextTriggerGetNextLesson();
        })
        .catch((error) => {
          if (error.message === 'date-occupied') {
            alert('W tym czasie są już zaplanowane inne zajęcia.');
          } else if (error.code === 'PERMISSION_DENIED') {
            alert('Wszystkie pola oprócz notatki nie mogą pozostać puste.');
          }
          this.submittingForm = false;
        });
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    this.studentsListChangedSubscription.unsubscribe();
    if (this.scheduleChangedSubscription) {
      this.scheduleChangedSubscription.unsubscribe();
    }
  }
}
