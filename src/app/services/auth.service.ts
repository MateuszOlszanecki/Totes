import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Location } from '@angular/common';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, map } from 'rxjs';
import { ProfileService } from './profile.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _uid!: string;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private location: Location,
    private router: Router,
    private profileService: ProfileService
  ) {}

  get uid(): string {
    return this._uid;
  }

  set uid(uid: string) {
    this._uid = uid;
  }

  signUp(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  signIn(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  autoSignIn() {
    return firstValueFrom(this.getUser()).then((user) => {
      if (
        user &&
        (this.router.url === '/login' ||
          this.router.url === '/register' ||
          this.router.url === '/reset_password')
      ) {
        return this.router.navigate(['menu']);
      }
      return null;
    });
  }

  signOut(): Promise<void> {
    return this.angularFireAuth.signOut();
  }

  sendVerificationEmail(): Promise<void> {
    return this.angularFireAuth.currentUser.then((user) => {
      if (user) {
        user.sendEmailVerification();
      }
    });
  }

  isEmailVerified(): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(
      map((user) => {
        if (user) {
          return user.emailVerified;
        } else {
          return false;
        }
      })
    );
  }

  changePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void | undefined> {
    const credential = firebase.auth.EmailAuthProvider.credential(
      email,
      currentPassword
    );
    return this.angularFireAuth.currentUser
      .then((user) => {
        if (user) {
          return user
            .reauthenticateWithCredential(credential)
            .then(() => {
              if (currentPassword === newPassword) {
                alert('Nowe hasło jest takie samo jak aktualne hasło.');
                return;
              } else {
                return user.updatePassword(newPassword).then(() => {
                  alert('Hasło zostało zmienione.');
                  this.location.back();
                });
              }
            })
            .catch(() => alert('Aktualne hasło wpisane niepoprawnie.'));
        }
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  resetPassword(email: string): Promise<void> {
    return this.angularFireAuth.sendPasswordResetEmail(email);
  }

  deleteUser(email: string, password: string): Promise<void | undefined> {
    const credential = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );
    return this.angularFireAuth.currentUser
      .then((user) => {
        if (user) {
          return user
            .reauthenticateWithCredential(credential)
            .then(() => {
              return this.profileService
                .deleteUserFromDatabase(user.uid)
                .then(() => {
                  return user
                    .delete()
                    .then(() => {
                      alert('Konto zostało usunięte.');
                      this.router.navigate(['login']);
                    })
                    .catch((error) => console.log(error));
                })
                .catch((error) => console.log(error));
            })
            .catch(() => alert('Hasło wpisane niepoprawnie.'));
        }
        return;
      })
      .catch((error) => console.log(error));
  }

  getUser(): Observable<firebase.User | null> {
    return this.angularFireAuth.authState;
  }
}
