import { Component, inject } from '@angular/core';
import { TopicsService } from '../../services/topics.service';
import { TopicComponent } from './topic/topic.component';
import { AddTopicComponent } from './add-topic/add-topic.component';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-homepage',
  imports: [TopicComponent, AddTopicComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  private topicsService = inject(TopicsService);
  permissionService = inject(PermissionsService);
  topics = this.topicsService.topicsData;

}
