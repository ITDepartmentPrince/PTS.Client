﻿import {Site} from "./site";
import {Material} from "./material";
import {StockTransferItemQty} from "./stock-transfer-item-qty";
import {StockTransfer} from "./stock-transfer";
import {Vendor} from "./vendor";

export class StockTransferItem {
  id: number;
  stSiteId: number;
  stSite: Site;
  stNumber: string;
  stockTransfer: StockTransfer;
  materialId: number;
  material: Material;
  stockTransferItemQtys = new Array<StockTransferItemQty>();
  vendorId: number;
  vendor: Vendor;

  //to display
  totalOriginQty = '---';
  destQty = '---';
  vendorMaterials: Array<Material>;
}
