import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { DataStorageService } from './data-storage.service';
import { Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private _user!: User;
  userChanged$ = new Subject<User>();

  constructor(private dataStorageService: DataStorageService) {}

  get user() {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
  }

  createUserFolderInDatabase(
    name: string,
    email: string,
    uid: string
  ): Promise<void> {
    return this.dataStorageService.createUserFolder(name, email, uid);
  }

  getUserFromDatabase(uid: string): Subscription {
    return this.dataStorageService.getUser(uid).subscribe({
      next: (user) => {
        this.user = user;
        this.nextUserChanged();
      },
      error: (error) => console.log(error),
    });
  }

  deleteUserFromDatabase(uid: string): Promise<void> {
    return this.dataStorageService.deleteUser(uid);
  }

  nextUserChanged(): void {
    this.userChanged$.next(this.user);
  }
}
