import {Vendor} from "./vendor";
import {MatlClassification} from "./matl-classification";
import {MatlCategory} from "./matl-category";
import {SizeVariant} from "./size-variant";
import {MeasurementUnit} from "./measurement-unit";
import {User} from "./user";

export class Material {
  id: number;
  description: string;
  catalogNumber: string;
  classificationId: number
  classification: MatlClassification;
  categoryId: number;
  category: MatlCategory | null;
  sizeId: number;
  size: SizeVariant | null;
  refersTo: RefersTo;
  vendorId: number;
  vendor: Vendor;
  uomId: number;
  uom: MeasurementUnit;
  convertToUomId?: number;
  convertToUom: MeasurementUnit;
  conversionRate?: number;
  inActive: boolean;
  createDate: Date;
  createUserId: number
  createUser: User;
  lastUpdate: Date;
  lastUserId: number
  lastUser: User;

  //for client only
  isUomConverted: boolean;
  catalogDescription: string;
  disabled = true;
}

export enum RefersTo {
  Prince = 1,
  Sponsor = 2
}
