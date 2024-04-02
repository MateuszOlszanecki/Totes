import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailVerifiedGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isEmailVerified().pipe(
      map((emailVerified) => {
        if (!emailVerified) {
          this.authService.signOut();
          this.router.navigate(['login']);
          alert('Zweryfikuj adres e-mail aby przejść dalej.');
          return false;
        }
        return true;
      })
    );
  }
}
