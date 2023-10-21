import {State} from "./state";
import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class Site {
  siteId: number;
  siteName: string;
  street1: string;
  street2?: string;
  cityName: string;
  stateCode: string;
  state: State;
  zipCode: string;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser;
}
