import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {Vendor} from "./vendor";

export class VendorContact {
  contactId: number;
  vendorId: number;
  vendor: Vendor;
  firstName: string;
  lastName: string;
  name: string;
  emailAddress: string;
  emailDistribution: string;
  phoneNumber: string;
  mobileNumber: string;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser
  vendors: Vendor[];
}
