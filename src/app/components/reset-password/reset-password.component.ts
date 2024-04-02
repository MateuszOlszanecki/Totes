import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailSending = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit(): void {
    const email = this.resetPasswordForm.value.email;

    this.emailSending = true;
    this.authService
      .resetPassword(email)
      .then(() => {
        alert('E-mail do resetu hasła został wysłany.');
        this.router.navigate(['login']);
        this.emailSending = false;
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          alert('Adres e-mail jest niepoprawny.');
        }
        this.emailSending = false;
      });
  }
}
