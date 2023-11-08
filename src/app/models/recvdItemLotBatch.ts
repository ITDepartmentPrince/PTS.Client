import {BatchLot} from "./batchLot";
import {ReceivingItem} from "./receivingItem";
import {Site} from "./site";
import {CreateUser} from "./create-user";

export class RecvdItemLotBatch {
  recvdItemLotBatchId: number;
  rilbReceivingItemId: number;
  receivingItem: ReceivingItem;
  rlbConversionRate = 0;
  rlbQty = 0;
  pricePerRlbQty = 0;
  batchLotId: number;
  batchLot: BatchLot;
  batchLotSiteId: number;
  batchLotSite: Site;
  expireDate: Date;
  isDamage = false;
  recvdBlockNo: string;
  recvdBlockDate: any;
  createUserId: number;
  createUser: CreateUser;
  batchLots: Array<BatchLot> = [];
  isLoading = false;

  constructor() {
    const dateTime = new Date();
    this.recvdBlockDate = new Date(dateTime
      .toLocaleDateString() + ' ' + dateTime
      .toLocaleTimeString() + ' UTC');
  }
}
