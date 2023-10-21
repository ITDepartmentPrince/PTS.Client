import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";

export class TaxRate {
  taxId: number;
  rate: number;
  taxName: string;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser;
  nameTaxRate: string;
}
