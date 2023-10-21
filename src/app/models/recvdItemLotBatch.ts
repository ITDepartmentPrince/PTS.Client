import {BatchLot} from "./batchLot";
import {ReceivingItem} from "./receivingItem";
import {Site} from "./site";
import {CreateUser} from "./create-user";

export class RecvdItemLotBatch {
  recvdItemLotBatchId: number;
  rilbReceivingItemId: number;
  receivingItem: ReceivingItem;
  rlbQty = 0;
  pricePerRlbQty = 0;
  batchLotId: number | null;
  batchLot: BatchLot;
  batchLotSiteId: number;
  batchLotSite: Site;
  expireDate: Date;
  isDamage = false;
  recvdBlockNo: string;
  recvdBlockDate = new Date();
  createUserId: number;
  createUser: CreateUser;
}
