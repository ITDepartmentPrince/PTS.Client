import {Shelf} from "./shelf";
import {BatchLot} from "./batchLot";
import {Site} from "./site";
import {ReceivingItem} from "./receivingItem";

export class ItemLabel {
  id: number;
  batchLotId: number;
  batchLot: BatchLot;
  batchLotSiteId: number;
  site: Site;
  shelfCode: string;
  shelf: Shelf;
  shelfSiteId: number;
  shelfSite: Site;
  qty = 0;
  toTransferQty = 0;
  conversionRate?: number;
  count = 0;
  receivingItemId?: number;
  receivingItem?: ReceivingItem;
}
