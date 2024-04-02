import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { CustomValidators } from '../../shared/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  signingIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
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
    const name = this.registerForm.value.name;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    this.signingIn = true;
    this.authService
      .signUp(email, password)
      .then((responseData) => {
        if (responseData.user) {
          this.profileService
            .createUserFolderInDatabase(name, email, responseData.user.uid)
            .then(() => {
              this.authService
                .sendVerificationEmail()
                .then(() => {
                  this.authService.signOut().then(() => {
                    alert('Rejestracja zakończona sukcesem.');
                    alert('E-mail weryfikacyjny został wysłany.');
                    this.router.navigate(['login']);
                    this.signingIn = false;
                  });
                })
                .catch((error) => {
                  console.log(error);
                  this.signingIn = false;
                });
            })
            .catch((error) => {
              console.log(error);
              this.signingIn = false;
            });
        }
      })
      .catch((error) => {
        this.signingIn = false;
        if (error.code === 'auth/email-already-in-use') {
          alert('Ten adres e-mail jest już zajęty.');
        } else if (error.code === 'auth/invalid-email') {
          alert('Adres e-mail jest niepoprawny.');
        } else {
          alert('Dane są niepoprawne');
        }
      });
  }
}
