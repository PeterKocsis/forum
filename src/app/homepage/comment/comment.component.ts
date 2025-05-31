import { Component, inject, input } from '@angular/core';
import { IComment } from '../../../interfaces/comment.interface';
import { TopicProviderService } from '../topic/topic-provider.service';
import { LoggedinUserProviderService } from '../../../services/loggedin-user-provider.service';
import { TopicsService } from '../../../services/topics.service';
import { AddCommentComponent } from '../add-comment/add-comment.component';

@Component({
  selector: 'app-comment',
  imports: [AddCommentComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {
  topicId = input.required<number>();
  comment = input.required<IComment>();

  private topicproviderService = inject(TopicProviderService);
  private loggedinUserProviderService = inject(LoggedinUserProviderService);
  private topicsService = inject(TopicsService);
  showAddComment = false;
  user = this.loggedinUserProviderService.currentUser;

  onDeleteComment() {
    this.topicsService.deleteComment(this.topicId(), this.comment().id).subscribe({
      error: (error: Error) => {
        console.error('Error deleting comment:', error);
      }
    });
  }
  onReact() {
    this.showAddComment = true;
  }
}
