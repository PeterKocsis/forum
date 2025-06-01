import { Component, inject, input, output } from '@angular/core';
import { TopicsService } from '../../../services/topics.service';
import { IComment } from '../../../interfaces/comment.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IVisibleUserData } from '../../../interfaces/visible-user-data.interface';

@Component({
  selector: 'app-add-comment',
  imports: [ReactiveFormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
})
export class AddCommentComponent {
  topicId = input.required<number>();
  commentId = input<number>();
  author = input.required<IVisibleUserData>();

  topicsService = inject(TopicsService);
  finished = output<void>();

  form = new FormGroup({
    commentContent: new FormControl<string>('', [Validators.required]),
  });

  onCancel() {
    this.form.reset();
    this.finished.emit();
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    const comment: IComment = {
      id: 0,
      author: this.author(),
      body: this.form.controls.commentContent.value!,
      comments: [],
    };
    if (this.topicId() === null) {
      return;
    }
    if (this.commentId() === undefined) {
      this.topicsService
        .addCommentToTopic(this.topicId(), comment)
        .subscribe({
          error: (error: Error) => {
            console.error('Error adding comment:', error);
          },
          complete: () => {
            this.form.reset();
            this.finished.emit();
          },
        });
    } else {
      this.topicsService
        .addCommentToComment(
          this.topicId(),
          this.commentId()!,
          comment
        )
        .subscribe({
          error: (error: Error) => {
            console.error('Error adding comment to comment:', error);
          },
          complete: () => {
            this.form.reset();
            this.finished.emit();
          },
        });
    }
  }
}
