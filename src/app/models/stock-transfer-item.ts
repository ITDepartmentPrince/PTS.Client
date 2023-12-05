import {Site} from "./site";
import {Material} from "./material";
import {StockTransferItemQty} from "./stock-transfer-item-qty";
import {StockTransfer} from "./stock-transfer";

export class StockTransferItem {
  id: number;
  stSiteId: number;
  stSite: Site;
  stNumber: string;
  stockTransfer: StockTransfer;
  materialId: number;
  material: Material;
  stockTransferItemQtys = new Array<StockTransferItemQty>();

  //to display
  totalOriginQty = '0';
  destQty = '0';
}
