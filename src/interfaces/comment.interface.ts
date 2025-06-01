import { IAuthor } from './author.interface';

export interface IComment {
  id: number;
  author: IAuthor;
  body: string;
  comments: IComment[];
  removed?: boolean;
}
