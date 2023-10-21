import {PurchaseReq} from "./purchase-req";
import {OtherCharge} from "./other-charge";

export class PurchaseReqCharges {
  prNumber: string;
  purchaseReq: PurchaseReq;
  otherChargeId: number;
  otherCharge: OtherCharge;
  amount: number
}
