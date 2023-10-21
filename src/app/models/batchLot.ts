import {Site} from "./site";
import {Material} from "./material";
import {MeasurementUnit} from "./measurement-unit";
import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {InventoryIntel} from "./inventoryIntel";

export class BatchLot {
  batchLotId: number;
  siteId: number;
  site: Site;
  batchLotNumber: string;
  materialId: number;
  material: Material;
  blUomId: number;
  blUom: MeasurementUnit;
  expireDate: Date;
  inventoryIntels: Array<InventoryIntel>
  createDate: Date;
  createUserId: number;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUserId: number;
  lastUser: LastUser;
}
