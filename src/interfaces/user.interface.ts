import { IAuthor } from './author.interface';

export interface IUser extends IAuthor {
  password: string;
}
