import { IUser } from "./user.interface";

export interface IProject {
  id?: number;
  name: string;
  description?: string;
  assignedTo: IUser;
  createdAt?: Date;
  updatedAt?: Date;
}
