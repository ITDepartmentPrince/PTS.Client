import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class OtherCharge {
  otherChargeId: number;
  otherChargeName: string
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser
}
