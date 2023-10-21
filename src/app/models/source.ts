import {Site} from "./site";
import {SourceType} from "../shared/source-type";
import {PurchaseOrder} from "./purchase-order";
import {Sponsor} from "./sponsor";
import {Receiving} from "./receiving";

export class Source {
  srSiteId: number;
  site: Site;
  srRoNumber: string;
  receiving: Receiving;
  sourceType: SourceType;
  poNumber: string;
  purchaseOrder: PurchaseOrder;
  sponsorId: number;
  sponsor: Sponsor;
  srcSiteId: number;
  srcSite: Site;
}
