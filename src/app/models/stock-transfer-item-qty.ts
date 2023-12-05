import {BatchLot} from "./batchLot";
import {Site} from "./site";
import {CheckShelfStorage} from "./check-shelf-storage";
import {StockTransferItem} from "./stock-transfer-item";
import {ShelfStorage} from "./shelfStorage";

export class StockTransferItemQty {
  id: number;
  stockTransferItemId: number;
  stockTransferItem: StockTransferItem;
  batchLotId: number;
  batchLot: BatchLot;
  batchLotSiteId: number;
  batchLotSite: Site;
  checkShelfStorage = new Array<CheckShelfStorage>();

  //
  shelfStorages = new Array<ShelfStorage>();
}
