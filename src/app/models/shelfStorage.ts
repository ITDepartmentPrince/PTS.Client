import {Site} from "./site";
import {CreateUser} from "./create-user";
import {BatchLot} from "./batchLot";
import {Shelf} from "./shelf";

export class ShelfStorage {
  id: number;
  batchLotId: number;
  batchLot: BatchLot;
  batchLotSiteId: number;
  site: Site;
  shelfCode: string;
  shelf: Shelf;
  qty = 0;
  createDate: Date;
  createUserId: number;
  createUser: CreateUser;

  //to display
  materialId: number;
  unitId: number;
  expireDate?: Date | null;
  blQty = 0;
}
