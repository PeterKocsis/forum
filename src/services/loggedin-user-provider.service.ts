import { effect, inject, Injectable, signal } from '@angular/core';
import { UsersService } from './users.service';
import { single } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { IAuthor } from '../interfaces/author.interface';

@Injectable({
  providedIn: 'root',
})
export class LoggedinUserProviderService {
  usersService = inject(UsersService);

  currentUser = signal<IAuthor | null>(null);

  setCurrentUser(userId: number): void {
    const selectedUser = this.usersService
      .usersData()
      .find((user) => user.id === userId);
    if (selectedUser) {
      const { password, ...rest } = selectedUser; // Exclude password
      this.currentUser.set(rest);
    } else {
      this.currentUser.set(null);
    }
  }

  constructor() {
    effect(() => {
      if (!this.currentUser()) {
        const users = this.usersService.usersData();
        if (users.length > 0) {
          this.currentUser.set(users[0]); // Set the first user as default
        }
      }
    });
  }
}
