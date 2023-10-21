import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class MatlCategory {
  constructor(public categoryId?: number,
              public categoryName?: string,
              public inActive?: boolean,
              public createDate?: Date,
              public createUser?: CreateUser,
              public lastUpdate?: Date,
              public lastUser?: LastUser) {}
}
