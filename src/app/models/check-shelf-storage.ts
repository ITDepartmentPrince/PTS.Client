import {StockTransferItemQty} from "./stock-transfer-item-qty";
import {ItemLabel} from "./itemLabel";

export class CheckShelfStorage {
  id: number;
  qty = 0;
  stockTransferItemQtyId: number;
  stockTransferItemQty: StockTransferItemQty;
  itemLabelId: number;
  itemLabel: ItemLabel | null;

  // to display
  labelQty: number;
}
