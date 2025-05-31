import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { UsersService } from '../services/users.service';
import { Subscription } from 'rxjs';
import { RolesService } from '../services/roles.service';
import { TopicsService } from '../services/topics.service';
import { HomepageComponent } from './homepage/homepage.component';
import { LoggedinUserProviderService } from '../services/loggedin-user-provider.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProfilePageComponent, HomepageComponent, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'forum';
  private usersService = inject(UsersService);
  private rolesService = inject(RolesService);
  private topicService = inject(TopicsService);
  private loggedinUserProviderService = inject(LoggedinUserProviderService);
  
  users = this.usersService.usersData;
  private usersSub : Subscription | undefined = undefined;
  fetchError = signal<string>('');
  
  onUserSelect(event: any) {
    this.loggedinUserProviderService.setCurrentUser(Number.parseInt(event.target.value));
  }
  
  ngOnInit(): void {
    this.usersSub =  this.usersService.getUsers().subscribe({
      error: (error: Error)=> {
        this.fetchError.set(error.message);
      }
    })
    this.rolesService.getRoles().subscribe({
      error: (error: Error)=> {
        this.fetchError.set(error.message);
      }
    });
    this.topicService.getTopics().subscribe({
      error: (error: Error)=> {
        this.fetchError.set(error.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.usersSub?.unsubscribe();
  }
}
