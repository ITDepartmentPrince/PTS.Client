import {MatlClassification} from "./matl-classification";
import {Site} from "./site";
import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {StockTransferItem} from "./stock-transfer-item";
import {Vendor} from "./vendor";

export class StockTransfer
{
  siteId: number;
  site: Site;
  number: string;
  // transferDate: Date;
  classificationId: number;
  classification: MatlClassification;
  originSiteId: number;
  originSite: Site;
  destinationSiteId: number;
  destinationSite: Site;
  notes: string;
  isShipped: boolean;
  createDate: Date;
  createUserId: number;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUserId: number;
  lastUser: LastUser;
  stockTransferItems = new Array<StockTransferItem>();
  vendorId: number;
  vendor: Vendor;

  //to display
  itemsValid = false;
}
