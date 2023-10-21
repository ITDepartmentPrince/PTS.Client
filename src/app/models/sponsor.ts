import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class Sponsor {
  id: number;
  sponsorName: string;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser;
}
