import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  userLoading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.authService
      .autoSignIn()
      .then(() => (this.userLoading = false))
      .catch((error) => {
        console.log(error);
        this.userLoading = false;
      });
  }

  onGoBack(): void {
    this.location.back();
  }

  onGoForward(): void {
    this.location.forward();
  }

  onNavigateMenu(): void {
    if (this.shouldNavigateMenu()) {
      this.router.navigate(['menu']);
    }
  }

  shouldNavigateMenu(): boolean {
    return (
      this.router.url !== '/login' &&
      this.router.url !== '/register' &&
      this.router.url !== '/reset_password' &&
      this.router.url !== '/menu'
    );
  }
}
