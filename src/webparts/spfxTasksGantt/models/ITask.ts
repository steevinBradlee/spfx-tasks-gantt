import { IUser } from "./IUser";
import { IPersonaProps } from "office-ui-fabric-react";
import { IPredecessor } from './IPredecessor';

export interface ITask {
  id: number;
  title: string;
  description: string;
  percentComplete: number;
  //completed: boolean;
  createdDate: Date;
  startDate: Date;
  dueDate: Date;
  status: string;
  predecessors: IPredecessor[];
  assignedTo?: IUser[];
  createdBy: IUser;
  priority: string;
}