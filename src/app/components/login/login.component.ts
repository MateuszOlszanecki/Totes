import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  loggingIn = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.initForm();
  }

  onNavigateRegister(): void {
    this.router.navigate(['register']);
  }

  onNavigateResetPassword(): void {
    this.router.navigate(['reset_password']);
  }

  initForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.loggingIn = true;
    this.authService
      .signIn(email, password)
      .then(() => {
        this.router.navigate(['menu']);
        this.loggingIn = false;
      })
      .catch((error) => {
        if (error.code === 'auth/too-many-requests') {
          alert(
            'Czasowa blokada z powodu zbyt wielu nieudanych prób logowania.'
          );
        } else if (error.code === 'auth/invalid-credential') {
          alert('Dane logowania są niepoprawne.');
        }
        this.loggingIn = false;
      });
  }
}
