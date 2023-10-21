import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {Country} from "./country";

export class State {
  stateCode: string;
  stateName: string;
  countryCode: string;
  country: Country;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser
  countries: Country[];
}
