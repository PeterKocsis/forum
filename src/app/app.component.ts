import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { UsersService } from '../services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProfilePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'forum';
  private usersService = inject(UsersService);
  private users = this.usersService.usersData;
  private usersSub : Subscription | undefined = undefined;
  fetchError = signal<string>('');

  
  selectedUser = computed(()=>{
    const numberOfUser = this.users().length;
    if (numberOfUser === 0) return undefined;
    // return this.users()[Math.floor(Math.random() * numberOfUser)];
    return this.users()[0];
  });
  
  ngOnInit(): void {
    this.usersSub =  this.usersService.getUsers().subscribe({
      error: (error: Error)=> {
        this.fetchError.set(error.message);
      }
    })
  }

  ngOnDestroy(): void {
    this.usersSub?.unsubscribe();
  }
}
