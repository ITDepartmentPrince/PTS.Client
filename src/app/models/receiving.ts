import {MatlClassification} from "./matl-classification";
import {Vendor} from "./vendor";
import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {Site} from "./site";
import {Source} from "./source";
import {ReceivingItem} from "./receivingItem";

export class Receiving {
  siteId: number;
  site: Site;
  roNumber: string;
  classificationId: number;
  classification: MatlClassification;
  source: Source;
  notes: string;
  vendorId: number | null;
  vendor: Vendor;
  receivedAllItems: boolean;
  inActive: boolean;
  deliveryDate: Date;
  createDate: Date;
  createUserId: number;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUserId: number;
  lastUser: LastUser;
  receivingItems: Array<ReceivingItem> = [];
}

export enum ReceivingStatus {
  ReceivedAll = 1,
  NotReceived = 2
}
