import {ItemType} from "../shared/item-type";
import {PurchaseReq} from "./purchase-req";
import {ApproveUser} from "./approve-user";
import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {ExecApproveUser} from "./exec-approve-user";

export class PurchaseOrder {
  poNumber: string;
  poType: ItemType;
  prNumber: string;
  purchaseReq: PurchaseReq;
  approveDate?: Date;
  approveUserId?: number;
  approveUser: ApproveUser | null;
  execApproveDate?: Date;
  execApproveUserId?: number;
  execApproveUser: ExecApproveUser | null;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser;
}
