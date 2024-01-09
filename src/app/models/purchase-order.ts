import {PurchaseReq} from "./purchase-req";
import {ApproveUser} from "./approve-user";
import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {ExecApproveUser} from "./exec-approve-user";
import {MatlClassification} from "./matl-classification";
import {User} from "./user";

export class PurchaseOrder {
  poNumber: string;
  prNumber: string;
  classificationId: number;
  classification: MatlClassification;
  purchaseReq: PurchaseReq;
  approveDate?: Date;
  approveUserId?: number;
  approveUser: User | null;
  execApproveDate?: Date;
  execApproveUserId?: number;
  execApproveUser: ExecApproveUser | null;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser;
  reqExecApproval: boolean;
  disApproveUserId: number;
}
