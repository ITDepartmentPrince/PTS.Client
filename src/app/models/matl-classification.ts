import {ItemType} from "../shared/item-type";
import {User} from "./user";

export class MatlClassification {
  classificationId: number;
  classificationName: string;
  classifiedAs: ItemType;
  inActive: boolean;
  createDate: Date;
  createUserId: number
  createUser: User;
  lastUpdate: Date;
  lastUserId: number
  lastUser: User;
}
