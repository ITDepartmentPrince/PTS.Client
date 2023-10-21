import {PurchaseReq} from "./purchase-req";
import {Material} from "./material";
import {MeasurementUnit} from "./measurement-unit";
import {TaxRate} from "./tax-rate";

export class PurchaseReqItem {
  itemId: number;
  prNumber: string;
  purchaseReq: PurchaseReq;
  materialId?: number;
  material: Material;
  purchaseUomId: number;
  purchaseUom:MeasurementUnit;
  conversionRate: number;
  quantity = 0;
  pricePerQty = 0;
  quoteNo: string;
  coaRequired?: boolean;
  msdRequired?: boolean;
  inStock = true;
  backOrder = false;
  taxId: number;
  taxRate: TaxRate;
}
