import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {State} from "./state";

export class Vendor {
  vendorId: number;
  companyName: string;
  email: string;
  phoneNumber: string;
  street1: string;
  street2: string;
  cityName: string;
  stateCode: string;
  state: State;
  zipCode: string;
  notes: string;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser
  states: State[];
}
