import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../../../models/student.model';

@Component({
  selector: 'app-student-tile',
  templateUrl: './student-tile.component.html',
})
export class StudentTileComponent {
  @Input() student!: Student;

  constructor(private router: Router, private route: ActivatedRoute) {}

  onNavigateStudentInfo(): void {
    this.router.navigate(['student_info', this.student.id], {
      relativeTo: this.route,
    });
  }
}
