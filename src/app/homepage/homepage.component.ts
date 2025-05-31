import { Component, inject } from '@angular/core';
import { TopicsService } from '../../services/topics.service';
import { TopicComponent } from './topic/topic.component';

@Component({
  selector: 'app-homepage',
  imports: [TopicComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  private topicsService = inject(TopicsService);
  topics = this.topicsService.topicsData;

}
