import {Site} from "./site";
import {SourceType} from "../shared/source-type";
import {PurchaseOrder} from "./purchase-order";
import {Receiving} from "./receiving";
import {Vendor} from "./vendor";

export class Source {
  srSiteId: number;
  site: Site;
  srRoNumber: string;
  receiving: Receiving;
  sourceType: SourceType;
  poNumber: string;
  purchaseOrder: PurchaseOrder;
  sponsorId: number;
  sponsor: Vendor;
}
