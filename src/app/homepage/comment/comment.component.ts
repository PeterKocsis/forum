import { Component, input } from '@angular/core';
import { IComment } from '../../../interfaces/comment.interface';

@Component({
  selector: 'app-comment',
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  comment = input.required<IComment>();
}
