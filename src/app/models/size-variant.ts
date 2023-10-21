import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class SizeVariant {
  constructor(public sizeId?: number,
              public sizeDescription?: string,
              public inActive?: boolean,
              public createDate?: Date,
              public createUser?: CreateUser,
              public lastUpdate?: Date,
              public lastUser?: LastUser) {}
}
