import { IVisibleUserData } from "./visible-user-data.interface";

export interface IUser extends IVisibleUserData {
    password: string;
}