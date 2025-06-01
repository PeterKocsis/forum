import { IComment } from './comment.interface';
import { IAuthor } from './author.interface';

export interface ITopic {
  id: number;
  author: IAuthor;
  title: string;
  body: string;
  comments: IComment[];
}

export interface ITopicWithFlattenedComments {
  id: number;
  author: IAuthor;
  title: string;
  body: string;
  comments: { depth: number; comment: IComment }[];
}
