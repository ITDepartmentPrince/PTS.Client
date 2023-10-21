import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {Vendor} from "./vendor";
import {VendorContact} from "./vendor-contact";
import {ApproveUser} from "./approve-user";
import {PurchaseReqItem} from "./purchase-req-item";
import {PurchaseReqCharges} from "./purchase-req-charges";
import {OtherCharge} from "./other-charge";
import {MatlClassification} from "./matl-classification";

export class PurchaseReq {
  prNumber: string;
  classificationId: number;
  classification: MatlClassification;
  vendorId: number;
  vendor: Vendor;
  contactId: number | null;
  vendorContact: VendorContact;
  purchaseReqItems: PurchaseReqItem[];
  purchaseReqCharges: PurchaseReqCharges[];
  deliveryDate: Date;
  notes: string;
  approveDate?: Date;
  approveUserId?: number;
  approveUser: ApproveUser | null;
  isSubmitted: boolean;
  submitUserId?: number;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser;
  totalPurchaseValue: number;
  vendors: Vendor[];
  classifications: MatlClassification[];
  otherCharges: OtherCharge[];
  vendorContacts: VendorContact[];
  empty = [];
  rawMaterial = 999999;

  constructor() {
    this.createDate = new Date();
    this.purchaseReqItems = [];
    this.purchaseReqCharges = [];
  }
}
