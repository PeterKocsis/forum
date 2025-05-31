import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

export const routes: Routes = [
  {
    path: 'homepage',
    component: HomepageComponent,
  },
  { path: 'profile', component: ProfilePageComponent },
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
];
