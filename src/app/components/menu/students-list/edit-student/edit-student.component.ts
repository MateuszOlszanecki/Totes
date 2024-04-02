import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Student } from '../../../../models/student.model';
import { StudentsListService } from '../../../../services/students-list.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
})
export class EditStudentComponent implements OnInit, OnDestroy {
  editMode!: boolean;
  student!: Student;
  paramsSubscription!: Subscription;
  studentsListChangedSubscription!: Subscription;

  studentForm!: FormGroup;
  submittingForm = false;

  constructor(
    private route: ActivatedRoute,
    private studentsListService: StudentsListService,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe({
      next: (params: Params) => {
        let studentId = params['student_id'];
        this.editMode = params['student_id'] != null;
        if (this.editMode) {
          let student = this.studentsListService.getStudent(studentId);
          if (student) {
            this.student = student;
            this.initForm();
          } else {
            this.studentsListChangedSubscription =
              this.studentsListService.studentsListChanged$.subscribe({
                next: () => {
                  let student = this.studentsListService.getStudent(studentId);
                  if (student) {
                    this.student = student;
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
    let name = '';
    let surname = '';
    let address = '';
    let telephoneNumber = '';
    let schoolClass = '';
    let furtherInfo = '';

    if (this.editMode && this.student) {
      name = this.student.name;
      surname = this.student.surname;
      address = this.student.address;
      telephoneNumber = this.student.telephoneNumber;
      schoolClass = this.student.schoolClass;
      furtherInfo = this.student.furtherInfo;
    }

    this.studentForm = new FormGroup({
      name: new FormControl(name, [Validators.required]),
      surname: new FormControl(surname),
      address: new FormControl(address, [Validators.required]),
      telephoneNumber: new FormControl(telephoneNumber),
      schoolClass: new FormControl(schoolClass),
      furtherInfo: new FormControl(furtherInfo),
    });
  }

  onSubmit(): void {
    const name = this.studentForm.value.name;
    const surname = this.studentForm.value.surname;
    const address = this.studentForm.value.address;
    const telephoneNumber = this.studentForm.value.telephoneNumber;
    const schoolClass = this.studentForm.value.schoolClass;
    const furtherInfo = this.studentForm.value.furtherInfo;

    let student = new Student(
      name,
      surname,
      address,
      telephoneNumber,
      schoolClass,
      furtherInfo
    );

    this.submittingForm = true;
    if (this.editMode && this.student.id) {
      this.studentsListService
        .updateStudentInDatabase(this.authService.uid, this.student.id, student)
        .then(() => {
          this.location.back();
          this.submittingForm = false;
        })
        .catch((error) => {
          if (error.code === 'PERMISSION_DENIED') {
            alert('Pola z imieniem oraz adresem nie mogą pozostać puste.');
          }
          this.submittingForm = false;
        });
    } else {
      this.studentsListService
        .postStudentToDatabase(this.authService.uid, student)
        .then(() => {
          this.location.back();
          this.submittingForm = false;
        })
        .catch((error) => {
          if (error.code === 'PERMISSION_DENIED') {
            alert('Pola z imieniem oraz adresem nie mogą pozostać puste.');
          }
          this.submittingForm = false;
        });
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    if (this.studentsListChangedSubscription) {
      this.studentsListChangedSubscription.unsubscribe();
    }
  }
}
