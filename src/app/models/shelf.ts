import {Country} from "./country";
import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {Site} from "./site";

export class Shelf {
  shelfCode: string;
  siteId: number;
  site: Site;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser
  countries: Country[];
}
