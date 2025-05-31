import { Component, inject } from '@angular/core';
import { TopicsService } from '../../../services/topics.service';
import { TopicProviderService } from '../topic/topic-provider.service';
import { IComment } from '../../../interfaces/comment.interface';
import { LoggedinUserProviderService } from '../../../services/loggedin-user-provider.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-comment',
  imports: [ReactiveFormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
})
export class AddCommentComponent {
  topicsService = inject(TopicsService);
  topicProviderService = inject(TopicProviderService);
  loggedinUserProviderService = inject(LoggedinUserProviderService);
  
  form = new FormGroup({
    commentContent: new FormControl<string>('', [Validators.required])
  });
  
  onCancel() {
    this.form.reset();
    this.topicProviderService.setShowAddComment(false);
  }
  
  onSave() {
    if (this.form.invalid) {
      return;
    }
    const comment: IComment = {
      id: 0,
      author: this.loggedinUserProviderService.currentUser()!,
      body: this.form.controls.commentContent.value!,
      comments: [],
    };
    if (this.topicProviderService.topicId === null) {
      return;
    } else {
      this.topicsService
        .addCommentToTopic(this.topicProviderService.topicId, comment)
        .subscribe({
          error: (error: Error) => {
            console.error('Error adding comment:', error);
          },
          complete: () => {
            this.form.reset();
            this.topicProviderService.setShowAddComment(false);
          },
        });
    }
  }
}
