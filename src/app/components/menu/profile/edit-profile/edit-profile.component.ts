import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { ProfileService } from '../../../../services/profile.service';
import { CustomValidators } from '../../../../shared/custom-validators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  editProfileForm!: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideRepeatNewPassword = true;

  editing = false;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.editProfileForm = new FormGroup(
      {
        currentPassword: new FormControl('', [Validators.required]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      { validators: CustomValidators.passwordMatchValidator }
    );
  }

  onSubmit(): void {
    const email = this.profileService.user.email;
    const currentPassword = this.editProfileForm.value.currentPassword;
    const newPassword = this.editProfileForm.value.password;

    this.editing = true;
    this.authService
      .changePassword(email, currentPassword, newPassword)
      .then(() => (this.editing = false));
  }
}
