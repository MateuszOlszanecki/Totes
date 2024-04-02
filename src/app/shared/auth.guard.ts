import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(
      map((user) => {
        if (!user) {
          alert('Zaloguj się aby przejść dalej.');
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
