/* export interface IUser {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  imageUrl: string;
  email: string;
  jobTitle?: string;
}*/

import { IPersonaProps } from 'office-ui-fabric-react';

export interface IUser extends IPersonaProps {
  email: string;
  accountName: string;
}