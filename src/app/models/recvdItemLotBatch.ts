import {BatchLot} from "./batchLot";
import {ReceivingItem} from "./receivingItem";
import {Site} from "./site";
import {CreateUser} from "./create-user";
import {ItemLabel} from "./itemLabel";

export class RecvdItemLotBatch {
  recvdItemLotBatchId: number;
  rilbReceivingItemId: number;
  receivingItem: ReceivingItem;
  rlbConversionRate?: number;
  rlbQty = 0;
  pricePerRlbQty?: number;
  batchLotId: number;
  batchLot: BatchLot;
  batchLotSiteId: number;
  batchLotSite: Site;
  expireDate: Date | null;
  isDamage = false;
  recvdBlockNo: string;
  recvdBlockDate: any;
  createUserId: number;
  createUser: CreateUser;
  batchLots: Array<BatchLot> = [];
  isLoading = false;
  itemsLabels: Array<ItemLabel>;

  constructor() {
    const dateTime = new Date();
    this.recvdBlockDate = new Date(dateTime
      .toLocaleDateString() + ' ' + dateTime
      .toLocaleTimeString() + ' UTC');
  }
}
