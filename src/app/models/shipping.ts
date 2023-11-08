import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class Shipping {
  id: number;
  name: string;
  accNo: string;
  nameWithAcc: string;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser;
}
