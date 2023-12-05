import {ShelfStorage} from "./shelfStorage";

import {StockTransferItemQty} from "./stock-transfer-item-qty";

export class CheckShelfStorage {
  id: number;
  qty = 0;
  stockTransferItemQtyId: number;
  stockTransferItemQty: StockTransferItemQty;
  shelfStorageId: number;
  shelfStorage: ShelfStorage | null;

  // to display
  shelfQty: number;
}
