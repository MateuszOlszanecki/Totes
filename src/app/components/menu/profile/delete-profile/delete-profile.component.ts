import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../../services/profile.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-delete-profile',
  templateUrl: './delete-profile.component.html',
})
export class DeleteProfileComponent implements OnInit {
  deleteProfileForm!: FormGroup;
  hidePassword = true;
  deleting = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.deleteProfileForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    const email = this.profileService.user.email;
    const password = this.deleteProfileForm.value.password;

    this.deleting = true;
    this.authService
      .deleteUser(email, password)
      .then(() => (this.deleting = false));
  }
}
