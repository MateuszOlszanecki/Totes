import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  user!: User;
  userChangedSubscription!: Subscription;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user = this.profileService.user;
    this.userChangedSubscription = this.profileService.userChanged$.subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (error) => console.log(error),
    });
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
