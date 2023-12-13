import {Site} from "./site";
import {InventoryIntelSource} from "../shared/inventory-intel-source";
import {Receiving} from "./receiving";
import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {BatchLot} from "./batchLot";
import {ItemLabel} from "./itemLabel";

export class InventoryIntel {
  inventoryIntelId: number
  batchLotId: number;
  batchLot: BatchLot;
  batchLotSiteId: number;
  batchLotSite: Site;
  source: InventoryIntelSource;
  roNumber: string;
  receiving: Receiving;
  roSiteId: number;
  roSite: Site;
  movementDate: Date;
  qty: number;
  pricePerQty: number;
  createDate: Date;
  createUserId: number;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUserId: number;
  lastUser: LastUser;
  itemLabels: Array<ItemLabel>;
}

