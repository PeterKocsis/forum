import { Component, inject, input, output } from '@angular/core';
import { TopicsService } from '../../../services/topics.service';
import { IComment } from '../../../interfaces/comment.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IAuthor } from '../../../interfaces/author.interface';

@Component({
  selector: 'app-add-comment',
  imports: [ReactiveFormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css',
})
export class AddCommentComponent {
  topicId = input.required<number>();
  parentCommentId = input<number>();
  author = input.required<IAuthor>();

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
    if (this.form.invalid || this.topicId() === null) {
      return;
    }
    const newComment = this.createComment();

    this.parentCommentId() ? this.addCommentToComment(newComment) : this.addCommentToTopic(newComment);
  }

  createComment(): IComment {
    const newComment: IComment = {
      id: 0,
      author: this.author(),
      body: this.form.controls.commentContent.value!,
      comments: [],
    };
    return newComment;
  }

  private addCommentToTopic(newComment : IComment) {
    this.topicsService.addCommentToTopic(this.topicId(), newComment).subscribe({
        error: (error: Error) => {
          console.error('Error adding comment:', error);
        },
        complete: () => {
          this.form.reset();
          this.finished.emit();
        },
      });
  }

  private addCommentToComment(newComment: IComment) {
    this.topicsService
        .addCommentToComment(this.topicId(), this.parentCommentId()!, newComment)
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
