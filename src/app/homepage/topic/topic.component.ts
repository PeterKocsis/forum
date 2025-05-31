import { Component, effect, inject, input } from '@angular/core';
import { ITopic } from '../../../interfaces/topic.interface';
import { CommentComponent } from '../comment/comment.component';
import { TopicsService } from '../../../services/topics.service';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { TopicProviderService } from './topic-provider.service';

@Component({
  selector: 'app-topic',
  imports: [CommentComponent, AddCommentComponent],
  templateUrl: './topic.component.html',
  providers: [TopicProviderService],
  styleUrl: './topic.component.css',
})
export class TopicComponent {
  topic = input.required<ITopic>();
  topicsService = inject(TopicsService);
  topicProviderService = inject(TopicProviderService);
  showAddComment = this.topicProviderService.showAddComment;

  constructor() {
    effect(() => {
      this.topicProviderService.topicId = this.topic().id;
    });
  }

  onAddComment() {
    this.topicProviderService.setShowAddComment(true);
  }
  onDeleteTopic() {
    this.topicsService.deleteTopic(this.topic().id).subscribe({
      error: (error: Error) => {
        console.error('Error deleting topic:', error);
      },
    });
  }
}
