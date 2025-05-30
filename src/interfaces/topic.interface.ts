import { IComment } from "./comment.interface"
import { IVisibleUserData } from "./visible-user-data.interface"

export interface ITopic {
    id: number,
    author: IVisibleUserData,
    title: string,
    body: string,
    comments: IComment[]
}