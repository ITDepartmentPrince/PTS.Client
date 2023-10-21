import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class Country {
  constructor(public countryCode?: string,
              public countryName?: string,
              public inActive?: boolean,
              public createDate?: Date,
              public createUser?: CreateUser,
              public lastUpdate?: Date,
              public lastUser?: LastUser) {}
}
