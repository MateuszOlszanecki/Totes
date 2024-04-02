import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map, take } from 'rxjs';
import { User } from '../models/user.model';
import { Student } from '../models/student.model';
import { Lesson } from '../models/lesson.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private database: AngularFireDatabase) {}

  //user/profile functionality
  createUserFolder(name: string, email: string, uid: string): Promise<void> {
    return this.database.object(`/users/${uid}/user_data`).set({ name, email });
  }

  getUser(uid: string): Observable<User> {
    return this.database
      .object<User>(`/users/${uid}/user_data`)
      .valueChanges()
      .pipe(
        take(1),
        map((data) => data as User)
      );
  }

  deleteUser(uid: string): Promise<void> {
    return this.database.object(`/users/${uid}`).remove();
  }

  //student functionality
  postStudent(uid: string, student: Student) {
    return this.database.list(`/users/${uid}/students_list`).push(student);
  }

  getStudentsList(uid: string): Observable<Student[]> {
    return this.database
      .object<{ [key: string]: Student }>(`/users/${uid}/students_list`)
      .valueChanges()
      .pipe(
        take(1),
        map((response) => {
          const students: Student[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              const student = new Student(
                response[key].name,
                response[key].surname,
                response[key].address,
                response[key].telephoneNumber,
                response[key].schoolClass,
                response[key].furtherInfo
              );
              student.setId(key);
              students.push(student);
            }
          }
          return students;
        })
      );
  }

  updateStudent(
    uid: string,
    studentId: string,
    student: Student
  ): Promise<void> {
    return this.database
      .object(`/users/${uid}/students_list/${studentId}`)
      .update(student);
  }

  deleteStudent(uid: string, studentId: string): Promise<void> {
    return this.database
      .object(`/users/${uid}/students_list/${studentId}`)
      .remove();
  }

  //schedule functionality
  postLesson(uid: string, lesson: Lesson) {
    return this.database.list(`/users/${uid}/schedule`).push(lesson);
  }

  getSchedule(uid: string): Observable<Lesson[]> {
    return this.database
      .object<{ [key: string]: Lesson }>(`/users/${uid}/schedule`)
      .valueChanges()
      .pipe(
        take(1),
        map((response) => {
          const schedule: Lesson[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              const lesson = new Lesson(
                response[key].studentId,
                response[key].date,
                response[key].time,
                response[key].durationHours,
                response[key].durationMinutes,
                response[key].note
              );
              lesson.setId(key);
              schedule.push(lesson);
            }
          }
          return schedule;
        })
      );
  }

  updateLesson(uid: string, lessonId: string, lesson: Lesson): Promise<void> {
    return this.database
      .object(`/users/${uid}/schedule/${lessonId}`)
      .update(lesson);
  }

  deleteLesson(uid: string, lessonId: string): Promise<void> {
    return this.database.object(`/users/${uid}/schedule/${lessonId}`).remove();
  }
}
