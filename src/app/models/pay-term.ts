import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class PayTerm {
  id: number;
  name: string;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser
}
