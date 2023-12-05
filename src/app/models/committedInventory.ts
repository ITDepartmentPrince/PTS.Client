import {Site} from "./site";
import {StockTransfer} from "./stock-transfer";
import {BatchLot} from "./batchLot";

enum CommittedInventorySource {
  Transfer = 1
}

export class CommittedInventory {
  id: number
  batchLotId: number;
  batchLot: BatchLot;
  batchLotSiteId: number;
  batchLotSite: Site;
  source: CommittedInventorySource;
  stNumber: string;
  stockTransfer: StockTransfer;
  stSiteId: number;
  stSite: Site;
  movementDate: Date;
  qty: number;
}
