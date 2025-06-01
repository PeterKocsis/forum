import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IUser } from '../interfaces/user.interface';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { IAuthor } from '../interfaces/author.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private users = signal<IUser[]>([]);

  usersData = this.users.asReadonly();

  getUsers(): Observable<IUser[]> {
    return this.http
      .get<{ data: IUser[]; messeage: string; status: number }>(
        `http://localhost:8888/api/users`
      )
      .pipe(
        map((response) => response.data),
        tap((usersData: IUser[]) => this.users.set(usersData)),
        catchError((errorResponse) => {
          console.log(errorResponse);
          return throwError(
            () => new Error('Unable to get users data, Please try again.')
          );
        })
      );
  }

  updateUserData(modifiedUserData: IAuthor): Observable<IUser> {
    return this.http
      .put<{ data: IUser; messeage: string; status: number }>(
        `http://localhost:8888/api/user/${modifiedUserData.id}`,
        modifiedUserData
      )
      .pipe(
        map((response) => response.data),
        tap((usersData: IUser) =>
          this.users().map((user) =>
            user.id === usersData.id ? usersData : user
          )
        ),
        catchError((errorResponse) => {
          console.log(errorResponse);
          return throwError(
            () =>
              new Error(
                'Something went wrong. Unable to update user data. Please try again.'
              )
          );
        })
      );
  }

  updateUserPassword(
    userId: number,
    passwords: { password1: string; password2: string }
  ): Observable<IUser> {
    return this.http
      .put<{ data: IUser; messeage: string; status: number }>(
        `http://localhost:8888/api/user/${userId}/password`,
        passwords
      )
      .pipe(
        map((response) => response.data),
        tap((usersData: IUser) =>
          this.users().map((user) =>
            user.id === usersData.id ? usersData : user
          )
        ),
        catchError((errorResponse) => {
          console.log(errorResponse);
          return throwError(
            () =>
              new Error(
                'Something went wrong. Unable to update user data. Please try again.'
              )
          );
        })
      );
  }
}
