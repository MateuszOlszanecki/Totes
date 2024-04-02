import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';
import { Subject, Subscription } from 'rxjs';
import { DataStorageService } from './data-storage.service';

@Injectable({ providedIn: 'root' })
export class StudentsListService {
  private _studentsList: Student[] = [];
  studentsListChanged$ = new Subject<Student[]>();

  constructor(private dataStorageService: DataStorageService) {}

  get studentsList(): Student[] {
    return this._studentsList;
  }

  set studentsList(studentsList: Student[]) {
    this._studentsList = studentsList;
  }

  getStudent(id: string): Student | undefined {
    return this.studentsList.find((student) => student.id === id);
  }

  getStudentIndex(id: string): number {
    return this.studentsList.findIndex((student) => student.id === id);
  }

  pushStudent(student: Student): void {
    this.studentsList.push(student);
  }

  replaceStudent(student: Student): void {
    if (student.id) {
      const index = this.getStudentIndex(student.id);
      this.studentsList[index] = student;
    }
  }

  removeStudent(studentId: string): void {
    this.studentsList = this.studentsList.filter((s) => s.id !== studentId);
  }

  postStudentToDatabase(uid: string, student: Student): Promise<void> {
    return this.dataStorageService
      .postStudent(uid, student)
      .then((responseData) => {
        if (responseData.key) {
          student.setId(responseData.key);
          this.pushStudent(student);
          this.nextStudentsListChanged();
        }
      });
  }

  getStudentsListFromDatabase(uid: string): Subscription {
    return this.dataStorageService.getStudentsList(uid).subscribe({
      next: (studentsList) => {
        this.studentsList = studentsList;
        this.nextStudentsListChanged();
      },
      error: (error) => console.log(error),
    });
  }

  updateStudentInDatabase(
    uid: string,
    studentId: string,
    student: Student
  ): Promise<void> {
    return this.dataStorageService
      .updateStudent(uid, studentId, student)
      .then(() => {
        student.setId(studentId);
        this.replaceStudent(student);
        this.nextStudentsListChanged();
      });
  }

  deleteStudentFromDatabase(uid: string, studentId: string): Promise<void> {
    return this.dataStorageService.deleteStudent(uid, studentId).then(() => {
      this.removeStudent(studentId);
      this.nextStudentsListChanged();
    });
  }

  nextStudentsListChanged(): void {
    this.studentsListChanged$.next(this.studentsList);
  }
}
