import {Site} from "./site";
import {Material} from "./material";
import {MeasurementUnit} from "./measurement-unit";
import {RecvdItemLotBatch} from "./recvdItemLotBatch";
import {TaxRate} from "./tax-rate";
import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {Receiving} from "./receiving";

export class ReceivingItem {
  receivingItemId: number;
  riRoNumber: string;
  receiving: Receiving;
  riSiteId: number;
  riSite: Site;
  materialId: number;
  material: Material;
  orderedUomId?: number;
  orderedUom: MeasurementUnit;
  orderedConversionRate?: number;
  orderedQty = 0;
  pricePerOrderedQty = 0;
  recvdItemLotsBatches: Array<RecvdItemLotBatch> = [];
  taxId: number | null;
  taxRate: TaxRate;
  createDate: Date;
  createUserId: number;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUserId: number;
  lastUser: LastUser;
}
