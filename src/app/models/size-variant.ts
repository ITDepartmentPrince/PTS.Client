import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class SizeVariant {
  sizeId: number;
  sizeDescription: string;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser
}
