import {Site} from "./site";
import {Material} from "./material";
import {MeasurementUnit} from "./measurement-unit";
import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {InventoryIntel} from "./inventoryIntel";
import {ShelfStorage} from "./shelfStorage";
import {CommittedInventory} from "./committedInventory";
import {ItemLabel} from "./itemLabel";

export class BatchLot {
  batchLotId: number;
  siteId: number;
  site: Site;
  batchLotNumber: string;
  materialId: number;
  material: Material;
  blUomId?: number;
  blUom: MeasurementUnit;
  expireDate: Date | null;
  inventoryIntels: Array<InventoryIntel>;
  itemLabels: Array<ItemLabel>;
  // shelfStorage: Array<ShelfStorage>;
  committed: Array<CommittedInventory>;
  createDate: Date;
  createUserId: number;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUserId: number;
  lastUser: LastUser;
  pricePerQty: number;
  pssId: string;
}
