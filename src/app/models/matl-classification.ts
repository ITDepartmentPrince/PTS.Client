import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {ItemType} from "../shared/item-type";

export class MatlClassification {
  constructor(public classificationId?: number,
              public classificationName?: string,
              public classifiedAs?: ItemType,
              public inActive?: boolean,
              public createDate?: Date,
              public createUser?: CreateUser,
              public lastUpdate?: Date,
              public lastUser?: LastUser) {}
}
