import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { IRole } from '../interfaces/role.interface';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private http = inject(HttpClient);
  private roles = signal<IRole[]>([]);
  rolesData = this.roles.asReadonly();

  constructor() {
  }

  getRoles(): Observable<IRole[]> {
    return this.http.get<{data: IRole[]}>(`http://localhost:8888/api/roles`).pipe(
      map((response)=>response.data),
      tap((data) => {
        this.roles.set(data);
      }),
      catchError((errorResponse) => {
        console.log(errorResponse);
        return throwError(
          () => new Error('Unable to fetch roles data. Please try again.')
        );
      })
    );
  }
}
