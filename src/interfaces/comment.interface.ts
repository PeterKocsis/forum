import { IVisibleUserData } from "./visible-user-data.interface";

export interface IComment {
  id: number;
  author: IVisibleUserData;
  body: string;
  comments: [];
}
