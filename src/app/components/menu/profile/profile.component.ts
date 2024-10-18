import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  user!: User;
  userChangedSubscription!: Subscription;
  isEmailVerified$!: Observable<boolean>;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.profileService.user;
    this.userChangedSubscription = this.profileService.userChanged$.subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (error) => console.log(error),
    });
    this.isEmailVerified$ = this.authService.isEmailVerified();
  }

  onNavigateEditProfile(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onNavigateDeleteProfile(): void {
    this.router.navigate(['delete'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.userChangedSubscription.unsubscribe();
  }
}
