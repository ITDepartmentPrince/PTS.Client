import {CreateUser} from "./create-user";
import {LastUser} from "./last-user";
import {Vendor} from "./vendor";
import {MatlClassification} from "./matl-classification";
import {MatlCategory} from "./matl-category";
import {SizeVariant} from "./size-variant";
import {MeasurementUnit} from "./measurement-unit";

export class Material {
  materialId: number;
  materialDescription: string;
  catalogNumber: string;
  name: string;
  classificationId: number
  matlClassification: MatlClassification;
  categoryId: number;
  matlCategory: MatlCategory;
  sizeId: number;
  sizeVariant: SizeVariant;
  vendorId: number;
  vendor: Vendor;
  uomId: number;
  measurementUnit: MeasurementUnit;
  isPurchaseDifferent: boolean;
  defaultUomUnitId: number | null;
  defaultUomUnit: MeasurementUnit;
  conversionRate: number | null;
  inActive: boolean;
  createDate: Date;
  createUser: CreateUser;
  lastUpdate: Date;
  lastUser: LastUser;
  catalogDescription: string;
  classifications: MatlClassification[];
  measurementUnits: MeasurementUnit[];
  matlCategories: MatlCategory[];
  sizeVariants: SizeVariant[];
  vendors: Vendor[];
  defaultUomUnits: MeasurementUnit[];
}

export class MaterialRefsList {
  classifications: MatlClassification[];
  measurementUnits: MeasurementUnit[];
  matlCategories: MatlCategory[];
  sizeVariants: SizeVariant[];
  vendors: Vendor[];
}
