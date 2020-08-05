import { IUser } from "./IUser";
import { IPersonaProps } from "office-ui-fabric-react";

export interface ITask {
  id: number;
  title: string;
  description: string;
  percentComplete: number;
  completed: boolean;
  createdDate: Date;
  startDate: Date;
  dueDate: Date;
  status: string;
  predecessors: ITask['id'][];
  assignedTo?: IUser[];
  createdBy: IUser;
}